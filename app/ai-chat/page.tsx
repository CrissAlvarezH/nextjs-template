import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react"


export default function AiChatPage() {
  return (
    <div className="flex h-dvh">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <div className="mb-4">
          <button className="w-full border border-white/20 rounded p-3 text-left hover:bg-gray-800">
            New Chat
          </button>
        </div>

        {/* Chat history list */}
        <div className="space-y-2">
          {/* We'll add chat history items here later */}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat messages container */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Messages will go here */}
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center max-w-3xl mx-auto justify-between gap-2">
            <textarea
              className="w-full px-3 py-2 rounded-full border border-gray-300 resize-none"
              rows={1}
              placeholder="Send a message..."
            />
            <Button variant="default" className="rounded-full p-2.5">
              <SendHorizonal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
