import svgSend from '@/svg/send.vue';

export default {
  components: {
    svgSend
  },

  data() {
    return {
      isShow: false,
      content: '',
      messages: [
        {
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
        }
      ]
    }
  },

  methods: {

    show() {
      this.isShow = true;
      this.toBottom();
    },

    sendMsg() {
      this.messages.push({
        type: 'me',
        content: this.content
      });
      this.content = '';
      this.toBottom();
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