export interface AddMockInterviewDto {
  /**
   * 面试难度
   */
  difficulty: string
  /**
   * 工作岗位
   */
  jobPosition: string
  /**
   * 工作年限
   */
  workExperience: string
}

export interface MockInterviewListDto {
  /**
   * 状态（0-待开始、1-进行中、2-已结束）
   */
  status?: number
  /**
   * 创建用户id
   */
  userId?: number
}

export interface MockInterview {
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 面试难度
   */
  difficulty: string
  /**
   * id
   */
  id: string
  /**
   * 是否删除（逻辑删除）
   */
  isDelete: number
  /**
   * 工作岗位
   */
  jobPosition: string
  /**
   * 消息列表（JSON 对象数组字段，同时包括了总结）
   */
  messages: string
  /**
   * 状态（0-待开始、1-进行中、2-已结束）
   */
  status: number
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人（用户 id）
   */
  userId: number
  /**
   * 工作年限
   */
  workExperience: string
}

export interface MockInterviewEventDto {
  /**
   * 事件类型
   */
  event: string
  /**
   * 房间ID
   */
  id: string
  /**
   * 消息内容
   */
  message?: string
}
