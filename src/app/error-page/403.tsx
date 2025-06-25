'use client'

import { Button, Result } from 'antd'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问该页面"
      extra={
        <Button type="primary" onClick={() => router.push('/')}>
          返回首页
        </Button>
      }
    />
  )
}

export default Page
