import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signin");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <ChatMessages />
    </div>
  );
};

export default Chat;