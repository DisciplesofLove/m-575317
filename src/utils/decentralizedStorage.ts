import Arweave from 'arweave';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

export interface DecentralizedMessage {
  content: string;
  sender: string;
  timestamp: number;
  transactionId?: string;
}

export const storeMessageOnArweave = async (message: DecentralizedMessage) => {
  try {
    // Create transaction
    const transaction = await arweave.createTransaction({
      data: JSON.stringify(message)
    });

    // Sign transaction (we'll need to implement wallet connection)
    // transaction.addTag('Content-Type', 'application/json');
    // await arweave.transactions.sign(transaction);
    
    // For now, we'll just return a mock transaction ID
    return {
      id: 'mock-transaction-id',
      message
    };
  } catch (error) {
    console.error('Error storing message on Arweave:', error);
    throw error;
  }
};

export const retrieveMessageFromArweave = async (transactionId: string) => {
  try {
    const transaction = await arweave.transactions.get(transactionId);
    const data = transaction.get('data', { decode: true, string: true });
    return JSON.parse(data as string) as DecentralizedMessage;
  } catch (error) {
    console.error('Error retrieving message from Arweave:', error);
    throw error;
  }
};