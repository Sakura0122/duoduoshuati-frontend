import { Button, Input, Space } from 'antd'
import { useState } from 'react'
import { message } from '@/utils/AntdGlobal'

const { TextArea } = Input

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>
  placeholder?: string
  buttonText?: string
  showCancel?: boolean
  onCancel?: () => void
}

export const CommentInput = ({
  onSubmit,
  placeholder = '写下你的评论...',
  buttonText = '提交',
  showCancel = false,
  onCancel,
}: CommentInputProps) => {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setSubmitting(true)
    try {
      await onSubmit(content)
      message.success('评论成功')
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <TextArea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={300}
        showCount
      />
      <Space style={{ marginTop: 8 }}>
        <Button type="primary" disabled={!content.trim()} loading={submitting} onClick={handleSubmit}>
          {buttonText}
        </Button>
        {showCancel && <Button onClick={onCancel}>取消</Button>}
      </Space>
    </div>
  )
}
