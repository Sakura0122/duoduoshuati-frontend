'use client'

import React from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import '@ant-design/v5-patch-for-react-19'
import { App } from 'antd'
import AntdGlobal from '@/utils/AntdGlobal'

export const AntdNextRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    <App>
      <AntdGlobal />
      <AntdRegistry>{children}</AntdRegistry>
    </App>
  )
}
