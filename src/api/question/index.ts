import request from '@/utils/request'
import { AddQuestionDto, Question, QuestionListDto, QuestionVO, UpdateQuestionDto } from '@/api/question/type'
import { PageDto, PageVo } from '@/types/type'

const questionApi = {
  addQuestion(data: AddQuestionDto) {
    return request.post('/question/add', data)
  },
  deleteQuestion(id: string) {
    return request.post('/question/delete', { id })
  },
  batchDeleteQuestion(ids: string[]) {
    return request.post('/question/batchDelete', { ids })
  },
  updateQuestion(data: UpdateQuestionDto) {
    return request.post('/question/update', data)
  },
  getQuestionList(data: PageDto<QuestionListDto>) {
    return request.post<PageVo<Question>>('/question/list', data)
  },
  /**
   * 获取公开题库列表
   * @param data
   */
  getPublicList: (data: PageDto<QuestionListDto>) => {
    return request.post<PageVo<QuestionVO>>('/question/public/list', data)
  },
  getQuestionBanksById(id: string) {
    return request.get<string[]>(`/question/${id}/questionBank`)
  },
}

export default questionApi
