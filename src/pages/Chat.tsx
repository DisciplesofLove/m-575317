import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";

const Chat = () => {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <ChatMessages />
    </div>
  );
};

export default Chat;