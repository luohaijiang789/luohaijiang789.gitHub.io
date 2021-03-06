'use strict';

var app = angular.module('myApp.controllers', []).controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', '$ngConfirm', '$http', '$timeout', function ($scope, $rootScope, $window, $location, $ngConfirm, $http, $timeout) {
    $('#version').html('v.1.0.7');

    //基础函数
    $rootScope.pageReady = false;
    $rootScope.deviceWidth = document.body.clientWidth;
    $rootScope.apiUrl = "";

    $rootScope.avatar = "";
    $rootScope.userData = {};
    $rootScope.currentItinerary = {};
    $rootScope.currentApp = null;

    $rootScope.work_weixin = {
        corpid: 'wxc74a3c82d0ad6c46',
        corpsecret: 'W4nNN7_s3AHwS3K3YQiexMhkv3O0KsVuQb137o7G79E',
        token: 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJlY2hpc2FuIiwic3ViIjoiMTAxNzAwMDAzIiwiaWF0IjoxNTgyODc1ODk2fQ.NqxsAIaQiLQdKwmvyh9oNP7nnsQhLJn0QeuwGxmJDANZ9Az9YQpOuxB10VZeWEPNaWgwYLwzo0UhINwrg3sTCQ',
    };

    $rootScope.deptList = [];
    $rootScope.gate_sign_deadline = 17;

    $rootScope.showFileUrl = $rootScope.apiUrl + ":8082/system/file/download?path=";
    $rootScope.allowFileTypes = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".wps", ".rtf", ".pdf", "jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".m4a", ".mp3", ".wav", ".mpg", ".mpeg", ".mp4", ".avi", ".mov", ".3gp", ".rmvb"];
    $rootScope.guardCode = null;
    $rootScope.clockInterval = null;

    $rootScope.gotoWelcome = false;

    $rootScope.getToken = function (callback) {
        if (!!localStorage.getItem('ncu_rygk_work_weixin_token')) $rootScope.work_weixin.token = localStorage.getItem('ncu_rygk_work_weixin_token');
        callback && callback();
    };

    $rootScope.removeToken = function () {
        localStorage.removeItem('ncu_rygk_work_weixin_token');
    };

    $rootScope.setToken = function ($token) {
        $rootScope.work_weixin.token = $token;
        // localStorage.setItem('ncu_rygk_work_weixin_token', $rootScope.work_weixin.token);
    };

    $rootScope.getUserData = function (callback) {
        if (!!localStorage.getItem('ncu_rygk_work_weixin_userData')) $rootScope.userData = JSON.parse(localStorage.getItem('ncu_rygk_work_weixin_userData'));
        callback && callback();
    };

    $rootScope.removeUserData = function () {
        localStorage.removeItem('ncu_rygk_work_weixin_userData');
    };

    $rootScope.setUserData = function ($userData) {
        $rootScope.userData = $userData;
        // localStorage.setItem('ncu_rygk_work_weixin_userData', JSON.stringify($rootScope.userData));
    };

    $rootScope.campusId = [{ key: '100002', value: '前湖北校区' }, { key: '100004', value: '前湖南校区' }, { key: '100003', value: '东湖校区' }, { key: '100001', value: '青山湖校区' }];

    $rootScope.datepickerOptions = {
        language: 'zh-CN', //显示中文
        format: 'yyyy-mm-dd hh:ii:ss', //显示格式
        todayBtn: false, //显示今日按钮
        showClose: true,
        minDate: true,
        autoclose: true
    };

    $rootScope.ajax = function (obj) {
        // if(!$rootScope.apiUrl || $rootScope.apiUrl == "") {
        //     $rootScope.getApiUrl(function () {
        //         $rootScope.ajaxFunc(obj);
        //     });
        // }else {
        $rootScope.ajaxFunc(obj);
        // }
    };

    $rootScope.ajaxFunc = function (obj) {
        $http({
            method: obj.method || 'POST',
            url: obj.url,
            headers: obj.headers || { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            params: obj.data,
            transformRequest: function transformRequest(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "-" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }).then(function successCallback(response, d) {
            if (response.status == 200) {
                if (response.data.message == "token已失效，请重新登录" && $location.$$path != "/login") {
                    $rootScope.reLogin();
                } else if (response.data.status == -1) {
                    console.error(response);
                } else if (response.data.status == 0) {
                    console.error(response);
                }
                if (obj.callback) obj.callback(response);
            } else {
                //网络错误
                alert('网络错误');
            }
        }, function errorCallback(response) {
            alert('网络错误');
        });
    };

    // 生成uuid
    $rootScope.Guuid = function () {
        function S4() {
            return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
        }
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };

    $rootScope.removeLoading = function ($parentNode) {
        $parentNode = $parentNode || $('body');
        $parentNode.find('.loading').remove();
    };
    $rootScope.showLoading = function ($node) {
        $node.append('<div class="loading"></div>');
    };

    $rootScope.last_slide = null;
    // slide页切换
    $rootScope.slide_page_switch = function (pageName) {
        window.setTimeout(function () {
            $('.current-slide').addClass('hide').removeClass('current-slide');
            $(pageName).removeClass('hide').addClass('current-slide');
        }, 50);
    };
    // slide页前进
    $rootScope.slide_page_go = function (pageName) {
        $(pageName).removeClass('hide');
        window.setTimeout(function () {
            $rootScope.last_slide = $('.current-slide');
            $('.current-slide').addClass('slide-left').removeClass('current-slide');
            $(pageName).removeClass('slide-right slide-left').addClass('current-slide');
        }, 50);
    };
    // slide页后退
    $rootScope.slide_page_back = function (pageName) {
        if (!pageName) pageName = $rootScope.last_slide;
        window.setTimeout(function () {
            $('.workspace-panel-body .cell').removeClass('active');
        }, 50);
        $('.current-slide').addClass('slide-right').removeClass('current-slide');
        $(pageName).removeClass('slide-left slide-right').addClass('current-slide');
    };

    $rootScope.generate_photo = function (imgFile, watermark) {
        var $image = $('.croppable_img_content');
        var imgNode = $image[0];
        imgNode.setAttribute('src', imgFile);

        var croppable = false;
        $image.cropper({
            dragMode: 'none',
            autoCropArea: 1,
            viewMode: 2,
            checkOrientation: true,
            ready: function ready() {
                croppable = true;

                var compress_width = 800;
                var canvas = $image.cropper("getCroppedCanvas", {
                    width: 800,
                    height: 800
                });

                var fsz = 32,
                    drawer = canvas.getContext("2d");
                //开始绘制图片(压缩之后)
                drawer.restore();
                drawer.font = fsz + "px Arial";
                drawer.textBaseline = 'middle';
                drawer.textAlign = 'center';
                drawer.shadowColor = 'rgba(255, 255, 255, 0.8)';
                drawer.shadowOffsetX = 2;
                drawer.shadowOffsetY = 2;
                drawer.shadowBlur = 2;
                drawer.fillStyle = "#000";

                if (!!watermark) {
                    //获取水印内容
                    drawer.fillText(watermark, canvas.width - drawer.measureText(watermark).width / 2 - 10, canvas.height - fsz / 2 - 5); //配置 水印
                    // drawer.fillText($rootScope.carmessage.agency_code, (canvas.width - (drawer.measureText($rootScope.carmessage.agency_code).width) / 2) - 10, (canvas.height - fsz / 2) - 53);//经销商代码 水印
                }

                //获取压缩之后的 base64 编码的数据
                var bodyData = canvas.toDataURL("image/jpeg", 0.7); // jpeg质量
                $image.cropper("destroy");
                $('.croppable_img_content').attr('src', '');
                console.info(bodyData);

                var formData = new FormData();
                // formData.append($rootScope.currentImageName, $rootScope.base64ToBlob(bodyData), $rootScope.currentImageName+".jpg");
            }
        });
    };

    // 计算文件尺寸
    $rootScope.base64Size = function ($data) {
        var tag = "base64,";
        var baseStr = $data.substring($data.indexOf(tag) + tag.length);
        var eqTagIndex = baseStr.indexOf("=");
        baseStr = eqTagIndex != -1 ? baseStr.substring(0, eqTagIndex) : baseStr;
        var strLen = baseStr.length;
        var fileSize = strLen - strLen / 8 * 2;
        return fileSize;
    };

    // base64转文件
    $rootScope.base64ToFile = function (urlData) {
        var $Blob = $rootScope.base64ToBlob(urlData);
        var files = new window.File([$Blob], $rootScope.Guuid() + '.' + $Blob.type.split('/')[1], { type: $Blob.type });
        return files;
    };

    // base64转Blob
    $rootScope.base64ToBlob = function (urlData) {
        var arr = urlData.split(',');
        var mime = arr[0].match(/:(.*?);/)[1] || 'image/jpeg';
        // 去掉url的头，并转化为byte
        var bytes = window.atob(arr[1]);
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        var ia = new Uint8Array(ab);

        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], {
            type: mime
        });
    };

    $rootScope.verificationAttachment = function ($file, callback) {
        if ($file) {
            var typeFlag = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = $rootScope.allowFileTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    if ($file.name.indexOf(item) >= 0) {
                        typeFlag = true;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (typeFlag) {
                if ($file.size / 1024 > 2048) {
                    alert('上传文件尺寸不得大于2MB');
                } else {
                    callback && callback();
                }
            } else {
                alert('禁止上传该格式类型文件');
            }
        }
    };

    $rootScope.pageReady = true;

    $rootScope.back = function () {
        $window.history.back();
    };
    $rootScope.go = function (path, search) {
        if (path == "/welcome") $rootScope.gotoWelcome = true;
        $timeout(function () {
            if (!search) {
                $location.url(path);
            } else {
                $location.url(path).search(search);
            }
        }, 10);
    };

    $rootScope.$on('$locationChangeStart', function (e, to, from) {
        if (to) {
            var toPath = to.split('/').pop();
            var fromPath = from.split('/').pop();

            if (!!$rootScope.gotoWelcome) {
                $rootScope.gotoWelcome = false;
            } else {
                if (toPath == "welcome" && (fromPath == "passport" || fromPath == "generator")) {
                    e.preventDefault(); //阻止后退
                }
                if (toPath == "generator" && fromPath == "passport") {
                    e.preventDefault(); //阻止后退
                }
            }
        }
    });

    // 清空暂存数据
    $rootScope.resetGlobalData = function () {};

    // 正在登录连接
    $rootScope.markerLoggedConnecting = function () {
        $('.welcome-page').addClass('LoggedIn');
    };
    // 已登录
    $rootScope.markerLoggedIn = function () {
        $('.welcome-page').removeClass('LoggedIn');
    };

    $(document).on('click', '.welcome-page.LoggedIn', function () {
        if (!!$rootScope.userData) {
            if (!!$rootScope.userData.cardId) {
                $scope.gotoPassport();
            } else {
                $rootScope.go('/generator');
            }
        }
    });

    // 获取用户数据
    $rootScope.getUserInfo = function (callback) {
        $rootScope.markerLoggedConnecting();
        // alert('cardId: ' + $rootScope.userData.cardId);
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/card/getUserInfo',
            method: 'post',
            traditional: true,
            data: {
                userId: $rootScope.userData.userId,
                cardId: $rootScope.userData.cardId
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                var userData = response.data;
                if (!!userData.imgPath) userData.avatar = userData.imgPath;
                if (!!userData.type) userData.userType = userData.type;
                $rootScope.setUserData(userData);
                callback && callback();
            } else if (response.code == 1) {
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        }).fail(function (err) {});
    };

    // 通过企业微信获取工号
    $rootScope.work_weixin_login = function (callback) {
        $rootScope.markerLoggedConnecting();
        var result = window.getRequest();
        if (result.code) {
            // $rootScope.removeToken();
            // $rootScope.removeUserData();
            console.info(result.code);
            // alert('code： ' + JSON.stringify(result));

            jQuery.ajax({
                url: $rootScope.apiUrl + '/system/auth/getWebChat',
                method: 'post',
                data: {
                    code: result.code
                }
            }).complete(function (xhr) {
                var response = xhr.responseJSON;
                var token = xhr.getResponseHeader('token');
                $rootScope.setToken(token);
                // alert('token： ' + token);
                // let server_time = null;

                $rootScope.markerLoggedIn();
                var userData = response.data;

                if (response.code == "308") {
                    $rootScope.setUserData(userData);
                    // alert('userData： ' + JSON.stringify(userData));
                    if (userData.cardId) {
                        $rootScope.weixinGetLocation();
                        $scope.isGuardScan(function (flag) {
                            if (callback) {
                                callback();
                            } else if (flag) {
                                $rootScope.go('/guard');
                            } else {
                                $scope.gotoPassport();
                            }
                        });
                    } else {
                        $rootScope.go('/generator');
                    }
                } else {
                    alert(response.message);
                }
            }).fail(function (err) {});
        }
    };
    $rootScope.re_login = function () {
        // TEST ⚡️
        $rootScope.removeToken();
        $rootScope.removeUserData();
        // $rootScope.work_weixin_login();
        $rootScope.go('/welcome');
        alert('请重新登录！');
    };

    $rootScope.local_login = function (callback) {
        $rootScope.markerLoggedIn();
        if (!!$rootScope.userData) {
            if (!!$rootScope.userData.cardId) {
                $rootScope.weixinGetLocation();
                $scope.isGuardScan(function (flag) {
                    if (callback) {
                        callback();
                    } else if (flag) {
                        $rootScope.go('/guard');
                    } else {
                        $scope.gotoPassport();
                    }
                });
            } else {
                $rootScope.go('/generator');
            }
        } else {
            // $rootScope.work_weixin_login();
        }
    };

    $scope.pageInit = function () {
        // TEST ⚡️
        // $rootScope.getToken();
        // $rootScope.getUserData();
        if (True) {
            $rootScope.local_login();
        } else {
            // 微信鉴权登录
            $rootScope.work_weixin_login();
        }
    };

    $scope.gotoPassport = function () {
        $scope.userRoleId = $rootScope.userData != {} && $rootScope.userData.roleId;
        if ($scope.userRoleId == 1004) {
            // 门岗
            $rootScope.go('/guard_welcome');
        } else {
            $rootScope.go('/passport');
        }
    };

    $scope.isGuardScan = function (callback) {
        var result = window.getRequest();
        if (result.state && result.state != "STATE" && /^[0-9-_]+$/.test(result.state)) {
            $rootScope.guardCode = result.state;
            console.info(result.state);
            callback && callback(true);
        } else {
            callback && callback(false);
        }
    };

    // 复制token
    // $(document).on('click', '#version', (e) => {
    //     $(e.target).append('<input id="clipboard" type="text"/>');
    //     $('#clipboard').val(JSON.stringify($rootScope.userData));
    // });

    // $(document).on('click', '#reset', (e) => {
    // $rootScope.removeToken();
    // $rootScope.removeUserData();
    // $('#reset').css({color: '#ff2800'});
    // $rootScope.go('/test');
    // });
    $(document).on('click', '#avatar-img', function (e) {
        $('#avatar_modal').modal('show');
    });
    $(document).on('click', '#avatar_modal img', function (e) {
        $('#avatar_modal').modal('hide');
    });

    $rootScope.clock = function () {
        var time = new Date();
        var timeHtml = time.Format('hh:mm:ss');
        // var time_h = time.getHours();
        // var time_m = time.getMinutes();
        var time_s = time.getSeconds();
        // var timeHtml = time_h+":"+time_m+":"+time_s;
        if (time_s % 2) timeHtml = timeHtml.replace(/:/g, ' ');
        $('.clock').html(timeHtml);
    };

    // 后台人员通行验证
    $rootScope.isSignSafe = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/isSignSafe',
            method: 'post',
            data: {
                userId: $rootScope.userData.userId
                // userId: '091264',
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            // alert('isSafe: ' + JSON.stringify(response));
            if (response.code == 0) {
                callback && callback(response.data);
            }
        }).fail(function (err) {});
    };

    // $rootScope.getServerTime = (callback) => {
    //     jQuery.ajax({
    //         url: 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp',
    //         method: 'get',
    //         data: {},
    //     }).then(response => {
    //         if (!!response.data && !!response.data.t) {
    //             callback && callback(new Date(response.data.t));
    //         }
    //     }).fail(err => {
    //     });
    // };

    $rootScope.createCORSRequest = function (method, url) {
        var xhr = new XMLHttpRequest();
        //                    alert(xhr.readyState)
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            var xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    };

    $rootScope.echarts = {
        totalSign: 4660,
        color: ['#FF9900', '#3EAAFF', '#F56B84', '#3EAABF', '#00bf56', '#ffc64c', '#adadad'],
        /**
         * x轴/y轴通用配置
         */
        commonConfig: {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: 0
                },
                axisLine: { show: false },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#DEDEDE',
                        type: 'dashed'
                    }
                },
                axisTick: { show: false },
                axisLine: { show: false }
            }
        },
        chartCampusList: [{ 'id': '100002', 'name': '前湖北区' }, { 'id': '100004', 'name': '前湖南区' }, { 'id': '100003', 'name': '东湖校区' }, { 'id': '100001', 'name': '青山湖校区' }],
        campusId: {
            '100002': '前湖北校区',
            '100004': '前湖南校区',
            '100003': '东湖校区',
            '100001': '青山湖校区'
        },
        gateId: {
            "001": "前湖北校区 1号门",
            "002": "前湖北校区 2号门",
            "003": "前湖北校区 3号门",
            "004": "前湖北校区 5号门",
            "005": "青山湖校区 教学区1号门",
            "006": "青山湖校区 教学区2号门",
            "007": "东湖校区 教学区1号门",
            "008": "前湖南校区 1号门",
            "009": "前湖南校区 2号门",
            "010": "校车",
            "011": "前湖北校区 羽毛球馆",
            "012": "前湖北校区 宿舍",
            "013": "前湖南校区 宿舍"
        }
    };

    $rootScope.noEntryUserId = [];

    $rootScope.getTicket = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/system/auth/getTicket',
            method: 'get',
            data: {
                url: window.location.href.split('#')[0]
            },
            traditional: true
        }).then(function (response) {
            callback && callback(response);
        });
    };

    // 获取微信定位
    $rootScope.weixinGetLocation = function () {
        $rootScope.getTicket(function (response) {
            if (response.data) {
                wx.config({
                    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: response.data.appId, // 必填，企业微信的corpID
                    timestamp: response.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
                    signature: response.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                    jsApiList: ['checkJsApi', 'getLocation'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
                });

                wx.error(function (res) {
                    // $('#test-result').val('出错了' + JSON.stringify(err));
                    // alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
                });

                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: ['getLocation'],
                        success: function success(res) {
                            wx.getLocation({
                                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                altitude: true,
                                isHighAccuracy: true,
                                highAccuracyExpireTime: 3000,
                                success: function success(res) {
                                    console.info(res);
                                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                    var speed = res.speed; // 速度，以米/每秒计
                                    var accuracy = res.accuracy; // 位置精度
                                    if (res && res.latitude && res.longitude) {
                                        jQuery.ajax({
                                            url: 'http://jcapi.ncu.edu.cn:8090/thirdapi/sign/studentSign',
                                            method: 'post',
                                            data: {
                                                userId: $rootScope.userData.userId,
                                                latitude: res.latitude,
                                                longitude: res.longitude,
                                                app: $rootScope.currentApp
                                            },
                                            headers: {
                                                "token": $rootScope.work_weixin.token
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });
    };

    $rootScope.schoolGateId = ['001', //1号门	100002
    '002', //2号门	100002
    '003', //3号门	100002
    '004', //5号门	100002
    '005', //教学区1号门	100001
    '006', //教学区2号门	100001
    '007', //教学区1号门	100003
    '008', //1号门	100004
    '009', //2号门	100004
    '010'];

    $rootScope.campusNameList = ['前湖南校区', '东湖校区', '前湖北校区', '青山湖校区'];

    $rootScope.otherPageInit = function (callback) {
        // TEST ⚡️
        // $rootScope.getToken();
        // $rootScope.getUserData(callback);
        if (!!$rootScope.work_weixin.token && !!$rootScope.userData) {
            $rootScope.markerLoggedIn();
            if (!!$rootScope.userData) {
                callback && callback();
            }
        } else {
            // 微信鉴权登录
            $rootScope.markerLoggedConnecting();
            var result = window.getRequest();
            if (result.code) {
                jQuery.ajax({
                    url: $rootScope.apiUrl + '/system/auth/getWebChat',
                    method: 'post',
                    data: {
                        code: result.code
                    }
                }).complete(function (xhr) {
                    var response = xhr.responseJSON;
                    var token = xhr.getResponseHeader('token');
                    $rootScope.setToken(token);
                    $rootScope.markerLoggedIn();
                    var userData = response.data;

                    if (response.code == "308") {
                        $rootScope.setUserData(userData);
                        callback && callback();
                    } else {
                        alert(response.message);
                    }
                }).fail(function (err) {});
            }
        }
    };

    $scope.getDeptList = function () {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/visitor/getVerifyDept',
            method: 'post'
        }).then(function (response) {
            if (response.code == 0) {
                console.info(response.data);
                $scope.$apply(function ($scope) {
                    $rootScope.deptList = response.data;
                });
            } else {
                alert(response.message);
            }
        }).fail(function (err) {});
    };

    $rootScope.getDeptName = function (id) {
        if (!!$rootScope.deptList.length && !!id) return $rootScope.deptList.filter(function (item) {
            return item.dept_id == id;
        })[0].name;
    };
}]);
