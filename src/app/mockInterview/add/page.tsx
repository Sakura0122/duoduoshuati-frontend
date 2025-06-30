'use client'
import { Button, Form, Input, Skeleton } from 'antd'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import './index.scss'
import { AddMockInterviewDto } from '@/api/mockInterview/type'
import mockInterviewApi from '@/api/mockInterview'
import { message } from '@/utils/AntdGlobal'
import userStore from '@/stores/user'
import { UserRole } from '@/enums/UserRole'
import { LockOutlined } from '@ant-design/icons'
import AccessControlPrompt from '@/components/AccessControlPrompt'
import useAccessControl from '@/hooks/useAccessControl'

const AddMockInterview = () => {
  const [form] = Form.useForm()
  const { userinfo } = userStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { isLoading, isNotLogin, isVIP } = useAccessControl()

  /**
   * 提交表单
   *
   * @param values
   */
  const doSubmit = async (values: AddMockInterviewDto) => {
    const hide = message.loading('正在创建模拟面试...')
    setLoading(true)
    try {
      const res = await mockInterviewApi.addMockInterview(values)
      hide()
      message.success('模拟面试创建成功')
      form.resetFields() // 重置表单
      router.push('/mockInterview/chat/' + res.data)
    } finally {
      hide()
      setLoading(false)
    }
  }

  return (
    <div id="addMockInterview">
      {isLoading ? (
        // 用户信息未加载时显示骨架屏
        <Skeleton active />
      ) : isNotLogin ? (
        // 未登录用户显示登录提示
        <AccessControlPrompt type="login" title="请先登录以创建模拟面试" />
      ) : !isVIP ? (
        // 非VIP用户显示升级提示
        <AccessControlPrompt type="vip" title="VIP专属功能" description="创建模拟面试是VIP专属功能，请升级VIP后使用" />
      ) : (
        // VIP用户显示表单
        <>
          <h2>创建 AI 模拟面试</h2>
          <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
            <Form.Item label="工作岗位" name="jobPosition" rules={[{ required: true, message: '请输入工作岗位' }]}>
              <Input placeholder="请输入工作岗位，例如：Web前端开发工程师" />
            </Form.Item>

            <Form.Item label="工作年限" name="workExperience" rules={[{ required: true, message: '请输入工作年限' }]}>
              <Input placeholder="请输入工作年限，例如：3 年" />
            </Form.Item>

            <Form.Item label="面试难度" name="difficulty" rules={[{ required: true, message: '请输入面试难度' }]}>
              <Input placeholder="请输入面试难度，例如：中等" />
            </Form.Item>

            <Form.Item>
              <Button loading={loading} style={{ width: 180 }} type="primary" htmlType="submit">
                创建模拟面试
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  )
}

export default AddMockInterview
