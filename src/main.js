import _Vue from 'vue';
import Pomelo from '../../pomelo-webclient/index';
import dialog from '@/components/dialog/index';
import panel from '@/components/panel/index';

import getUser from '@/services/getUser';
import getServer from '@/services/getServer';

// 主入口函数
async function init(options = {}) {
  const Vue = options.Vue || _Vue;
  let userInfo = await getUser(options.userId, options.iid);
  // let serverInfo = await getServer(userInfo);
  let pomelo = new Pomelo();
  let iid = options.iid || 1000;
  // 建立真正的连接
  let ws = await pomelo.init({
    host: 'gate.huaxiyou.cc', //serverInfo.host,
    port: '3051', // serverInfo.port,
    scheme: 'wss',
    log: true
  });
  console.log('userInfo', userInfo);
  // 登录
  async function enter() {
    let data = await pomelo.request('connector.entryHandler.enter', {
      apnToken: "",
      bundle: `com.fingerall.app${iid}`,
      token: userInfo.ridSecret,
      uid: userInfo.uid,
      version: "2.0.8"
    });
    return data;
  }
  let data = await enter();
  let vueData = {
    pomelo,
    ws,
    userInfo,
    iid: Number(iid),
    isNeedPre: options.isNeedPre || false,
    onPublicMessage: options.onMessage || '',
    onClose: function() {
      init(options);
    }
  };
  // 挂载 dialog
  dialog.install(Vue, window.thindoWebChat, Object.assign(vueData, {
    unReadMsg: data.unReadMsg
  }));
  // 挂载 panel
  panel.install(Vue, window.thindoWebChat, Object.assign(vueData, {
    unReadMsg: data.unReadMsg
  }));
}

let thindoWebChat = {
  init
};
if (window) window.thindoWebChat = thindoWebChat;

export default thindoWebChat;