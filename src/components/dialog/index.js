import template from './template';
import util from '@/util/util';

const libName = 'dialog';

export default {
  install(Vue, pkg, data) {
    const _install = function(showOptions = '') {
      pkg[libName] = {};
      let el = util.createDiv();
      let tempData = template.data();
      let dataFn = function() {
        return Object.assign(tempData, data);
      }
      template.data = dataFn;
      let object = Object.assign(template, {
        el: `#${el.id}`
      });
      pkg[libName] = new Vue(object);
      if (showOptions) {
        pkg[libName].show(showOptions);
      }
    }
    if (pkg[libName]) {
      let isShow = pkg[libName].isShow;
      let showOptions = pkg[libName].showOptions;
      let child = pkg[libName].$el;
      child.parentNode.removeChild(child);
      if (isShow === true) {
        _install(showOptions);
      } else {
        _install();
      }
    } else {
      _install();
    }
  }
}
