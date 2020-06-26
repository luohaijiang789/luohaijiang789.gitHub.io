'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

angular.module('myApp.controllers_welcome', [])
//登录
.controller('welcomeCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.goto_generator = function () {
        $rootScope.go('/generator');
    };
    $scope.goto_passport = function () {
        $rootScope.go('/passport');
    };
    $scope.goto_application = function () {
        $rootScope.go('/application');
    };
}]);

angular.module('myApp.controllers_generator', [])
//生成ID
.controller('generatorCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();
    $rootScope.currentApp = 'cardId';

    $scope.avatarFileName = "";
    $scope.avatarFile = null;
    $scope.avatarOriginalFile = null;

    $scope.formField = {
        'name': null,
        'sex': null,
        'number': null,
        'mobile': null,
        'idCard': null,
        'class': null,
        'campus': null
    };

    $scope.formField.name = $rootScope.userData.userName ? $rootScope.userData.userName : null;
    $scope.formField.sex = $rootScope.userData.sex ? $rootScope.userData.sex : null;
    $scope.formField.number = $rootScope.userData.userId ? $rootScope.userData.userId : null;
    $scope.formField.mobile = $rootScope.userData.mobile ? parseInt($rootScope.userData.mobile) : null;
    $scope.formField.idCard = $rootScope.userData.idCard ? $rootScope.userData.idCard : null;
    $scope.formField.className = $rootScope.userData.className ? $rootScope.userData.className : null;
    $scope.formField.collegeName = $rootScope.userData.collegeName ? $rootScope.userData.collegeName : null;
    $scope.formField.majorName = $rootScope.userData.majorName ? $rootScope.userData.majorName : null;
    $scope.formField.grade = $rootScope.userData.grade ? $rootScope.userData.grade : null;
    $scope.formField.campus = $rootScope.userData.campus ? $rootScope.userData.campus : null;
    $scope.formField.deptName = $rootScope.userData.deptName ? $rootScope.userData.deptName : null;
    $scope.formField.userType = $rootScope.userData.userType ? $rootScope.userData.userType : null;

    $scope.take_photo = function () {};

    // 生成电子ID
    $scope.generator = function () {
        // $rootScope.avatar = $('.cropped_image').attr('src');
        // console.info($rootScope.avatar);
        // $scope.uploadPhoto((imgPath) => {
        $scope.uploadPhotoBase64(function (imgPath) {
            $scope.imgPath = imgPath;
            $scope.addCard(function () {
                $rootScope.userData.cardStatus = 1;
                $rootScope.go('/passport');
            });
        });
        // $rootScope.generate_photo($rootScope.avatar, $('#idCard').val());
    };

    // $scope.photo_button = () => {
    //     jQuery('#avatar_input').click();
    // };
    //
    // $(document).on('touchstart', '#photo-button', () => {
    //     console.info('xxxxx');
    //     jQuery('#avatar_input').click();
    // });

    $scope.uploadPhoto = function (callback) {
        var formData = new FormData();
        formData.append("file", $scope.avatarFile);

        $http.post($rootScope.apiUrl + "/system/file/upload",
        // 'http://jcapi.ncu.edu.cn:8090/thirdapi/file/uploadImg',
        formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (response.code == 0) {
                if (!!response.data && response.data != "") {
                    callback && callback(response.data);
                } else {
                    alert(response.message);
                }
            } else {
                alert(response.message);
            }
        });
    };
    $scope.uploadPhotoBase64 = function (callback) {
        var formData = new FormData();
        console.info($scope.avatarFile);
        formData.append("fileStr", $scope.cropperBase64);

        $http.post($rootScope.apiUrl + "/system/file/uploadImgBase64",
        // 'http://jcapi.ncu.edu.cn:8090/thirdapi/file/uploadImgBase64',
        formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (response.code == 0) {
                if (!!response.data && response.data != "") {
                    callback && callback(response.data);
                } else {
                    alert(response.message);
                }
            } else {
                alert(response.message);
            }
        });
    };

    $scope.addCard = function (callback) {
        var data = {
            userId: $scope.formField.number,
            mobile: $scope.formField.mobile,
            idCard: $scope.formField.idCard,
            type: $scope.formField.userType,
            imgPath: $scope.imgPath
        };
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/card/addCard',
            method: 'post',
            // contentType: 'application/json;charset=UTF-8',
            traditional: true,
            data: data,
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                var userData = $rootScope.userData;
                userData['cardId'] = response.data;
                userData['avatar'] = $scope.imgPath;
                userData['mobile'] = $scope.formField.mobile;
                userData['idCard'] = $scope.formField.idCard;
                $rootScope.setUserData(userData);
                callback && callback();
            } else if (response.code == 1) {
                alert(response.message);
            } else {
                alert(response.message);
            }
        });
    };

    $scope.myImagePreview = null;
    $scope.myCroppedImage = '';
    $scope.cropped_image_show = false;
    $scope.cropper = null;

    var handleFileSelect = function handleFileSelect(evt) {
        if (!!$scope.cropper) {
            $scope.cropper.destroy();
        }

        $scope.avatarOriginalFile = evt.currentTarget.files[0];
        $scope.avatarFileName = $scope.avatarOriginalFile.name;
        var reader = new FileReader();
        reader.onload = function (evt) {
            $('#avatar_cropped_modal').removeClass('offscreen');
            $('.modal-backdrop').fadeIn();
            // $('#avatar_cropped_modal').modal('show');
            $scope.$apply(function ($scope) {
                $scope.myImagePreview = evt.target.result;
            });
            setTimeout(function () {
                $scope.cropper = new Cropper($('#cropper')[0], {
                    autoCrop: false,
                    aspectRatio: 1,
                    viewMode: 2,
                    responsive: true,
                    background: false,
                    autoCropArea: 1,
                    minCropBoxWidth: 200,
                    minCropBoxHeight: 200,
                    ready: function ready() {
                        this.cropper.crop();
                    }
                });
            }, 300);
        };
        reader.readAsDataURL($scope.avatarOriginalFile);
    };
    angular.element(document.querySelector('#avatar_input')).on('change', handleFileSelect);

    $scope.show_modal = function () {
        // $('#avatar_cropped_modal').modal('show');
        $('#avatar_cropped_modal').removeClass('offscreen');
        $('.modal-backdrop').fadeIn();
    };
    $scope.cropped = function () {
        $scope.cropperBase64 = null;

        // $('#avatar_cropped_modal').modal('hide');
        $('#avatar_cropped_modal').addClass('offscreen');
        $('.modal-backdrop').fadeOut();

        // $scope.cropper.data('cropper');
        $scope.cropperBase64 = $scope.cropper.getCroppedCanvas({
            // imageSmoothingEnabled: false,
            imageSmoothingQuality: "high",
            maxWidth: 2500,
            maxHeight: 2500
        }).toDataURL('image/jpeg', 0.8);
        $scope.myCroppedImage = $scope.cropperBase64;
        $scope.cropped_image_show = true;
        console.info($scope.cropperBase64);

        // try {
        //     $scope.avatarFile = new File([$rootScope.base64ToBlob($scope.cropperBase64)], $scope.avatarFileName);
        // } catch(err) {
        //     $scope.avatarFile = $scope.avatarOriginalFile; // 提交原始照片文件
        // }
        //
        // if(($scope.avatarFile.size / 1024).toFixed(2) <= 2){
        //     console.info(($scope.avatarFile.size / 1024).toFixed(2) + 'kb');
        //     $scope.avatarFile = $scope.avatarOriginalFile; // 提交原始照片文件
        //     // alert('照片文件获取错误');
        // }else{
        // }

        // 文件类型为空
        // if(!$scope.avatarFile.type || $scope.avatarFile.type == ""){
        //     $scope.avatarFile = $scope.avatarOriginalFile;
        // }
    };

    $scope.imgCropDone = function (e) {
        console.info(e);
    };

    // 表单校验
    var forms = $('form');
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            $('.custom-select, .form-control').removeClass('invalid valid');
            $('.avatar_input-feedback').removeClass('invalid valid');
            var validityFlag = false;

            // if($scope.avatarFile == null){
            if ($scope.avatarOriginalFile == null) {
                validityFlag = true;
                $('.avatar_input-feedback').addClass('invalid');
            }

            if (form.checkValidity() === false || validityFlag) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                $scope.generator();
            }
            form.classList.add('was-validated');
        }, false);
    });
}]);

angular.module('myApp.controllers_passport', [])
//查看ID
.controller('passportCtrl', ['$scope', '$rootScope', '$http', '$interval', function ($scope, $rootScope, $http, $interval) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();
    $rootScope.currentApp = 'cardId';

    $scope.pageInit = function () {
        if (!$rootScope.clockInterval) {
            $rootScope.clockInterval = $interval($rootScope.clock, 1000);
        }
    };

    $scope.userRoleId = $rootScope.userData != {} && $rootScope.userData.roleId;
    $scope.token = $rootScope.work_weixin.token;
    $scope.userdata = JSON.stringify($rootScope.userData);
    $scope.passport = {
        'qr': null,
        'name': null,
        'sex': null,
        'photo': null,
        'number': null,
        'mobile': null,
        'idCard': null,
        'class': null,
        'campus': null
    };

    $scope.passport.qr = $rootScope.userData.cardId ? $rootScope.userData.cardId : null;
    $scope.passport.name = $rootScope.userData.userName ? $rootScope.userData.userName : null;
    $scope.passport.sex = $rootScope.userData.sex ? $rootScope.userData.sex : null;
    $scope.passport.avatar = $rootScope.userData.avatar ? $rootScope.userData.avatar : null;
    $scope.passport.number = $rootScope.userData.userId ? $rootScope.userData.userId : null;
    $scope.passport.mobile = $rootScope.userData.mobile ? parseInt($rootScope.userData.mobile) : null;
    $scope.passport.idCard = $rootScope.userData.idCard ? $rootScope.userData.idCard : null;
    $scope.passport.className = $rootScope.userData.className ? $rootScope.userData.className : null;
    $scope.passport.collegeName = $rootScope.userData.collegeName ? $rootScope.userData.collegeName : null;
    $scope.passport.majorName = $rootScope.userData.majorName ? $rootScope.userData.majorName : null;
    $scope.passport.grade = $rootScope.userData.grade ? $rootScope.userData.grade : null;
    $scope.passport.campus = $rootScope.userData.campus ? $rootScope.userData.campus : null;
    $scope.passport.deptName = $rootScope.userData.deptName ? $rootScope.userData.deptName : null;
    $scope.passport.userType = $rootScope.userData.userType ? $rootScope.userData.userType : null;

    $scope.goto_list_approved = function () {
        $rootScope.go('/list_approved');
    };
    $scope.goto_list_apply = function () {
        $rootScope.go('/list_apply');
    };
    $scope.goto_gate_sign = function () {
        $rootScope.go('/gate_sign');
    };

    // 生成二维码
    var generateQRCodeCanvas = function generateQRCodeCanvas() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $scope.passport.qr;
        var foreground = arguments[1];
        var background = arguments[2];
        var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        if (!$scope.passport.qr) {
            $rootScope.re_login();
            return false;
        }

        var options = {
            typeNumber: -1,
            correctLevel: QRErrorCorrectLevel.H,
            width: type == 1 ? 150 : 180,
            height: type == 1 ? 150 : 180,
            background: background ? background : "#ffffff",
            foreground: foreground ? foreground : "#163a7b",
            text: text
        };

        var qrcode = new QRCode(options.typeNumber, options.correctLevel);
        qrcode.addData(options.text);
        qrcode.make();

        // create canvas element
        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        var ctx = canvas.getContext('2d');

        // compute tileW/tileH based on options.width/options.height
        var tileW = options.width / qrcode.getModuleCount();
        var tileH = options.height / qrcode.getModuleCount();

        // draw in the canvas
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                var w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
                var h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW);
                ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
            }
        }
        ctx.globalAlpha = 0;
        jQuery('.qr-code-canvas .canvas').html(canvas);
    };
    generateQRCodeCanvas();

    // 获取校区识别卡

    $scope.campusItineraryList = {
        '100002': 0,
        '100004': 0,
        '100001': 0,
        '100003': 0
    };
    $scope.getCampusItinerary = function () {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/queryList',
            method: 'post',
            data: {
                isCheck: 1
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                if (response.data && response.data.length > 0) {
                    var nowTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = response.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var item = _step.value;

                            if (item.startTime <= nowTime && item.endTime >= nowTime && item.status == '1' && item.campusId) {
                                // 当天的许可列表
                                $scope.campusItineraryList[item.campusId] = ++$scope.campusItineraryList[item.campusId];
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
                }

                // 学生
                if ($scope.passport.userType == 1) {
                    $scope.renderCampusBox();
                    var foreground = "#163a7b";
                    var background = "#ffffff";
                    if ($rootScope.userData.cardStatus == 0) {
                        // 长期通行
                        $scope.stuCardGreen();
                        foreground = "#163a7b";
                    } else if ($rootScope.userData.cardStatus == 1) {
                        // 要看通行许可
                        if ($scope.campusItineraryList[100001] > 0 || $scope.campusItineraryList[100002] > 0 || $scope.campusItineraryList[100003] > 0 || $scope.campusItineraryList[100004] > 0) {
                            $scope.stuCardGreen();
                            foreground = "#163a7b";
                        } else {
                            $scope.stuCardRed();
                            foreground = "#ff4222";
                            $('.stuNoentry').fadeIn();
                        }
                    } else if ($rootScope.userData.cardStatus == 2) {
                        // 在人事处名单即可长期通行
                        $scope.stuCardGreen();
                        foreground = "#163a7b";
                    } else if ($rootScope.userData.cardStatus == 3) {
                        // 通行证失效
                        $scope.stuCardRed();
                        foreground = "#ff4222";
                        $('.nopassport').fadeIn();
                    } else if ($rootScope.userData.cardStatus == 4) {
                        // 黄码
                        $scope.stuCardYellow();
                        foreground = "#ffb400";
                    }
                    generateQRCodeCanvas($scope.passport.qr, foreground, background, 1);
                } else {
                    var _foreground = "#3d9e00";

                    // 4.23在广东，黑龙江打卡1
                    if ($rootScope.noEntryUserId.indexOf($rootScope.userData.userId) >= 0) {
                        $('#unapply-buttons').fadeIn();
                        $('.qr-box-card').addClass('red').removeClass('green');
                        $('.user-info-card').addClass('red').removeClass('green');
                        $('.campus-box').removeClass('active');
                        _foreground = "#ff4222";
                        $('.epidemicArea').fadeIn();
                    } else {
                        $rootScope.isSignSafe(function (SignSafe) {
                            // $scope.isSafe((isSafe) => {
                            if ($rootScope.userData.cardStatus == 0) {
                                // 长期通行
                                $scope.cardGreen();
                                _foreground = "#3d9e00";
                            } else if ($rootScope.userData.cardStatus == 1) {
                                // 要看通行许可
                                // if(isSafe) {
                                // if (flag) { // 是否有教师出行申请
                                //     $scope.cardGreen();
                                //     foreground = "#3d9e00";
                                // } else {
                                //     if ($scope.campusItineraryList[$scope.guardCampusId] > 0) {

                                if (SignSafe.safe) {
                                    $scope.cardGreen();
                                    _foreground = "#3d9e00";
                                } else {
                                    $scope.cardRed();
                                    _foreground = "#ff4222";
                                    $('.isSignSafeResult').html(SignSafe.result).fadeIn();
                                }
                                // } else {
                                //     $scope.cardRed();
                                //     $('.noentry').fadeIn();
                                // }
                                // }
                                // }else{
                                //     $scope.cardRed();
                                //     foreground = "#ff4222";
                                //     $('.unsafe').fadeIn();
                                // }
                            } else if ($rootScope.userData.cardStatus == 2) {
                                // 在人事处名单即可长期通行
                                $scope.cardGreen();
                                _foreground = "#3d9e00";
                            } else if ($rootScope.userData.cardStatus == 3) {
                                // 通行证失效
                                $scope.cardRed();
                                _foreground = "#ff4222";
                                $('.nopassport').fadeIn();
                            }
                            generateQRCodeCanvas($scope.passport.qr, _foreground);
                            // });
                            // $scope.getCampusItinerary();
                        });
                    }
                }
            } else {
                alert(response.message);
            }
        });
    };

    $scope.renderCampusBox = function () {
        console.info($scope.campusItineraryList);
        for (var i in $scope.campusItineraryList) {
            if ($scope.campusItineraryList[i] > 0) {
                $('.campus-box.campus_id-' + i).addClass('active');
            }
        }
    };

    $scope.stuCardYellow = function () {
        $('.qr-box-card').addClass('yellow').removeClass('green').removeClass('red');
        $('.user-info-card').addClass('yellow').removeClass('green').removeClass('red');
        $('.qr-code-canvas').removeClass('student-qrcode-red').removeClass('student-qrcode-blue').addClass('student-qrcode-yellow');
    };

    $scope.stuCardGreen = function () {
        $('.qr-box-card').addClass('green').removeClass('red');
        $('.user-info-card').addClass('green').removeClass('red');
        $('.qr-code-canvas').removeClass('student-qrcode-red').addClass('student-qrcode-blue');
    };

    $scope.stuCardRed = function () {
        $('.qr-box-card').addClass('red').removeClass('green');
        $('.user-info-card').addClass('red').removeClass('green');
        $('.qr-code-canvas').removeClass('student-qrcode-blue').addClass('student-qrcode-red');
    };

    $scope.cardGreen = function () {
        $('.qr-box-card').addClass('green').removeClass('red');
        $('.user-info-card').addClass('green').removeClass('red');
        $('.campus-box').addClass('active');
    };

    $scope.cardRed = function () {
        $('.redcode').fadeIn();
        $('.qr-box-card').addClass('red').removeClass('green');
        $('.user-info-card').addClass('red').removeClass('green');
        $('.campus-box').removeClass('active');
    };
    // $scope.cardGreen();
    $scope.getCampusItinerary();
}]);

angular.module('myApp.controllers_guard', [])
//用户扫门岗通行
.controller('guardCtrl', ['$scope', '$rootScope', '$http', '$interval', function ($scope, $rootScope, $http, $interval) {
    $rootScope.$on('$locationChangeStart', function (e, to, from) {
        e.preventDefault();
    });
    window.addEventListener('popstate', function (e) {
        e.preventDefault();
        // wx.closeWindow();
    });

    //️ TEST ⚡️
    // $rootScope.getToken();
    // $rootScope.getUserData();
    // let result = window.getRequest();
    // if(result.state && result.state != "STATE" && /^[0-9-_]+$/.test(result.state)) {
    //     $rootScope.guardCode = result.state;
    // }

    $scope.token = $rootScope.work_weixin.token;
    $scope.userdata = JSON.stringify($rootScope.userData);
    $scope.passport = {
        'qr': null,
        'name': null,
        'sex': null,
        'photo': null,
        'number': null,
        'mobile': null,
        'idCard': null,
        'class': null,
        'campus': null
    };
    $scope.guardCampusId = null;
    $scope.guardGateId = null;
    $scope.guardGateStatus = 0;
    $scope.guardName = null;
    $scope.campusId = null;
    $scope.guardNameData = {
        'qhb': '前湖北校区',
        'qhn': '前湖南校区',
        'qsh': '青山湖校区',
        'dh': '东湖校区'
    };
    $scope.checkReark = "";
    $scope.formField = {
        temperature: window.RandomNumBoth(358, 367) / 10
    };

    $scope.passport.qr = $rootScope.userData.cardId ? $rootScope.userData.cardId : null;
    $scope.passport.name = $rootScope.userData.userName ? $rootScope.userData.userName : null;
    $scope.passport.sex = $rootScope.userData.sex ? $rootScope.userData.sex : null;
    $scope.passport.avatar = $rootScope.userData.avatar ? $rootScope.userData.avatar : null;
    $scope.passport.number = $rootScope.userData.userId ? $rootScope.userData.userId : null;
    $scope.passport.mobile = $rootScope.userData.mobile ? $rootScope.userData.mobile : null;
    $scope.passport.idCard = $rootScope.userData.idCard ? $rootScope.userData.idCard : null;
    $scope.passport.className = $rootScope.userData.className ? $rootScope.userData.className : null;
    $scope.passport.collegeName = $rootScope.userData.collegeName ? $rootScope.userData.collegeName : null;
    $scope.passport.majorName = $rootScope.userData.majorName ? $rootScope.userData.majorName : null;
    $scope.passport.grade = $rootScope.userData.grade ? $rootScope.userData.grade : null;
    $scope.passport.campus = $rootScope.userData.campus ? $rootScope.userData.campus : null;
    $scope.passport.deptName = $rootScope.userData.deptName ? $rootScope.userData.deptName : null;
    $scope.passport.userType = $rootScope.userData.userType ? $rootScope.userData.userType : null;

    if ($scope.passport.mobile.length == 11) $scope.passport.mobile = $scope.passport.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    if ($scope.passport.idCard.length == 18) $scope.passport.idCard = $scope.passport.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, "$1********$2");

    // 生成二维码
    var generateQRCodeCanvas = function generateQRCodeCanvas() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $scope.passport.qr;
        var foreground = arguments[1];
        var background = arguments[2];
        var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        if (!$scope.passport.qr) {
            $rootScope.re_login();
            return false;
        }

        var options = {
            typeNumber: -1,
            correctLevel: QRErrorCorrectLevel.H,
            width: type == 1 ? 150 : 180,
            height: type == 1 ? 150 : 180,
            background: background ? background : "#ffffff",
            foreground: foreground ? foreground : "#163a7b",
            text: text
        };

        var qrcode = new QRCode(options.typeNumber, options.correctLevel);
        qrcode.addData(options.text);
        qrcode.make();

        // create canvas element
        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        var ctx = canvas.getContext('2d');

        // compute tileW/tileH based on options.width/options.height
        var tileW = options.width / qrcode.getModuleCount();
        var tileH = options.height / qrcode.getModuleCount();

        // draw in the canvas
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                var w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
                var h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW);
                ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
            }
        }
        ctx.globalAlpha = 0;
        jQuery('.qr-code-canvas .canvas').html(canvas);
    };

    // 获取当前门岗
    $scope.getGuardCode = function () {
        if ($rootScope.guardCode) {
            $scope.guardCampusId = $rootScope.guardCode.split('_')[0];
            $scope.guardGateId = $rootScope.guardCode.split('_')[1];
            $scope.getCampusItinerary();
        }
    };

    // 获取校区识别卡
    $scope.campusItineraryList = {
        '100002': 0,
        '100004': 0,
        '100001': 0,
        '100003': 0
    };
    $scope.getCampusItinerary = function () {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/queryList',
            method: 'post',
            data: {
                isCheck: 1
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                if (response.data && response.data.length > 0) {
                    var nowTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = response.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var item = _step2.value;

                            if (item.startTime <= nowTime && item.endTime >= nowTime && item.status == '1' && item.campusId) {
                                // 当天的许可列表
                                $scope.campusItineraryList[item.campusId] = ++$scope.campusItineraryList[item.campusId];
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            }

            // 学生
            if ($scope.passport.userType == 1) {
                $scope.renderCampusBox();
                $scope.getGuardId(function (gateId) {
                    var foreground = "#163a7b";
                    var background = "#ffffff";
                    if ($rootScope.userData.cardStatus == 0) {
                        // 长期通行
                        $('#temperature_modal').modal({ backdrop: 'static', keyboard: false });
                        $scope.stuCardGreen();
                        foreground = "#163a7b";
                    } else if ($rootScope.userData.cardStatus == 1) {
                        // 要看通行许可
                        // 判断是校门看许可
                        var isSchoolGate = false;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = $rootScope.schoolGateId[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _item = _step3.value;

                                if (_item == $scope.guardGateId) {
                                    isSchoolGate = true;
                                    break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }

                        if (!isSchoolGate) {
                            // 不是校门
                            $scope.sendGuardCheck(0, { temperature: $scope.formField.temperature });
                        }
                        if ($scope.campusItineraryList[$scope.guardCampusId] > 0) {
                            $('#temperature_modal').modal({ backdrop: 'static', keyboard: false });
                            $scope.stuCardGreen();
                            foreground = "#163a7b";
                        } else {
                            $scope.stuCardRed();
                            foreground = "#ff4222";
                            $('.stuNoentry').fadeIn();
                        }
                    } else if ($rootScope.userData.cardStatus == 2) {
                        // 在人事处名单即可长期通行
                        $('#temperature_modal').modal({ backdrop: 'static', keyboard: false });
                        $scope.stuCardGreen();
                        foreground = "#163a7b";
                    } else if ($rootScope.userData.cardStatus == 3) {
                        // 通行证失效
                        $scope.stuCardRed();
                        foreground = "#ff4222";
                        $('.nopassport').fadeIn();
                    } else if ($rootScope.userData.cardStatus == 4) {
                        // 黄码
                        $('#temperature_modal').modal({ backdrop: 'static', keyboard: false });
                        $scope.stuCardYellow();
                        foreground = "#ffb400";
                    }
                    generateQRCodeCanvas($scope.passport.qr, foreground, background, 1);
                });
            } else {
                var foreground = "#3d9e00";
                // 4.23在广东，黑龙江打卡1
                if ($rootScope.noEntryUserId.indexOf($rootScope.userData.userId) >= 0) {
                    $('#unapply-buttons').fadeIn();
                    $('.qr-box-card').addClass('red').removeClass('green');
                    $('.user-info-card').addClass('red').removeClass('green');
                    $('.campus-box').removeClass('active');
                    foreground = "#ff4222";
                    $('.epidemicArea').fadeIn();
                } else {
                    // $scope.verificationUserItinerary((flag) => {
                    $scope.getGuardId(function (gateId) {
                        $rootScope.isSignSafe(function (SignSafe) {
                            // $scope.isSafe((isSafe) => {
                            if ($rootScope.userData.cardStatus == 0) {
                                // 长期通行
                                $scope.sendGuardCheck(0);
                                $scope.cardGreen();
                                foreground = "#3d9e00";
                            } else if ($rootScope.userData.cardStatus == 1) {
                                // 要看通行许可
                                // if(isSafe) {
                                // if (flag) { // 是否有教师出行申请
                                // $scope.sendGuardCheck(0);
                                //     $scope.cardGreen();
                                //     foreground = "#3d9e00";
                                // } else {
                                //     if ($scope.campusItineraryList[$scope.guardCampusId] > 0) {

                                if (SignSafe.safe) {
                                    $scope.sendGuardCheck(0);
                                    $scope.cardGreen();
                                    foreground = "#3d9e00";
                                } else {
                                    $scope.cardRed();
                                    foreground = "#ff4222";
                                    $('.isSignSafeResult').html(SignSafe.result).fadeIn();
                                }
                                // } else {
                                //     $scope.cardRed();
                                //     $('.noentry').fadeIn();
                                // }
                                // }
                                // }else{
                                //     $scope.cardRed();
                                //     foreground = "#ff4222";
                                //     $('.unsafe').fadeIn();
                                // }
                            } else if ($rootScope.userData.cardStatus == 2) {
                                // 在人事处名单即可长期通行
                                $scope.sendGuardCheck(0);
                                $scope.cardGreen();
                                foreground = "#3d9e00";
                            } else if ($rootScope.userData.cardStatus == 3) {
                                // 通行证失效
                                $scope.cardRed();
                                foreground = "#ff4222";
                                $('.nopassport').fadeIn();
                            }
                            generateQRCodeCanvas($scope.passport.qr, foreground);
                            // });
                        });
                    });
                    // });
                }
            }
        });
    };

    // 表单校验
    var temperature_modal_forms = $('#temperature_modal form');
    var validation = Array.prototype.filter.call(temperature_modal_forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                $('#temperature-btn').attr('disabled', 'disabled');
                $('#temperature_modal').modal('hide');
                $scope.sendGuardCheck(0, { temperature: $scope.formField.temperature });
            }
            form.classList.add('was-validated');
        }, false);
    });

    $scope.stuCardYellow = function () {
        $('.qr-box-card').addClass('yellow').removeClass('green').removeClass('red');
        $('.user-info-card').addClass('yellow').removeClass('green').removeClass('red');
        $('.qr-code-canvas').removeClass('student-qrcode-red').removeClass('student-qrcode-blue').addClass('student-qrcode-yellow');
    };

    $scope.stuCardGreen = function () {
        $('.qr-box-card').addClass('green').removeClass('red');
        $('.user-info-card').addClass('green').removeClass('red');
        $('.qr-code-canvas').removeClass('student-qrcode-red').addClass('student-qrcode-blue');
    };

    $scope.stuCardRed = function () {
        $('.qr-box-card').addClass('red').removeClass('green');
        $('.user-info-card').addClass('red').removeClass('green');
        $('.qr-code-canvas').removeClass('student-qrcode-blue').addClass('student-qrcode-red');
    };

    $scope.cardGreen = function () {
        $('.qr-box-card').addClass('green').removeClass('red');
        $('.user-info-card').addClass('green').removeClass('red');
        $('.campus-box').addClass('active');
    };

    $scope.cardRed = function () {
        $('.redcode').fadeIn();
        $('.qr-box-card').addClass('red').removeClass('green');
        $('.user-info-card').addClass('red').removeClass('green');
        $('.campus-box').removeClass('active');
    };

    // 人事处的返校名单，符合隔离要求
    $scope.isSafe = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/isSafe',
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
        });
    };

    // 是否有教师出行申请
    $scope.doGetTeacherRegistrationList = function (callback) {
        var qwxq = {
            '100004': '0', // 前湖南校区
            '100002': '1', // 前湖北校区
            '100001': '2', // 青山湖校区
            '100003': '3' // 东湖校区
        };
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/doRequest/dogetTeacherRegistrationList',
            method: 'post',
            traditional: true,
            data: {
                userCode: $rootScope.userData.userId,
                qwxq: qwxq[$scope.guardCampusId]
            }
        }).then(function (response) {
            console.info(response);
            if (response.status == "200") {
                var flag = false;
                if (response.data && response.data.length > 0) {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = response.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _item2 = _step4.value;

                            var isDuringDate = window.isDuringDate(_item2.yjlaixsj, _item2.yjlxsj);
                            if (!!isDuringDate) {
                                if (_item2.qwxq == qwxq[$scope.guardCampusId]) {
                                    flag = true;
                                }
                                for (var xq in qwxq) {
                                    if (qwxq[xq] == _item2.qwxq) {
                                        $scope.campusItineraryList[xq] = ++$scope.campusItineraryList[xq];
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                } // $scope.renderCampusBox();
                callback && callback(flag);
            }
        });
    };

    $scope.verificationUserItinerary = function (callback) {
        // $scope.doGetTeacherRegistrationList((flag) => {
        //     callback && callback(flag);
        // });
    };

    // 绘制校区色块
    $scope.renderCampusBox = function () {
        console.info($scope.campusItineraryList);
        for (var i in $scope.campusItineraryList) {
            if ($scope.campusItineraryList[i] > 0) {
                $('.campus-box.campus_id-' + i).addClass('active');
            }
        }
    };

    // 入校记录
    $scope.sendGuardCheck = function (status) {
        var temperature = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/guard/check',
            method: 'post',
            data: _extends({
                status: status }, temperature, {
                userId: $rootScope.userData.userId,
                cardId: $rootScope.userData.cardId,
                gateId: $scope.guardGateId
            }),
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {} else {
                alert(response.message);
            }
        });
    };

    // 查询门岗id
    $scope.getGuardId = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/guard/queryList',
            method: 'post',
            data: {
                campusId: $scope.guardCampusId
                // guardId:
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    var _loop = function _loop() {
                        var item = _step5.value;

                        if (item.campusId == $scope.guardCampusId && item.gateId == $scope.guardGateId) {
                            $scope.$apply(function ($scope) {
                                $scope.campusId = item.campusId;
                                $scope.guardName = item.campusName + ' ' + item.gateName;
                            });
                            callback && callback(item.gateId);
                        }
                    };

                    for (var _iterator5 = response.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        _loop();
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }
        });
    };

    $scope.getGuardCode();

    $scope.pageGuardInit = function () {
        if (!$rootScope.clockInterval) {
            $rootScope.clockInterval = $interval($rootScope.clock, 1000);
        }
    };

    // $scope.cardGreen();
}]);

angular.module('myApp.controllers_guard_apply', [])
//保安门岗扫用户
.controller('guard_applyCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$interval', function ($scope, $rootScope, $http, $timeout, $interval) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();

    $scope.applys = [];

    if (!!$rootScope.scanQRCodeData) {
        $scope.scanQRCodeData = $rootScope.scanQRCodeData;
        $rootScope.scanQRCodeData = null;

        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/guard/getInfo',
            method: 'post',
            traditional: true,
            data: {
                cardId: $scope.scanQRCodeData
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.applys = response.data.applys;
                $scope.passport = response.data;
                console.info($scope.passport);

                if ($scope.passport.mobile && $scope.passport.mobile.length == 11) $scope.passport.mobile = $scope.passport.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                if ($scope.passport.idCard && $scope.passport.idCard.length == 18) $scope.passport.idCard = $scope.passport.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, "$1********$2");

                $scope.getGuardCode();
                // } else if (response.code == 1) {
                //     $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    }

    $scope.token = $rootScope.work_weixin.token;
    $scope.userdata = JSON.stringify($rootScope.userData);
    $scope.passport = {
        'qr': null,
        'name': null,
        'sex': null,
        'photo': null,
        'number': null,
        'mobile': null,
        'idCard': null,
        'class': null,
        'campus': null
    };
    $scope.guardCampusId = null;
    $scope.guardGateId = null;
    $scope.guardGateStatus = null;
    $scope.guardName = null;
    $scope.campusId = null;
    $scope.guardNameData = {
        'qhb': '前湖北校区',
        'qhn': '前湖南校区',
        'qsh': '青山湖校区',
        'dh': '东湖校区'
    };

    // 生成二维码
    var generateQRCodeCanvas = function generateQRCodeCanvas() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $scope.scanQRCodeData;
        var foreground = arguments[1];
        var background = arguments[2];
        var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        if (!text) {
            // $rootScope.re_login();
            return false;
        }

        var options = {
            typeNumber: -1,
            correctLevel: QRErrorCorrectLevel.H,
            width: type == 1 ? 150 : 180,
            height: type == 1 ? 150 : 180,
            background: background ? background : "#ffffff",
            foreground: foreground ? foreground : "#163a7b",
            text: text
        };

        var qrcode = new QRCode(options.typeNumber, options.correctLevel);
        qrcode.addData(options.text);
        qrcode.make();

        // create canvas element
        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        var ctx = canvas.getContext('2d');

        // compute tileW/tileH based on options.width/options.height
        var tileW = options.width / qrcode.getModuleCount();
        var tileH = options.height / qrcode.getModuleCount();

        // draw in the canvas
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                var w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
                var h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW);
                ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
            }
        }
        ctx.globalAlpha = 0;
        jQuery('.qr-code-canvas .canvas').html(canvas);
    };

    // 获取当前门岗
    $scope.getGuardCode = function () {
        if ($rootScope.campusData) {
            $scope.guardCampusId = $rootScope.campusData.campus;
            $scope.guardGateId = $rootScope.campusData.gateId;
            $scope.getCampusItinerary();
        }
    };

    // 获取校区识别卡
    $scope.campusItineraryList = {
        '100002': 0,
        '100004': 0,
        '100001': 0,
        '100003': 0
    };
    $scope.campusItineraryNameList = {
        '前湖北校区': 100002,
        '前湖南校区': 100004,
        '青山湖校区': 100001,
        '东湖校区': 100003
    };
    $scope.getCampusItinerary = function () {
        if ($scope.applys && $scope.applys.length > 0) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = $scope.applys[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _item3 = _step6.value;

                    var nowTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    if (_item3.status == '1') {
                        if (_item3.startTime <= nowTime && _item3.endTime >= nowTime && _item3.status == '1' && _item3.applyCampus) {
                            // 当天的许可列表
                            $scope.campusItineraryList[$scope.campusItineraryNameList[_item3.applyCampus]] = ++$scope.campusItineraryList[$scope.campusItineraryNameList[_item3.applyCampus]];
                        }
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        }
        // alert(JSON.stringify($scope.passport));
        // 学生
        if ($scope.passport.type == 1) {
            $scope.renderCampusBox();
            $scope.getGuardId(function (gateId) {
                var foreground = "#163a7b";
                var background = "#ffffff";
                if ($scope.passport.cardStatus == 0) {
                    // 长期通行
                    $scope.stuCardGreen();
                    foreground = "#163a7b";
                } else if ($scope.passport.cardStatus == 1) {
                    // 要看通行许可
                    if ($scope.campusItineraryList[$scope.guardCampusId] > 0) {
                        $scope.stuCardGreen();
                        foreground = "#163a7b";
                    } else {
                        $scope.stuCardRed();
                        foreground = "#ff4222";
                        $('.stuNoentry').fadeIn();
                    }
                } else if ($scope.passport.cardStatus == 2) {
                    // 在人事处名单即可长期通行
                    $scope.stuCardGreen();
                    foreground = "#163a7b";
                } else if ($scope.passport.cardStatus == 3) {
                    // 通行证失效
                    $scope.stuCardRed();
                    foreground = "#ff4222";
                    $('.nopassport').fadeIn();
                } else if ($rootScope.passport.cardStatus == 4) {
                    // 黄码
                    $scope.stuCardYellow();
                    foreground = "#ffb400";
                }
                generateQRCodeCanvas($scope.passport.qr, foreground, background, 1);
            });
        } else {
            var foreground = "#3d9e00";
            // 4.23在广东，黑龙江打卡1
            if ($rootScope.noEntryUserId.indexOf($scope.passport.userId) >= 0) {
                $('#unapply-buttons').fadeIn();
                $('.qr-box-card').addClass('red').removeClass('green');
                $('.user-info-card').addClass('red').removeClass('green');
                $('.campus-box').removeClass('active');
                foreground = "#ff4222";
                $('.epidemicArea').fadeIn();
            } else {
                // $scope.renderCampusBox();
                // $scope.verificationUserItinerary((flag) => {
                $scope.getGuardId(function (gateId) {
                    $rootScope.isSignSafe(function (SignSafe) {
                        // $scope.isSafe((isSafe) => {
                        if ($scope.passport.cardStatus == 0) {
                            // 长期通行
                            $('#buttons').fadeIn();
                            $scope.cardGreen();
                            foreground = "#3d9e00";
                        } else if ($scope.passport.cardStatus == 1) {
                            // 要看通行许可
                            // if(isSafe) {
                            //     if (flag) { // 是否有教师出行申请
                            //          $('#buttons').fadeIn();
                            //         $scope.cardGreen();
                            //         foreground = "#3d9e00";
                            //     } else {
                            //         if ($scope.campusItineraryList[$scope.guardCampusId] > 0) {
                            if (SignSafe.safe) {
                                $('#buttons').fadeIn();
                                $scope.cardGreen();
                                foreground = "#3d9e00";
                            } else {
                                $scope.cardRed();
                                foreground = "#ff4222";
                                $('.isSignSafeResult').html(SignSafe.result).fadeIn();
                            }
                            // } else {
                            //     $scope.cardRed();
                            //     $('.noentry').fadeIn();
                            // }
                            // }
                            // }else{
                            //     $scope.cardRed();
                            //     foreground = "#ff4222";
                            //     $('.unsafe').fadeIn();
                            // }
                        } else if ($scope.passport.cardStatus == 2) {
                            // 在人事处名单即可长期通行
                            $('#buttons').fadeIn();
                            $scope.cardGreen();
                            foreground = "#3d9e00";
                        } else if ($scope.passport.cardStatus == 3) {
                            // 通行证失效
                            $scope.cardRed();
                            foreground = "#ff4222";
                            $('.nopassport').fadeIn();
                        }
                        generateQRCodeCanvas($scope.passport.qr, foreground);
                        // });
                    });
                });
                // });
            }
        }
    };

    $scope.stuCardYellow = function () {
        $('.qr-box-card').addClass('yellow').removeClass('green').removeClass('red');
        $('.user-info-card').addClass('yellow').removeClass('green').removeClass('red');
        $('.qr-code-canvas').removeClass('student-qrcode-red').removeClass('student-qrcode-blue').addClass('student-qrcode-yellow');
    };

    $scope.stuCardGreen = function () {
        $('.qr-box-card').addClass('green').removeClass('red');
        $('.user-info-card').addClass('green').removeClass('red');
        $('.qr-code-canvas').removeClass('student-qrcode-red').addClass('student-qrcode-blue');
    };

    $scope.stuCardRed = function () {
        $('.qr-box-card').addClass('red').removeClass('green');
        $('.user-info-card').addClass('red').removeClass('green');
        $('.qr-code-canvas').removeClass('student-qrcode-blue').addClass('student-qrcode-red');
    };

    $scope.cardGreen = function () {
        $('.qr-box-card').addClass('green').removeClass('red');
        $('.user-info-card').addClass('green').removeClass('red');
        $('.campus-box').addClass('active');
    };

    $scope.cardRed = function () {
        $('.redcode').fadeIn();
        $('#unapply-buttons').fadeIn();
        $('.qr-box-card').addClass('red').removeClass('green');
        $('.user-info-card').addClass('red').removeClass('green');
        $('.campus-box').removeClass('active');
    };

    // 人事处的返校名单，符合隔离要求
    $scope.isSafe = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/isSafe',
            method: 'post',
            data: {
                userId: $scope.passport.userId
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
        });
    };

    // 是否有教师出行申请
    $scope.doGetTeacherRegistrationList = function (callback) {
        var qwxq = {
            '100004': '0', // 前湖南校区
            '100002': '1', // 前湖北校区
            '100001': '2', // 青山湖校区
            '100003': '3' // 东湖校区
        };
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/doRequest/dogetTeacherRegistrationList',
            method: 'post',
            traditional: true,
            data: {
                userCode: $rootScope.userData.userId,
                qwxq: qwxq[$scope.guardCampusId]
            }
        }).then(function (response) {
            console.info(response);
            if (response.status == "200") {
                var flag = false;
                if (response.data && response.data.length > 0) {
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = response.data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var _item4 = _step7.value;

                            var isDuringDate = window.isDuringDate(_item4.yjlaixsj, _item4.yjlxsj);
                            if (!!isDuringDate) {
                                if (_item4.qwxq == qwxq[$scope.guardCampusId]) {
                                    flag = true;
                                }
                                for (var xq in qwxq) {
                                    if (qwxq[xq] == _item4.qwxq) {
                                        $scope.campusItineraryList[xq] = ++$scope.campusItineraryList[xq];
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }
                }$scope.renderCampusBox();
                callback && callback(flag);
            }
        });
    };

    $scope.verificationUserItinerary = function (callback) {
        $scope.doGetTeacherRegistrationList(function (flag) {
            callback && callback(flag);
        });
    };

    $scope.renderCampusBox = function () {
        console.info($scope.campusItineraryList);
        for (var i in $scope.campusItineraryList) {
            if ($scope.campusItineraryList[i] > 0) {
                $('.campus-box.campus_id-' + i).addClass('active');
            }
        }
    };

    $scope.denyGuardCheck = function () {
        $rootScope.go('/guard_scan');
    };

    // 入校记录
    $scope.sendGuardCheck = function (status) {
        $('#checkReark_modal').modal('hide');
        var params = {
            status: status, // 0是入校，1是离校 2无许可入校
            // temperature
            userId: $scope.passport.userId,
            cardId: $scope.passport.cardId,
            gateId: $scope.guardGateId
        };
        if ($scope.checkReark && $scope.checkReark != "") params['remark'] = $scope.checkReark;

        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/guard/check',
            method: 'post',
            data: params,
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $('.alert-success-recall').fadeIn();
                $('.submit-form-panel').fadeOut();
                $timeout(function () {
                    $rootScope.go('/guard_scan');
                }, 2000);
            } else {
                alert(response.message);
            }
        });
    };

    // 查询门岗id
    $scope.getGuardId = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/guard/queryList',
            method: 'post',
            data: {
                campusId: $scope.guardCampusId
                // guardId:
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    var _loop2 = function _loop2() {
                        var item = _step8.value;

                        if (item.campusId == $scope.guardCampusId && item.gateId == $scope.guardGateId) {
                            $scope.$apply(function ($scope) {
                                $scope.campusId = item.campusId;
                                $scope.guardName = item.campusName + ' ' + item.gateName;
                            });
                            callback && callback(item.gateId);
                        }
                    };

                    for (var _iterator8 = response.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        _loop2();
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            }
        });
    };

    $scope.pageGuardInit = function () {
        if (!$rootScope.clockInterval) {
            $rootScope.clockInterval = $interval($rootScope.clock, 1000);
        }
    };

    $scope.show_checkReark_modal = function () {
        $('#checkReark_modal').modal('show');
    };

    $scope.checkReark_change = function () {
        console.info($scope.checkReark);
        if ($scope.checkReark != '') {
            $('#unapply-btn').attr('disabled', false);
        } else {
            $('#unapply-btn').attr('disabled', 'disabled');
        }
    };

    $timeout(function () {
        $('textarea[autoHeight]').autoHeight();
    }, 200);

    // $scope.cardGreen();
}]);

angular.module('myApp.controllers_application', [])
//出入申请操作
.controller('applicationCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();

    // $scope.goto_itinerary = function () {
    //     $rootScope.go('/itinerary');
    // };
    // $scope.goto_list_approved = function () {
    //     $rootScope.go('/list_approved');
    // };
    // $scope.goto_list_pending = function () {
    //     $rootScope.go('/list_pending');
    // };
    // $scope.goto_list_dismiss = function () {
    //     $rootScope.go('/list_dismiss');
    // };
}]);

angular.module('myApp.controllers_itinerary_approved', [])
//申请详情
.controller('itinerary_approvedCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();

    if ($routeParams.itineraryID) {
        var $id = $routeParams.itineraryID;
        // 查询详情
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/query',
            // url: 'http://192.168.16.103:8086/gate/apply/query',
            method: 'post',
            traditional: true,
            data: {
                id: $id
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            console.info(response.data);
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $rootScope.currentItinerary = response.data;
                    $scope.itinerary = $rootScope.currentItinerary;
                });
                $timeout(function () {}, 100);
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    }
    $scope.attachment = document.getElementById('attachment').files[0];

    $('#datetimepicker-start').datetimepicker(_extends({}, $rootScope.datepickerOptions, {
        startDate: new Date()
    }));
    $('#datetimepicker-end').datetimepicker(_extends({}, $rootScope.datepickerOptions, {
        startDate: new Date(),
        useCurrent: false
    }));

    $("#datetimepicker-start").datetimepicker().on("hide", function (e) {
        if (!!e.currentTarget.value) {
            var value = e.currentTarget.value;
            value = value.split(':')[0] + ":" + value.split(':')[1] + ":00";
            $('#datetimepicker-start').val(value).datetimepicker('update');
            $scope.itinerary.startTime = value;

            // let midnightTime = e.currentTarget.value.split(' ')[0] + ' 23:59:59';
            // $('#datetimepicker-end').val(midnightTime).datetimepicker('setStartDate', e.currentTarget.value).datetimepicker('setEndDate', midnightTime).datetimepicker('update');
            $('#datetimepicker-end').datetimepicker('setStartDate', e.currentTarget.value).datetimepicker('update');
            // $scope.itinerary.endTime = midnightTime;
        }
    });

    // 撤回
    $scope.recall = function ($id, $event) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/revocation',
            // url: 'http://192.168.16.103:8086/gate/apply/revocation',
            method: 'post',
            traditional: true,
            data: {
                id: $id
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            console.info(response.data);
            if (response.code == 0) {
                $('#recall-btn').attr('disabled', 'disabled');
                $scope.itinerary.status = 3;
                $rootScope.currentItinerary.status = 3;
                $('.alert-success-recall').fadeIn();
                $timeout(function () {
                    $rootScope.go('/passport');
                }, 2000);
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };

    // 删除
    $scope.deleteItinerary = function ($id, $event) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/delApply',
            method: 'post',
            traditional: true,
            data: {
                id: $id
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            console.info(response.data);
            if (response.code == 0) {
                $('#submit-btn').attr('disabled', 'disabled');
                $rootScope.currentItinerary = null;
                $('.alert-success-delete').fadeIn();
                $timeout(function () {
                    $rootScope.go('/passport');
                }, 2000);
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };

    $(document).on('change', '#attachment', function (e) {
        var $file = e.target.files[0];
        $rootScope.verificationAttachment($file, function () {
            $scope.$apply(function ($scope) {
                $scope.fileName = $file.name;
            });
            $('.attachment-button').addClass('complete');
        });
    });

    $scope.addAttachment = function (callback) {
        $scope.attachment = document.getElementById('attachment').files[0];

        if ($scope.attachment) {
            var formData = new FormData();
            formData.append("file", $scope.attachment);
            $http.post($rootScope.apiUrl + "/system/file/upload", formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (response) {
                if (response.code == 0) {
                    callback && callback(response.data);
                } else {
                    alert(response.message);
                    $('.attachment-button').removeClass('complete').addClass('fail');
                }
            });
        } else {
            callback && callback(null);
        }
    };

    $scope.editItinerary = function () {
        $scope.addAttachment(function (filePath) {
            var data = {
                // userId: $rootScope.userData.userId,
                id: $scope.itinerary.id,
                userId: $scope.itinerary.userId,
                cardId: $scope.itinerary.cardId,
                campusId: $scope.itinerary.campusId,
                startTime: $scope.itinerary.startTime,
                endTime: $scope.itinerary.endTime,
                remark: $scope.itinerary.remark,
                status: 0
            };
            if (!!filePath) data['filePath'] = filePath;

            jQuery.ajax({
                url: $rootScope.apiUrl + '/gate/apply/editApply',
                // url: 'http://192.168.16.103:8086/gate/apply/editApply',
                method: 'post',
                // contentType: 'application/json;charset=UTF-8',
                traditional: true,
                data: data,
                headers: {
                    "token": $rootScope.work_weixin.token
                }
                // type: 'json',
            }).then(function (response) {
                console.info(response);
                if (response.code == 0) {
                    $('#submit-btn').attr('disabled', 'disabled');
                    $('#delete-btn').attr('disabled', 'disabled');
                    $('.alert-success-itinerary').fadeIn();
                    $timeout(function () {
                        $rootScope.go('/passport');
                    }, 2000);
                } else if (response.code == 1) {
                    alert(response.message);
                    $rootScope.re_login();
                } else {
                    alert(response.message);
                }
            });
        });
    };

    $scope.attachment_button = function () {
        document.getElementById('attachment').click();
    };

    // 表单校验
    var forms = $('form');
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            $('.custom-select, .form-control').removeClass('invalid valid');
            var validityFlag = false;
            if (!$('#datetimepicker-start').val()) {
                validityFlag = true;
                $('#datetimepicker-start').addClass('invalid');
            } else $('#datetimepicker-start').addClass('valid');
            if (!$('#datetimepicker-end').val()) {
                validityFlag = true;
                $('#datetimepicker-end').addClass('invalid');
            } else $('#datetimepicker-end').addClass('valid');

            if (form.checkValidity() === false || validityFlag) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                $scope.editItinerary();
            }
            form.classList.add('was-validated');
        }, false);
    });

    $timeout(function () {
        $('textarea[autoHeight]').autoHeight();
    }, 200);
}]);

angular.module('myApp.controllers_list_approved', [])
//列表 出行记录
.controller('list_approvedCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();

    $scope.list = [];
    $scope.pageNum = 0;
    $scope.pageSize = 10;
    $scope.hasLoadMore = false;
    $rootScope.currentItinerary = {};

    // $scope.goto_itinerary_approved = function () {
    //     $rootScope.go('/itinerary_approved');
    // };

    $scope.loadList = function (pageNum) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/guard/queryLog',
            // url: 'http://192.168.16.103:8086/gate/apply/queryList',
            method: 'post',
            traditional: true,
            data: {
                // userId: $rootScope.userData.userId,
                date: new Date().Format('yyyy-MM-dd'),
                size: $scope.pageSize,
                num: pageNum
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                if (response.data && response.data.length > 0) {
                    console.info(response.data);
                    if (response.data.length == 10) $scope.hasLoadMore = true;else $scope.hasLoadMore = false;
                    $scope.$apply(function ($scope) {
                        $scope.list = $scope.list.concat(response.data);
                        // 时间倒序
                        $scope.list.sort(function (a, b) {
                            return a.createTime < b.createTime ? 1 : -1;
                        });
                    });
                }
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };

    $scope.list_load_more = function () {
        ++$scope.pageNum;
        $scope.loadList($scope.pageNum);
    };

    $scope.list_load_more();

    $scope.query = function ($item) {
        // 出行记录查询详情
        $rootScope.itineraryLog = $item;
        $rootScope.go('/itinerary_approvedLog');
    };
}]);

angular.module('myApp.controllers_itinerary_approvedLog', [])
//出行记录
.controller('itinerary_approvedLogCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {}]);

angular.module('myApp.controllers_list_apply', [])
//列表 待审批
.controller('list_applyCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();

    $scope.approvedList = [];
    $scope.unapprovedList = [];
    $scope.approvedListPageNum = 0;
    $scope.unapprovedListPageNum = 0;
    $scope.pageSize = 10;
    $scope.approvedHasLoadMore = false;
    $scope.unapprovedHasLoadMore = false;
    $rootScope.currentItinerary = {};

    // $scope.goto_itinerary_approved = function () {
    //     $rootScope.go('/itinerary_approved');
    // };
    $scope.switch_tab = function ($id) {
        $('.tab-content .tab-pane').fadeOut();
        var id = $id.split('-')[1];
        if (id == 0) {
            $scope.unapprovedList = [];
            $scope.loadList(id, $scope.unapprovedListPageNum);
        } else if (id == 1) {
            $scope.approvedList = [];
            $scope.loadList(1, $scope.approvedListPageNum);
            $scope.loadList(2, $scope.approvedListPageNum);
        }
        $timeout(function () {
            $('.tab-content .tab-pane' + $id).fadeIn();
        }, 500);
    };

    $scope.loadList = function ($id, pageNum) {

        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/queryListByRole',
            method: 'post',
            data: {
                // userId: $rootScope.userData.userId,
                status: $id, // 0 待审核  1 已审核
                size: $scope.pageSize,
                num: pageNum
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                if (response.data && response.data.length > 0) {
                    console.info(response.data);
                    if ($id == 0) {
                        if (response.data.length == 10) $scope.unapprovedHasLoadMore = true;else $scope.unapprovedHasLoadMore = false;
                        $scope.$apply(function ($scope) {
                            $scope.unapprovedList = $scope.unapprovedList.concat(response.data);
                            // 时间倒序
                            $scope.unapprovedList.sort(function (a, b) {
                                return a.createTime < b.createTime ? 1 : -1;
                            });
                        });
                    } else if ($id == 1 || $id == 2) {
                        if (response.data.length == 10) $scope.approvedHasLoadMore = true;else $scope.approvedHasLoadMore = false;
                        $scope.$apply(function ($scope) {
                            $scope.approvedList = $scope.approvedList.concat(response.data);
                            // 时间倒序
                            $scope.approvedList.sort(function (a, b) {
                                return a.createTime < b.createTime ? 1 : -1;
                            });
                        });
                    }
                }
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };

    $scope.list_load_more = function ($id) {
        if ($id == 0) {
            ++$scope.unapprovedListPageNum;
            $scope.loadList($id, $scope.unapprovedListPageNum);
        } else if ($id == 1 || $id == 2) {
            ++$scope.approvedListPageNum;
            $scope.loadList($id, $scope.approvedListPageNum);
        }
    };

    $timeout(function () {
        // $scope.list_load_more(0);
        $('#home-tab').click();
    }, 100);

    $scope.query = function ($data) {
        $rootScope.go('/detail_apply', { applyDetail: $data });
    };
}]);

angular.module('myApp.controllers_detail_apply', [])
//审批操作
.controller('detail_applyCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();

    $scope.checkReark = null;
    $scope.applyData = null;
    if ($routeParams.applyDetail) {
        var data = $routeParams.applyDetail;
        $scope.applyData = data;
    }

    $scope.check = function (check) {
        $scope.checkReark = $('textarea#remark').val();
        if (!$scope.checkReark) {
            if (check) $scope.checkReark = '同意';else $scope.checkReark = '拒绝';
        }

        var ids = [];
        ids[0] = $scope.applyData.id;

        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/apply/check?remark=' + $scope.checkReark + '&check=' + check,
            method: 'post',
            data: JSON.stringify(ids),
            // {
            //     ids: ,

            // },
            dataType: "json",
            processData: false,
            headers: {
                'Content-Type': 'application/json',
                "token": $rootScope.work_weixin.token
            },
            traditional: true
        }).then(function (response) {
            if (response.code == 0) {
                if (response.message == "success") {
                    $('.alert-success-detail').fadeIn();
                    $timeout(function () {
                        $rootScope.go('/list_apply');
                    }, 2000);
                }
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };

    $timeout(function () {
        $('textarea[autoHeight]').autoHeight();
    }, 200);
}]);

angular.module('myApp.controllers_guard_scan', [])
// 保安门岗扫码
.controller('guard_scanCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();
    if (!$rootScope.campusData) $rootScope.go('/guard_welcome');

    $scope.goto_passport = function () {
        $rootScope.go('/passport');
    };
    jQuery.ajax({
        url: $rootScope.apiUrl + '/system/auth/getTicket',
        method: 'get',
        data: {
            url: window.location.href.split('#')[0]
        },
        traditional: true
    }).then(function (response) {
        if (response.data) {
            wx.config({
                beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: response.data.appId, // 必填，企业微信的corpID
                timestamp: response.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
                signature: response.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
            });

            wx.error(function (res) {
                // $('#test-result').val('出错了' + JSON.stringify(err));
                // alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
            });

            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: ['scanQRCode'],
                    success: function success(res) {}
                });

                //电子ID扫码
                document.querySelector('#scanQRCode').onclick = function () {
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function success(res) {
                            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                            // $('#test-result').val(JSON.stringify(res));
                            $rootScope.scanQRCodeData = result;
                            $rootScope.go('/guard_apply');
                        }
                    });
                };

                //昌通码扫码
                document.querySelector('#ncQRCode').onclick = function () {
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function success(res) {
                            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                            $rootScope.NCrqcodeOriginal = result.split('unionCode=')[1];
                            $rootScope.NCrqcode = encodeURIComponent(encodeURIComponent($rootScope.NCrqcodeOriginal));
                            $scope.sendNCcode($rootScope.NCrqcode);
                        }
                    });
                };
            });
        }
    }).fail(function (err) {
        // $('#test-result').val('err' + JSON.stringify(err));
    });

    // TEST ⚡️
    // $rootScope.getToken();
    // $rootScope.getUserData(() => {
    //     document.querySelector('#scanQRCode').onclick = () => {
    //         $rootScope.scanQRCodeData = '11140508502016170568';
    //         $rootScope.go('/guard_apply');
    //     };
    //     document.querySelector('#ncQRCode').onclick = () => {
    //         const url = 'https://elecard.hcctm.com/elecard/card.html?unionCode=PqvTTHXjdisXvy4aj82FNIA4giQlVXkDsxDJs8eq/nE=';
    //         $rootScope.NCrqcodeOriginal = url.split('unionCode=')[1];
    //         $rootScope.NCrqcode = encodeURIComponent(encodeURIComponent($rootScope.NCrqcodeOriginal));
    //         $scope.sendNCcode($rootScope.NCrqcode);
    //     };
    // });

    $scope.sendNCcode = function () {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/visitor/guardCheckVisitor',
            method: 'post',
            data: {
                ctm: $rootScope.NCrqcode
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $rootScope.go('/visitor_passport', { passport: JSON.stringify(response.data) });
            } else if (response.code == 1) {
                alert(response.message);
            } else {
                alert(response.message);
            }
        });
    };
}]);

angular.module('myApp.controllers_guard_welcome', [])
// 保安门岗选择校区
.controller('guard_welcomeCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();

    // $scope.goto_guard_scan = () => {
    //     $rootScope.campusData = {
    //         campus: $scope.activeCampus,
    //         gateId: $scope.activeGateId
    //     };
    //     $rootScope.go('/guard_scan');
    // };

    var forms = $('form');
    var validation = Array.prototype.filter.call(forms, function (form) {
        $('#gateId_select').removeClass('invalid');
        form.addEventListener('submit', function (event) {
            $('.custom-select, .form-control').removeClass('invalid valid');
            var validityFlag = false;

            if ($('#gateId_select').val() == "? object:null ?") {
                $('#gateId_select').addClass('invalid');
                validityFlag = true;
            } else {
                if (form.checkValidity() === false || validityFlag) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    $rootScope.campusData = {
                        campus: $scope.activeCampus,
                        gateId: $scope.activeGateId
                    };
                    $rootScope.go('/guard_scan');
                    // TEST ⚡️
                    // $rootScope.go('/guard_apply');
                }
            }
            form.classList.add('was-validated');
        }, false);
    });

    $scope.guardList = {};
    $scope.activeCampus = '100002';
    $scope.activeGuardList = [];
    $scope.activeGateId = null;

    // 查询门岗id
    $scope.getGuardList = function () {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/guard/queryList',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = response.data[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var _item5 = _step9.value;

                        if ($rootScope.schoolGateId.indexOf(_item5.gateId) >= 0) {
                            if ($scope.guardList[_item5.campusId]) {
                                $scope.guardList[_item5.campusId].push(_item5);
                            } else {
                                $scope.guardList[_item5.campusId] = [_item5];
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }

                $scope.$apply(function ($scope) {
                    $scope.activeGuardList = $scope.guardList[$scope.activeCampus];
                });
                console.info($scope.guardList);
            }
        });
    };
    $scope.getGuardList();

    $scope.campus_select_change = function () {
        console.info($scope.activeCampus);
        $scope.activeGuardList = $scope.guardList[$scope.activeCampus];
    };
}]);
angular.module('myApp.controllers_gate_sign', [])
// 打卡
.controller('gate_signCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    window.document.title = '教职员工健康打卡';
    $scope.serverNowDate = null;

    window.addEventListener('popstate', function (e) {
        e.preventDefault();
        // wx.closeWindow();
    });

    $scope.formField = {
        'inChina': '是',
        'addressProvince': '江西省',
        'addressCity': '南昌市',
        'temperatureStatus': '正常',
        'temperature': 0,
        'isIll': '否',
        'closeHb': null,
        'closeIll': '否',
        'healthDetail': '无异常',
        'isIsolation': '否',
        'isolationPlace': '无',
        'closeBjSix': null,
        'closeOtherSix': null
        // 'closeHbNew': null,
        // 'closeHrb': null,
        // 'closeBj': null,
        // 'closeJl': null,
        // 'closeOther': null,
        // 'closeGx': null,
    };
    $scope.checkField = {
        // 'closeHbNew': false,
        // 'closeHrb': false,
        // 'closeBj': false,
        // 'closeJl': false,
        // 'closeOther': false,
        // 'closeGx': false,
        'closeBjSix': false,
        'closeOtherSix': false
    };

    $scope.pageInit = function () {
        // TEST ⚡️
        // $rootScope.getToken();
        // $rootScope.getUserData();
        // $scope.getInitData();
        $rootScope.otherPageInit(function () {
            $scope.getInitData();
        });
    };

    $scope.getInitData = function () {
        $rootScope.weixinGetLocation();
        // if (!!$rootScope.userData.cardId) {
        $scope.agree = false;
        $scope.allow = true;

        $scope.formField['userId'] = $rootScope.userData.userId;
        // $scope.addressDistrict = null;
        // $('.submit-form-panel').fadeOut();
        // $scope.allow = false;
        // }
        // else {
        $scope.getPreSignInfo();
        // } else {
        //     alert('请您先生成电子ID，完成后再次进入即可开始每日健康打卡');
        //     $rootScope.go('/generator');
        // }
    };

    var forms = $('form');
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (!$scope.formField) return false;
            // $('.custom-select, .form-control').removeClass('invalid valid');
            var param = JSON.parse(JSON.stringify($scope.formField));
            var validityFlag = false;
            var province = $('#addressProvince');
            var city = $('#addressCity');
            var healthDetail = $('#healthDetail');
            var temperature = $('#temperature');
            var isGraduateRadios = $('input[name="isGraduateRadios"]:checked').val();
            var isIsolationRadios = $('input[name="isIsolationRadios"]:checked').val();
            var isolationPlace = $('#isolationPlace');

            // let district = $('#addressDistrict');
            province.removeClass('invalid valid');
            city.removeClass('invalid valid');
            healthDetail.removeClass('invalid valid');

            $('.iagree-check-panel .form-label-input').removeClass('invalid valid');
            // district.removeClass('invalid valid');

            if (!$scope.agree) {
                $('.iagree-check-panel .form-label-input').addClass('invalid');
                validityFlag = true;
            } else {
                $('.iagree-check-panel .form-label-input').removeClass('invalid');
            }
            if (param.inChina == "是") {
                if (province.val() == "" || province.val() == "? object:null ?" || province.val() == "? string: ?") {
                    province.addClass('invalid');
                    validityFlag = true;
                } else {
                    province.removeClass('invalid');
                }
                if (city.val() == "" || city.val() == "? object:null ?" || city.val() == "? string: ?") {
                    city.addClass('invalid');
                    validityFlag = true;
                } else {
                    city.removeClass('invalid');
                }
                // if(district.val() == "" || district.val() == "? object:null ?"){
                //     district.addClass('invalid');
                //     validityFlag = true;
                // }
            }

            if (healthDetail.val() == "" || healthDetail.val() == "? object:null ?" || healthDetail.val() == "? string: ?") {
                healthDetail.addClass('invalid');
                validityFlag = true;
            } else {
                healthDetail.removeClass('invalid');
            }
            if (param.temperatureStatus == '异常' && param.temperature == 0) {
                temperature.addClass('invalid');
                validityFlag = true;
            } else {
                temperature.removeClass('invalid');
            }

            if (!isGraduateRadios) {
                validityFlag = true;
                $('input[name="isGraduateRadios"]').addClass('invalid');
                $('.isGraduate-invalid-feedback').show();
            } else {
                $('input[name="isGraduateRadios"]').removeClass('invalid');
                $('.isGraduate-invalid-feedback').hide();
            }

            if (!param['closeHb']) {
                validityFlag = true;
                $('input[name="closeHbRadios"]').addClass('invalid');
                $('.closeHb-invalid-feedback').show();
                $('.closeHb-form-group').addClass('invalid');
            } else {
                $('input[name="closeHbRadios"]').removeClass('invalid');
                $('.closeHb-invalid-feedback').hide();
                $('.closeHb-form-group').removeClass('invalid');
            }

            if (!isIsolationRadios) {
                validityFlag = true;
                $('input[name="isIsolationRadios"]').addClass('invalid');
                $('.isIsolation-invalid-feedback').show();
            } else {
                $('input[name="isIsolationRadios"]').removeClass('invalid');
                $('.isIsolation-invalid-feedback').hide();
            }
            if (isIsolationRadios == '是') {
                if (isolationPlace.val() == "" || isolationPlace.val() == "? object:null ?" || isolationPlace.val() == "? string: ?") {
                    isolationPlace.addClass('invalid');
                    validityFlag = true;
                } else {
                    isolationPlace.removeClass('invalid');
                }
            }

            if ($scope.checkField['closeBjSix'] && !$scope.formField['closeBjSix']) {
                validityFlag = true;
                $('.closeBjSix-invalid-feedback').show();
            } else {
                $('.closeBjSix-invalid-feedback').hide();
            }
            if ($scope.checkField['closeOtherSix'] && !$scope.formField['closeOtherSix']) {
                validityFlag = true;
                $('.closeOtherSix-invalid-feedback').show();
            } else {
                $('.closeOtherSix-invalid-feedback').hide();
            }
            // if($scope.checkField['closeHbNew'] && !$scope.formField['closeHbNew']){
            //     validityFlag = true;
            //     $('.closeHbNew-invalid-feedback').show();
            // }else{
            //     $('.closeHbNew-invalid-feedback').hide();
            // }
            // if($scope.checkField['closeHrb'] && !$scope.formField['closeHrb']){
            //     validityFlag = true;
            //     $('.closeHrb-invalid-feedback').show();
            // }else{
            //     $('.closeHrb-invalid-feedback').hide();
            // }
            // if($scope.checkField['closeBj'] && !$scope.formField['closeBj']){
            //     validityFlag = true;
            //     $('.closeBj-invalid-feedback').show();
            // }else{
            //     $('.closeBj-invalid-feedback').hide();
            // }
            // if($scope.checkField['closeJl'] && !$scope.formField['closeJl']){
            //     validityFlag = true;
            //     $('.closeJl-invalid-feedback').show();
            // }else{
            //     $('.closeJl-invalid-feedback').hide();
            // }
            // if($scope.checkField['closeOther'] && !$scope.formField['closeOther']){
            //     validityFlag = true;
            //     $('.closeOther-invalid-feedback').show();
            // }else{
            //     $('.closeOther-invalid-feedback').hide();
            // }
            // if($scope.checkField['closeGx']){
            //     param['closeGx'] = "0";
            // }else{
            //     param['closeGx'] = null;
            // }
            if ($scope.formField['closeHb'] == '是') {
                if ($scope.checkField['closeBjSix'] || $scope.checkField['closeOtherSix']
                // $scope.checkField['closeHbNew']
                //   || $scope.checkField['closeHbNew']
                //   || $scope.checkField['closeHrb']
                //   || $scope.checkField['closeBj']
                //   || $scope.checkField['closeJl']
                //   || $scope.checkField['closeOther']
                //   || $scope.checkField['closeGx']
                ) {
                        $('.closeAll-invalid-feedback').hide();
                    } else {
                    validityFlag = true;
                    $('.closeAll-invalid-feedback').show();
                }
            }

            if (form.checkValidity() === false || validityFlag) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // param['signDate'] = $scope.serverNowDate.Format('yyyy-MM-dd hh:mm:ss');
                // param['addressInfo'] = $scope.addressDistrict + param['addressInfo'];
                param['addressInfo'] = param['addressInfo'];
                param['inChina'] = param['inChina'] && param['inChina'];
                param['temperatureStatus'] = param['temperatureStatus'] && param['temperatureStatus'];
                param['isIll'] = param['isIll'] && param['isIll'];
                param['closeHb'] = param['closeHb'] && param['closeHb'];
                param['closeIll'] = param['closeIll'] && param['closeIll'];
                param['healthStatus'] = healthDetail.val() == "? string: ?" ? '' : healthDetail.val();
                param['isIsolate'] = isIsolationRadios;
                param['isolatePlace'] = isolationPlace.val() == "? string: ?" ? '' : isolationPlace.val();

                Object.keys(param).forEach(function (key) {
                    return param[key] == null && delete param[key];
                });
                console.info(param);
                if (param['userId']) {
                    $scope.submitSign(param);
                }
            }
            form.classList.add('was-validated');
        }, false);
    });

    // 提交打卡
    $scope.submitSign = function (param) {
        $('.submit-form-panel').fadeOut();
        $('button, input, select, label').attr('disabled', 'disabled');
        $('#distpicker select').attr('disabled', 'disabled');
        $scope.allow = false;
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/sign/signIn',
            // url: $rootScope.apiUrl + ':8086/gate/sign/signIn',
            method: 'post',
            data: param,
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $('.alert-success-recall').fadeIn();
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };

    $scope.checkIagree = function () {
        // if($scope.agree && $scope.allow){
        //     $('#submit-btn').attr('disabled', false);
        // }else{
        // }
    };

    $scope.changeTemperatureStatus = function (flag) {
        $scope.formField['temperature'] = 0;
    };

    $scope.changeIsIsolation = function (flag) {
        $scope.formField['isolationPlace'] = '无';
    };

    $scope.changeInChina = function (flag) {
        if (!flag) {
            $scope.formField['addressProvince'] = '';
            $scope.formField['addressCity'] = '';
            $('#distpicker').distpicker('reset');
        }
    };

    // 获取上一次打卡数据
    $scope.getPreSignInfo = function () {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/sign/getPreSignInfo',
            // url: $rootScope.apiUrl + ':8086/gate/sign/getPreSignInfo',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).complete(function (xhr) {
            var response = xhr.responseJSON;
            var server_time = xhr.getResponseHeader('server_time');
            var serverNowDate = moment(parseInt(server_time)).tz("Asia/Shanghai");
            $scope.serverNowDate = serverNowDate;
            // }).then(response => {
            if (response.code == 0) {
                if (response.data && response.data != {}) {
                    $scope.$apply(function ($scope) {
                        $scope.formField['inChina'] = response.data.inChina && response.data.inChina;
                        $scope.formField['addressProvince'] = response.data.addressProvince;
                        $scope.formField['addressCity'] = response.data.addressCity;
                        $scope.formField['temperatureStatus'] = response.data.temperatureStatus && response.data.temperatureStatus;
                        $scope.formField['temperature'] = response.data.temperature;
                        $scope.formField['isIll'] = response.data.isIll && response.data.isIll;
                        $scope.formField['closeHb'] = response.data.closeHb && response.data.closeHb;
                        $scope.formField['closeIll'] = response.data.closeIll && response.data.closeIll;
                        $scope.formField['addressInfo'] = response.data.addressInfo;
                        $scope.formField['isGraduate'] = response.data.isGraduate && response.data.isGraduate;
                        $scope.formField['healthDetail'] = response.data.healthStatus && response.data.healthStatus;
                        $scope.formField['isIsolation'] = response.data.isIsolate && response.data.isIsolate;
                        $scope.formField['isolationPlace'] = response.data.isolatePlace && response.data.isolatePlace;

                        if (response.data.closeBjSix) {
                            $scope.formField['closeBjSix'] = response.data.closeBjSix;
                            $scope.checkField['closeBjSix'] = true;
                        }
                        if (response.data.closeOtherSix) {
                            $scope.formField['closeOtherSix'] = response.data.closeOtherSix;
                            $scope.checkField['closeOtherSix'] = true;
                        }
                        // if(response.data.closeHbNew) {
                        //     $scope.formField['closeHbNew'] = response.data.closeHbNew;
                        //     $scope.checkField['closeHbNew'] = true;
                        // }
                        // if(response.data.closeHrb) {
                        //     $scope.formField['closeHrb'] = response.data.closeHrb;
                        //     $scope.checkField['closeHrb'] = true;
                        // }
                        // if(response.data.closeBj) {
                        //     $scope.formField['closeBj'] = response.data.closeBj;
                        //     $scope.checkField['closeBj'] = true;
                        // }
                        // if(response.data.closeJl) {
                        //     $scope.formField['closeJl'] = response.data.closeJl;
                        //     $scope.checkField['closeJl'] = true;
                        // }
                        // if(response.data.closeOther) {
                        //     $scope.formField['closeOther'] = response.data.closeOther;
                        //     $scope.checkField['closeOther'] = true;
                        // }
                        // if(response.data.closeGx) {
                        //     $scope.formField['closeGx'] = response.data.closeGx;
                        //     $scope.checkField['closeGx'] = true;
                        // }

                        // if(response.data.addressProvince == '湖北省') {
                        //     $scope.formField['closeHb'] = '是';
                        //     $('#closeHbRadios1, #closeHbRadios2').attr('disabled', 'disabled');
                        // }
                    });
                    $('#distpicker').distpicker({
                        province: $scope.formField.addressProvince,
                        city: $scope.formField.addressCity
                    });
                    if (response.data.signDate) {
                        // 上次打卡记录时间
                        var signDateArr = response.data.signDate.split(/[- : \/]/);
                        var signDate = new Date(signDateArr[0], signDateArr[1] - 1, signDateArr[2], signDateArr[3], signDateArr[4], signDateArr[5]);

                        if (signDate.getFullYear() == serverNowDate.year() && signDate.getMonth() == serverNowDate.month() && signDate.getDate() == serverNowDate.date()) {
                            $('.alert-error-recall').fadeIn();
                            $('.submit-form-panel').fadeOut();
                            $('button, input, select, label').attr('disabled', 'disabled');
                            $('#distpicker select').attr('disabled', 'disabled');
                            $scope.allow = false;
                        } else {
                            $scope.$apply(function ($scope) {
                                $scope.agree = true;
                            });

                            if (serverNowDate.hour() >= $rootScope.gate_sign_deadline) {
                                $('.alert-error-timeout').fadeIn();
                            }
                            $('.submit-form-panel').fadeIn();
                        }
                    }
                    console.info($scope.formField);
                } else {
                    $('#distpicker').distpicker({
                        province: '江西省',
                        city: '南昌市'
                    });
                    $('#notification_modal').modal({ backdrop: 'static', keyboard: false });

                    if (serverNowDate.hour() >= $rootScope.gate_sign_deadline) {
                        $('.alert-error-timeout').fadeIn();
                    }
                    $('.submit-form-panel').fadeIn();
                }
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };

    $(document).on('change', '.form-check-input[name="closeHbRadios"]', function (e) {
        if (e.target.value == '否') {
            $('.closeAll-invalid-feedback').hide();
            $scope.$apply(function ($scope) {
                // $scope.formField['closeHbNew'] = null;
                // $scope.formField['closeHrb'] = null;
                // $scope.formField['closeBj'] = null;
                // $scope.formField['closeJl'] = null;
                // $scope.formField['closeOther'] = null;
                // $scope.formField['closeGx'] = null;
                // $scope.checkField['closeHbNew'] = false;
                // $scope.checkField['closeHrb'] = false;
                // $scope.checkField['closeBj'] = false;
                // $scope.checkField['closeJl'] = false;
                // $scope.checkField['closeOther'] = false;
                // $scope.checkField['closeGx'] = false;
                $scope.checkField['closeBjSix'] = false;
                $scope.checkField['closeOtherSix'] = false;
            });
        }
    });

    $scope.modal_hide = function () {
        $('#notification_modal').modal('hide');
    };

    $scope.changeCheckField = function (val) {
        $scope.formField[val] = null;
    };
}]);

angular.module('myApp.controllers_test', []).controller('testCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {

    jQuery.ajax({
        url: $rootScope.apiUrl + '/system/auth/getTicket',
        method: 'get',
        data: {
            url: window.location.href.split('#')[0]
        },
        traditional: true
    }).then(function (response) {
        if (response.data) {
            // alert(JSON.stringify(response.data));
            wx.config({
                beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: response.data.appId, // 必填，企业微信的corpID
                timestamp: response.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
                signature: response.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                jsApiList: ['checkJsApi', 'scanQRCode', 'getLocation'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
            });

            wx.error(function (res) {
                // $('#test-result').val('出错了' + JSON.stringify(err));
                alert("出错了：" + res.errMsg); //这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
            });

            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: ['scanQRCode', 'getLocation'],
                    success: function success(res) {}
                });

                jQuery('#btn').on('click', function () {
                    wx.getLocation({
                        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        altitude: true,
                        isHighAccuracy: true,
                        highAccuracyExpireTime: 6000,
                        success: function success(res) {
                            console.info(res);
                            alert(JSON.stringify(res));
                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            var speed = res.speed; // 速度，以米/每秒计
                            var accuracy = res.accuracy; // 位置精度

                            wx.openLocation({
                                latitude: res.latitude, // 纬度，浮点数，范围为90 ~ -90
                                longitude: res.longitude, // 经度，浮点数，范围为180 ~ -180。
                                name: '打卡位置', // 位置名
                                scale: 16 // 地图缩放级别,整形值,范围从1~28。默认为16
                            });
                        }
                    });
                });
            });
        }
    }).fail(function (err) {
        // $('#test-result').val('err' + JSON.stringify(err));
    });
}]);

angular.module('myApp.controllers_maintenance', []).controller('maintenanceCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {}]);

angular.module('myApp.controllers_back_school', []).controller('back_schoolCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    window.document.title = '返程登记';

    window.addEventListener('popstate', function (e) {
        e.preventDefault();
        // wx.closeWindow();
    });

    $scope.pageInit = function () {
        // TEST ⚡️
        // $rootScope.getToken();
        // $rootScope.getUserData();
        // getTravelInfo();
        if (!!$rootScope.work_weixin.token && !!$rootScope.userData) {
            $rootScope.markerLoggedIn();
            if (!!$rootScope.userData) {
                getTravelInfo();
            }
        } else {
            // 微信鉴权登录

            $rootScope.markerLoggedConnecting();
            var result = window.getRequest();
            if (result.code) {
                // $rootScope.removeToken();
                // $rootScope.removeUserData();
                console.info(result.code);
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

                        getTravelInfo();
                    } else {
                        alert(response.message);
                    }
                });
            }
        }
    };

    var personCount = [];
    var travelInfo = {};
    var personCountCaps = 500;

    var datepickerOptions = {
        language: 'zh-CN', //显示中文
        todayBtn: false, //显示今日按钮
        showClose: true,
        minDate: true,
        autoclose: true,
        minView: 'month'
    };

    var input_details_placeholder = {
        "飞机": "航班号，座位号",
        "火车": "车次，车厢，座位号",
        "客运班车": "车次，座位号",
        "公交": "线路名称，座位号",
        "轮船": "线路名称，座位号",
        "自驾": "详细描述",
        "非公共交通": "详细描述",
        "其他": "详细描述"
    };

    // 表单校验
    var forms = $('form');
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            $('.invalid-feedback').hide();
            $('.form-control, .custom-select').removeClass('invalid valid');
            var validityFlag = false;
            if ($('#datetimepicker-nanchang').val() == '') {
                validityFlag = true;
                $('#datetimepicker-nanchang').addClass('invalid');
                $('.nanchang-invalid-feedback').show();
            } else {
                $('#datetimepicker-nanchang').removeClass('invalid');
                $('.nanchang-invalid-feedback').hide();
            }

            if ($('#addressProvince').val() == '') {
                validityFlag = true;
                $('#addressProvince').addClass('invalid');
                $('.distpicker-invalid-feedback').show();
            } else {
                $('#addressProvince').removeClass('invalid');
                $('.distpicker-invalid-feedback').hide();
            }
            if ($('#addressCity').val() == '') {
                validityFlag = true;
                $('#addressCity').addClass('invalid');
                $('.distpicker-invalid-feedback').show();
            } else {
                $('#addressCity').removeClass('invalid');
                $('.distpicker-invalid-feedback').hide();
            }

            $('.transport-form .transport-form-row').each(function (i) {
                var node = $('.transport-form .transport-form-row').eq(i);
                if (node.find('.input-transport-date').val() == '') {
                    validityFlag = true;
                    node.find('.input-transport-date').addClass('invalid');
                } else {
                    node.find('.input-transport-date').removeClass('invalid');
                }
            });

            // if($('#datetimepicker-backSchool').val() == ''){
            //     validityFlag = true;
            //     $('#datetimepicker-backSchool').addClass('invalid');
            //     $('.backSchoolDate-invalid-feedback').show();
            // }

            if (!$('input[name="isPassedHB"]:checked').val()) {
                validityFlag = true;
                $('input[name="isPassedHB"]').addClass('invalid');
                $('.backSchoolTime-invalid-feedback').show();
            } else {
                $('input[name="isPassedHB"]').removeClass('invalid');
                $('.backSchoolTime-invalid-feedback').hide();
            }

            if ($('#input-backSchool').val() == '') {
                validityFlag = true;
                $('#input-backSchool').addClass('invalid');
                $('.isPassedHB-invalid-feedback').show();
            } else {
                $('#input-backSchool').removeClass('invalid');
                $('.isPassedHB-invalid-feedback').hide();
            }

            event.preventDefault();
            if (form.checkValidity() === false || validityFlag) {
                event.stopPropagation();
            } else {
                submit();
            }
            form.classList.add('was-validated');
        }, false);
    });

    function getRequest() {
        var url = window.location.search;
        var jsonList = {};
        if (url.indexOf("?") > -1) {
            var str = url.slice(url.indexOf("?") + 1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                jsonList[strs[i].split("=")[0]] = strs[i].split("=")[1]; //如果出现乱码的话，可以用decodeURI()进行解码
            }
        }
        return jsonList;
    }

    var getTravelInfo = function getTravelInfo() {
        $('#input-userId').html($rootScope.userData.userId);
        $('#input-userName').html($rootScope.userData.userName);

        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/travel/getTravelInfo',
            // url: $rootScope.apiUrl + ':8086/gate/travel/getTravelInfo',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).complete(function (xhr) {
            var response = xhr.responseJSON;
            var server_time = xhr.getResponseHeader('server_time');

            if (response.data) {
                initForm(response.data);
                var serverNowDate = moment(parseInt(server_time)).tz("Asia/Shanghai");
                var arriveSchoolDate = moment(response.data['arriveSchoolDate'] + ' 23:59:59').tz("Asia/Shanghai");
                // 返校时间早于当前时间
                if (arriveSchoolDate.isBefore(serverNowDate)) {
                    $('.alert-timeout').fadeIn();
                    $('input').attr('disabled', 'disabled');
                    $('#submit-btn').parents('.card').hide();
                } else {}
                if (!response.data.travelDetails || response.data.travelDetails.length == 0) {
                    $('#submit-btn').html('提交');
                } else {
                    $('#submit-btn').html('修改');
                }
            } else {
                alert('目前未安排返校');
                // 目前未安排返校
                $('.alert-noentry').fadeIn();
                $('input').attr('disabled', 'disabled');
                $('#submit-btn').parents('.card').hide();
            }
        });
    };

    var initForm = function initForm(info) {
        travelInfo = info;
        console.info(travelInfo);
        if (travelInfo.arriveSchoolDate) $('#datetimepicker-backSchool').html(travelInfo.arriveSchoolDate);
        if (travelInfo.arriveCampus) $('#campus-backSchool').html($rootScope.echarts.campusId[travelInfo.arriveCampus]);
        if (travelInfo.arriveSchoolTime) {
            $('#input-backSchool').val(travelInfo.arriveSchoolTime);
            $('#backSchool_modal .form-check-input[value="' + travelInfo.arriveSchoolTime + '"]').attr('checked', 'checked');
        }
        if (travelInfo.arriveNCDate) $('#datetimepicker-nanchang').val(travelInfo.arriveNCDate);
        if (travelInfo.currentProvince) {
            $('#distpicker').distpicker({
                province: travelInfo.currentProvince,
                city: travelInfo.currentCity
            });
        } else {
            $('#distpicker').distpicker({
                province: '江西省',
                city: '南昌市'
            });
        }
        if (travelInfo.passHb) $('input[name="isPassedHB"][value="' + travelInfo.passHb + '"]').attr('checked', 'checked');

        if (travelInfo.travelDetails && travelInfo.travelDetails.length > 0) {
            travelInfo.travelDetails.sort(function (a, b) {
                return a.sort - b.sort;
            });
            travelInfo.travelDetails.forEach(function (item, key) {
                var node = $('.transport-form .transport-form-row:nth-child(' + (key + 1) + ')');
                if (!node[0]) {
                    $('.transport-form').append($('template').html());
                    node = $('.transport-form .transport-form-row:nth-child(' + (key + 1) + ')');
                }
                node.find('.select-transport').val(item.transportation);
                node.find('.input-destination').val(item.destination);
                // var departureDateFormat = new Date('2020-04-12 21:19:13');
                // var departureDateFormat = new Date(item.departureDate);
                var departureDateText = moment(item.departureDate).format("YYYY-MM-DD HH:mm:ss");
                // var departureDateText = departureDateFormat.getFullYear() + '-' + ('0' + (departureDateFormat.getMonth() + 1)).substr(-2) + '-' + ('0' + departureDateFormat.getDate()).substr(-2) + ' ' + ('0' + departureDateFormat.getHours()).substr(-2) + ':' + ('0' + departureDateFormat.getMinutes()).substr(-2);
                node.find('.input-transport-date').val(departureDateText);
                node.find('.input-details').val(item.travelInfo);
            });
        } else {
            $('.transport-form').append($('template').html());
        }

        $('#datetimepicker-nanchang').datetimepicker(_extends({}, datepickerOptions, {
            format: 'yyyy-mm-dd', //显示格式
            minView: 'month',
            startDate: new Date(),
            endDate: new Date(travelInfo['arriveSchoolDate'])
        }));

        // $('#datetimepicker-backSchool').datetimepicker({
        //     ...datepickerOptions,
        //     format: 'yyyy-mm-dd',//显示格式
        //     minView: 'month',
        //     startDate: new Date(),
        // });

        $('.input-transport-date').datetimepicker(_extends({}, datepickerOptions, {
            format: 'yyyy-mm-dd hh:ii', //显示格式
            minView: 'hour',
            startDate: new Date(),
            endDate: new Date(travelInfo['arriveSchoolDate'].split(' ')[0] + ' 23:59:59')
        }));

        $('#input-backSchool').on('click', function () {
            $('#backSchool_modal').modal('show');
            // if(personCount.length == 0){
            //     getPersonCountByTime(function () {
            //         renderPersonCountForm();
            //     });
            // }else {
            renderPersonCountForm();
            // }
        });

        $('#checked-btn').on('click', function () {
            $('#backSchool_modal').modal('hide');
            $('#input-backSchool').val($('#backSchool_modal input[name="radios"]:checked').val());
        });

        $('#append-transport-btn').on('click', function () {
            $('.transport-form').append($('template').html());
            $('.input-transport-date').datetimepicker(_extends({}, datepickerOptions, {
                format: 'yyyy-mm-dd hh:ii', //显示格式
                minView: 'hour',
                startDate: new Date(),
                endDate: new Date(travelInfo['arriveSchoolDate'].split(' ')[0] + ' 23:59:59')
            }));
        });

        $('.transport-form-row:first-child .del-transport-btn').replaceWith('<div class="ml-3" style="width: 64px;"></div>');

        $(document).on('click', '.del-transport-btn', function (e) {
            $(e.target).parents('.transport-form-row').remove();
        });
        $(document).on('change', '.select-transport', function (e) {
            $(e.target).parents('.transport-form-panel').find('.input-details').attr('placeholder', input_details_placeholder[e.target.value]);
        });
    };

    // var getPersonCountByTime = function (callback) {
    //     jQuery.ajax({
    //         url: $rootScope.apiUrl + '/gate/travel/getPersonCountByTime',
    //         // url: $rootScope.apiUrl + ':8086/gate/travel/getPersonCountByTime',
    //         method: 'post',
    //         traditional: true,
    //         data: {
    //             selectedDate: travelInfo['arriveSchoolDate']
    //         },
    //         headers: {
    //             "token": $rootScope.work_weixin.token
    //         },
    //     }).then(response => {
    //         if(response.data){
    //             personCount = response.data;
    //             if(callback) callback();
    //         }
    //     }).fail(err => {
    //     });
    // };

    var renderPersonCountForm = function renderPersonCountForm() {
        personCount.forEach(function (item) {
            var node = $('#backSchool_modal .form-label-input[data-value="' + item.arrive_school_time + '"]');
            node.find('.count').html(item.count);
            // if (item.count > personCountCaps) {
            //     node.addClass('color-red');
            //     node.append('<strong class="color-red">（人数过多）</strong>');
            //     // node.prev().attr('disabled', 'disabled');
            // }
        });
    };

    var submit = function submit() {
        delete travelInfo['id'];
        delete travelInfo['userId'];
        delete travelInfo['arriveSchoolDate'];
        delete travelInfo['updateTime'];

        travelInfo['currentProvince'] = $('#addressProvince').val();
        travelInfo['currentCity'] = $('#addressCity').val();
        travelInfo['arriveNCDate'] = $('#datetimepicker-nanchang').val();
        travelInfo['arriveSchoolTime'] = $('#input-backSchool').val();
        travelInfo['passHb'] = $('input[name="isPassedHB"]:checked').val();

        travelInfo['travelDetails'] = [];
        $('.transport-form .transport-form-row').each(function (i) {
            var node = $('.transport-form .transport-form-row').eq(i);
            var travelInfoItem = {};
            travelInfoItem['transportation'] = node.find('.select-transport').val();
            travelInfoItem['destination'] = node.find('.input-destination').val();
            travelInfoItem['departureDate'] = node.find('.input-transport-date').val() + ':00';
            travelInfoItem['travelInfo'] = node.find('.input-details').val();
            travelInfoItem['userId'] = travelInfo['userId'];
            travelInfoItem['sort'] = i;
            travelInfo['travelDetails'][i] = travelInfoItem;
        });
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/travel/backToSchool',
            // url: $rootScope.apiUrl + ':8086/gate/travel/backToSchool',
            method: 'post',
            contentType: 'application/json;charset=UTF-8',
            traditional: true,
            data: JSON.stringify(travelInfo),
            headers: {
                "token": $rootScope.work_weixin.token
            },
            type: 'json'
        }).then(function (response) {
            $('input').attr('disabled', 'disabled');
            $('#submit-btn').parents('.card').hide();
            $('#append-transport-btn').hide();
            $('.alert-submit').fadeIn();
            if (response.code == 0) {
                alert('提交成功');
            } else {
                alert(response.message);
            }
        });
    };

    $('#iagree-btn').on('click', function () {
        $('#bulletin_modal').removeClass('was-validated');
        $('#iagree, #iagree+label').removeClass('invalid');
        if ($('#iagree:checked')[0]) {
            $('#bulletin_modal').modal('hide');
        } else {
            $('#bulletin_modal').addClass('was-validated');
            $('#iagree, #iagree+label').addClass('invalid');
        }
    });
}]);

angular.module('myApp.controllers_statistics_entry', []).controller('statistics_entryCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    // 加载token
    $rootScope.otherPageInit();
    $scope.goto_back_school = function () {
        $rootScope.go('/statistics/back_school');
    };
    $scope.goto_detail = function () {
        $rootScope.go('/statistics/details');
    };
    $scope.goto_apply = function () {
        $rootScope.go('/statistics/apply');
    };
    $scope.goto_person = function () {
        $rootScope.go('/statistics/person');
    };
}]);

angular.module('myApp.controllers_statistics_back_school', []).controller('statistics_back_schoolCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    window.document.title = '学生返校统计';

    // 返校批次日期
    $scope.backDateList = ['2020-04-16', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-10', '2020-05-11', '2020-05-12', '2020-05-29', '2020-05-30'];
    $scope.localNowDay = moment(new Date()).format('YYYY-MM-DD');
    // if (!!$scope.backDateList.indexOf($scope.localNowDay)) {
    //     $scope.backDate = $scope.backDateList[0];
    // }else {
    $scope.backDate = $scope.backDateList[$scope.backDateList.length - 1];
    // }
    $scope.serverNowDay = '';
    $scope.serverNowTime = '';
    $scope.chartData = {};
    $scope.logList = {};
    $scope.collegeBackSchoolCounts = {};
    $scope.collegeBackSchoolSum = {};
    $scope.currnetBackDate = "返校批次日期";

    $scope.currentCampus = '100002';

    jQuery(document).on('click', '.switch-campus .dropdown-item', function (e) {
        $scope.$apply(function ($scope) {
            $scope.currentCampus = jQuery(e.target).attr('data-id');
        });
        $scope.getRecentLogWithHours(function () {
            var option = $scope.chart2.getOption();
            option.series[0].data = $scope.chartData.logWithHoursList.map(function (item) {
                return item.count;
            });
            $scope.chart2.setOption(option);
        });
    });

    // 切换批次
    jQuery(document).on('click', '.switch-batch .dropdown-item', function (e) {
        $scope.$apply(function ($scope) {
            $scope.currnetBackDate = e.target.innerHTML;
            $scope.backDate = e.target.innerHTML;
            $scope.pageInit();
        });
    });

    $scope.getBackSchoolCounts = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getBackSchoolCounts',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getBackSchoolCounts',
            method: 'post',
            traditional: true,
            data: {
                back_date: $scope.backDate
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).complete(function (xhr) {
            var response = xhr.responseJSON;
            var server_time = xhr.getResponseHeader('server_time');
            // if(server_time) {
            var serverNowDate = moment(parseInt(server_time)).tz("Asia/Shanghai");
            $scope.$apply(function ($scope) {
                $scope.serverNowDay = serverNowDate.format('YYYY-MM-DD');
                $scope.serverNowTime = serverNowDate.format('HH:mm');
            });
            // }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.chartData = response.data;
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getCampusBackSchoolInfo = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getCampusBackSchoolInfo',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getCampusBackSchoolInfo',
            method: 'post',
            traditional: true,
            data: {
                back_date: $scope.backDate
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.chartData = Object.assign($scope.chartData, { backSchoolList: response.data });
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getRecentLog = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/gatelog/getStudentRecentLog',
            // url: $rootScope.apiUrl + ':8086/gate/gatelog/getStudentRecentLog',
            method: 'post',
            traditional: true,
            data: {
                back_date: $scope.backDate
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                var logListData = response.data;
                response.data.forEach(function (item, key) {
                    logListData[key] = item;

                    var name = item.userName.split('');
                    name = name.map(function (item, key) {
                        return key < 1 ? item : '*';
                    });
                    logListData[key]['userName'] = name.join('');
                });
                $scope.$apply(function ($scope) {
                    $scope.logList = logListData;
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getRecentLogWithHours = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getCampusBackSchoolInfoWithHours',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getCampusBackSchoolInfoWithHours',
            method: 'post',
            traditional: true,
            data: {
                campus_id: $scope.currentCampus,
                back_date: $scope.backDate
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.chartData = Object.assign($scope.chartData, { logWithHoursList: response.data });
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getCollegeBackSchoolCounts = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getCollegeBackSchoolCounts',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getCampusBackSchoolInfoWithHours',
            method: 'post',
            traditional: true,
            data: {
                back_date: $scope.backDate
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    var data = response.data.filter(function (item) {
                        return item.deptName != null;
                    });
                    var backSchoolList = [];
                    data.forEach(function (item) {
                        backSchoolList.push({
                            oddRow: true,
                            deptName: item.deptName,
                            RealCountTol: parseInt(item.undergraduateRealCount) + parseInt(item.postgraduateRealCount),
                            TotalTol: parseInt(item.undergraduateTotal) + parseInt(item.postgraduateTotal)
                        });
                        backSchoolList.push({
                            evenRow: true,
                            undergraduateRealCount: item.undergraduateRealCount,
                            undergraduateTotal: item.undergraduateTotal,
                            postgraduateRealCount: item.postgraduateRealCount,
                            postgraduateTotal: item.postgraduateTotal
                        });
                    });
                    $scope.collegeBackSchoolCounts = backSchoolList;
                    var collegeBackSchoolSum = data.map(function (item) {
                        return item.total;
                    }).reduce(function (a, b) {
                        return parseInt(a) + parseInt(b);
                    });
                    $scope.collegeBackSchoolSum = collegeBackSchoolSum;

                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.listInit = function () {
        $scope.pageInit = function () {
            $scope.getBackSchoolCounts(function () {
                $scope.getCampusBackSchoolInfo(function () {
                    $scope.getRecentLogWithHours(function () {
                        $scope.renderChart();
                    });
                });
            });
            $scope.getRecentLog();
            $scope.getCollegeBackSchoolCounts();
        };
    };

    $rootScope.getUserData();
    $rootScope.getToken(function () {
        if (!$rootScope.work_weixin.token) {
            $rootScope.otherPageInit(function () {
                $scope.listInit();
            });
        } else {
            $scope.listInit();
        }
    });

    $scope.getCampusBackSchoolItem = function (val) {
        if ($scope.chartData.backSchoolList.filter(function (item) {
            return item.campusType == val;
        })[0]) {
            return $scope.chartData.backSchoolList.filter(function (item) {
                return item.campusType == val;
            })[0].count;
        } else {
            return 0;
        }
    };

    $scope.renderChart = function () {
        $scope.chartOptions1 = {
            color: ['#3EAAFF', '#FF9900'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: [_extends({}, $rootScope.echarts.commonConfig.xAxis, {
                data: $rootScope.echarts.chartCampusList.map(function (item) {
                    return item.name;
                })
            })],
            yAxis: [_extends({}, $rootScope.echarts.commonConfig.yAxis, {
                offset: -10
            })],
            series: [{
                name: '实际',
                type: 'bar',
                barWidth: '8px',
                itemStyle: {
                    barBorderRadius: [4, 4, 0, 0]
                },
                barGap: '20%',
                data: [$scope.getCampusBackSchoolItem('100002_real'), $scope.getCampusBackSchoolItem('100004_real'), $scope.getCampusBackSchoolItem('100003_real'), $scope.getCampusBackSchoolItem('100001_real')]
            }, {
                name: '计划',
                type: 'bar',
                barWidth: '8px',
                itemStyle: {
                    barBorderRadius: [4, 4, 0, 0]
                },
                data: [$scope.getCampusBackSchoolItem('100002_total'), $scope.getCampusBackSchoolItem('100004_total'), $scope.getCampusBackSchoolItem('100003_total'), $scope.getCampusBackSchoolItem('100001_total')]
            }]
        };

        $scope.chart1 = echarts.init(document.querySelector('.chart1'));
        $scope.chart1.setOption($scope.chartOptions1);

        $scope.chartOptions2 = {
            color: ['#3EAAFF'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            dataZoom: [{
                id: 'dataZoomX',
                type: 'slider',
                xAxisIndex: [0],
                filterMode: 'filter',
                start: 30,
                end: 70
            }],
            xAxis: [_extends({}, $rootScope.echarts.commonConfig.xAxis, {
                data: $scope.chartData.logWithHoursList.map(function (item) {
                    return item.time;
                })
            })],
            yAxis: [_extends({}, $rootScope.echarts.commonConfig.yAxis, {
                offset: -10
            })],
            series: [{
                name: '入校人数',
                type: 'bar',
                barWidth: '8px',
                itemStyle: {
                    barBorderRadius: [4, 4, 0, 0]
                },
                barGap: '20%',
                data: $scope.chartData.logWithHoursList.map(function (item) {
                    return item.count;
                })
            }]
        };

        $scope.chart2 = echarts.init(document.querySelector('.chart2'));
        $scope.chart2.setOption($scope.chartOptions2);
    };
}]);

angular.module('myApp.controllers_statistics_details', []).controller('statistics_detailsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    window.document.title = '人员信息统计';

    $scope.yellowAndRedList = [];
    $scope.collegeBackSchoolCounts = {};
    $scope.chartData = {};
    $scope.typeDataUG = {};
    $scope.typeDataPG = {};
    $scope.summary = {};
    $scope.typeList = ['在校', '不在校', '隔离', '请假外出'];
    $scope.ugBackSchoolList = []; // 本科生返校明细
    $scope.pgBackSchoolList = []; // 研究生返校明细

    $scope.yellowAndRedList = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/ctm/yellowAndRedList',
            // url: $rootScope.apiUrl + ':8087/statistics/ctm/yellowAndRedList',
            method: 'post',
            traditional: true,
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.yellowAndRedList = response.data;
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };
    $scope.getCollegeBackSchoolCounts = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getCollegeBackSchoolCounts',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getCampusBackSchoolInfoWithHours',
            method: 'post',
            traditional: true,
            data: {
                back_date: $scope.backDate
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    var data = response.data.filter(function (item) {
                        return item.deptName != null;
                    });
                    var backSchoolList = [];
                    data.forEach(function (item) {
                        backSchoolList.push({
                            oddRow: true,
                            deptName: item.deptName,
                            RealCountTol: parseInt(item.undergraduateRealCount) + parseInt(item.postgraduateRealCount),
                            TotalTol: parseInt(item.undergraduateTotal) + parseInt(item.postgraduateTotal)
                        });
                        backSchoolList.push({
                            evenRow: true,
                            undergraduateRealCount: item.undergraduateRealCount,
                            undergraduateTotal: item.undergraduateTotal,
                            postgraduateRealCount: item.postgraduateRealCount,
                            postgraduateTotal: item.postgraduateTotal
                        });
                    });
                    $scope.collegeBackSchoolCounts = backSchoolList;
                    var collegeBackSchoolSum = data.map(function (item) {
                        return item.total;
                    }).reduce(function (a, b) {
                        return parseInt(a) + parseInt(b);
                    });
                    $scope.collegeBackSchoolSum = collegeBackSchoolSum;

                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getStudentSummary = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/student/summary',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getSignCountsWithArea',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                response.data;
                $scope.$apply(function ($scope) {
                    $scope.summary = response.data;
                    $scope.typeDataUG = [{
                        value: response.data.ugInSchoolCount,
                        name: $scope.typeList[0]
                    }, {
                        value: response.data.ugLeaveCount,
                        name: $scope.typeList[1]
                    }, {
                        value: response.data.ugIsolateCount,
                        name: $scope.typeList[2]
                    }, {
                        value: response.data.ugNotInSchoolCount,
                        name: $scope.typeList[3]
                    }];
                    $scope.typeDataPG = [{
                        value: response.data.pgInSchoolCount,
                        name: $scope.typeList[0]
                    }, {
                        value: response.data.pgLeaveCount,
                        name: $scope.typeList[1]
                    }, {
                        value: response.data.pgIsolateCount,
                        name: $scope.typeList[2]
                    }, {
                        value: response.data.pgNotInSchoolCount,
                        name: $scope.typeList[3]
                    }];
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.renderChart = function () {
        $scope.chartOptions1 = {
            color: $rootScope.echarts.color,
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>{c} ({d}%)'
            },
            grid: {
                // left: '80%'
                // right: 0
            },
            series: [{
                name: '类型',
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: $scope.typeDataUG,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        $scope.chart1 = echarts.init(document.querySelector('.chart1'));
        $scope.chart1.setOption($scope.chartOptions1);

        $scope.chartOptions2 = {
            color: $rootScope.echarts.color,
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>{c} ({d}%)'
            },
            grid: {
                // left: '80%'
                // right: 0
            },
            series: [{
                name: '类型',
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: $scope.typeDataPG,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        $scope.chart2 = echarts.init(document.querySelector('.chart2'));
        $scope.chart2.setOption($scope.chartOptions2);
    };

    $scope.ugBackSchool = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/student/ugBackSchoolInfoWithDept',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.ugBackSchoolList = response.data;
                });
            }
        });
    };

    $scope.pgBackSchool = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/student/pgBackSchoolInfoWithDept',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.pgBackSchoolList = response.data;
                });
            }
        });
    };

    $scope.listInit = function () {
        $scope.pageInit = function () {
            $scope.yellowAndRedList();
            $scope.ugBackSchool();
            $scope.pgBackSchool();
            // $scope.getCollegeBackSchoolCounts();
            $scope.getStudentSummary(function () {
                // $scope.renderChart();
            });
        };
    };

    $rootScope.getUserData();
    $rootScope.getToken(function () {
        if (!$rootScope.work_weixin.token) {
            $rootScope.otherPageInit(function () {
                $scope.listInit();
            });
        } else {
            $scope.listInit();
        }
    });
}]);

angular.module('myApp.controllers_statistics_apply', []).controller('statistics_applyCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    window.document.title = '校园管控统计';

    $scope.serverNowDay = '';
    $scope.serverNowTime = '';
    $scope.chartData = {};
    $scope.chartHourMax = {};
    $scope.chartHourMaxList = [];
    $scope.recentLog = [];

    $scope.getInSchoolCounts = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getInSchoolCounts',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getInSchoolCounts',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).complete(function (xhr) {
            var response = xhr.responseJSON;
            var server_time = xhr.getResponseHeader('server_time');
            if (server_time) {
                var serverNowDate = moment(parseInt(server_time)).tz("Asia/Shanghai");
                $scope.$apply(function ($scope) {
                    $scope.serverNowDay = serverNowDate.format('YYYY-MM-DD');
                    $scope.serverNowTime = serverNowDate.format('HH:mm');
                });
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.chartData = response.data;
                    $scope.chartHourCount = Object.entries($scope.chartData.hourCount);
                    $scope.chartHourCount.sort(function (a, b) {
                        return parseInt(a[0].match(/(\d*)/g)[0]) - parseInt(b[0].match(/(\d*)/g)[0]);
                    });
                    // 时间段人数最大值
                    angular.copy($scope.chartHourCount, $scope.chartHourMaxList);
                    $scope.chartHourMaxList.sort(function (a, b) {
                        return parseInt(b[1]) - parseInt(a[1]);
                    });
                    $scope.chartHourMax = $scope.chartHourMaxList[0];
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };
    $scope.getRecentLog = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/gatelog/getRecentLog',
            // url: $rootScope.apiUrl + ':8086/gate/gatelog/getRecentLog',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.recentLogData = response.data;
                // let recentLogData = [];
                // response.data.forEach((item, key) => {
                //     recentLogData[key] = item;
                //
                //     let name = item.userName.split('');
                //     name = name.map((item, key) => {
                //         return key < 1 ? item : '*';
                //     });
                //     recentLogData[key]['userName'] = name.join('');
                //     recentLogData[key]['gateName'] = $rootScope.echarts.gateId[item.gateId];
                // });
                // $scope.$apply($scope => {
                //     $scope.recentLog = recentLogData
                // });
                callback && callback();
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getVisitorCounts = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/visitor/getVisitorCounts',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.visitorCounts = response.data;
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getVisitorGetInWithHours = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/visitor/getVisitorGetInWithHours',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.chartVisitorHourCount = response.data;
                    $scope.chartVisitorHourCount.sort(function (a, b) {
                        return parseInt(a.time.match(/(\d*)/g)[0]) - parseInt(b.time.match(/(\d*)/g)[0]);
                    });
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getVisitorGetInInfo = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/visitor/getVisitorGetInInfo',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                var data = [].concat(_toConsumableArray($scope.recentLogData), _toConsumableArray(response.data));
                // let data = $scope.recentLogData;
                var recentLogData = [];
                data.forEach(function (item, key) {
                    recentLogData[key] = item;

                    var name = item.userName.split('');
                    name = name.map(function (item, key) {
                        return key < 1 ? item : '*';
                    });
                    recentLogData[key]['userName'] = name.join('');
                    recentLogData[key]['gateName'] = item.gateName ? item.gateName : $rootScope.echarts.gateId[item.gateId];
                });

                recentLogData.sort(function (a, b) {
                    return a.createTime < b.createTime ? 1 : -1;
                });
                $scope.$apply(function ($scope) {
                    $scope.recentLog = recentLogData;
                    // $scope.chartData = Object.assign( $scope.chartData, {recentLog: recentLogData} );
                    console.info($scope.chartData.recentLog);
                });
                callback && callback();
            } else {
                alert(response.message);
            }
        });
    };

    $scope.getTodayOpenCardIdCounts = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getTodayOpenCardIdCounts',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.todayOpenCardId = response.data;
                });
                callback && callback();
            } else {
                alert(response.message);
            }
        });
    };

    $scope.listInit = function () {
        $scope.getTodayOpenCardIdCounts();
        $scope.getVisitorCounts();
        $scope.getVisitorGetInWithHours();
        $scope.getInSchoolCounts(function () {
            $scope.renderChart();
        });
        $scope.getRecentLog(function () {
            $scope.getVisitorGetInInfo();
        });
    };

    $rootScope.getUserData();
    $rootScope.getToken(function () {
        if (!$rootScope.work_weixin.token) {
            $rootScope.otherPageInit(function () {
                $scope.listInit();
            });
        } else {
            $scope.listInit();
        }
    });

    $scope.renderChart = function () {
        // 柱状图 各校区人数
        $scope.chartOptions1 = {
            color: ['#3EAAFF', '#FF9900'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: [_extends({}, $rootScope.echarts.commonConfig.xAxis, {
                data: $rootScope.echarts.chartCampusList.map(function (item) {
                    return item.name;
                })
            })],
            yAxis: [_extends({}, $rootScope.echarts.commonConfig.yAxis, {
                offset: -10
            })],
            series: [{
                name: '师生人数',
                type: 'bar',
                barWidth: '8px',
                barGap: '20%',
                stack: '人数',
                data: [$scope.chartData.qhb, $scope.chartData.qhn, $scope.chartData.dh, $scope.chartData.qsh]
            }, {
                name: '访客人数',
                type: 'bar',
                barWidth: '8px',
                itemStyle: {
                    barBorderRadius: [4, 4, 0, 0]
                },
                barGap: '20%',
                stack: '人数',
                data: [$scope.visitorCounts.qhb, $scope.visitorCounts.qhn, $scope.visitorCounts.dh, $scope.visitorCounts.qsh]
            }]
        };

        $scope.chart1 = echarts.init(document.querySelector('.chart1'));
        $scope.chart1.setOption($scope.chartOptions1);

        // 时间轴柱状图 各时段
        $scope.chartOptions2 = {
            color: ['#3EAAFF', '#FF9900'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            dataZoom: [{
                id: 'dataZoomX',
                type: 'slider',
                xAxisIndex: [0],
                filterMode: 'filter',
                start: 30,
                end: 70
            }],
            xAxis: [_extends({}, $rootScope.echarts.commonConfig.xAxis, {
                data: $scope.chartHourCount.map(function (item) {
                    return item[0];
                })
            })],
            yAxis: [_extends({}, $rootScope.echarts.commonConfig.yAxis, {
                offset: -10
            })],
            series: [{
                name: '师生人数',
                type: 'bar',
                barWidth: '8px',
                barGap: '20%',
                stack: '人数',
                data: $scope.chartHourCount.map(function (item) {
                    return item[1];
                })
            }, {
                name: '访客人数',
                type: 'bar',
                barWidth: '8px',
                itemStyle: {
                    barBorderRadius: [4, 4, 0, 0]
                },
                barGap: '20%',
                stack: '人数',
                data: $scope.chartVisitorHourCount.map(function (item) {
                    return item.count;
                })
            }]
        };

        $scope.chart2 = echarts.init(document.querySelector('.chart2'));
        $scope.chart2.setOption($scope.chartOptions2);

        $scope.chartOptions3 = {
            color: $rootScope.echarts.color,
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>{c} ({d}%)'
            },
            series: [{
                name: '人员',
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: [{
                    value: $scope.chartData.student,
                    name: '学生'
                }, {
                    value: $scope.chartData.teacher,
                    name: '教职工'
                }, {
                    value: $scope.chartData.b,
                    name: 'B类人员'
                }, {
                    value: $scope.chartData.temp,
                    name: '临时人员'
                }, {
                    value: $scope.visitorCounts.visitorCounts,
                    name: '访客'
                }]
            }]
        };

        $scope.chart3 = echarts.init(document.querySelector('.chart3'));
        $scope.chart3.setOption($scope.chartOptions3);
    };
}]);

angular.module('myApp.controllers_statistics_person', []).controller('statistics_personCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    document.title = '人员分析统计';

    $scope.serverNowDay = '';
    $scope.serverNowTime = '';
    $scope.chartData = {};
    $scope.areaDataCount = 0;
    $scope.signPercent = 0;

    $scope.getSignCounts = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getSignCounts',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getSignCounts',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).complete(function (xhr) {
            var response = xhr.responseJSON;
            var server_time = xhr.getResponseHeader('server_time');
            if (server_time) {
                var serverNowDate = moment(parseInt(server_time)).tz("Asia/Shanghai");
                $scope.$apply(function ($scope) {
                    $scope.serverNowDay = serverNowDate.format('YYYY-MM-DD');
                    $scope.serverNowTime = serverNowDate.format('HH:mm');
                });
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.chartData = response.data;
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };
    $scope.getRecentDaysSignCounts = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getRecentDaysSignCounts',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getRecentDaysSignCounts',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.chartData = Object.assign($scope.chartData, response.data);
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };
    $scope.getSignCountsInKeyArea = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getSignCountsInKeyArea',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getSignCountsInKeyArea',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.keyArea = response.data;
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };
    $scope.getSignCountsWithArea = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/statistics/gate/getSignCountsWithArea',
            // url: $rootScope.apiUrl + ':8087/statistics/gate/getSignCountsWithArea',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    var areaData = [];
                    response.data.forEach(function (item, key) {
                        areaData[key] = {
                            value: item.count,
                            name: item.address_province
                        };
                    });
                    // areaData[areaData.length] = {
                    //     value: $scope.chartData.totalSign - response.data.map(item => item.count).reduce((a, b) => {return parseInt(a)+parseInt(b)}),
                    //     name: '其他'
                    // };
                    $scope.chartData = Object.assign($scope.chartData, { areaData: areaData });
                    $scope.areaDataCount = $scope.chartData.areaData.map(function (item) {
                        return item.value;
                    }).reduce(function (a, b) {
                        return parseInt(a) + parseInt(b);
                    });
                    $scope.signPercent = ($scope.chartData.totalSign / $rootScope.echarts.totalSign * 100).toFixed(1);
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };
    $scope.getRecentSignInfo = function (callback) {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/sign/getRecentSignInfo',
            // url: $rootScope.apiUrl + ':8086/gate/sign/getRecentSignInfo',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function ($scope) {
                    $scope.chartData = Object.assign($scope.chartData, { signInfo: response.data });
                    callback && callback();
                });
            } else {
                alert(response.message);
            }
        });
    };

    $scope.listInit = function () {
        $scope.getSignCountsInKeyArea();
        $scope.getSignCounts(function () {
            $scope.getRecentDaysSignCounts(function () {
                $scope.getSignCountsWithArea(function () {
                    // $scope.getRecentSignInfo(() => {
                    $scope.renderChart();
                    // });
                });
            });
        });
    };

    $rootScope.getUserData();
    $rootScope.getToken(function () {
        if (!$rootScope.work_weixin.token) {
            $rootScope.otherPageInit(function () {
                $scope.listInit();
            });
        } else {
            $scope.listInit();
        }
    });

    $scope.renderChart = function () {
        $scope.chartOption4 = {
            backgroundColor: "#fff",
            color: ["#3EAAFF"],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: [_extends({}, $rootScope.echarts.commonConfig.xAxis, {
                data: [moment().subtract('days', 6).format('MM.DD'), moment().subtract('days', 5).format('MM.DD'), moment().subtract('days', 4).format('MM.DD'), moment().subtract('days', 3).format('MM.DD'), moment().subtract('days', 2).format('MM.DD'), '昨天', '今天']
            })],
            yAxis: [_extends({}, $rootScope.echarts.commonConfig.yAxis, {
                offset: -10,
                scale: true
            })],
            series: [{
                name: '打卡次数',
                type: 'line',
                data: [$scope.chartData.seventhCount, $scope.chartData.sixthCount, $scope.chartData.fifthCount, $scope.chartData.fourthCount, $scope.chartData.thirdCount, $scope.chartData.yesterdaySign, $scope.chartData.totalSign]
            }]
        };

        $scope.chart4 = echarts.init(document.querySelector('.chart4'));
        $scope.chart4.setOption($scope.chartOption4);

        $scope.chartOptions3 = {
            color: $rootScope.echarts.color,
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>{c} ({d}%)'
            },
            grid: {
                // left: '80%'
                // right: 0
            },
            series: [{
                name: '地区',
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: $scope.chartData.areaData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        $scope.chart3 = echarts.init(document.querySelector('.chart3'));
        $scope.chart3.setOption($scope.chartOptions3);
    };
}]);

angular.module('myApp.controllers_visitor_list', [])
// 访客 申请列表
.controller('visitor_listCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
    window.document.title = '南昌大学访客系统';
    $scope.loading = true;

    $scope.statusList = {
        0: '待部门信息员审核',
        1: '待部门领导审核',
        2: '部门信息员审核拒绝',
        3: '部门领导审核通过',
        4: '部门领导审核拒绝'
    };

    $scope.listInit = function () {
        $scope.approvedList = []; // 已同意
        $scope.unapprovedList = []; // 待审批
        $scope.refusesList = []; // 已拒绝
        $scope.pageSize = 10;
        $rootScope.currentItinerary = {};

        $scope.switch_tab = function ($id) {
            $('.tab-content .tab-pane').fadeOut();
            var id = $id.split('-')[1];
            $scope.loadList(id);
            if (id == 0) {
                $scope.unapprovedList = [];
            } else if (id == 1) {
                $scope.approvedList = [];
            } else if (id == 2) {
                $scope.refusesList = [];
            }
            $timeout(function () {
                $('.tab-content .tab-pane' + $id).fadeIn();
            }, 500);
        };

        $scope.loadList = function ($id) {
            // $scope.$apply(function ($scope) {
            $scope.loading = true;
            // });
            $rootScope.visitorListActiveTab = $id;
            jQuery.ajax({
                url: $rootScope.apiUrl + '/gate/visitor/queryApplyList',
                method: 'post',
                data: {
                    status: $id // 0 待审批  1 已同意  2 已拒绝
                },
                headers: {
                    "token": $rootScope.work_weixin.token
                }
            }).then(function (response) {
                $scope.$apply(function ($scope) {
                    $scope.loading = false;
                });
                if (response.code == 0) {
                    if (response.data && response.data.length > 0) {
                        console.info(response.data);
                        if ($id == 0) {
                            $scope.$apply(function ($scope) {
                                $scope.unapprovedList = response.data;
                                $scope.unapprovedList.sort(function (a, b) {
                                    return a.updateTime < b.updateTime ? 1 : -1;
                                });
                            });
                        } else if ($id == 1) {
                            $scope.$apply(function ($scope) {
                                $scope.approvedList = response.data;
                                $scope.approvedList.sort(function (a, b) {
                                    return a.updateTime < b.updateTime ? 1 : -1;
                                });
                            });
                        } else if ($id == 2) {
                            $scope.$apply(function ($scope) {
                                $scope.refusesList = response.data;
                                $scope.refusesList.sort(function (a, b) {
                                    return a.updateTime < b.updateTime ? 1 : -1;
                                });
                            });
                        }
                    }
                } else if (response.code == 1) {
                    alert(response.message);
                    $rootScope.re_login();
                } else {
                    alert(response.message);
                }
            }).fail(function (err) {});
        };
        $scope.loadList(!!$rootScope.visitorListActiveTab ? $rootScope.visitorListActiveTab : 0);
    };

    // 加载token
    $rootScope.getUserData();
    $rootScope.getToken(function () {
        if (!$rootScope.work_weixin.token) {
            $rootScope.otherPageInit(function () {
                $scope.listInit();
            });
        } else {
            $scope.listInit();
        }
    });

    $scope.query = function ($data, $isVerify) {
        $data = _extends({ 'isVerify': $isVerify }, $data);
        $rootScope.go('/visitor_detail_apply', { applyDetail: JSON.stringify($data) });
    };
}]);

angular.module('myApp.controllers_visitor_detail_apply', [])
// 访客 申请审批
.controller('visitor_detail_applyCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.go('/visitor_list');

    if ($rootScope.deptList = []) $scope.getDeptList();

    $scope.visitedCampus = '';
    $scope.applyStatus = '';

    $scope.statusList = {
        0: '待部门信息员审核',
        1: '待部门领导审核',
        2: '部门信息员审核拒绝',
        3: '部门领导审核通过',
        4: '部门领导审核拒绝'
    };

    $scope.getStatusText = function () {
        if ($scope.formField && $scope.formField.status != null) {
            var text = $scope.statusList[$scope.formField.status];
            if ($scope.formField.status == 0) {
                text = text.replace(/信息员/, '信息员【' + $scope.formField.verifyManager + '】');
                text = text.replace(/领导/, '领导【' + $scope.formField.verifyLeader + '】');
            }
            return text;
        }
    };

    if ($routeParams.applyDetail) {
        var data = JSON.parse($routeParams.applyDetail);
        $scope.isVerify = data.isVerify;
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/visitor/queryApply',
            method: 'post',
            data: {
                applyId: data.applyId,
                idCard: data.visitorIdCard
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.formField = response.data;
                $scope.formField.visitedCampus.split('').map(function (val, key) {
                    if (val == '1') $scope.visitedCampus = $scope.visitedCampus + $rootScope.campusNameList[key] + ' ';
                });
                $scope.$apply(function ($scope) {
                    $scope.formField;
                });
            } else {
                alert(response.message);
            }
        });
    }

    // 审批提交
    $scope.check = function (verifyResult) {
        var checkConfirm = confirm('确定要【' + (!!verifyResult ? '拒绝' : '同意') + '】该条申请？');
        if (!checkConfirm) return false;
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/visitor/applyVerify',
            method: 'post',
            data: {
                applyId: $scope.formField.applyId,
                idCard: $scope.formField.visitorIdCard,
                verifyResult: verifyResult, // 0 同意  1 拒绝
                remark: $scope.verifyRemark ? $scope.verifyRemark : verifyResult == 0 ? '同意' : '拒绝',
                updateTime: $scope.formField.updateTime
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $('.alert-success-detail').fadeIn();
                $('.submit-form-panel').remove();
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };
}]);

angular.module('myApp.controllers_visitor_passport', [])
// 访客电子ID
.controller('visitor_passportCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    window.document.title = '南昌大学访客系统';

    if (!$rootScope.campusData) $rootScope.go('/guard_welcome');
    $scope.passport = {};
    $scope.visitedCampus = '';
    $scope.visitedCampusName = '';
    $scope.noentry = false;

    console.info($rootScope.campusData.campus);
    if ($routeParams.passport) {
        var data = $routeParams.passport;
        data = JSON.parse(data);
        $scope.passport = data[0];
        if ($scope.passport.visitorMobile.length == 11) $scope.passport.visitorMobile = $scope.passport.visitorMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        if ($scope.passport.visitorIdCard.length == 18) $scope.passport.visitorIdCard = $scope.passport.visitorIdCard.replace(/^(.{6})(?:\d+)(.{4})$/, "$1********$2");

        data.map(function (p) {
            p.visitedCampus.split('').map(function (val, key) {
                if (val == '1') $scope.visitedCampus = $scope.visitedCampus + $rootScope.campusNameList[key] + ' ';
            });
        });

        // 获取数组
        var currentCampus = $rootScope.campusId.filter(function (item) {
            return item.key == $rootScope.campusData.campus;
        });
        currentCampus = currentCampus[0].value;
        console.info(currentCampus.value);
        if ($scope.visitedCampus.indexOf(currentCampus) >= 0) {
            $scope.noentry = false;
            $('.alert-danger').hide();
            $('.visitor-info-card').addClass('green').removeClass('red');
        } else {
            $scope.noentry = true;
            $('.alert-danger').show();
            $('.visitor-info-card').addClass('red').removeClass('green');
            // alert('')
        }
        $scope.visitedCampusName = $scope.visitedCampus.split(' ');
        $scope.visitedCampusName = [].concat(_toConsumableArray(new Set($scope.visitedCampusName)));

        $scope.visitedCampus = '';
        $scope.visitedCampusName.map(function (item) {
            $scope.visitedCampus = $scope.visitedCampus + item + ' ';
        });
    }

    // 入校记录
    $scope.sendGuardCheck = function () {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/visitor/visitorLogIn',
            method: 'post',
            data: {
                campusId: $rootScope.campusData.campus,
                ctm: $rootScope.NCrqcodeOriginal
            },
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $('.alert-success-recall').fadeIn();
                $('.submit-form').hide();
                $timeout(function () {
                    $rootScope.go('/guard_scan');
                }, 2000);
            } else {
                alert(response.message);
            }
        });
    };

    $scope.denyGuardCheck = function () {
        $rootScope.go('/guard_scan');
    };
}]);
