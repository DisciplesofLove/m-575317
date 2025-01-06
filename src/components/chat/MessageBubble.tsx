import { Check, ThumbsUp, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/chat";
import { currentUser } from "@/data/mockData";
import { formatTimestamp } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: Message;
  onReply?: (messageId: string) => void;
}

export const MessageBubble = ({ message, onReply }: MessageBubbleProps) => {
  const isCurrentUser = message.sender.id === currentUser.id;
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const handleLike = async () => {
    try {
      const { data: existingLike } = await supabase
        .from('reactions')
        .select()
        .eq('message_id', message.id)
        .eq('user_id', currentUser.id)
        .eq('type', 'like')
        .single();

      if (existingLike) {
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existingLike.id);
        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        await supabase
          .from('reactions')
          .insert({
            message_id: message.id,
            user_id: currentUser.id,
            type: 'like'
          });
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like",
      });
    }
  };

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
          // Here you would typically call a translation API
          // For now, we'll just show a mock translation
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
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLike}
                    className={`p-1 rounded hover:bg-white/10 transition-colors ${
                      isLiked ? "text-accent" : ""
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {likes > 0 && <span className="ml-1">{likes}</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLiked ? "Unlike" : "Like"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onReply?.(message.id)}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reply</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleTranslate}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {translatedContent ? "Original" : "Translate"}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{translatedContent ? "Show original" : "Translate message"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};