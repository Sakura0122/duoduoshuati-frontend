'use client'
import { Button, Card, Input, List, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './index.scss'
import { MockInterview } from '@/api/mockInterview/type'
import mockInterviewApi from '@/api/mockInterview'

interface Message {
  content: string
  isAI: boolean
}

interface MockInterviewDetail extends MockInterview {
  parsedMessages?: Message[]
}

interface InterviewRoomProps {
  params: {
    mockInterviewId: string
  }
}

const InterviewRoom = ({ params }: InterviewRoomProps) => {
  const { mockInterviewId } = params
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [interview, setInterview] = useState<MockInterviewDetail>()
  const [messages, setMessages] = useState<Message[]>([])
  const [isStarted, setIsStarted] = useState(false)
  const [isEnded, setIsEnded] = useState(false)

  // 加载面试数据
  const loadInterview = async () => {
    const res = await mockInterviewApi.getMockInterviewById(mockInterviewId)
    const data = res.data as MockInterviewDetail

    // 解析历史消息
    if (data.messages) {
      const rawMessages = JSON.parse(data.messages)
      data.parsedMessages = rawMessages
        .filter((msg: any) => msg.role !== 'system')
        .map((msg: any) => ({
          content: msg.message,
          isAI: msg.role === 'assistant',
        }))
      setMessages(data.parsedMessages || [])
    }

    setInterview(data)
    setIsStarted(data.status === 1)
    setIsEnded(data.status === 2)
  }

  useEffect(() => {
    loadInterview()
  }, [])

  // 处理事件
  const handleEvent = async (eventType: string, msg?: string) => {
    setLoading(true)
    try {
      const res = await mockInterviewApi.handleMockInterviewEvent({
        event: eventType,
        id: interview!.id,
        message: msg,
      })

      // 更新消息列表
      const newMessage: Message = {
        content: msg || (eventType === 'start' ? '面试开始' : '面试结束'),
        isAI: false,
      }

      const aiResponse: Message = {
        content: res.data || '收到请求',
        isAI: true,
      } as any

      setMessages([...messages, newMessage, aiResponse])

      // 更新状态
      if (eventType === 'start') setIsStarted(true)
      if (eventType === 'chat' && res.data.includes('【面试结束】')) {
        setIsEnded(true)
      }
      if (eventType === 'end') setIsEnded(true)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    await handleEvent('chat', inputMessage)
    setInputMessage('')
  }

  return (
    <div id="InterviewRoom" className="max-width-content">
      {/* 标题 */}
      <div className="header">
        <h1>模拟面试</h1>
        <Tag color={isEnded ? 'red' : isStarted ? 'green' : 'orange'}>
          {isEnded ? '已结束' : isStarted ? '进行中' : '待开始'}
        </Tag>
      </div>

      {/* 操作按钮 */}
      <div className="action-buttons">
        <Button type="primary" onClick={() => handleEvent('start')} disabled={isStarted || isEnded} loading={loading}>
          开始面试
        </Button>
        <Button danger onClick={() => handleEvent('end')} disabled={!isStarted || isEnded} loading={loading}>
          结束面试
        </Button>
      </div>

      {/* 消息列表 */}
      <Card className="message-area">
        <List
          dataSource={messages}
          split={false}
          renderItem={(item) => (
            <List.Item
              style={{
                justifyContent: item.isAI ? 'flex-start' : 'flex-end',
              }}
            >
              <div className={`message-bubble ${item.isAI ? 'ai' : 'user'}`}>
                <div className="message-content">{item.content}</div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* 输入区域 */}
      <div className="input-area">
        <Input.TextArea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="输入你的回答..."
          disabled={!isStarted || isEnded}
          rows={3}
        />
        <Button type="primary" onClick={sendMessage} loading={loading} disabled={!isStarted || isEnded}>
          发送
        </Button>
      </div>
    </div>
  )
}

export default InterviewRoom
