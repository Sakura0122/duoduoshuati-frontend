'use client'
import { List, Typography } from 'antd'
import { CommentVo } from '@/api/comment/type'
import { useState } from 'react'
import { CommentInput } from '@/components/comment/CommentInput'
import { CommentItem } from '@/components/comment/CommentItem'

interface CommentListProps {
  comments: CommentVo[]
  currentUserId?: string
  loading?: boolean
  onAddComment: (content: string, parentId?: string) => Promise<void>
  onDeleteComment: (commentId: string) => Promise<void>
}

export const CommentList = ({ comments, currentUserId, loading, onAddComment, onDeleteComment }: CommentListProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleAddTopComment = async (content: string) => {
    await onAddComment(content)
  }

  const handleAddReply = async (content: string) => {
    if (!replyingTo) return
    await onAddComment(content, replyingTo)
    setReplyingTo(null)
  }

  return (
    <div>
      {currentUserId && (
        <CommentInput onSubmit={handleAddTopComment} placeholder="写下你的评论..." buttonText="发表评论" />
      )}

      {loading ? (
        <List loading={loading} />
      ) : comments.length === 0 ? (
        <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 24 }}>
          暂无评论
        </Typography.Text>
      ) : (
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <CommentItem
              comment={comment}
              currentUserId={currentUserId}
              onReply={setReplyingTo}
              onDelete={onDeleteComment}
            />
          )}
        />
      )}

      {replyingTo && currentUserId && (
        <div style={{ marginLeft: 48, marginTop: 16 }}>
          <CommentInput
            onSubmit={handleAddReply}
            placeholder="写下你的回复..."
            buttonText="提交回复"
            showCancel
            onCancel={() => setReplyingTo(null)}
          />
        </div>
      )}
    </div>
  )
}
