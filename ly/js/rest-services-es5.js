'use strict';

angular.module('myApp.restServices', ['ngResource']).filter('nl2br', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
    };
});

Date.prototype.Format = function (fmt) {
    //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }return fmt;
};

Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};

window.deleteIterative = function (oldArr, newArr) {
    var resultArr = newArr;
    if (oldArr) for (var i in newArr) {
        if (i in oldArr) {
            delete resultArr[i];
        }
    }
    return resultArr;
};

window.sortObj = function (obj) {
    var arr = [];
    for (var i in obj) {
        arr.push([obj[i], i]);
    };
    arr.sort(function (a, b) {
        return a[0] - b[0];
    });
    var len = arr.length,
        obj = {};
    for (var i = 0; i < len; i++) {
        obj[arr[i][1]] = arr[i][0];
    }
    return obj;
};

/*remove url of alert/confirm*/
var wAlert = window.alert;
window.alert = function (message) {
    try {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        var alertFrame = window.frames[0];
        var iwindow = alertFrame.window;
        if (iwindow == undefined) {
            iwindow = alertFrame.contentWindow;
        }
        iwindow.alert(message);
        iframe.parentNode.removeChild(iframe);
    } catch (exc) {
        return wAlert(message);
    }
};

var wConfirm = window.confirm;
window.confirm = function (message) {
    try {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        var alertFrame = window.frames[0];
        var iwindow = alertFrame.window;
        if (iwindow == undefined) {
            iwindow = alertFrame.contentWindow;
        }
        var result = iwindow.confirm(message);
        iframe.parentNode.removeChild(iframe);
        return result;
    } catch (exc) {
        return wConfirm(message);
    }
};

window.setupWebViewJavascriptBridge = function (callback) {
    // https://www.jianshu.com/p/d12ec047ce52
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe);
    }, 0);
};

window.getRequest = function (url) {
    var url = !!url ? url : window.location.search;
    var jsonList = {};
    if (url.indexOf("?") > -1) {
        var str = url.slice(url.indexOf("?") + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            jsonList[strs[i].split("=")[0]] = strs[i].split("=")[1]; //如果出现乱码的话，可以用decodeURI()进行解码
        }
    }
    return jsonList;
};

window.isDuringDate = function (beginDateStr, endDateStr) {
    var curDate = new Date(),
        beginDate = new Date(beginDateStr),
        endDate = new Date(endDateStr);
    if (curDate >= beginDate && curDate <= endDate) {
        return true;
    }
    return false;
};

$.fn.autoHeight = function () {
    function autoHeight(elem) {
        elem.style.height = 'auto';
        elem.scrollTop = 0; //防抖动
        var height = elem.scrollHeight;
        if (height == '0') {
            elem.style.height = '60px';
        } else {
            elem.style.height = height + 'px';
        }
    }
    this.each(function () {
        autoHeight(this);
        $(this).on('keyup', function () {
            autoHeight(this);
        });
    });
};
$('textarea[autoHeight]').autoHeight();

window.RandomNumBoth = function (Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.floor(Rand * Range); //四舍五入
    return num;
};
