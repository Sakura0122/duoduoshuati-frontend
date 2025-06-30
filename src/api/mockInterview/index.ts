import request from '@/utils/request'
import {
  AddMockInterviewDto,
  MockInterview,
  MockInterviewEventDto,
  MockInterviewListDto,
} from '@/api/mockInterview/type'
import { PageDto, PageVo } from '@/types/type'

const mockInterviewApi = {
  addMockInterview(data: AddMockInterviewDto) {
    return request.post<string>('/mockInterview/add', data)
  },
  deleteMockInterview(id: string) {
    return request.post('/mockInterview/delete', { id })
  },
  getMockInterviewList(data: PageDto<MockInterviewListDto>) {
    return request.post<PageVo<MockInterview>>('/mockInterview/list', { params: data })
  },
  getMyMockInterviewList(data: PageDto<{ status: number }>) {
    return request.post<PageVo<MockInterview>>('/mockInterview/my/list', { params: data })
  },
  getMockInterviewById(id: string) {
    return request.get<MockInterview>(`/mockInterview/${id}`)
  },
  handleMockInterviewEvent(data: MockInterviewEventDto) {
    return request.post<string>('/mockInterview/handleEvent', data)
  },
}

export default mockInterviewApi
