import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/chat";
import { currentUser } from "@/data/mockData";
import { formatTimestamp } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MessageActions } from "./MessageActions";

interface MessageBubbleProps {
  message: Message;
  onReply?: (messageId: string) => void;
}

export const MessageBubble = ({ message, onReply }: MessageBubbleProps) => {
  const isCurrentUser = message.sender.id === currentUser.id;
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (translatedContent) {
      setTranslatedContent(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('translated_content')
        .eq('id', message.id)
        .single();

      if (error) throw error;

      if (data?.translated_content && typeof data.translated_content === 'object') {
        const translatedText = (data.translated_content as { [key: string]: string })?.en;
        if (translatedText) {
          setTranslatedContent(translatedText);
        } else {
          setTranslatedContent("Translated text would appear here");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to translate message",
      });
    }
  };

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="w-8 h-8">
        <img 
          src={message.sender.avatar_url || ''}
          alt={message.sender.username || 'User'}
          className="object-cover"
        />
      </Avatar>
      <div className="flex flex-col gap-1">
        <div className={`message-bubble ${isCurrentUser ? "sent" : "received"}`}>
          {translatedContent || message.content}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          {formatTimestamp(new Date(message.created_at))}
          <MessageActions
            messageId={message.id}
            userId={currentUser.id}
            isLiked={isLiked}
            likes={likes}
            onReply={() => onReply?.(message.id)}
            onTranslate={handleTranslate}
            hasTranslation={!!translatedContent}
          />
        </div>
      </div>
    </div>
  );
};