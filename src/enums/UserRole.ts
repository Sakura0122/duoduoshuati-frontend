export enum UserRole {
  Not_Login = 'not_login',
  USER = 'user',
  ADMIN = 'admin',
  VIP = 'vip',
  BAN = 'ban',
}

export const USER_ROLE_TEXT_MAP: Record<UserRole, string> = {
  [UserRole.USER]: '普通用户',
  [UserRole.ADMIN]: '管理员',
  [UserRole.Not_Login]: '未登录',
  [UserRole.VIP]: '超级会员',
  [UserRole.BAN]: '禁用',
}
