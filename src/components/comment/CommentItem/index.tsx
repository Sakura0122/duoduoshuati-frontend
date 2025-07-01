import { Avatar, Button, Divider, Popconfirm, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import { CommentVo } from '@/api/comment/type'
import { message } from '@/utils/AntdGlobal'
import commentApi from '@/api/comment'
import { DeleteOutlined } from '@ant-design/icons'

interface CommentItemProps {
  comment: CommentVo
  currentUserId?: string
  onReply: (commentId: string) => void
  onDelete: (commentId: string) => Promise<void>
  level?: number
  showActions?: boolean
}

export const CommentItem = ({ comment, currentUserId, onReply, onDelete, level = 0 }: CommentItemProps) => {
  const hasReplies = comment.replies && comment.replies.length > 0
  const isTopLevel = level === 0
  const isAuthor = currentUserId === comment.userId

  const handleDelete = async () => {
    await onDelete(comment.id)
    message.success('评论已删除')
  }

  return (
    <div
      style={{
        marginBottom: 16,
        marginLeft: level > 0 ? 32 : 0,
        borderLeft: level > 0 ? '1px solid #f0f0f0' : 'none',
        paddingLeft: level > 0 ? 16 : 0,
      }}
    >
      <Space align="start" size="middle">
        <Avatar src={comment.userInfo.userAvatar} alt={comment.userInfo.userName} />
        <div style={{ flex: 1 }}>
          <Typography.Text strong>{comment.userInfo.userName}</Typography.Text>

          <div style={{ margin: '8px 0' }}>{comment.content}</div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#999',
              fontSize: 12,
            }}
          >
            <span>{dayjs(comment.createTime).format('YYYY-MM-DD HH:mm')}</span>

            <>
              {currentUserId && currentUserId !== comment.userId && (
                <Button
                  type="text"
                  size="small"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => onReply(comment.id)}
                >
                  回复
                </Button>
              )}

              {isAuthor && (
                <Popconfirm title="确定要删除这条评论吗？" onConfirm={handleDelete} okText="确定" cancelText="取消">
                  <Button type="text" size="small" icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              )}
            </>
          </div>

          {hasReplies && (
            <div style={{ marginTop: 16 }}>
              {comment.replies?.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  onDelete={onDelete}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </Space>
      {isTopLevel && <Divider style={{ margin: '16px 0' }} />}
    </div>
  )
}
