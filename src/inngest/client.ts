import { EventSchemas, Inngest } from "inngest";

// Define the event types
type Events = {
    "vercel/project.toggled": {
        data: {
            userId: string;
            projectId: string;
            enabled: boolean;
        };
    };
    "vercel/build.failed": {
        data: {
            userId?: string;
            projectId: string;
            deploymentId: string;
            payload: Record<string, unknown>;
        };
    };
};

// Initialize the Inngest client
export const inngest = new Inngest({
    id: "gitglide",
    schemas: new EventSchemas().fromRecord<Events>()
});
