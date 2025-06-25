import { create } from 'zustand'
import { UserInfoVo } from '@/api/user/type'

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
  reset: () => set(() => ({ userinfo: { userName: '未登录', userAvatar: '', userProfile: '', userRole: '' } })),
}))

export default userStore
