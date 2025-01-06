import { ThumbsUp, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageActionsProps {
  messageId: string;
  userId: string;
  isLiked: boolean;
  likes: number;
  onReply: () => void;
  onTranslate: () => void;
  hasTranslation: boolean;
}

export const MessageActions = ({
  messageId,
  userId,
  isLiked,
  likes,
  onReply,
  onTranslate,
  hasTranslation,
}: MessageActionsProps) => {
  const handleLike = async () => {
    try {
      const { data: existingLike } = await supabase
        .from('reactions')
        .select()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('type', 'like')
        .single();

      if (existingLike) {
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existingLike.id);
      } else {
        await supabase
          .from('reactions')
          .insert({
            message_id: messageId,
            user_id: userId,
            type: 'like'
          });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like",
      });
    }
  };

  return (
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
              onClick={onReply}
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
              onClick={onTranslate}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              {hasTranslation ? "Original" : "Translate"}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{hasTranslation ? "Show original" : "Translate message"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};