import Pomelo from '../../../pomelo-webclient/index';

/**
 * 获取服务器信息
 */
async function getServer(userInfo) {
  let pomelo = new Pomelo();
  // 得到服务器信息
  let ws = await pomelo.init({
    host: 'gate.huaxiyou.cc',
    port: '3014',
    scheme: 'ws',
    log: true
  });
  let data = await pomelo.request(
    'gate.gateHandler.queryEntry', {
      "uid": userInfo.uid
    }
  );
  return data;
}

export default getServer;