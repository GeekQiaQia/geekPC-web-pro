import request from '@/utils/request';
import { UserRegisterParams } from '../pages/user/register';
const rootPath='/server/api';
export async function fakeRegister(params: UserRegisterParams) {
  return request(`${rootPath}/users/register`, {
    method: 'POST',
    data: params,
  });
}
