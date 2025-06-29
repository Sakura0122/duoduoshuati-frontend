import { create } from 'zustand'
import { UserInfoVo } from '@/api/user/type'
import { UserRole } from '@/enums/UserRole'

interface UserStore {
  userinfo: UserInfoVo
  setUserinfo: (userinfo: UserInfoVo) => void
  reset: () => void
}

const userStore = create<UserStore>((set) => ({
  userinfo: {
    userName: '未登录',
    userAvatar: '',
    userProfile: '',
    userRole: '',
  },
  setUserinfo: (userinfo: UserInfoVo) => set(() => ({ userinfo })),
  reset: () => set({ userinfo: { userName: '未登录', userAvatar: '', userProfile: '', userRole: UserRole.Not_Login } }),
}))

export default userStore
