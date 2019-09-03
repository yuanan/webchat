import _Vue from 'vue';
import Pomelo from '../../pomelo-webclient/index';
import dialog from '@/components/dialog/index';
import getUser from '@/services/getUser';
import getServer from '@/services/getServer';

// 主入口函数
async function init (options = {}) {
  const Vue = options.Vue || _Vue;
  let userInfo = await getUser(options.userId, options.iid);
  let serverInfo = await getServer(userInfo);
  let pomelo = new Pomelo();
  let iid = options.iid || 1000;
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
  dialog.install(Vue, window.thindoWebChat, {
    pomelo,
    ws,
    userInfo,
    iid
  });
}

let thindoWebChat = { init };
if (window) window.thindoWebChat = thindoWebChat;

export default thindoWebChat;
