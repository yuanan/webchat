import Vue from 'vue';
import template from './template';
import util from '@/util/util';

export default {
  install(pkg) {
    if (!pkg.dialog) pkg.dialog = {};
    let el = util.createDiv();
    pkg.dialog = new Vue(
      Object.assign(template, {
        el: `#${el.id}`
      }
    ));
  }
}