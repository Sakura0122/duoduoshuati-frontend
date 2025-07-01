import { AddCommentDto, CommentListDto, UpdateCommentDto } from '@/api/comment/type'
import request from '@/utils/request'
import { PageDto, PageVo } from '@/types/type'
import { Comment } from '@/api/comment/type'

const commentApi = {
  addComment(data: AddCommentDto) {
    return request.post<string>('/comment/add', data)
  },
  deleteComment(id: string) {
    return request.post<boolean>('/comment/delete', { id })
  },
  updateComment(data: UpdateCommentDto) {
    return request.post<boolean>('/comment/update', data)
  },
  getCommentList(data: PageDto<CommentListDto>) {
    return request.post<PageVo<Comment>>('/comment/list', data)
  },
}

export default commentApi
