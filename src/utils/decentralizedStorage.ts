import Arweave from 'arweave';

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
    // For now, we'll use a mock IPFS hash since we can't use Pinata in the browser
    // In a production environment, you would want to use a backend service to handle IPFS storage
    const mockIpfsHash = `ipfs-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    console.log('Storing message on IPFS (mock):', messageData);
    return mockIpfsHash;
  } catch (error) {
    console.error('Error storing on IPFS:', error);
    throw error;
  }
};