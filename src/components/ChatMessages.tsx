import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Check, Info, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Message, User } from "@/types/chat";
import { currentUser, contacts } from "@/data/mockData";

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
  const [newMessage, setNewMessage] = useState("");

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: currentUser,
      receiver: contacts[0],
      timestamp: new Date(),
      status: "sent",
      type: "text",
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    toast({
      description: "Message sent",
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="glass p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <img src={contacts[0].avatar} alt={contacts[0].name} className="object-cover" />
          </Avatar>
          <div>
            <div className="font-medium">{contacts[0].name}</div>
            <div className="text-sm text-muted">
              {contacts[0].status === "online" 
                ? "Active now" 
                : contacts[0].lastSeen 
                  ? `Last seen ${formatTimestamp(contacts[0].lastSeen)}`
                  : "Offline"}
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-end gap-2 ${message.sender.id === currentUser.id ? "flex-row-reverse" : ""}`}
          >
            <Avatar className="w-8 h-8">
              <img 
                src={message.sender.avatar}
                alt={message.sender.name}
                className="object-cover"
              />
            </Avatar>
            <div className="flex flex-col gap-1">
              <div 
                className={`message-bubble ${
                  message.sender.id === currentUser.id ? "sent" : "received"
                }`}
              >
                {message.content}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                {formatTimestamp(message.timestamp)}
                {message.sender.id === currentUser.id && (
                  <Check 
                    className={`w-3 h-3 ${
                      message.status === "read" ? "text-accent" : ""
                    }`} 
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4">
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
    </div>
  );
};