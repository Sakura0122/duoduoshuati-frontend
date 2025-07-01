import userStore from '@/stores/user'
import { UserRole } from '@/enums/UserRole'

const useAccessControl = () => {
  const { userinfo } = userStore()
  return {
    isLoading: !userinfo?.userRole,
    isNotLogin: userinfo?.userRole === UserRole.Not_Login,
    isVIP: userinfo?.userRole === UserRole.VIP || userinfo?.userRole === UserRole.ADMIN,
  }
}

export default useAccessControl
