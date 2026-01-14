import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';

interface ReviewComment {
  id: string;
  content_id: string;
  actor_id: string;
  comment: string;
  created_at: string;
}

interface ReviewCommentsProps {
  contentId: string;
}

export const ReviewComments = ({ contentId }: ReviewCommentsProps) => {
  const { user, isAdmin, roles } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  const canComment = user && (roles.includes('editor') || isAdmin);

  const { data: comments } = useQuery<ReviewComment[]>({
    queryKey: ['review-comments', contentId],
    enabled: !!contentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_review_comments')
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ReviewComment[];
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (comment: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('content_review_comments')
        .insert({
          content_id: contentId,
          actor_id: user.id,
          comment,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-comments', contentId] });
      setNewComment('');
      toast({ title: 'Comment added' });
    },
    onError: () => {
      toast({ title: 'Failed to add comment', variant: 'destructive' });
    },
  });

  const handleSubmit = () => {
    if (!newComment.trim()) {
      toast({ title: 'Comment cannot be empty', variant: 'destructive' });
      return;
    }
    addCommentMutation.mutate(newComment);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Review Comments ({comments?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {comment.actor_id.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      {comment.actor_id.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No comments yet. Start the conversation!
            </p>
          )}
        </div>

        {/* Add Comment */}
        {canComment ? (
          <div className="space-y-2 pt-4 border-t">
            <Textarea
              placeholder="Add a comment for this content review..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button
              onClick={handleSubmit}
              disabled={addCommentMutation.isPending || !newComment.trim()}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center pt-4 border-t">
            You need editor or admin role to comment.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
