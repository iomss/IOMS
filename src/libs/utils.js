const utils = {

  /**
	 * 将对象数据转化成字符串拼接格式，用于get请求
	 * @param  {[type]} objectItem [description]
	 * @return {[type]}            [description]
	 */
  objectToString(objectItem) {
    if (!objectItem || !objectItem.constructor === Object) return

    var str_query_data = '?'

    for (const key in objectItem) {
      str_query_data += key + '=' + objectItem[key] + '&'
    }

    return str_query_data.trim('&', 'right')
  },

  /**
   * 时间戳转化成指定格式
   * @param  {[type]} number [毫秒级时间错 1570947270151]
   * @param  {[type]} format [‘Y-M-D’]
   * @return {[type]}        [description]
   */
  formatTime(number, format) {
    const formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
    var returnArr = []

    var date = new Date(number)
    // var date = number
    returnArr.push(date.getFullYear())
    returnArr.push(this.formatNumber(date.getMonth() + 1))
    returnArr.push(this.formatNumber(date.getDate()))
    returnArr.push(this.formatNumber(date.getHours()))
    returnArr.push(this.formatNumber(date.getMinutes()))
    returnArr.push(this.formatNumber(date.getSeconds()))

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i])
    }

    return format
  },

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }

}

export default utils
