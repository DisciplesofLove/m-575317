import Arweave from 'arweave';
import { supabase } from '@/integrations/supabase/client';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

interface MessageData {
  content: string;
  sender: string;
  timestamp: number;
}

export const storeMessageOnArweave = async (messageData: MessageData) => {
  try {
    const transaction = await arweave.createTransaction({ data: JSON.stringify(messageData) });
    await arweave.transactions.sign(transaction);
    await arweave.transactions.post(transaction);
    return { id: transaction.id };
  } catch (error) {
    console.error('Error storing on Arweave:', error);
    throw error;
  }
};

export const storeMessageOnIPFS = async (messageData: MessageData) => {
  try {
    const { data, error } = await supabase.functions.invoke('store-ipfs', {
      body: { messageData }
    });

    if (error) throw error;
    console.log('Successfully stored message on IPFS:', data);
    return data.ipfsHash;
  } catch (error) {
    console.error('Error storing on IPFS:', error);
    throw error;
  }
};