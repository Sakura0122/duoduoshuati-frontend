'use client'

import { Dropdown, Input } from 'antd'
import React from 'react'
import GlobalFooter from '@/layouts/components/GlobalFooter'
import Image from 'next/image'
import { GithubFilled, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import './index.scss'
import menus, { getMenus } from '../../../config/menu'
import userStore from '@/stores/user'
import userApi from '@/api/user'
import { ProLayout } from '@ant-design/pro-components'

const SearchInput = () => {
  const router = useRouter()
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 24,
      }}
    >
      <Input.Search
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
        }}
        placeholder="搜索题目"
        onSearch={(value: string) => {
          router.push(`/questions?keywords=${value}`)
        }}
      />
    </div>
  )
}

interface BasicLayoutProps {
  children: React.ReactNode
}

export default function BasicLayout({ children }: BasicLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { userinfo, reset } = userStore()

  const handleLogout = async () => {
    await userApi.logout()
    reset()
    router.push('/user/login')
  }

  return (
    <div className="basicLayout">
      <ProLayout
        title="多多刷题平台"
        layout="top"
        logo={<Image src="/assets/logo.png" alt="多多刷题网站" width={32} height={32} />}
        location={{ pathname }}
        footerRender={() => <GlobalFooter />}
        avatarProps={{
          src: userinfo.userAvatar || '/assets/default_avatar.jpg',
          size: 'small',
          title: userinfo.userName,
          render: (props, dom) => {
            return userinfo.id ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'userCenter',
                      icon: <UserOutlined />,
                      label: '个人中心',
                    },
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                    },
                  ],
                  onClick: async (event: { key: React.Key }) => {
                    const { key } = event
                    if (key === 'logout') {
                      await handleLogout()
                    } else if (key === 'userCenter') {
                      router.push('/user/center')
                    }
                  },
                }}
              >
                {dom}
              </Dropdown>
            ) : (
              <div onClick={() => router.push('/user/login')}>{dom}</div>
            )
          },
        }}
        actionsRender={(props) => {
          if (props.isMobile) return []
          return [
            <SearchInput key="SearchInput" />,
            <a target="_blank" key="a">
              <GithubFilled />
            </a>,
          ]
        }}
        headerTitleRender={(logo, title, _) => {
          return (
            <a target="_blank">
              {logo}
              {title}
            </a>
          )
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuDataRender={() => getMenus(userinfo, menus)}
        menuItemRender={(item, dom) => (
          <Link href={item.path || '/'} target={item.target}>
            {dom}
          </Link>
        )}
      >
        {children}
      </ProLayout>
    </div>
  )
}
