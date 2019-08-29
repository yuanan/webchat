import Vue from 'vue';
import dialog from '@/components/dialog/index';
import Socket from '@/lib/Socket';
import fly from 'flyio';
import Pomelo from '../../pomelo-webclient/index';

Vue.config.productionTip = false;

let webchat = {};
dialog.install(webchat);

if (process.env.NODE_ENV === 'development') {
  window.webchat = webchat;
}

(async () => {
  let pomelo = new Pomelo();
  try {
    let ws = await pomelo.init({
      host: 'gate.huaxiyou.cc',
      port: '3014',
      scheme: 'ws',
      log: true
    });
    let data = await pomelo.request(
      'gate.gateHandler.queryEntry',
      {
        "uid": 120445
      }
    );
    console.log('data', data);
  } catch (error) {
    console.log(error);
  }
})();

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