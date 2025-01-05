import { Check } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/chat";
import { currentUser } from "@/data/mockData";
import { formatTimestamp } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isCurrentUser = message.sender.id === currentUser.id;

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="w-8 h-8">
        <img 
          src={message.sender.avatar}
          alt={message.sender.name}
          className="object-cover"
        />
      </Avatar>
      <div className="flex flex-col gap-1">
        <div className={`message-bubble ${isCurrentUser ? "sent" : "received"}`}>
          {message.content}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted">
          {formatTimestamp(message.timestamp)}
          {isCurrentUser && (
            <Check 
              className={`w-3 h-3 ${message.status === "read" ? "text-accent" : ""}`} 
            />
          )}
        </div>
      </div>
    </div>
  );
};