import template from './template';
import util from '@/util/util';

const libName = 'panel';

export default {
  install(Vue, pkg, data) {
    if (!pkg[libName]) pkg[libName] = {};
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
  }
}
