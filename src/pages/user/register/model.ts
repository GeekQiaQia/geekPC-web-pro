import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { fakeRegister } from '@/services/register';
// import {getPageQuery} from "@/utils/utils";
import {routerRedux} from "dva/router";

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userRegister',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
      if (response.data.code === '0000') {
        // 改变路由
        yield put(routerRedux.replace( {pathname: '/user/login',}));
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
