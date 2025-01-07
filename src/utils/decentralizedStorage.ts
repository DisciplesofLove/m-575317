import Arweave from 'arweave';
import PinataSDK from '@pinata/sdk';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Initialize Pinata (you'll need to add PINATA_API_KEY and PINATA_SECRET_KEY to your environment)
const pinata = new PinataSDK(
  process.env.PINATA_API_KEY || '',
  process.env.PINATA_SECRET_KEY || ''
);

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