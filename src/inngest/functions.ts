import { inngest } from "./client";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/security/encryption";
export const vercelProjectToggled = inngest.createFunction(
    { id: "vercel-project-toggled" },
    { event: "vercel/project.toggled" },
    async ({ event, step }) => {
        const { userId, projectId, enabled } = event.data;

        // Fetch user settings to get decrypted Vercel token
        const settings = await step.run("fetch-user-settings", async () => {
            const userSettings = await prisma.userSettings.findUnique({
                where: { clerkUserId: userId },
            });
            if (!userSettings?.vercelToken) {
                throw new Error("Vercel token not found");
            }
            return {
                ...userSettings,
                vercelToken: decrypt(userSettings.vercelToken),
            };
        });

        const integrationConfigKey = `vercel_project_${projectId}`;

        if (enabled) {
            // 1. Create Webhook in Vercel
            const webhookInfo = await step.run("create-vercel-webhook", async () => {
                // App URL based webhook destination
                const appUrl = process.env.NEXT_PUBLIC_APP_URL;
                if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL is not set");

                const response = await fetch(`https://api.vercel.com/v1/webhooks`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${settings.vercelToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        events: ["deployment.error"],
                        projectIds: [projectId],
                        url: `${appUrl}/api/webhooks/vercel`,
                    }),
                });

                if (!response.ok) {
                    const body = await response.text();
                    throw new Error(`Failed to create Vercel webhook. Status: ${response.status}. Body: ${body}`);
                }

                const data = await response.json();
                return { webhookId: data.id as string, secret: data.secret as string };
            });

            // 2. Save IntegrationConfig and WebhookLog in DB
            await step.run("save-webhook-config", async () => {
                await prisma.integrationConfig.upsert({
                    where: {
                        clerkUserId_type: { clerkUserId: userId, type: integrationConfigKey },
                    },
                    update: {
                        enabled: true,
                        config: { webhookId: webhookInfo.webhookId, secret: webhookInfo.secret },
                    },
                    create: {
                        clerkUserId: userId,
                        type: integrationConfigKey,
                        enabled: true,
                        config: { webhookId: webhookInfo.webhookId, secret: webhookInfo.secret },
                    },
                });
            });

            return { status: "enabled", webhookId: webhookInfo.webhookId };
        } else {
            // Get current config to find webhook ID
            const config = await step.run("get-integration-config", async () => {
                return await prisma.integrationConfig.findUnique({
                    where: { clerkUserId_type: { clerkUserId: userId, type: integrationConfigKey } },
                });
            });

            const webhookId = config?.config && typeof config.config === "object" && "webhookId" in config.config
                ? (config.config as { webhookId: string }).webhookId
                : null;

            if (webhookId) {
                // 1. Delete Webhook in Vercel
                await step.run("delete-vercel-webhook", async () => {
                    const response = await fetch(`https://api.vercel.com/v1/webhooks/${webhookId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${settings.vercelToken}`,
                        },
                    });

                    if (!response.ok && response.status !== 404) {
                        const body = await response.text();
                        console.error(`Failed to delete Vercel webhook. Status: ${response.status}. Body: ${body}`);
                        // non-fatal because maybe it was already deleted manually
                    }
                });
            }

            // 2. Remove from DB or mark disabled
            await step.run("disable-webhook-config", async () => {
                await prisma.integrationConfig.update({
                    where: { clerkUserId_type: { clerkUserId: userId, type: integrationConfigKey } },
                    data: { enabled: false, config: {} },
                });
            });

            return { status: "disabled" };
        }
    }
);

export const vercelBuildFailed = inngest.createFunction(
    { id: "vercel-build-failed", retries: 0 },
    { event: "vercel/build.failed" },
    async ({ event, step }) => {
        const { userId, projectId, deploymentId, payload } = event.data;

        // Log the webhook reception properly
        const webhookLogId = await step.run("log-webhook", async () => {
            const log = await prisma.webhookLog.create({
                data: {
                    clerkUserId: userId,
                    source: "vercel",
                    event: "deployment.error",
                    payload: payload as unknown as import('@prisma/client').Prisma.InputJsonValue,
                    status: "processing",
                },
            });
            return log.id;
        });

        try {
            if (!userId) {
                throw new Error("UserId not available to fetch Jules API Key");
            }

            const settings = await step.run("fetch-user-settings", async () => {
                const userSettings = await prisma.userSettings.findUnique({
                    where: { clerkUserId: userId },
                });
                if (!userSettings?.julesApiKey) {
                    throw new Error("Jules API key not found");
                }
                if (!userSettings?.vercelToken) {
                    throw new Error("Vercel token not found");
                }
                return {
                    julesApiKey: decrypt(userSettings.julesApiKey),
                    vercelToken: decrypt(userSettings.vercelToken)
                };
            });

            // Get deployment info for contextual prompt
            const deploymentInfo = await step.run("fetch-deployment-info", async () => {
                const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
                    headers: {
                        Authorization: `Bearer ${settings.vercelToken}`
                    }
                });
                return await response.json();
            });

            // Trigger Direct Mode with Jules API
            const julesSessionId = await step.run("start-jules-session", async () => {
                // we will need the Github repo context
                const repoUrl = deploymentInfo.meta?.githubCommitRepo;
                const org = deploymentInfo.meta?.githubCommitOrg;
                const branch = deploymentInfo.meta?.githubCommitRef;

                if (!repoUrl || !org || !branch) {
                    throw new Error("Deployment does not have GitHub linkage metadata");
                }
                // Formulate prompt
                const deploymentUrl = (payload as { deployment?: { url?: string } })?.deployment?.url || deploymentId;
                const prompt = `Fix the build failure in Vercel project deployment: ${deploymentUrl}.
Event: deployment.error.
Please check the latest build logs or error trace and resolve the issue. If it's a type error or lint error, please supply the fixes.`;

                // Note: Since jules expects source as 'sources/github-org-repo' normally,
                // we will formulate it based on the webhook metadata.
                const julesSource = `sources/github-${org}-${repoUrl}`;

                const response = await fetch("https://jules.googleapis.com/v1alpha/sessions", {
                    method: "POST",
                    headers: {
                        "x-goog-api-key": settings.julesApiKey,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt,
                        title: `Fix Vercel Build - ${deploymentInfo.name || projectId}`,
                        sourceContext: {
                            source: julesSource,
                            githubRepoContext: {
                                startingBranch: branch
                            }
                        },
                        requirePlanApproval: false,
                        automationMode: "AUTO_CREATE_PR"
                    })
                });

                if (!response.ok) {
                    const body = await response.text();
                    throw new Error(`Failed to create Jules session. Status: ${response.status}. Body: ${body}`);
                }

                const data = await response.json();
                return data.id as string;
            });

            // Update Webhook log 
            await step.run("update-webhook-success", async () => {
                await prisma.webhookLog.update({
                    where: { id: webhookLogId },
                    data: {
                        status: "success",
                        julesSessionId
                    }
                });
            });

            return { success: true, julesSessionId };
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            await step.run("update-webhook-failed", async () => {
                await prisma.webhookLog.update({
                    where: { id: webhookLogId },
                    data: {
                        status: "failed",
                        payload: { error: errorMessage, original: payload } as unknown as import('@prisma/client').Prisma.InputJsonValue
                    }
                });
            });
            throw err;
        }
    }
);
