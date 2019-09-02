export default {

  set(key, value) {
    let l = window.localStorage;
    let _value = JSON.stringify(value);
    l.setItem(key, _value);
  },

  get(key) {
    let l = window.localStorage;
    let value = l.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      return undefined;
    }
  }

}