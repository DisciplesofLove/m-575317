import { useState } from "react";
import { Message } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { currentUser, contacts } from "@/data/mockData";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";

export const ChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey! How's your project coming along?",
      sender: contacts[0],
      receiver: currentUser,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "read",
      type: "text",
    },
    {
      id: "2",
      content: "Making good progress! Just implementing the chat interface now.",
      sender: currentUser,
      receiver: contacts[0],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      status: "read",
      type: "text",
    },
    {
      id: "3",
      content: "That's great! Would love to see it when it's ready.",
      sender: contacts[0],
      receiver: currentUser,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: "read",
      type: "text",
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser,
      receiver: contacts[0],
      timestamp: new Date(),
      status: "sent",
      type: "text",
    };

    setMessages([...messages, newMsg]);
    toast({
      description: "Message sent",
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <ChatHeader contact={contacts[0]} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};