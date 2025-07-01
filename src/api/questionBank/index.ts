import request from '@/utils/request'
import {
  AddQuestionBankDto,
  AddQuestionToBankDto,
  DeleteQuestionFromBankDto,
  QuestionBank,
  QuestionBankListDto,
  QuestionBankVo,
  QuestionBankWithSimpleQuestionsVo,
  UpdateQuestionBankDto,
} from '@/api/questionBank/type'
import { PageDto, PageVo } from '@/types/type'

const questionBankApi = {
  addQuestionBank(data: AddQuestionBankDto) {
    return request.post('/questionBank/add', data)
  },
  deleteQuestionBank(id: string) {
    return request.post('/questionBank/delete', { id })
  },
  updateQuestionBank(data: UpdateQuestionBankDto) {
    return request.post('/questionBank/update', data)
  },
  getQuestionBankList(data: PageDto<QuestionBankListDto>) {
    return request.post<PageVo<QuestionBank>>('/questionBank/list', data)
  },
  getPublicList(data: PageDto<QuestionBankListDto>) {
    return request.post<PageVo<QuestionBankVo>>('/questionBank/public/list', data)
  },
  getQuestionBankById(id: string) {
    return request.get<QuestionBankVo>(`/questionBank/${id}`)
  },
  getQuestionBankWithSimpleQuestions(id: string) {
    return request.get<QuestionBankWithSimpleQuestionsVo>(`/questionBank/${id}/questions/simple`)
  },
  addQuestionToBank(data: AddQuestionToBankDto) {
    return request.post('/questionBank/addQuestion', data)
  },
  deleteQuestionFromBank(data: DeleteQuestionFromBankDto) {
    return request.post('/questionBank/deleteQuestion', data)
  },
}

export default questionBankApi
