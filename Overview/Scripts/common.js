//扩展一下javascript的Date类型,增加一个函数,用于返回 yyyy-MM-dd HH:mm:ss 这种时间格式
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };

    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }

    return format;
}

//替换掉/Date( )/
function convertTime(jsonTime, format) {
    var date = new Date(parseInt(jsonTime.replace("/Date(", "").replace(")/", ""), 10));
    var formatDate = date.format(format);
    return formatDate;
}

//获取当前时间(分钟)
function nowTime(m) {
    if (m == null) {
        var date = new Date();
        var time = date.getFullYear() + "-" +
                  ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
                  (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " +
                  (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" +
                  (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" +
                  (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    }
    else if (m == "start") {
        var date = new Date();
        var time = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-01 00:00:00";
    }
    else if (m == "end") {
        var date = new Date();
        date = new Date(date.getFullYear(), (date.getMonth() + 1), 1, 23, 59, 59);
        var time = date.getTime() - 24 * 60 * 60 * 1000;
        date = new Date(time);
        time = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
                (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + "23:59:59";
    }
    else {
        var date = new Date();
        var time = date.getTime() - m * 1000 * 60;
        date = new Date(time);
        time = date.getFullYear() + "-" +
                  ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
                  (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " +
                  (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" +
                  (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" +
                  (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    }
    return time;
}