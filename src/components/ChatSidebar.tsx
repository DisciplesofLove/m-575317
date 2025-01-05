import { Search, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { contacts, currentUser } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

export const ChatSidebar = () => {
  return (
    <div className="w-80 h-screen glass p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <img 
              src={currentUser.avatar}
              alt={currentUser.name}
              className="object-cover"
            />
          </Avatar>
          <span className="font-medium">{currentUser.name}</span>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full bg-white/5 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 ring-white/20 transition-all"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <Avatar className="w-10 h-10 relative">
              <img src={contact.avatar} alt={contact.name} className="object-cover" />
              {contact.status === "online" && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-muted truncate">
                {contact.status === "online" 
                  ? "Active now"
                  : contact.lastSeen 
                    ? `Last seen ${formatDistanceToNow(contact.lastSeen, { addSuffix: true })}`
                    : "Offline"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};