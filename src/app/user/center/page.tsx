'use client'
import { Avatar, Card, Col, Flex, Row, Segmented, Switch, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import Paragraph from 'antd/es/typography/Paragraph'
import { useState } from 'react'
import dayjs from 'dayjs'
import userStore from '@/stores/user'
import { USER_ROLE_TEXT_MAP, UserRole } from '@/enums/UserRole'
import UserInfo from '@/app/user/center/components/UserInfo'
import UserInfoEditForm from '@/app/user/center/components/UserInfoEditForm'
import CalendarChart from '@/app/user/center/components/CalendarChart'

/**
 * 用户中心页面
 * @constructor
 */
export default function UserCenterPage() {
  // 获取登录用户信息
  const { userinfo } = userStore()
  console.log(userinfo)

  // 控制菜单栏的 Tab 高亮
  const [activeTabKey, setActiveTabKey] = useState<string>('info')
  // 控制用户资料编辑状态的切换
  const [currentEditState, setCurrentEditState] = useState<string>('查看信息')
  const handleChangeShowAnswer = (checked: boolean) => {
    if (checked) {
      localStorage.setItem('showAnswer', 'true')
    } else {
      localStorage.setItem('showAnswer', '')
    }
  }

  return (
    <div id="userCenterPage" className="max-width-content" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar src={userinfo.userAvatar} size={72} />
            <div style={{ marginBottom: 16 }} />
            <Card.Meta
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  {userinfo.userName}
                </Title>
              }
              description={<Paragraph type="secondary">{userinfo.userProfile}</Paragraph>}
            />
            <Tag color={userinfo.userRole === UserRole.ADMIN ? 'gold' : 'grey'}>
              {USER_ROLE_TEXT_MAP[userinfo.userRole as UserRole]}
            </Tag>
            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              注册日期：{dayjs(userinfo.createTime).format('YYYY-MM-DD')}
            </Paragraph>
            <Paragraph
              type="secondary"
              style={{ marginTop: 8 }}
              copyable={{
                text: userinfo.id,
              }}
            >
              我的 id：{userinfo.id}
            </Paragraph>
            <Flex justify={'space-between'}>
              <Paragraph type="secondary">默认展示答案</Paragraph>
              <Switch
                defaultChecked={localStorage.getItem('showAnswer') === 'true'}
                onChange={handleChangeShowAnswer}
              />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card
            tabList={[
              {
                key: 'info',
                label: '我的信息',
              },
              {
                key: 'record',
                label: '刷题记录',
              },
              {
                key: 'others',
                label: '其他',
              },
            ]}
            activeTabKey={activeTabKey}
            onTabChange={(key: string) => {
              setActiveTabKey(key)
            }}
          >
            {activeTabKey === 'info' && (
              <>
                <Segmented<string>
                  options={['查看信息', '修改信息']}
                  value={currentEditState}
                  onChange={setCurrentEditState}
                />
                {currentEditState === '查看信息' && <UserInfo user={userinfo} />}
                {currentEditState === '修改信息' && <UserInfoEditForm user={userinfo} />}
              </>
            )}
            {activeTabKey === 'record' && (
              <>
                <CalendarChart />
              </>
            )}
            {activeTabKey === 'others' && <>bbb</>}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
