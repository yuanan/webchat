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

  watch: {
    messages(val) {
      console.log('消息在变化。');
      // 覆盖到本地
      if (this.lid) {
        store.set(this.lid, val);
      }
    }
  },

  mounted() {
    // 监听消息
    this.pomelo.pemelo.on('onMessage', this.getMsg);
  },

  methods: {

    /**
     * 显示面板
     * @param {*} options 
     */
    show(options) {
      try {
        this.isShow = true;
        let ids = this.getMessages();
        if (this.unReadMsg && this.unReadMsg.length) {
          this.unReadMsg.forEach(msg => {
            this.getMsg(msg)
          });
        }
        this.serverBack(ids);
      } catch (error) {
        alert(JSON.stringify(error));
      }
    },

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
    getMessages() {
      // 获取存储在本地的消息
      this.lid = `thindo.webchat.panel.messages`;
      let messages = store.get(this.lid) || [];
      console.log('messages', messages);
      this.messages = messages;
      let ids = [];
      this.messages.forEach(m => {
        ids.push(m.content.tempID);
      });
      return ids;
    },

    /**
     * 监听服务器的消息
     */
    getMsg(data) {
      let type = data.content.body.type;
      if (type === 1 || type === 2 || type === 3 || type === 4) {
        for (const callback of this.onMessageCallBack) {
          if (typeof callback === 'function') callback(data);
        }
        if (type === 1) {
          data.content.body.text = this.parseContent(data.content.body.text);
        }
        this.messages.push(data);
        console.log('this.messages', this.messages);
      }
    },

    /**
     * 收到对方消息告诉服务器
     */
    async serverBack(ids) {
      let data = await this.pomelo.request('chat.chatHandler.updateReadFlag', {
        msgids: ids
      });
    },

    /**
     * 解析内容
     * @param {*} data 
     */
    parseContent(str) {
      var re = /([a-zA-z]+:\/\/)?(([^\s]+)\.([^\s]+))/g;
      var newContent = str.replace(re, function (a, b, c) {
        return "<a href=\"http://".concat(c, "\" target=\"_blank\">").concat(a, "</a>");
      });
      return newContent;
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
    }

  }
}