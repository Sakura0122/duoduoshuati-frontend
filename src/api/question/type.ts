export interface Question {
  /**
   * 推荐答案
   */
  answer: string
  /**
   * 内容
   */
  content: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * id
   */
  id: string
  /**
   * 是否删除
   */
  isDelete: number
  /**
   * 标签列表（json 数组）
   */
  tags: string
  /**
   * 标题
   */
  title: string
  /**
   * 是否vip
   */
  isVip: number
  /**
   * status
   */
  status: number
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建用户 id
   */
  userId: number
  /**
   * 题目难度
   */
  difficulty: number
}

export interface AddQuestionDto {
  /**
   * 题目答案
   */
  answer: string
  /**
   * 题目内容
   */
  content: string
  /**
   * 题目标签
   */
  tags?: string[]
  /**
   * 题目标题
   */
  title: string
  /**
   * 题目难度
   */
  difficulty: number
  /**
   * 是否vip
   */
  isVip: number
  /**
   * status
   */
  status: number
}

export interface UpdateQuestionDto extends AddQuestionDto {
  /**
   * 题目id
   */
  id: string
}

export interface QuestionListDto {
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
   * 题库id
   */
  questionBankId?: string
  /**
   * 标签
   */
  tag?: string[]
  /**
   * 题目难度
   */
  difficulty?: number
  /**
   * 是否vip
   */
  isVip?: number
  /**
   * status
   */
  status?: number
}

export interface QuestionVO {
  /**
   * 题目答案
   */
  answer: string
  /**
   * 题目内容
   */
  content: string
  /**
   * 题目id
   */
  id: number
  /**
   * 题目标签
   */
  tags: string
  /**
   * 题目标题
   */
  title: string
  /**
   * 题目难度
   */
  difficulty: number
  /**
   * 是否vip
   */
  isVip: number
  /**
   * status
   */
  status: number
}
