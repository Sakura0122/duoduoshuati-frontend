import axios from 'axios'
import type { Method, AxiosRequestConfig } from 'axios'
import type { Data } from '@/types/type.ts'
import { message } from '@/utils/AntdGlobal'
import userStore from '@/stores/user'
import Cookies from 'js-cookie'

const service = axios.create({
  baseURL: 'http://localhost:8101',
  timeout: 10000,
  withCredentials: true,
})

service.interceptors.request.use(
  (config) => {
    // const token = getToken()
    // if (token) {
    //   config.headers['sakura-token'] = token
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (res) => {
    if (res.data.code === 200) {
      return res.data
    } else if (res.data.code === 40100) {
      message.error(res.data.message || '登录过期，请重新登录')
      Cookies.remove('duoduoshuati-token')
      userStore.getState().reset()
      // 不是获取用户信息接口，或者不是登录页面，则跳转到登录页面
      if (!res.request.responseURL.includes('user/userInfo') && !window.location.pathname.includes('/user/login')) {
        window.location.href = '/user/login'
      }
      return Promise.reject(res.data)
    } else {
      message.error(res.data.message || '网络异常')
      return Promise.reject(res.data)
    }
  },
  (error) => {
    console.log(error)
    message.error('请求错误')
    return Promise.reject(error)
  },
)

const baseRequest = (method: Method) => {
  return <T>(url: string, submitData?: object, config?: AxiosRequestConfig) => {
    return service.request<T, Data<T>>({
      url,
      method,
      [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
      ...config,
    })
  }
}

const request = {
  get: baseRequest('get'),
  post: baseRequest('post'),
}

export default request
