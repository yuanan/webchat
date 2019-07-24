import fly from 'flyio';
import store from 'store';
import env from './env';

const proApi = '/';
const devApi = 'http://127.0.0.1:7011';

let _baseURL = env() === 'development' ? devApi : proApi;

fly.interceptors.request.use((request) => {
  const token = store.get('token');
  // 给所有请求添加自定义header
  request.headers['authorization'] = token
  request.baseURL = baseURL
  return request
});

function Req(vueInstance) {
  //拦截请求
  fly.interceptors.response.use(
    response => {
      //只返回data
      return response.data;
    },
    err => {
      //发生网络错误后会走到这里
      //return Promise.resolve("ssss")
    }
  )
  return fly;
}

export let Request = Req;
export let req = fly;
export let baseURL = _baseURL;
