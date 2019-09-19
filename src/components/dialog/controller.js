import svgSend from '@/svg/send';
import svgClose from '@/svg/close';
import util from '@/util/util';
import store from '@/lib/store';

export default {
  components: {
    svgSend,
    svgClose
  },

  data() {
    return {
      isShow: false,
      showOptions: '',
      state: 1, // 1 待发送状态 2 输入中状态
      content: '',
      messages: [],
      receiver: {},
      cid: '',
      lid: ''
    }
  },

  created() {
    // 处理未读消息
    this.getUnReadMsg();
  },

  mounted() {
    console.log(this);
    // 监听消息
    this.pomelo.pemelo.on('onMessage', this.getMsg);
  },

  methods: {

    /**
     * 失去焦点
     * @param {*} e 
     */
    onBlur(e) {
      setTimeout(() => {
        document.body.scrollTop = 0;
        window.scroll(0, 0);
        console.log('on blur');
      });
    },

    /**
     * 显示聊天窗口
     * @param {*} options 
     */
    show(options) {
      this.showOptions = options;
      try {
        this.receiver = options.receiver || {};
        let localMessages = this.getLocalMessages();
        this.messages = localMessages;
        console.log('得到的本地存储的消息', localMessages);
        this.isShow = true;
        if (this.isNeedPre === true) {
          this.content = `【${document.getElementsByTagName('title')[0].innerText}】${window.location.href}`;
          this.onSendMsg();
        }
        this.toBottom();
        document.body.addEventListener('contextmenu', function (e) {
          e.preventDefault();
        });
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
        this.unReadMsg.forEach(msg => {
          console.log('解析未读消息', msg);
          if (msg.content.body) {
            let type = msg.content.body.type;
            if (type === 1 || type === 10) {
              msg.content.body.text = this.parseContent(msg.content.body.text);
            }
            let item = {
              type: 'other',
              content: msg.content
            }
            unReadMsg.push(item);
          }
        });
        // 处理未读消息
        console.log('处理未读消息', unReadMsg);
        this.setLocalMessage(unReadMsg);
        this.unReadMsg = [];
      }
    },

    /**
     * 获取本地存储的数据
     */
    getLocalMessages() {
      let fromUser = this.userInfo;
      let toUser = this.receiver;
      // 生成通道id
      this.cid = `CHANNEL_P2P_${util.min(fromUser.id, toUser.roleId)}-${util.max(fromUser.id, toUser.roleId)}_${util.min(toUser.uid, fromUser.uid)}_${util.max(toUser.uid, fromUser.uid)}`;
      // 获取存储在本地的消息
      this.lid = `thindo.webchat.dialog.messages_${this.cid}`;
      return store.get(this.lid) || [];
    },

    /**
     * 隐藏聊天窗口
     */
    hide() {
      this.isShow = false;
    },

    /**
     * 输入框获取焦点
     */
    focus() {
      this.$refs['message'].focus();
    },

    /**
     * 发送消息按钮事件
     */
    async onSendMsg() {
      if (!this.content) return;
      let params = this.getSendParams();
      await this.sendMsg(params);
      params.content.body.text = this.parseContent(params.content.body.text);
      let message = {
        type: 'me',
        content: params.content
      }
      this.messages.push(message);
      this.$refs['message'].blur();
      this.content = '';
      this.toBottom();
      this.onBlur();
    },

    /**
     * 监听服务器的消息
     */
    getMsg(data) {
      if (!data.content.body) return;
      let type = data.content.body.type;
      if (type === 1 || type === 2 || type === 3 || type === 4) {
        if (type === 1) {
          data.content.body.text = this.parseContent(data.content.body.text);
        }
        let message = {
          type: 'other',
          content: data.content
        };
        console.log('得到聊天消息', message);
        this.messages.push(message);
        this.postServer(message);
        this.toBottom();
      }
    },

    /**
     * 收到对方消息告诉服务器
     */
    async postServer(message) {
      let res = await this.pomelo.request('chat.chatHandler.updateReadFlag', {
        msgids: [message.content.tempID]
      });
      if (res.code === 200) {
        console.log('将消息存储到本地');
        this.setLocalMessage(message);
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
      console.log('_localMessages', _localMessages);
      let newLocalMessages = [];
      // 消息去重
      _localMessages.forEach(m => {
        if (!this._checkInMessages(m.content.tempID, newLocalMessages)) {
          newLocalMessages.push(m);
        }
      });
      // 覆盖到本地
      if (this.lid) {
        console.log('覆盖到本地', newLocalMessages);
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
     * 发送消息到服务器
     */
    async sendMsg(params) {
      let res = await this.pomelo.request('chat.chatHandler.send', params);
      if (res.code === 200) {
        this.setLocalMessage({
          type: 'me',
          content: params.content
        });
      }
    },

    /**
     * 获取发送参数
     */
    getSendParams() {
      let params = {
        content: {
          body: {
            text: this.content,
            type: 1
          },
          cid: this.cid,
          sender: {
            avatar: this.userInfo.img_path,
            interestID: this.iid,
            interestName: "",
            label: "",
            level: 1,
            nick_name: this.userInfo.nickname,
            roleID: this.userInfo.id,
            sex: 1,
            uid: this.userInfo.uid
          },
          tempID: new Date().getTime() + '000'
        },
        scope: 1
      }
      return params;
    },

    /**
     * 解析内容
     * @param {*} data 
     */
    parseContent(str) {
      let re = /([a-zA-z]+:\/\/)?(([^\s]+)\.([^\s]+))/g;
      let res = str.match(re);
      if (res && res.length > 1) {
        let newContent = str.replace(re, function (a, b, c) {
          return "<a href=\"http://".concat(c, "\" target=\"_blank\">").concat(a, "</a>");
        });
        return newContent;
      } else {
        return str;
      }
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