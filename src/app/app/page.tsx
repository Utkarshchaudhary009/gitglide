import { ChatInput } from '@/components/chat'
import { SessionList } from '@/components/sessions'

export default function AppPage() {
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex flex-1 items-center justify-center">
        <ChatInput />
      </div>
      <div className="mt-8">
        <SessionList />
      </div>
    </div>
  )
}
