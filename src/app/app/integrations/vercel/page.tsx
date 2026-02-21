import { VercelProjectsList } from '@/components/integrations/vercel/projects-list'
import { DeploymentsTab } from '@/components/integrations/vercel/deployments/deployments-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function VercelPage() {
    return (
        <div className="flex-1 bg-background flex flex-col overflow-hidden h-full">
            <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 flex-shrink-0 border-b">
                <h1 className="text-2xl sm:text-3xl font-bold">Vercel Deployments</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Monitor deployments and manage auto-fix direct mode.
                </p>
            </div>

            <Tabs defaultValue="deployments" className="flex-1 flex flex-col overflow-hidden pt-4">
                <div className="px-4 sm:px-6 md:px-8 lg:px-10 flex-shrink-0">
                    <TabsList className="mb-0">
                        <TabsTrigger value="deployments">Deployments</TabsTrigger>
                        <TabsTrigger value="projects">Projects Configuration</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="deployments" className="flex-1 overflow-auto m-0 px-4 sm:px-6 md:px-8 lg:px-10 py-4">
                    <DeploymentsTab />
                </TabsContent>

                <TabsContent value="projects" className="flex-1 overflow-auto m-0 px-4 sm:px-6 md:px-8 lg:px-10 py-4">
                    <VercelProjectsList />
                </TabsContent>
            </Tabs>
        </div>
    )
}
