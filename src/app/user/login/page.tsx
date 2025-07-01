'use client'

import { LoginForm, ProForm, ProFormText } from '@ant-design/pro-form'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import './index.scss'
import { message } from '@/utils/AntdGlobal'
import { Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import authApi from '@/api/auth'
import userApi from '@/api/user'
import type { UserLoginDto } from '@/api/user/type'
import userStore from '@/stores/user'

const Login = () => {
  const [form] = ProForm.useForm()
  const router = useRouter()

  // 获取验证码
  const key = useRef(crypto.randomUUID())
  const [captchaImg, setCaptchaImg] = useState('')
  const getCodeData = async () => {
    const res = await authApi.getCaptcha(key.current)
    setCaptchaImg(res.data)
  }

  const { setUserinfo } = userStore()
  const handleSubmit = async (values: UserLoginDto) => {
    try {
      await userApi.login({ ...values, key: key.current })
      message.success('登录成功！')

      const res = await userApi.getUserInfo()
      setUserinfo(res.data)
      form.resetFields()

      // 获取回调地址
      const searchParams = new URLSearchParams(window.location.search)
      const callbackUrl = searchParams.get('callback')

      // 如果有回调地址则跳转，否则跳转首页
      router.replace(callbackUrl ? decodeURIComponent(callbackUrl) : '/')
    } catch (e) {
      getCodeData()
    }
  }

  useEffect(() => {
    getCodeData()
  }, [])

  return (
    <div className="login">
      <LoginForm<UserLoginDto>
        form={form}
        logo={<Image src="/assets/logo.png" alt="多多刷题" width={44} height={44} />}
        title="多多刷题 - 用户登录"
        subTitle="程序员面试刷题网站"
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: '登录',
          },
        }}
      >
        <ProFormText
          name="userAccount"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />,
          }}
          placeholder={'请输入用户账号'}
          rules={[
            {
              required: true,
              message: '请输入用户账号!',
            },
          ]}
        />
        <ProFormText.Password
          name="userPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          placeholder={'请输入密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <ProForm.Item
          name="code"
          placeholder={'请输入验证码'}
          rules={[
            {
              required: true,
              message: '请输入验证码！',
            },
          ]}
        >
          <div className="captcha">
            <Input placeholder="请输入验证码" size={'large'} prefix={<LockOutlined />} />
            {captchaImg && (
              <Image className="img" src={captchaImg} alt="多多刷题" width={100} height={32} onClick={getCodeData} />
            )}
          </div>
        </ProForm.Item>
        <div
          style={{
            marginBlockEnd: 24,
            textAlign: 'end',
          }}
        >
          还没有账号？
          <Link prefetch={false} href={'/user/register'}>
            去注册
          </Link>
        </div>
      </LoginForm>
    </div>
  )
}

export default Login
