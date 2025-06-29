'use client'
import { Button, Card, Select, Skeleton, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import TagList from '@/components/TagList'
import MdViewer from '@/components/MdViewer'
import { QuestionVO } from '@/api/question/type'
import { useCallback, useState } from 'react'
import { themeList } from 'bytemd-plugin-theme'
import userStore from '@/stores/user'
import { UserRole } from '@/enums/UserRole'
import { UserInfoVo } from '@/api/user/type'
import { AnswerStatus } from '@/enums/answerStatus'
import { useRouter } from 'next/navigation'
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons'

// import useAddUserSignInRecord from '@/hooks/useAddUserSignInRecord'

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
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)

  const getVipDisplayStatus = useCallback((question: QuestionVO, userinfo?: UserInfoVo): AnswerStatus => {
    if (userinfo?.userRole === UserRole.Not_Login) return AnswerStatus.REQUEST_LOGIN
    if (question.isVip !== 1) return AnswerStatus.SHOW_ANSWER
    if (userinfo?.userRole !== UserRole.VIP) return AnswerStatus.REQUEST_VIP
    return AnswerStatus.SHOW_ANSWER
  }, [])

  const displayStatus = getVipDisplayStatus(question, userinfo)

  // 签到
  // useAddUserSignInRecord()

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
            {displayStatus === AnswerStatus.REQUEST_VIP && (
              <div className="vip-upsell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }}>
                  <LockOutlined />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>会员专属内容</div>
                <div style={{ fontSize: '16px', color: '#888', marginBottom: '24px' }}>
                  对不起，本题目为会员专属，请先开通 VIP 后访问。
                </div>
                <Button
                  type="primary"
                  href="/user/center"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  开通 VIP
                </Button>
              </div>
            )}
            {displayStatus === AnswerStatus.REQUEST_LOGIN && (
              <div className="vip-upsell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '48px', color: '#aaa', marginBottom: '8px' }}>
                  <LockOutlined style={{ fontSize: '60px', color: '#aaa' }} />
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: '#aaa',
                  }}
                >
                  登录后可查看答案
                </div>
                <Button
                  type="primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onClick={() => router.push('/login')}
                >
                  去登录
                </Button>
              </div>
            )}
            )
          </>
        ) : (
          <Skeleton />
        )}
      </Card>
    </div>
  )
}

export default QuestionCard
