import { useEffect, useState } from 'react'
import userApi from '@/api/user'

const useAddUserSignInRecord = () => {
  // 签到状态
  const [loading, setLoading] = useState<boolean>(true)

  // 请求后端执行签到
  const doFetch = async () => {
    setLoading(true)
    try {
      await userApi.addUserSignIn()
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  // 保证只会调用一次
  useEffect(() => {
    doFetch()
  }, [])

  return { loading }
}

export default useAddUserSignInRecord
