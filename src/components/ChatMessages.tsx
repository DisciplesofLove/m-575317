import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { contacts } from "@/data/mockData";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const ChatMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/signin");
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          translated_content,
          parent_id,
          chat_id,
          sender:profiles!sender_id (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch messages",
        });
        return;
      }

      setMessages(data as Message[]);
    };

    fetchMessages();

    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const handleSendMessage = async (content: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/signin");
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: session.session.user.id,
          chat_id: '1',
          parent_id: replyTo
        });

      if (error) throw error;

      setReplyTo(null);
      toast({
        description: "Message sent",
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    }
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