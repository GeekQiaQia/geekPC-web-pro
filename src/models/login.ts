import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';

import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}
/***
 * @description 定义model 接口；
 * */
export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',
// model 初始状态数据；
  state: {
    status: undefined,
  },
// 处理异步逻辑 effects； 使用generate 函数；
  effects: {
    * login({ payload }, { call, put }) {
      // 调用统一管理的service 请求函数；call 发送异步请求；返回json 对象；
      const response = yield call(fakeAccountLogin, payload);
      // put 函数同步改变state 状态；
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        console.log("sdf",window.location.href);
        console.log("adfas",window.location);
        const urlParams = new URL(window.location.href);
        console.log(urlParams);
        const params = getPageQuery();
        console.log(params);
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          // 判断是否同源；
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        // 改变路由
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      console.log(redirect);
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        // 1.后端异步logout;

        // 2. 前端同步logout状态；

        // 3. 前端路由跳转，并改变当前location.href;
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
// 同步更新state的reducers;接收action,同步更新state;
  reducers: {
    // 同步update state;
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
