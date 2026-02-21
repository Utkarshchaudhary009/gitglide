import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { vercelProjectToggled, vercelBuildFailed } from "@/inngest/functions";

// Expose the Inngest API
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        vercelProjectToggled,
        vercelBuildFailed
    ],
});
