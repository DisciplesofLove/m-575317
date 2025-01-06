import { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  onReply: (messageId: string) => void;
}

export const MessageList = ({ messages, onReply }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          onReply={onReply}
        />
      ))}
    </div>
  );
};