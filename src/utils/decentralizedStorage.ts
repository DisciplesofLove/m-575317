import Arweave from 'arweave';
import { default as Pinata } from '@pinata/sdk';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Initialize Pinata with dummy keys for now
const pinata = new Pinata('dummy-key', 'dummy-secret');

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
    const result = await pinata.pinJSONToIPFS(messageData);
    return result.IpfsHash;
  } catch (error) {
    console.error('Error storing on IPFS:', error);
    throw error;
  }
};