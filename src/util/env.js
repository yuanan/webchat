/**
 * 获取环境
 */
export default function env() {
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  } else {
    if (window && window.location && window.location.host) {
      let host = window.location.host;
      if (host.includes('127.0.0.1') || host.includes(localhost)) {
        return 'development';
      } else {
        return 'production';
      }
    } else {
      return 'production';
    }
  }
}