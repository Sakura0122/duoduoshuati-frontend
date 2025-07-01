import request from '@/utils/request'
import {
  AddQuestionDto,
  AiGenerateQuestionsDto,
  Question,
  QuestionListDto,
  QuestionVO,
  UpdateQuestionDto,
} from '@/api/question/type'
import { PageDto, PageVo } from '@/types/type'
import { CommentVo } from '@/api/comment/type'

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
  getPublicList(data: PageDto<QuestionListDto>) {
    return request.post<PageVo<QuestionVO>>('/question/public/list', data)
  },
  getQuestionById(id: string) {
    return request.get<QuestionVO>(`/question/${id}`)
  },
  getQuestionBanksById(id: string) {
    return request.get<string[]>(`/question/${id}/questionBank`)
  },
  aiGenerateQuestions(data: AiGenerateQuestionsDto) {
    return request.post<boolean>('/question/ai/generate', data)
  },
  toggleQuestionFavour(id: string) {
    return request.post<boolean>(`/question/${id}/favour`)
  },
  getFavourStatus(id: string) {
    return request.get<boolean>(`/question/${id}/favour/status`)
  },
  getFavourQuestionList(data: PageDto<QuestionListDto>) {
    return request.post<PageVo<QuestionVO>>('/question/favour/list', data)
  },
  getQuestionComments(id: string) {
    return request.get<CommentVo[]>(`/question/${id}/comments`)
  },
}

export default questionApi
