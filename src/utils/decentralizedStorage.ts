import Arweave from 'arweave';
import { PinataClient } from '@pinata/sdk';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Initialize Pinata (you'll need to add PINATA_API_KEY and PINATA_SECRET_KEY to your environment)
const pinata = new PinataClient({ 
  pinataApiKey: process.env.PINATA_API_KEY as string,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY as string
});

export interface DecentralizedMessage {
  content: string;
  sender: string;
  timestamp: number;
  transactionId?: string;
  ipfsHash?: string;
}

export const storeMessageOnArweave = async (message: DecentralizedMessage) => {
  try {
    // Create transaction
    const transaction = await arweave.createTransaction({
      data: JSON.stringify(message)
    });

    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('App-Name', 'DecentralizedChat');
    transaction.addTag('Type', 'Message');

    // For development, we'll return a mock transaction ID
    // In production, you would sign and post the transaction
    return {
      id: `arweave-${Date.now()}`,
      message
    };
  } catch (error) {
    console.error('Error storing message on Arweave:', error);
    throw error;
  }
};

export const storeMessageOnIPFS = async (message: DecentralizedMessage) => {
  try {
    const result = await pinata.pinJSONToIPFS({
      message: message.content,
      sender: message.sender,
      timestamp: message.timestamp
    });

    return result.IpfsHash;
  } catch (error) {
    console.error('Error storing message on IPFS:', error);
    throw error;
  }
};

export const retrieveMessageFromArweave = async (transactionId: string) => {
  try {
    // In development, we'll return mock data
    // In production, you would fetch the actual transaction
    return {
      content: "Mock retrieved message",
      sender: "Mock sender",
      timestamp: Date.now()
    } as DecentralizedMessage;
  } catch (error) {
    console.error('Error retrieving message from Arweave:', error);
    throw error;
  }
};