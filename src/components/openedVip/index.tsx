'use client'
import React, { useState } from 'react'
import { Input, Button, Card, Typography, Badge, Space } from 'antd'
import { CrownOutlined, StarOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { UserRole } from '@/enums/UserRole'
import userStore from '@/stores/user'
import userApi from '@/api/user'

const { Title, Text } = Typography

const openedVip: React.FC = () => {
  const { userinfo, setUserinfo } = userStore()
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleExchange = async () => {
    setLoading(true)
    try {
      await userApi.exchangeVip(code)
      const res = await userApi.getUserInfo()
      setUserinfo(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="beVip">
      {userinfo.userRole === UserRole.USER && (
        <div>
          <Card
            title="会员兑换"
            style={{
              width: '100%',
              margin: 'auto',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Typography.Title
              level={3}
              style={{
                textAlign: 'center',
                marginBottom: '24px',
                fontWeight: 'bold',
              }}
            >
              兑换专属VIP会员
            </Typography.Title>

            <div style={{ marginBottom: '24px' }}>
              {' '}
              {/* 增加输入框和按钮的间距 */}
              <div style={{ textAlign: 'center' }}>
                <Input
                  placeholder="请输入兑换码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    width: '100%',
                    marginBottom: '24px',
                    padding: '12px',
                    fontSize: '16px',
                  }}
                />
                <Button
                  type="primary"
                  block
                  loading={loading}
                  onClick={handleExchange}
                  style={{
                    height: 50,
                    fontSize: '18px',
                    padding: '12px',
                  }}
                >
                  立即兑换
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {userinfo.userRole === UserRole.VIP && (
        <Card
          style={{
            marginTop: '20px',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)', // 更深的金色渐变
            boxShadow: '0 6px 16px rgba(250, 173, 20, 0.3)',
            overflow: 'hidden',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Badge.Ribbon text="VIP 会员" color="gold">
            <Space direction="vertical" align="center" size="large">
              <StarOutlined style={{ fontSize: '48px', color: '#fff' }} />
              <Title level={3} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                尊贵的 VIP 会员
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                感谢您对我们的支持，享受专属特权
              </Text>
            </Space>
          </Badge.Ribbon>
        </Card>
      )}

      {userinfo.userRole === UserRole.ADMIN && (
        <Card
          style={{
            marginTop: '20px',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1890ff 0%, #0052d9 100%)',
            boxShadow: '0 6px 16px rgba(24, 144, 255, 0.3)',
            overflow: 'hidden',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Badge.Ribbon text="系统管理员" color="blue">
            <Space direction="vertical" align="center" size="large">
              <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#fff' }} />
              <Title level={3} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                尊敬的管理员
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                您拥有系统最高权限，请谨慎操作
              </Text>
            </Space>
          </Badge.Ribbon>
        </Card>
      )}
    </div>
  )
}

export default openedVip
