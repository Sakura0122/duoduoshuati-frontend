// 接口响应类型
export type Data<T> = {
  code: number
  data: T
  message: string
}

// 分页请求参数类型
export type PageDto<T = any> = {
  currentPage?: number
  pageSize?: number
  /**
   * 排序字段
   */
  sortField?: string
  /**
   * 是否升序
   */
  isAsc?: boolean
} & T

// 分页响应类型
export type PageVo<T = any> = {
  list: T[]
  total: number
  pageCount: number

  [key: string]: any
}

export type Export = {
  type: string
  filename: string
  blob: Blob
}
