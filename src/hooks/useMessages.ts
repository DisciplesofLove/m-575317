import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { storeMessageOnArweave, storeMessageOnIPFS } from '@/utils/decentralizedStorage';

export const useMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);

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
          ipfs_hash,
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

  const sendMessage = async (content: string, replyTo: string | null = null) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/signin");
        return;
      }

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

  return { messages, sendMessage };
};