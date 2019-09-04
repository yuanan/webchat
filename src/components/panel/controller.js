import svgClose from '@/svg/close';
import util from '@/util/util';
import store from '@/lib/store';

export default {
  components: {
    svgClose
  },

  data() {
    return {
      isShow: false,
      messages: [],
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
        this.getMessages();
      } catch (error) {
        alert(JSON.stringify(error));
      }
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
    },

    /**
     * 监听服务器的消息
     */
    getMsg(data) {
      let type = data.content.body.type;
      if (type === 1 || type === 2 || type === 3 || type === 4 ) {
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
    }
  }
}