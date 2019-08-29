class Socket {
  
  constructor(options) {
    this.server = options.server || '';
    this.ws = '';
    this.onopenArray = [];
    this.oncloseArray = [];
    this.onerrorArray = [];
    this.onmessageArray = [];
  }

  /**
   * 建立链接
   */
  connect() {
    let that = this;
    if (window.WebSocket && this.server) {
      this.ws = new WebSocket(this.server);
      this.ws.onopen = function (e) {
        for (let index = 0; index < that.onopenArray.length; index++) {
          const fn = that.onopenArray[index];
          if (typeof fn === 'function') fn(e);
        }
      };
      this.ws.onclose = function (e) {
        for (let index = 0; index < that.oncloseArray.length; index++) {
          const fn = that.oncloseArray[index];
          if (typeof fn === 'function') fn(e);
        }
      };
      this.ws.onerror = function () {
        for (let index = 0; index < that.onerrorArray.length; index++) {
          const fn = that.onerrorArray[index];
          if (typeof fn === 'function') fn(e);
        }
      };
      this.ws.onmessage = function() {
        for (let index = 0; index < that.onmessageArray.length; index++) {
          const fn = that.onmessageArray[index];
          if (typeof fn === 'function') fn(e);
        }
      }
    }
  }

  /**
   * 增加订阅者
   */
  addListener(eventName, callback) {
    this[`on${eventName}Array`].push(callback);
  }
}


export default Socket;