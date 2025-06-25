import { UserInfoVo } from '@/api/user/type'
import { UserRole } from '@/enums/UserRole'

/**
 * 验证用户角色
 * @param userInfo 用户信息
 * @param needRole 需要的角色
 */
export const verifyRole = (userInfo: UserInfoVo, needRole: UserRole = UserRole.Not_Login) => {
  const userRole = userInfo.userRole || UserRole.Not_Login

  // 1.如果需要的权限是 Not_Login，直接通过
  if (needRole === UserRole.Not_Login) return true

  // 2.如果用户被封禁，直接拒绝
  if (userRole === UserRole.BAN) return false

  // 3.如果需要 USER 权限，但用户未登录，拒绝
  if (needRole === UserRole.USER && userRole === UserRole.Not_Login) return false

  // 4.如果需要 ADMIN 权限，但用户不是 ADMIN，拒绝
  if (needRole === UserRole.ADMIN && userRole !== UserRole.ADMIN) return false

  // 5.其他情况（如 USER 权限检查通过，或 ADMIN 权限检查通过）
  return true
}
