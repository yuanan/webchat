import Vue from 'vue';
import dialog from '@/components/dialog/index';

Vue.config.productionTip = false;

let webchat = {};
dialog.install(webchat);

if (process.env.NODE_ENV === 'development') {
  window.webchat = webchat;
}

export default webchat;