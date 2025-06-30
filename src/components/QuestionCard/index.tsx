'use client'
import { Button, Card, Select, Skeleton, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import TagList from '@/components/TagList'
import MdViewer from '@/components/MdViewer'
import { QuestionVO } from '@/api/question/type'
import React, { useCallback, useState } from 'react'
import { themeList } from 'bytemd-plugin-theme'
import userStore from '@/stores/user'
import { UserRole } from '@/enums/UserRole'
import { UserInfoVo } from '@/api/user/type'
import { AnswerStatus } from '@/enums/answerStatus'
import { useRouter } from 'next/navigation'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import AccessControlPrompt from '@/components/AccessControlPrompt'
import useAddUserSignInRecord from '@/hooks/useAddUserSignInRecord'

interface Props {
  question: QuestionVO
}

/**
 * 题目卡片
 * @param props
 * @constructor
 */
const QuestionCard = (props: Props) => {
  const { question } = props
  const { userinfo } = userStore()
  const router = useRouter()
  const [themeValue, setThemeValue] = useState<string>('github')
  const [isAnswerVisible, setIsAnswerVisible] = useState<boolean>(!!localStorage.getItem('showAnswer'))

  const getVipDisplayStatus = useCallback((question: QuestionVO, userinfo?: UserInfoVo): AnswerStatus => {
    if (userinfo?.userRole === UserRole.Not_Login) return AnswerStatus.REQUEST_LOGIN
    if (question.isVip !== 1) return AnswerStatus.SHOW_ANSWER
    if (userinfo?.userRole !== UserRole.VIP) return AnswerStatus.REQUEST_VIP
    return AnswerStatus.SHOW_ANSWER
  }, [])

  const displayStatus = getVipDisplayStatus(question, userinfo)

  // 签到
  useAddUserSignInRecord()

  return (
    <div className="question-card">
      <Card>
        <Title level={1} style={{ fontSize: 24 }}>
          {question.title}
        </Title>
        <TagList tagList={JSON.parse(question.tags) || []} />
        <div style={{ marginBottom: 16 }} />
        <MdViewer value={question.content} />
      </Card>
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
    </div>
  )
}

export default QuestionCard
