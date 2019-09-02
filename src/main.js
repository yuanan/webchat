import Vue from 'vue';
import Pomelo from '../../pomelo-webclient/index';
import dialog from '@/components/dialog/index';
import getUser from '@/services/getUser';
import getServer from '@/services/getServer';

Vue.config.productionTip = false;
let webchat = {};

// 主入口函数
(async function main () {
  let userInfo = await getUser();
  let serverInfo = await getServer(userInfo);
  let pomelo = new Pomelo();
  let iid = 1000;
  // 建立真正的连接
  let ws = await pomelo.init({
    host: serverInfo.host,
    port: serverInfo.port,
    scheme: 'ws',
    log: true
  });
  console.log('userInfo', userInfo);
  // 登录
  // userInfo.uid = '105201';
  let data = await pomelo.request('connector.entryHandler.enter', {
    apnToken: "",
    bundle: `com.fingerall.app${iid}`,
    token: userInfo.ridSecret,
    uid: userInfo.uid,
    version: "2.0.8"
  });
  Vue.mixin({
    data() {
      return {
        pomelo,
        ws,
        userInfo,
        iid
      }
    }
  });
  if (process.env.NODE_ENV === 'development') {
    window.webchat = webchat;
  }
  dialog.install(Vue, webchat);
})();

// (async () => {
//   let pomelo = new Pomelo();
//   try {


//   } catch (error) {
//     console.log(error);
//   }
// })();

// console.log(Object.keys(pomelo));
// console.log(pomelo.socket);
// try {
//   pomelo.init({
//     host: 'gate.huaxiyo1u.cc',
//     port: '3014',
//     scheme: 'ws',
//     log: true,
//   }, function (data) {
//     console.log(data);
//     pomelo.request('gate.gateHandler.queryEntry', {
//       "uid": 120445
//     }, function (data) {
//       console.log(data);
//     });
//   }, function(e) {
//     console.log('error');
//   });
// } catch (error) {
//   console.log(error);
// }

// let socket = new Socket({
//   server: 'ws://gate.huaxiyou.cc:3014'
// });

// socket.addListener('open', function (e) {
//   console.log('建立链接成功！');
//   socket.ws.send({
//     "uid" : 120445
//   });
// });

// socket.addListener('message', function(e) {
//   console.log('数据已接收...', e);
// });

// socket.addListener('error', function(e) {
//   console.log('发生错误', e);
// });

// socket.addListener('close', function(e) {
//   console.log('关闭连接', e);
// });

// // 建立链接
// socket.connect();

export default webchat;