export interface User {
  id: string
  userAccount: string
  userPassword: string
  unionId: string
  mpOpenId: string
  userName: string
  userAvatar: string
  userProfile: string
  phoneNumber: string
  email: string
  grade: string
  workExperience: string
  expertiseDirection: string
  userRole: string
  createTime: string
  updateTime: string
  isDelete: string
}

export interface UserLoginDto {
  /**
   * 验证码
   */
  code: string
  /**
   * 验证码key
   */
  key: string
  /**
   * 用户账号
   */
  userAccount: string
  /**
   * 用户密码
   */
  userPassword: string
}

export interface UserRegisterDto {
  /**
   * 确认密码
   */
  checkPassword: string
  /**
   * 验证码
   */
  code: string
  /**
   * 验证码key
   */
  key: string
  /**
   * 用户账号
   */
  userAccount: string
  /**
   * 用户密码
   */
  userPassword: string
}

export interface UserInfoVo {
  /**
   * 邮箱
   */
  email?: string
  /**
   * 技能方向
   */
  expertiseDirection?: string
  /**
   * 年级
   */
  grade?: string
  /**
   * 用户id
   */
  id: string
  /**
   * 手机号
   */
  phoneNumber?: string
  /**
   * 用户头像
   */
  userAvatar: string
  /**
   * 用户账号
   */
  userName: string
  /**
   * 用户简介
   */
  userProfile: string
  /**
   * 用户角色
   */
  userRole: string
  /**
   * 工作经历
   */
  workExperience?: string
}

export interface UserListDto {
  /**
   * 开始时间
   */
  beginTime?: string
  /**
   * 结束时间
   */
  endTime?: string
  /**
   * 关键字
   */
  keyword?: string
  /**
   * 用户角色
   */
  userRole?: string
}

export interface AddUserDto {
  /**
   * 用户账号
   */
  userAccount: string
  /**
   * 用户头像
   */
  userAvatar?: string
  /**
   * 用户昵称
   */
  userName: string
  /**
   * 用户密码
   */
  userPassword: string
  /**
   * 用户角色
   */
  userRole: string
}

export interface UpdateUserDto extends AddUserDto {
  /**
   * 用户id
   */
  id: string
}
