'use client'
import { Button, Card, Divider, Flex, Select, Skeleton, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import TagList from '@/components/TagList'
import MdViewer from '@/components/MdViewer'
import { QuestionVO } from '@/api/question/type'
import React, { useCallback, useEffect, useState } from 'react'
import { themeList } from 'bytemd-plugin-theme'
import userStore from '@/stores/user'
import { UserRole } from '@/enums/UserRole'
import { UserInfoVo } from '@/api/user/type'
import { AnswerStatus } from '@/enums/answerStatus'
import { EyeInvisibleOutlined, EyeOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import AccessControlPrompt from '@/components/AccessControlPrompt'
import useAddUserSignInRecord from '@/hooks/useAddUserSignInRecord'
import questionApi from '@/api/question'
import { message } from '@/utils/AntdGlobal'
import Link from 'next/link'
import { CommentList } from '@/components/comment/CommentList'
import { CommentVo } from '@/api/comment/type'
import commentApi from '@/api/comment'
import dayjs from 'dayjs'

interface Props {
  question: QuestionVO
  questionBankId?: string
  prevQuestionId?: string
  nextQuestionId?: string
  showComments?: boolean
}

/**
 * 题目卡片
 * @param props
 * @constructor
 */
const QuestionCard = (props: Props) => {
  const { question, questionBankId, prevQuestionId, nextQuestionId, showComments = false } = props
  const { userinfo } = userStore()
  // 答案样式
  const [themeValue, setThemeValue] = useState<string>('github')
  // 是否显示答案
  const [isAnswerVisible, setIsAnswerVisible] = useState<boolean>(false)
  // 添加收藏状态
  const [isFavoured, setIsFavoured] = useState<boolean>(false)
  const [favourCount, setFavourCount] = useState<number>(question.favourNum || 0)
  // 评论相关状态
  const [comments, setComments] = useState<CommentVo[]>([])
  const [commentContent, setCommentContent] = useState<string>('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getFavourStatus = async () => {
      if (userinfo?.id) {
        const res = await questionApi.getFavourStatus(question.id)
        setIsFavoured(res.data)
      }
    }

    getFavourStatus()
    setIsAnswerVisible(!!localStorage.getItem('showAnswer'))

    // 加载评论
    if (showComments) {
      loadComments()
    }
  }, [question.id, userinfo?.id, showComments])

  // 加载评论
  const loadComments = async () => {
    try {
      setLoading(true)
      const res = await questionApi.getQuestionComments(question.id)
      setComments(res.data)
    } catch (error) {
      message.error('加载评论失败')
    } finally {
      setLoading(false)
    }
  }
  // 点击收藏
  const handleCollect = async () => {
    const res = await questionApi.toggleQuestionFavour(question.id.toString())
    const newStatus = res.data
    setIsFavoured(newStatus)
    // 更新收藏数
    setFavourCount((prev) => (newStatus ? prev + 1 : Math.max(0, prev - 1)))
    message.success(newStatus ? '收藏成功' : '已取消收藏')
  }

  // 获取答案显示状态
  const getVipDisplayStatus = useCallback((question: QuestionVO, userinfo?: UserInfoVo): AnswerStatus => {
    if (userinfo?.userRole === UserRole.Not_Login) return AnswerStatus.REQUEST_LOGIN
    if (question.isVip !== 1) return AnswerStatus.SHOW_ANSWER
    if (userinfo?.userRole === UserRole.VIP || userinfo?.userRole === UserRole.ADMIN) return AnswerStatus.SHOW_ANSWER
    return AnswerStatus.REQUEST_VIP
  }, [])
  const displayStatus = getVipDisplayStatus(question, userinfo)

  // 签到
  useAddUserSignInRecord()

  // 提交评论
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.warning('评论内容不能为空')
      return
    }

    try {
      await commentApi.addComment({
        questionId: question.id,
        content: commentContent,
        pid: '0', // 一级评论
      })
      message.success('评论成功')
      setCommentContent('')
      loadComments()
    } catch (error) {
      message.error('评论失败')
    }
  }

  // 提交回复
  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) {
      message.warning('回复内容不能为空')
      return
    }

    try {
      await commentApi.addComment({
        questionId: question.id,
        content: replyContent,
        pid: parentId,
      })
      message.success('回复成功')
      setReplyContent('')
      setReplyingTo(null)
      loadComments()
    } catch (error) {
      message.error('回复失败')
    }
  }

  // 格式化时间
  const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm')
  }

  return (
    <div className="question-card">
      <Card>
        <Title level={1} style={{ fontSize: 24 }}>
          {question.title}
        </Title>
        <TagList tagList={JSON.parse(question.tags) || []} />
        <div style={{ marginBottom: 16 }} />
        <MdViewer value={question.content} />
        <Divider />
        <Space>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleCollect}>
            {!isFavoured ? (
              <StarOutlined
                style={{
                  marginRight: '8px',
                  color: '#FADB14',
                  fontSize: '21px',
                }}
              />
            ) : (
              <StarFilled
                style={{
                  marginRight: '8px',
                  color: '#FADB14',
                  fontSize: '21px',
                }}
              />
            )}
            <span>{favourCount}</span>
          </div>
        </Space>
      </Card>
      <div style={{ marginBottom: 16 }} />
      {questionBankId && (
        <Card>
          <Flex justify="space-between">
            <Link href={prevQuestionId ? `/bank/${questionBankId}/question/${prevQuestionId}` : '#'}>
              <Button type="default" disabled={!prevQuestionId}>
                上一题
              </Button>
            </Link>
            <Link href={nextQuestionId ? `/bank/${questionBankId}/question/${nextQuestionId}` : '#'}>
              <Button type="primary" disabled={!nextQuestionId}>
                下一题
              </Button>
            </Link>
          </Flex>
        </Card>
      )}
      <div style={{ marginBottom: 16 }} />
      <Card
        title="推荐答案"
        extra={
          <Space>
            <Select
              defaultValue={themeValue}
              style={{ width: 205 }}
              onChange={setThemeValue}
              options={themeList.map((item) => ({
                key: item.theme,
                label: item.title,
                value: item.theme,
              }))}
            />
            <Button
              icon={isAnswerVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setIsAnswerVisible(!isAnswerVisible)}
              style={{ border: 'none' }}
            >
              {isAnswerVisible ? '隐藏答案' : '查看答案'}
            </Button>
          </Space>
        }
      >
        {userinfo?.userRole ? (
          <>
            {displayStatus === AnswerStatus.SHOW_ANSWER &&
              (isAnswerVisible ? (
                <MdViewer value={question.answer} theme={themeValue} />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginTop: '20px',
                  }}
                >
                  <EyeInvisibleOutlined
                    style={{
                      fontSize: '60px',
                      color: '#aaa',
                      marginBottom: '8px',
                    }}
                  />
                  <Title
                    style={{
                      color: '#aaa',
                      marginTop: '20px',
                      marginBottom: '25px',
                    }}
                  >
                    答案已隐藏
                  </Title>
                  <Button type="primary" onClick={() => setIsAnswerVisible(true)}>
                    显示答案
                  </Button>
                </div>
              ))}
            {displayStatus === AnswerStatus.REQUEST_VIP && <AccessControlPrompt type={'vip'} />}
            {displayStatus === AnswerStatus.REQUEST_LOGIN && <AccessControlPrompt type={'login'} />}
          </>
        ) : (
          <Skeleton />
        )}
      </Card>

      {showComments && (
        <>
          <div style={{ marginBottom: 16 }} />
          <Card title={`评论 (${comments?.length})`}>
            <CommentList
              comments={comments}
              currentUserId={userinfo?.id}
              loading={loading}
              onAddComment={async (content, parentId) => {
                await commentApi.addComment({
                  questionId: question.id,
                  content,
                  pid: parentId || '0',
                })
                loadComments()
              }}
              onDeleteComment={async (commentId) => {
                await commentApi.deleteComment(commentId)
                loadComments()
              }}
            />
          </Card>
        </>
      )}
    </div>
  )
}

export default QuestionCard
