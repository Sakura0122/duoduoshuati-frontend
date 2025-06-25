import React from 'react'
import { usePathname } from 'next/navigation'
import { getMenuNeedRole } from '../../config/menu'
import { verifyRole } from '@/utils/permission'
import userStore from '@/stores/user'
import ErrorPage403 from '@/app/error-page/403'

export default ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname()
  const needRole = getMenuNeedRole(pathname)
  const { userinfo } = userStore()
  if (!verifyRole(userinfo, needRole)) {
    return <ErrorPage403 />
  }
  return children
}
