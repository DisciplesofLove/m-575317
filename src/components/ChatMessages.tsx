import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { contacts } from "@/data/mockData";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { storeMessageOnArweave, retrieveMessageFromArweave } from "@/utils/decentralizedStorage";

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

      // Fetch messages from both Supabase and Arweave
      const { data: supabaseMessages, error } = await supabase
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

      setMessages(supabaseMessages as Message[]);
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
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // Store message on Arweave when a new message is received
          try {
            const arweaveResult = await storeMessageOnArweave({
              content: newMessage.content,
              sender: newMessage.sender.id,
              timestamp: new Date(newMessage.created_at).getTime()
            });
            
            // Update message with Arweave transaction ID
            await supabase
              .from('messages')
              .update({ arweave_tx_id: arweaveResult.id })
              .eq('id', newMessage.id);

            setMessages(prev => [...prev, { ...newMessage, arweave_tx_id: arweaveResult.id }]);
          } catch (error) {
            console.error('Error storing message on Arweave:', error);
            setMessages(prev => [...prev, newMessage]);
          }
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

      // First store message on Arweave
      const arweaveResult = await storeMessageOnArweave({
        content,
        sender: session.session.user.id,
        timestamp: Date.now()
      });

      // Then store in Supabase with Arweave transaction ID
      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: session.session.user.id,
          chat_id: '1',
          parent_id: replyTo,
          arweave_tx_id: arweaveResult.id
        });

      if (error) throw error;

      setReplyTo(null);
      toast({
        description: "Message sent and stored on Arweave",
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