import request from '@/lib/request';
import store from '@/lib/store';

/**
 * 获取用户信息
 */
async function getUser() {
  return new Promise((resolve, reject) => {
    let userInfo = store.get('userInfo');
    console.log('store', userInfo);
    if (userInfo) {
      resolve(userInfo);
    } else {
      request(
        'get',
        'http://yun.huaxiyou.cc/getUserInfo?uniqId=1', {},
        function (res) {
          if (res.code === 0) {
            store.set('userInfo', res.t);
            resolve(res.t);
          } else {
            store.set('userInfo', '');
            reject(res.msg);
          }
        },
        'json'
      )
    }
  });
}

export default getUser;