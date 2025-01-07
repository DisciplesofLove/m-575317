import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { contacts } from "@/data/mockData";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { storeMessageOnArweave, storeMessageOnIPFS } from "@/utils/decentralizedStorage";

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

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          translated_content,
          parent_id,
          chat_id,
          arweave_tx_id,
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

      setMessages(messages as Message[]);
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
          
          try {
            // Store message on both Arweave and IPFS
            const [arweaveResult, ipfsHash] = await Promise.all([
              storeMessageOnArweave({
                content: newMessage.content,
                sender: newMessage.sender.id,
                timestamp: new Date(newMessage.created_at).getTime()
              }),
              storeMessageOnIPFS({
                content: newMessage.content,
                sender: newMessage.sender.id,
                timestamp: new Date(newMessage.created_at).getTime()
              })
            ]);
            
            // Update message with decentralized storage IDs
            const { error: updateError } = await supabase
              .from('messages')
              .update({ 
                arweave_tx_id: arweaveResult.id,
                ipfs_hash: ipfsHash 
              })
              .eq('id', newMessage.id);

            if (updateError) throw updateError;

            setMessages(prev => [...prev, { 
              ...newMessage, 
              arweave_tx_id: arweaveResult.id,
              ipfs_hash: ipfsHash 
            }]);
          } catch (error) {
            console.error('Error storing message:', error);
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

      // Store message on both Arweave and IPFS first
      const [arweaveResult, ipfsHash] = await Promise.all([
        storeMessageOnArweave({
          content,
          sender: session.session.user.id,
          timestamp: Date.now()
        }),
        storeMessageOnIPFS({
          content,
          sender: session.session.user.id,
          timestamp: Date.now()
        })
      ]);

      // Then store in Supabase with decentralized storage IDs
      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: session.session.user.id,
          chat_id: '1',
          parent_id: replyTo,
          arweave_tx_id: arweaveResult.id,
          ipfs_hash: ipfsHash
        });

      if (error) throw error;

      setReplyTo(null);
      toast({
        description: "Message sent and stored on decentralized networks",
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