import svgSend from '@/svg/send';
import svgClose from '@/svg/close';

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

  methods: {

    onBlur(e) {
      setTimeout(() => {
        document.body.scrollTop = 0;
        window.scroll(0,0);
        console.log('on blur');
      });
    },

    show() {
      this.isShow = true;
      this.toBottom();
      document.body.addEventListener('contextmenu', function(e){
        e.preventDefault();
      });
    },

    hide() {
      this.isShow = false;
    },

    focus() {
      this.$refs['message'].focus();
    },

    sendMsg() {
      if (!this.content) return;
      this.messages.push({
        type: 'me',
        content: this.content
      });
      this.$refs['message'].blur();
      this.content = '';
      this.toBottom();
      this.onBlur();
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