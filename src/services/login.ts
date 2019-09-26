import request from '@/utils/request';
const rootPath='/server/api';
// 定义login 接口函数；
export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request(`${rootPath}/users/login`, {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`${rootPath}/login/captcha?mobile=${mobile}`);
}
