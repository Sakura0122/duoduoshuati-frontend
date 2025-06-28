'use client'

import React, { useCallback, useEffect } from 'react'
import '@/app/globals.css'
import BasicLayout from '@/layouts/BasicLayout'
import userApi from '@/api/user'
import userStore from '@/stores/user'
import Permission from '@/app/permission'
import Cookies from 'js-cookie'
import { App } from 'antd'
import AntdGlobal from '@/utils/AntdGlobal'
import { AntdRegistry } from '@ant-design/nextjs-registry'

const RootLayout = ({ children }: React.PropsWithChildren) => {
  const { setUserinfo } = userStore()

  const init = useCallback(async () => {
    if (Cookies.get('duoduoshuati-token')) {
      try {
        const res = await userApi.getUserInfo()
        setUserinfo(res.data)
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    init()
  }, [])

  return (
    <html lang="zh">
      <body>
        <AntdRegistry>
          <App>
            <AntdGlobal />
            <BasicLayout>
              <Permission>{children}</Permission>
            </BasicLayout>
          </App>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default RootLayout
