import { Json } from "@/integrations/supabase/types";

export interface User {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  created_at: string;
  translated_content?: Json | null;
  parent_id?: string | null;
  chat_id: string;
  likes?: number;
  arweave_tx_id?: string | null;
  ipfs_hash?: string | null;
}