import request from '@/utils/request'

const authApi = {
  /**
   * 获取验证码
   * @param key redis存储的key
   */
  getCaptcha(key: string) {
    return request.get<string>('/auth/captcha', { key })
  },
}

export default authApi
