import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { currentUser, contacts } from "@/data/mockData";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
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

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
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
          setMessages(prev => [...prev, payload.new as Message]);
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
          chat_id: '1', // For now, we'll use a default chat_id
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

  const handleReply = (messageId: string) => {
    setReplyTo(messageId);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <ChatHeader contact={contacts[0]} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onReply={handleReply}
          />
        ))}
      </div>

      <MessageInput 
        onSendMessage={handleSendMessage} 
        replyTo={replyTo ? messages.find(m => m.id === replyTo) : undefined}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};