import svgSend from '@/svg/send';
import svgClose from '@/svg/close';
import util from '@/util/util';

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
      messages: [{
        type: 'me',
        content: 'h1'
      }, {
        type: 'me',
        content: 'h1'
      }, {
        type: 'me',
        content: 'h1'
      }, {
        type: 'me',
        content: 'h1'
      }, {
        type: 'other',
        content: 'h1'
      }, {
        type: 'other',
        content: 'h1'
      }, {
        type: 'other',
        content: 'h1'
      }, {
        type: 'me',
        content: 'h1'
      }, {
        type: 'me',
        content: 'h1'
      }, {
        type: 'me',
        content: 'h1'
      }]
    }
  },

  mounted() {
    console.log(this.pomelo);
    this.pomelo.pemelo.on('onMessage', this.getMsg);
    // let data = await pomelo.request(
    //   'gate.gateHandler.queryEntry',
    //   {
    //     "uid": 120445
    //   }
    // );
  },

  methods: {

    onBlur(e) {
      setTimeout(() => {
        document.body.scrollTop = 0;
        window.scroll(0, 0);
        console.log('on blur');
      });
    },

    show(options) {
      this.receiver = options.receiver || {};
      this.isShow = true;
      console.log(this.pomelo.pemelo.on);

      this.toBottom();
      document.body.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });
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
        this.toBottom();
      }
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
          cid: `CHANNEL_P2P_${util.min(fromUser.id, toUser.roleId)}-${util.max(fromUser.id, toUser.roleId)}_${util.min(toUser.uid, fromUser.uid)}_${util.max(toUser.uid, fromUser.uid)}`,
          sender: {
            avatar: this.userInfo.img_path,
            interestID: this.iid,
            interestName: "话嬉游",
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