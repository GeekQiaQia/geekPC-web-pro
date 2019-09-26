import request from '@/utils/request';
const rootPath='/server/api';

export interface LoginParamsType {
  userName: string;
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
