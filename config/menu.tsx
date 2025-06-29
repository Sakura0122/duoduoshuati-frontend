import { MenuDataItem } from '@ant-design/pro-components'
import { CrownOutlined } from '@ant-design/icons'
import React from 'react'
import { UserRole } from '@/enums/UserRole'
import { UserInfoVo } from '@/api/user/type'
import { verifyRole } from '@/utils/permission'

const menus: MenuDataItem[] = [
  {
    path: '/',
    name: '主页',
  },
  {
    path: '/banks',
    name: '题库',
  },
  {
    path: '/questions',
    name: '题目',
  },
  {
    path: '/admin',
    name: '管理',
    icon: <CrownOutlined />,
    needRole: UserRole.ADMIN,
    children: [
      {
        path: '/admin/user',
        name: '用户管理',
        needRole: UserRole.ADMIN,
      },
      {
        path: '/admin/bank',
        name: '题库管理',
        needRole: UserRole.ADMIN,
      },
      {
        path: '/admin/question',
        name: '题目管理',
        needRole: UserRole.ADMIN,
      },
    ],
  },
] as MenuDataItem[]

/**
 * 获取菜单需要的角色
 * @param path 路径
 */
export const getMenuNeedRole = (path: string) => {
  const findMenu = (menus: MenuDataItem[], path: string): UserRole => {
    for (const menu of menus) {
      if (menu.path === path) {
        return menu.needRole
      }
      if (menu.children) {
        const needRole = findMenu(menu.children, path)
        if (needRole) {
          return needRole
        }
      }
    }
    return UserRole.Not_Login
  }
  return findMenu(menus, path)
}

/**
 * 获取菜单
 * @param userInfo 用户信息
 * @param menuItems 菜单项
 */
export const getMenus = (userInfo: UserInfoVo, menuItems = menus) => {
  return menuItems.filter((menu) => {
    if (!verifyRole(userInfo, menu.needRole)) return false
    if (menu.children) {
      menu.children = getMenus(userInfo, menu.children)
    }
    return true
  })
}

export default menus
