import request from '@/utils/request'
import {
  AddUserDto,
  UpdateUserDto,
  User,
  UserInfoVo,
  UserListDto,
  UserLoginDto,
  UserRegisterDto,
} from '@/api/user/type'
import { PageDto, PageVo } from '@/types/type'

const userApi = {
  login(data: UserLoginDto) {
    return request.post<string>('/user/login', data)
  },
  register(data: UserRegisterDto) {
    return request.post('/user/register', data)
  },
  logout() {
    return request.post('/user/logout')
  },
  getUserInfo() {
    return request.get<UserInfoVo>('/user/userInfo')
  },
  addUser(data: AddUserDto) {
    return request.post('/user/add', data)
  },
  deleteUser(id: string) {
    return request.post('/user/delete', { id })
  },
  updateUser(data: UpdateUserDto) {
    return request.post('/user/update', data)
  },
  getUserList(data: PageDto<UserListDto>) {
    return request.get<PageVo<User>>('/user/list', data)
  },
}

export default userApi
