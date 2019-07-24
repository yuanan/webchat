import svgSend from '@/svg/send.vue';

export default {
  components: {
    svgSend
  },
  data() {
    return {
      isShow: false
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.isShow = true;
    }
  }
}