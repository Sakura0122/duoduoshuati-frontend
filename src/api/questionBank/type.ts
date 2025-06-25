export interface QuestionBank {
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 描述
   */
  description: string
  /**
   * id
   */
  id: string
  /**
   * 是否删除
   */
  isDelete: number
  /**
   * 图片
   */
  picture: string
  /**
   * 标题
   */
  title: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建用户 id
   */
  userId: number
}

export interface QuestionBankVo {
  /**
   * 描述
   */
  description: string
  /**
   * id
   */
  id: string
  /**
   * 图片
   */
  picture: string
  /**
   * 标题
   */
  title: string
}

export interface AddQuestionBankDto {
  /**
   * 描述
   */
  description: string
  /**
   * 图片
   */
  picture?: string
  /**
   * 标题
   */
  title: string
}

export interface UpdateQuestionBankDto extends AddQuestionBankDto {
  /**
   * 题库id
   */
  id: string
}

export interface QuestionBankListDto {
  /**
   * 开始时间
   */
  beginTime?: string
  /**
   * 结束时间
   */
  endTime?: string
  /**
   * 是否升序
   */
  isAsc?: boolean
  /**
   * 关键字
   */
  keyword?: string
}

export interface AddQuestionToBankDto {
  questionBankId: string
  questionIds: string[]
  userId: string
}

export interface DeleteQuestionFromBankDto {
  questionBankId: string
  questionIds: string[]
}
