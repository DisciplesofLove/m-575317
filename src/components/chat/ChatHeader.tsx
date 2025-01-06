import { Avatar } from "@/components/ui/avatar";
import { Info } from "lucide-react";
import { User } from "@/types/chat";

interface ChatHeaderProps {
  contact: User;
}

export const ChatHeader = ({ contact }: ChatHeaderProps) => {
  return (
    <div className="glass p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <img 
            src={contact.avatar_url || ''} 
            alt={contact.username || 'User'} 
            className="object-cover" 
          />
        </Avatar>
        <div>
          <div className="font-medium">{contact.username}</div>
          <div className="text-sm text-muted">
            Active now
          </div>
        </div>
      </div>
      <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
        <Info className="w-5 h-5" />
      </button>
    </div>
  );
};