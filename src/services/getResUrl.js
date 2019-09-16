function getResUrl({
  action,
  iid,
  cid = 1000
} = {}) {
  let url = ''
  let pObj = {}
  let tag = ''
  if (action.aid != 2) {
    pObj = !!action.p && _.isString(action.p) ? JSON.parse(action.p) : action.p
  }
  switch (action.aid) {
    case 2:
      url = action.p
      break
    case 30:
      switch (pObj.moduleType) {
        case 3:
          url += '/app/video/' + iid;
          break
        case 9:
          url += '/app/act/' + iid;
          break
        case 10:
          url += '/app/mate/' + iid;
          break
        case 11:
          url += '/app/note/' + iid;
          break
        case 13:
          url += '/app/sact/' + iid;
          break
        case 14:
          url += '/app/news/' + iid;
          break
        case 20:
          url += '/app/campsite/' + iid + "?type=" + (pObj.type == 2 ? 1 : 2);
          break
        case 21: //赛事列表
          url += '/app/game/' + iid + "/list";
          break
        case 23:
          url += '/app/live/' + iid;
          break
        case 31: //程序源地接线路列表
          url = '/app/act/origin/list?iid=' + iid;
          break
        default:
          break
      }
      let moduleName = pObj.moduleName
      if (url.indexOf('?') === -1) {
        if (!!moduleName) {
          url += '?title=' + moduleName;
        }
      } else {
        if (!!moduleName) {
          url += '&title=' + moduleName;
        }
      }
      tag = pObj.tag;
      if (!!tag) {
        tag = encodeURIComponent(tag);
      }
      break
    case 20:
      url += '/app/act/' + iid + '/detail/' + pObj.actId;
      break
    case 21:
      url += '/app/mate/' + iid + '/detail/' + pObj.actId;
      break
    case 22:
      url += '/app/note/' + iid + '/detail/' + pObj.articleId;
      break
    case 26:
      url += '/app/store/' + iid + '/detail/' + pObj.goodsId;
      break
    case 27:
      url += '/app/store/' + iid + '/list?type=' + pObj.typeId;
      break
    case 30:
      url += '/app/store/' + iid + '/list?type=' + pObj.typeId;
      break
    case 33:
      url += '/app/index/' + iid + '?type=' + pObj.type;
      break
    case 36:
      url += '/app/sact/' + iid + '/detail/' + pObj.id;
      break
    case 37:
      url += '/app/news/' + iid + '/detail/' + pObj.id;
      break
    case 58:
      url += '/app/category/' + iid;
      break
    case 59:
      url += '/app/campsite/' + iid + '/' + pObj.id + "?type=" + (pObj.type == 2 ? 2 : 1);
      break
    case 62:
      url += '/app/game/' + iid + "/detail/" + pObj.id;
      break
    case 64:
      url += '/app/game/' + iid + "/" + pObj.id;
      break
    case 65:
      tag = pObj.subject;
      if (!!tag) {
        tag = encodeURIComponent(tag);
      }
      url += '/app/feed/' + iid + '/list';
      break
    case 67:
      url += '/app/live/' + iid;
      break;
    case 68:
      url += '/app/live/' + iid + "/detail?id=" + pObj.id;
      break;
    case 71: //递归调用
      return this.toUrl({
        action: pObj,
        iid: iid,
        cid: cid
      });
    case 76: //京东商品搜索页
      store.set("goodsSearchObject", "");
      if (pObj.typeId > 0) {
        let catName = (!!pObj.typeName) ? pObj.typeName : '';
        url = '/app/mall/search?iid=' + iid + '&catId=' + pObj.typeId + '&catName=' + catName;
      } else {
        //全部分类
        url = '/app/mall/search?iid=' + iid;
      }
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 200);
      break;
    case 77: //京东商品详情页
      url = '/app/mall/detail?iid=' + iid + '&skuId=' + pObj.skuId;
      break;
    case 80:
      url = '/app/act/origin/detail?id=' + pObj.id;
      break;
    default:
      break
  }

  if (!!cid && typeof (cid) === "object") { //兼容传了两个cid的情况
    cid = cid[0];
  }

  if (!!url) {
    let prefix = '/app/page';
    if (url.slice(0, prefix.length) === prefix) {
      location.href = 'http://www.fingerall.com' + url;
      return;
    } else {
      if (cid != 1000) {
        if (url.indexOf('?') === -1) {
          url += '?cid=' + cid + (!!tag ? '&tag=' + tag : '');
        } else {
          url += '&cid=' + cid + (!!tag ? '&tag=' + tag : '');
        }
      } else {
        if (url.indexOf('?') === -1) {
          if (!!tag) {
            url += '?tag=' + tag;
          }
        } else {
          if (!!tag) {
            url += '&tag=' + tag;
          }
        }
      }
      return url;
    }
  }

  if (cid != 1000) {
    if (url.indexOf('?') === -1) {
      url += '?cid=' + cid;
    } else {
      url += '&cid=' + cid;
    }
  }
  return url;
}

export default getResUrl;