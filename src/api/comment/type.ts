export interface Comment {
  /**
   * 评论内容
   */
  content: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 评论ID
   */
  id: string
  /**
   * 是否删除
   */
  isDelete: number
  /**
   * 父评论ID，0表示一级评论
   */
  pid: string
  /**
   * 关联的题目ID
   */
  questionId: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 评论用户ID
   */
  userId: string
}

export interface AddCommentDto {
  /**
   * 评论内容
   */
  content: string
  /**
   * 父级评论ID
   */
  pid?: string
  /**
   * 题目ID
   */
  questionId: string
}

export interface UpdateCommentDto {
  /**
   * 评论内容
   */
  content: string
  /**
   * 评论ID
   */
  id: string
}

export interface CommentListDto {
  keyword?: string
}

export interface CommentVo {
  /**
   * 评论内容
   */
  content: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 评论ID
   */
  id: string
  /**
   * 父评论ID
   */
  pid: string
  /**
   * 关联的题目ID
   */
  questionId: string
  /**
   * 回复列表
   */
  replies: CommentVo[]
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 评论用户ID
   */
  userId: string
  userInfo: UserInfoVo
}

/**
 * UserInfoVo
 */
export interface UserInfoVo {
  id?: number
  userAvatar?: string
  userName?: string
}
