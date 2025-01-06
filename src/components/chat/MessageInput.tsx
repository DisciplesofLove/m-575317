import { Send, X } from "lucide-react";
import { useState } from "react";
import { Message } from "@/types/chat";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  replyTo?: Message;
  onCancelReply?: () => void;
}

export const MessageInput = ({ onSendMessage, replyTo, onCancelReply }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      {replyTo && (
        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
          <div className="flex-1 text-sm truncate">
            Replying to: {replyTo.content}
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="p-1 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="glass rounded-full p-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none px-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button 
          type="submit"
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
          disabled={!newMessage.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};