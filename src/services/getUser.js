import request from '@/lib/request';
import util from '@/util/util';

/**
 * 获取用户信息
 */
async function getUser(userId, iid = 1000) {
  return new Promise((resolve, reject) => {
    let userInfo = util.cookie.get('userInfo');
    let url = '';
    if (userId) {
      url = `http://yun.huaxiyou.cc/getUserInfo?userId=${userId}&iid=${iid}`;
    } else {
      url = `http://yun.huaxiyou.cc/getUserInfo?uniqId=1&iid=${iid}`;
    }
    if (userInfo) {
      resolve(userInfo);
    } else {
      request(
        'get',
        url,
        {},
        function (res) {
          if (res.code === 0) {
            util.cookie.set('userInfo', res.t, (new Date().getTime() + 0.5*24*60*60*1000));
            resolve(res.t);
          } else {
            util.cookie.set('userInfo', '', 1000);
            reject(res.msg);
          }
        },
        'json'
      )
    }
  });
}

export default getUser;
