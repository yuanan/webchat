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
      state: 1, // 1 待发送状态 2 输入中状态
      content: '',
      messages: [],
      receiver: {},
      cid: '',
      lid: ''
    }
  },

  watch: {
    messages(val) {
      console.log('消息在变化。');
      // 覆盖到本地
      if (this.lid && this.cid) {
        store.set(this.lid, val);
      }
    }
  },

  mounted() {
    // 监听消息
    this.pomelo.pemelo.on('onMessage', this.getMsg);
  },

  methods: {

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
      try {
        this.receiver = options.receiver || {};
        this.isShow = true;
        // 获取本地存储的数据
        this.getMessages();
        this.toBottom();
        document.body.addEventListener('contextmenu', function (e) {
          e.preventDefault();
        });
      } catch (error) {
        alert(JSON.stringify(error));
      }
    },

    /**
     * 获取本地存储的数据
     */
    getMessages() {
      let fromUser = this.userInfo;
      let toUser = this.receiver;
      // 生成通道id
      this.cid = `CHANNEL_P2P_${util.min(fromUser.id, toUser.roleId)}-${util.max(fromUser.id, toUser.roleId)}_${util.min(toUser.uid, fromUser.uid)}_${util.max(toUser.uid, fromUser.uid)}`;
      // 获取存储在本地的消息
      this.lid = `thindo.webchat.messages_${this.cid}`;
      let messages = store.get(this.lid) || [];
      this.messages = messages;
    },

    hide() {
      this.isShow = false;
    },

    focus() {
      this.$refs['message'].focus();
    },

    /**
     * 发送消息按钮事件
     */
    onSendMsg() {
      if (!this.content) return;
      this.messages.push({
        type: 'me',
        content: this.content
      });
      this.sendMsg();
      this.$refs['message'].blur();
      this.content = '';
      this.toBottom();
      this.onBlur();
    },

    /**
     * 监听服务器的消息
     */
    getMsg(data) {
      if (data.content.body.text) {
        this.messages.push({
          type: 'other',
          content: data.content.body.text
        });
        this.serverBack(data.content);
        this.toBottom();
      }
    },

    /**
     * 收到对方消息告诉服务器
     */
    async serverBack(msg) {
      let data = await this.pomelo.request('chat.chatHandler.updateReadFlag', {
        msgids: [msg.tempID]
      });
    },

    /**
     * 发送消息到服务器
     */
    async sendMsg() {
      let params = this.getSendParams();
      // console.log('params', params);
      let data = await this.pomelo.request('chat.chatHandler.send', params);
      // console.log(data);
    },

    /**
     * 获取发送参数
     */
    getSendParams() {
      let fromUser = this.userInfo;
      let toUser = this.receiver;
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