import Cookies from 'js-cookie'

const cookies = {
  /**
   * @description 存储 cookie 值
   * @param {String} name cookie name
   * @param {String} value cookie value
   * @param {Object} setting cookie setting
   */
  set: (name, value, cookieSetting = {}) => {
    const currentCookieSetting = {
      expires: 1
    }
    Object.assign(currentCookieSetting, cookieSetting)
    Cookies.set(`ioms-${process.env.VUE_APP_VERSION}-${name}`, value, currentCookieSetting)
  },
  /**
   * @description 拿到 cookie 值
   * @param {String} name cookie name
   */
  get: name => {
    return Cookies.get(`ioms-${process.env.VUE_APP_VERSION}-${name}`)
  },
  /**
   * @description 拿到 cookie 全部的值
   */
  getAll: () => {
    return Cookies.get()
  },

  /**
   * @description 删除 cookie
   * @param {String} name cookie name
   */
  remove: name => {
    return Cookies.remove(`ioms-${process.env.VUE_APP_VERSION}-${name}`)
  }
}

export default cookies
