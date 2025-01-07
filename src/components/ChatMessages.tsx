import { useState } from "react";
import { contacts } from "@/data/mockData";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { useMessages } from "@/hooks/useMessages";

export const ChatMessages = () => {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const { messages, sendMessage } = useMessages();

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, replyTo);
    setReplyTo(null);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <ChatHeader contact={contacts[0]} />
      <MessageList messages={messages} onReply={setReplyTo} />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        replyTo={replyTo ? messages.find(m => m.id === replyTo) : undefined}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};