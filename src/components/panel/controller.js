import svgClose from '@/svg/close';
import util from '@/util/util';
import store from '@/lib/store';

export default {
  components: {
    svgClose
  },

  data() {
    return {
      dateFormat: util.dateFormat,
      isShow: false,
      messages: [],
      onMessageCallBack: [],
      lid: `thindo.webchat.panel.messages`
    }
  },

  created() {
    // 处理未读消息
    this.getUnReadMsg();
  },

  mounted() {
    // 监听消息
    this.pomelo.pemelo.on('onMessage', this.onMsg);
    this.pomelo.pemelo.on('onClose', this.onClose);
    // this.pomelo.pomelo.on('onClose', this.onClose);
  },

  methods: {
    /**
     * 显示面板
     * @param {*} options 
     */
    show(options = {}) {
      try {
        let localMessages = this.getLocalMessages();
        console.log('得到的本地存储的消息', localMessages);
        this.messages = localMessages;
        this.isShow = true;
        this.toBottom();
      } catch (error) {
        alert(JSON.stringify(error));
      }
    },

    /**
     * 获取未读消息
     */
    getUnReadMsg() {
      if (this.unReadMsg && this.unReadMsg.length) {
        let unReadMsg = [];
        this.unReadMsg.forEach(m => {
          if (!m.content.body) {
            unReadMsg.push(this.toTextObj(m));
          } else {
            unReadMsg.push(m);
          }
        });
        this.setLocalMessage(unReadMsg);
        if (typeof this.onPublicMessage === 'function') this.onPublicMessage(unReadMsg);
        this.unReadMsg = [];
      }
    },

    /**
     * 外部监听接口
     * @param {*} callback 
     */
    onMessage(callback) {
      this.onMessageCallBack.push(callback);
    },

    /**
     * 隐藏面板
     */
    hide() {
      this.isShow = false;
    },

    /**
     * 获取本地存储的数据
     */
    getLocalMessages() {
      return store.get(this.lid) || [];
    },

    /**
     * 监听服务器的消息
     */
    onMsg(data) {
      if (!data.content.body) {
        data = this.toTextObj(data);
      }
      let type = data.content.body.type;
      if (type === 1 || type === 2 || type === 3 || type === 4 || type === 10 || type === 11) {
        for (const callback of this.onMessageCallBack) {
          if (typeof callback === 'function') callback(data);
        }
        if (typeof this.onPublicMessage === 'function') this.onPublicMessage(data);
        if (type === 1 || type === 10) {
          data.content.body.text = this.parseContent(data.content.body.text);
        }
        console.log('得到消息', data);
        console.log('2', JSON.stringify(data));
        this.messages.push(data);
        this.postServer(data);
      }
    },

    /**
     * 把资源类型消息转化为系统通知消息
     */
    toTextObj(data) {
      let flag = data.flag;
      if (flag !== 2) return;
      let id = data.date;
      let resource = data.content.arguments.tipNotify.content;
      let _data = {
        "content": {
          "body": {
            "text": '获得一张优惠券【' + resource.name + '' + resource.desc + '】请到我的优惠券页面查看',
            "time": id,
            "type": 10
          },
          "cid": "Notify",
          "sender": {
            "avatar": "https://fimage.oss-cn-shenzhen.aliyuncs.com/common/inform.png",
            "interestID": this.iid,
            "level": 15,
            "nick_name": "系统消息",
            "roleID": 315340,
            "sex": 2,
            "uid": 1000
          },
          "tempID": id
        },
        "date": id,
        "flag": 1,
        "scope": 1,
        "id": id,
        "cid": "Notify"
      }
      return _data;
    },

    /**
     * 收到对方消息告诉服务器
     */
    async postServer(data) {
      let msgids = [];
      if (data.constructor === Array) {
        data.forEach(m => {
          msgids.push(m.content.tempID);
        });
      } else if (data.constructor === Object) {
        msgids = [data.content.tempID];
      } else {
        return;
      }
      let res = await this.pomelo.request('chat.chatHandler.updateReadFlag', {
        msgids
      });
      if (res.code === 200) {
        // console.log('将消息存储到本地');
        this.setLocalMessage(data);
        this.toBottom();
      }
    },

    /**
     * 解析内容
     * @param {*} data 
     */
    parseContent(str) {
      let re = /([a-zA-z]+:\/\/)?(([^\s]+)\.([^\s]+))/g;
      if (re && re.length > 1) {
        let newContent = str.replace(re, function (a, b, c) {
          return "<a href=\"http://".concat(c, "\" target=\"_blank\">").concat(a, "</a>");
        });
        return newContent;
      } else {
        return str;
      }
    },

    /**
     * 保存消息到本地存储
     */
    setLocalMessage(data) {
      let messages = [];
      if (data.constructor === Array) {
        messages = data;
      } else if (data.constructor === Object) {
        messages = [data];
      }
      let localMessages = this.getLocalMessages();
      let _localMessages = localMessages.concat(messages);
      // console.log('_localMessages', _localMessages);
      let newLocalMessages = [];
      // 消息去重
      _localMessages.forEach(m => {
        if (!this._checkInMessages(m.content.tempID, newLocalMessages)) {
          newLocalMessages.push(m);
        }
      });
      // 覆盖到本地
      if (this.lid) {
        // console.log('覆盖到本地', newLocalMessages);
        store.set(this.lid, newLocalMessages);
      }
    },

    /**
     * 消息数组去重
     * @param {*} tempID 
     * @param {*} messages 
     */
    _checkInMessages(tempID, messages = []) {
      let hasMessage = false;
      if (messages.length === 0) return hasMessage;
      messages.forEach(m => {
        if (m.content.tempID === tempID) {
          hasMessage = true;
        }
      });
      return hasMessage;
    },

    /**
     * 回复某条消息
     */
    onReply(data) {
      let lid = `thindo.webchat.dialog.messages_${data.cid}`;
      let messages = store.get(lid) || [];
      if (messages.length === 0) {
        messages.push({
          type: 'other',
          content: data.content
        });
        store.set(lid, messages);
      }
      this.isShow = false;
      // 显示聊天窗口
      window.thindoWebChat.dialog.show({
        receiver: {
          roleId: data.content.sender.roleID,
          uid: data.content.sender.uid,
          nickName: data.content.sender.nick_name
        }
      });
    },

    /**
     * 前往资源
     */
    goResource(data) {

    },

    /**
     * 置底
     */
    toBottom() {
      this.$nextTick(() => {
        let scrollDom = this.$refs['content'];
        if (scrollDom) {
          scrollDom.scrollTop = scrollDom.scrollHeight;
        }
      });
    }
  }
}