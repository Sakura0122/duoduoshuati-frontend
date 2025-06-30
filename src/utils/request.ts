import type { Data } from '@/types/type.ts'
import { message } from '@/utils/AntdGlobal'
import userStore from '@/stores/user'
import Cookies from 'js-cookie'
import { getServerToken } from '@/utils/token'

export async function getToken() {
  if (typeof window === 'undefined') {
    return getServerToken()
  }
  return Cookies.get('duoduoshuati-token')
}

/**
 * 封装 fetch 请求
 */
const baseRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  submitData?: object,
  config?: RequestInit,
): Promise<Data<T>> => {
  const token = await getToken()
  const headers: any = {
    'Content-Type': 'application/json',
    ...config?.headers,
  }

  if (token) {
    headers['duoduoshuati-token'] = `${token}`
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    credentials: 'include', // 相当于 axios 的 withCredentials: true
    ...config,
  }

  // 如果是 GET，参数放在 URL；否则放在 body
  if (method === 'GET' && submitData) {
    const params = new URLSearchParams(submitData as Record<string, string>)
    url += `?${params.toString()}`
  } else if (submitData) {
    requestOptions.body = JSON.stringify(submitData)
  }

  try {
    const response = await fetch(`http://localhost:8101${url}`, requestOptions)
    const data = await response.json()

    // 处理响应拦截逻辑（类似 axios 的 interceptors.response）
    if (data.code === 200) {
      return data
    } else if (data.code === 40100) {
      console.log('token', token)
      console.log(url)
      message.error(data.message || '登录过期，请重新登录')
      Cookies.remove('duoduoshuati-token')
      userStore.getState().reset()

      // 如果不是获取用户信息接口，且不是登录页面，则跳转登录
      if (
        typeof window !== 'undefined' &&
        !response.url.includes('user/userInfo') &&
        !window.location.pathname.includes('/user/login')
      ) {
        window.location.href = '/user/login'
      }
      throw data
    } else {
      message.error(data.message || '网络异常')
      throw data
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const request = {
  get: <T>(url: string, params?: object, config?: RequestInit) => baseRequest<T>('GET', url, params, config),
  post: <T>(url: string, data?: object, config?: RequestInit) => baseRequest<T>('POST', url, data, config),
}

export default request
