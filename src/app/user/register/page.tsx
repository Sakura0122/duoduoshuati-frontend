'use client'

import React, { useEffect, useRef, useState } from 'react'
import { LoginForm, ProForm, ProFormText } from '@ant-design/pro-form'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import './index.scss'
import type { UserRegisterDto } from '@/api/user/type'
import { Input } from 'antd'
import authApi from '@/api/auth'
import { message } from '@/utils/AntdGlobal'
import userApi from '@/api/user'

/**
 * 用户注册页面
 * @param props
 */
const Register: React.FC = (props) => {
  const [form] = ProForm.useForm()
  const router = useRouter()

  // 获取验证码
  const key = useRef(crypto.randomUUID())
  const [captchaImg, setCaptchaImg] = useState('')
  const getCodeData = async () => {
    const res = await authApi.getCaptcha(key.current)
    setCaptchaImg(res.data)
  }

  /**
   * 提交
   * @param values
   */
  const handleSubmit = async (values: UserRegisterDto) => {
    try {
      await userApi.register({ ...values, key: key.current })
      message.success('注册成功，请登录')
      router.push('/user/login')
    } catch (e) {
      getCodeData()
    }
  }

  useEffect(() => {
    getCodeData()
  }, [])

  return (
    <div className="register">
      <LoginForm<UserRegisterDto>
        form={form}
        logo={<Image src="/assets/logo.png" alt="多多刷题" width={44} height={44} />}
        title="多多刷题 - 用户注册"
        subTitle="程序员面试刷题网站"
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: '注册',
          },
        }}
      >
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />,
          }}
          name="userAccount"
          placeholder={'请输入用户名'}
          rules={[
            {
              required: true,
              message: '请输入用户名！',
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
        <ProFormText.Password
          name="checkPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          placeholder={'确认密码'}
          rules={[
            {
              required: true,
              message: '请再次输入密码！',
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
          已有账号？
          <Link prefetch={false} href={'/user/login'}>
            去登录
          </Link>
        </div>
      </LoginForm>
    </div>
  )
}

export default Register
