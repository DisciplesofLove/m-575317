import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Chat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to access the chat",
        });
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