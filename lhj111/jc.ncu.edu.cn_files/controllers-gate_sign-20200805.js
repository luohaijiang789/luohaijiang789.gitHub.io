'use strict';

var _extends2 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

angular.module('myApp.controllers_gate_sign', []).controller('gate_sign_entryCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
    $rootScope.isVerifier = false;
    $rootScope.weixinGetLocation();

    $scope.goto_home = function () {
        $rootScope.go('/gate_sign/home');
    };
    $scope.goto_list = function () {
        $rootScope.go('/gate_sign/list', {verify: false});
    };
    $scope.goto_verify_list = function () {
        $rootScope.go('/gate_sign/list', {verify: true});
    };

    $rootScope.checkIsVerifier = function () {
        jQuery.ajax({
            url: $rootScope.apiUrl + '/gate/user/isVerifier',
            method: 'post',
            data: {},
            headers: {
                "token": $rootScope.work_weixin.token
            }
        }).then(function (response) {
            if (response.code == 0) {
                $scope.$apply(function () {
                    $rootScope.isVerifier = response.message == '是';
                });
            } else if (response.code == 1) {
                alert(response.message);
                $rootScope.re_login();
            } else {
                alert(response.message);
            }
        });
    };

    // 加载token
    $rootScope.otherPageInit(function () {
        $rootScope.checkIsVerifier();
    });
}]);

angular.module('myApp.controllers_gate_sign_home', [])
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
            'closeServen': null
            // 'closeBjSix': null,
            // 'closeOtherSix': null,
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
            'closeServen': false
            // 'closeBjSix': false,
            // 'closeOtherSix': false,
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

                if ($scope.checkField['closeServen'] && !$scope.formField['closeServen']) {
                    validityFlag = true;
                    $('.closeServen-invalid-feedback').show();
                } else {
                    $('.closeServen-invalid-feedback').hide();
                }

                // if($scope.checkField['closeBjSix'] && !$scope.formField['closeBjSix']){
                //     validityFlag = true;
                //     $('.closeBjSix-invalid-feedback').show();
                // }else{
                //     $('.closeBjSix-invalid-feedback').hide();
                // }
                // if($scope.checkField['closeOtherSix'] && !$scope.formField['closeOtherSix']){
                //     validityFlag = true;
                //     $('.closeOtherSix-invalid-feedback').show();
                // }else{
                //     $('.closeOtherSix-invalid-feedback').hide();
                // }
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
                    if ($scope.checkField['closeServen']
                    // $scope.checkField['closeBjSix']
                    // || $scope.checkField['closeOtherSix']
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
            $('button, input, select, label, #distpicker').attr('disabled', 'disabled');
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

                            if (response.data.closeServen) {
                                $scope.formField['closeServen'] = response.data.closeServen;
                                $scope.checkField['closeServen'] = true;
                            }
                            // if(response.data.closeBjSix) {
                            //     $scope.formField['closeBjSix'] = response.data.closeBjSix;
                            //     $scope.checkField['closeBjSix'] = true;
                            // }
                            // if(response.data.closeOtherSix) {
                            //     $scope.formField['closeOtherSix'] = response.data.closeOtherSix;
                            //     $scope.checkField['closeOtherSix'] = true;
                            // }
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
                                $('button, input, select, label, #distpicker').attr('disabled', 'disabled');
                                $scope.allow = false;
                            } else {
                                // 暂不勾选重点地区 每次地区变更取消勾选3天
                                $scope.formField['closeHb'] = null;
                                // ****
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
                        $('#notification_modal').modal({backdrop: 'static', keyboard: false});

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

                    $scope.checkField['closeServen'] = false;
                    // $scope.checkField['closeBjSix'] = false;
                    // $scope.checkField['closeOtherSix'] = false;
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

angular.module('myApp.controllers_gate_sign_list', [])
//离昌申请列表
    .controller('gate_sign_listCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
        window.document.title = '离昌申请审批';
        $rootScope.otherPageInit();

        $scope.loading = true;
        $rootScope.applyListActiveTab = 0;

        // if(!$routeParams.verify || !$rootScope.isVerifier) $rootScope.go('/gate_sign');
        $rootScope.isGateSignVerify = JSON.parse($routeParams.verify);
        $rootScope.statusList = {
            0: '待部门信息员审核',
            1: '待部门领导审核',
            2: '部门信息员审核拒绝',
            3: '部门领导审核通过',
            4: '部门领导审核拒绝'
        };

        if ($rootScope.isGateSignVerify && !$rootScope.leaveNCReadModal) {
            $('#alert_modal').modal({backdrop: 'static', keyboard: false});
        }

        console.info($rootScope.leaveNCReadModal);
        $scope.hide_modal = function () {
            $rootScope.leaveNCReadModal = true;
            $('#alert_modal').modal('hide');
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
                $rootScope.applyListActiveTab = $id;
                jQuery.ajax({
                    url: $rootScope.apiUrl + ($rootScope.isGateSignVerify ? '/gate/leaveNC/queryApplyListForVerify' : '/gate/leaveNC/queryApplyList'),
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
                }).fail(function (err) {
                });
            };
            $scope.loadList(!!$rootScope.applyListActiveTab ? $rootScope.applyListActiveTab : 0);
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
            $data = _extends({'isVerify': $isVerify}, $data);
            $rootScope.go('/gate_sign/detail_apply', {applyDetail: JSON.stringify($data)});
        };

        $scope.newapply = function () {
            $rootScope.go('/gate_sign/detail_apply');
        };
    }]);

angular.module('myApp.controllers_gate_sign_detail_apply', [])
// 打卡 离昌申请 表单
    .controller('gate_sign_detail_applyCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function ($scope, $rootScope, $http, $timeout, $routeParams) {
        if (!$rootScope.userData || !$rootScope.userData.userId) $rootScope.re_login();
        // if($rootScope.isGateSignVerify && !$rootScope.isVerifier) $rootScope.go('/gate_sign');

        $scope.applyStatus = '';
        $scope.isNewApply = true;
        $scope.deptName = '';

        $scope.statusList = {
            0: '待部门信息员审核',
            1: '待部门领导审核',
            2: '部门信息员审核拒绝',
            3: '部门领导审核通过',
            4: '部门领导审核拒绝'
        };

        $scope.formField = {
            destinationInChina: '是'
        };

        $scope.getStatusText = function () {
            if ($scope.formField && $scope.formField.status != null) {
                var text = $scope.statusList[$scope.formField.status];
                if ($scope.formField.status == 0 || $scope.formField.status == 1) {
                    text = text.replace(/信息员/, '信息员【' + $scope.formField.verifyManager + '】');
                    text = text.replace(/领导/, '领导【' + $scope.formField.verifyLeader + '】');
                }
                return text;
            }
        };

        // 表单控件初始化
        $scope.formInit = function () {
            $('#datetimepicker-leave').datetimepicker(_extends2({}, $rootScope.datepickerOptions, {
                format: 'yyyy-mm-dd', //显示格式
                minView: 'month',
                startDate: new Date()
            }));
            $('#datetimepicker-back').datetimepicker(_extends2({}, $rootScope.datepickerOptions, {
                format: 'yyyy-mm-dd', //显示格式
                minView: 'month',
                startDate: new Date(),
                useCurrent: false
            }));

            $("#datetimepicker-leave").datetimepicker().on("hide", function (e) {
                if (!!e.currentTarget.value) {
                    var value = e.currentTarget.value;
                    $('#datetimepicker-leave').val(value).datetimepicker('update');
                    $scope.formField.leaveNCDate = value;

                    $('#datetimepicker-back').datetimepicker('setStartDate', e.currentTarget.value).datetimepicker('update');
                }
            });

            $("#datetimepicker-back").datetimepicker().on("hide", function (e) {
                if (!!e.currentTarget.value) {
                    $scope.formField.planBackNCDate = e.currentTarget.value;
                }
            });

            if ($scope.formField && $scope.formField.destinationProvince) {
                $('#distpicker').distpicker({
                    province: $scope.formField.destinationProvince,
                    city: $scope.formField.destinationCity
                });
            } else {
                $('#distpicker').distpicker({
                    province: '江西省',
                    city: '南昌市'
                });
            }
        };

        // 获取详情
        if ($routeParams.applyDetail) {
            $scope.isNewApply = false;
            var data = JSON.parse($routeParams.applyDetail);
            $scope.isVerify = data.isVerify;
            jQuery.ajax({
                url: $rootScope.apiUrl + '/gate/leaveNC/queryApply',
                method: 'post',
                data: {
                    applyId: data.applyId,
                    userId: data.userId
                },
                headers: {
                    "token": $rootScope.work_weixin.token
                }
            }).then(function (response) {
                if (response.code == 0) {
                    $scope.formField = response.data;
                    $scope.$apply(function ($scope) {
                        $scope.formField;
                        $scope.formInit();
                        $scope.deptName = $rootScope.getDeptName($scope.formField.deptId);
                        if ($scope.formField.leaveNCDate) $('#datetimepicker-leave').html($scope.formField.leaveNCDate);
                        if ($scope.formField.planBackNCDate) $('#datetimepicker-back').html($scope.formField.planBackNCDate);
                        if ($scope.formField.status != 0 && $scope.formField.status != 1) {
                            $('#distpicker, input, select, textarea').attr('disabled', 'disabled');
                            $('#datetimepicker-leave, #datetimepicker-back').attr('disabled', 'disabled');
                        }
                    });
                } else {
                    alert(response.message);
                }
            });
        } else {
            $scope.formField['userId'] = $rootScope.userData.userId;
            $scope.formField['userName'] = $rootScope.userData.userName;
            $scope.formInit();
        }

        var forms = $('#apply-form');
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                $('.invalid-feedback').hide();
                $('.form-control, .custom-select').removeClass('invalid valid');
                var validityFlag = false;
                if (!$scope.formField) return false;

                if (!$scope.formField.deptId) {
                    validityFlag = true;
                    $('#dept-tree').removeClass('valid').addClass('invalid');
                    $('.deptId-invalid-feedback').show();
                } else {
                    $('#dept-tree').removeClass('invalid').addClass('valid');
                    $('.deptId-invalid-feedback').hide();
                }

                if (!$('#datetimepicker-leave').val()) {
                    validityFlag = true;
                    $('#datetimepicker-leave').addClass('invalid');
                    $('.leave-invalid-feedback').show();
                } else {
                    $('#datetimepicker-leave').addClass('valid');
                    $('.leave-invalid-feedback').hide();
                }

                if (!$('#datetimepicker-back').val()) {
                    validityFlag = true;
                    $('#datetimepicker-back').addClass('invalid');
                    $('.back-invalid-feedback').show();
                } else {
                    $('#datetimepicker-back').addClass('valid');
                    $('.back-invalid-feedback').hide();
                }

                if (!$('#addressInfo').val()) {
                    validityFlag = true;
                    $('.addressInfo-invalid-feedback').show();
                } else {
                    $('.addressInfo-invalid-feedback').hide();
                }

                var province = $('#addressProvince');
                var city = $('#addressCity');
                if ($scope.formField.destinationInChina == "是") {
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
                }

                if (form.checkValidity() === false || validityFlag) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    $scope.submit();
                }

                form.classList.add('was-validated');
            }, false);
        });

        // 申请提交
        $scope.submit = function () {
            var params = {
                userId: $scope.formField.userId,
                userName: $scope.formField.userName,
                deptId: $scope.formField.deptId,
                leaveNCDate: $('#datetimepicker-leave').val(),
                planBackNCDate: $('#datetimepicker-back').val(),
                destinationInChina: $scope.formField.destinationInChina,
                destinationProvince: $('#addressProvince').val(),
                destinationCity: $('#addressCity').val(),
                destinationAddressInfo: $scope.formField.destinationAddressInfo,
                remark: $scope.formField.remark
            };
            if (!$scope.isNewApply) {
                params['applyId'] = $scope.formField.applyId;
                params['status'] = $scope.formField.status;
            }
            console.info(params);
            jQuery.ajax({
                url: $rootScope.apiUrl + ($scope.isNewApply ? '/gate/leaveNC/newapply' : '/gate/leaveNC/modifyApply'), // 新增 / 修改申请
                method: 'post',
                contentType: 'application/json;charset=UTF-8',
                traditional: true,
                data: JSON.stringify(_extends2({}, params)),
                headers: {
                    "token": $rootScope.work_weixin.token
                },
                type: 'json'
            }).then(function (response) {
                if (response.code == 0) {
                    $scope.formInputDisabled();
                    $('.alert-success-apply-detail').fadeIn();
                    $('#submit-btn').remove();
                } else if (response.code == 1) {
                    alert(response.message);
                    $rootScope.re_login();
                } else {
                    alert(response.message);
                }
            });
        };

        $scope.formInputDisabled = function () {
            $('#distpicker, input, select, textarea').attr('disabled', 'disabled');
            $('#datetimepicker-leave, #datetimepicker-back').attr('disabled', 'disabled');
        };

        // 审批提交
        $scope.check = function (verifyResult) {
            var checkConfirm = confirm('确定要【' + (!!verifyResult ? '拒绝' : '同意') + '】该条申请？');
            if (!checkConfirm) return false;
            jQuery.ajax({
                url: $rootScope.apiUrl + '/gate/leaveNC/applyVerify',
                method: 'post',
                data: {
                    apply_id: $scope.formField.applyId,
                    user_id: $scope.formField.userId,
                    verifyResult: verifyResult, // 0 同意  1 拒绝
                    remark: $scope.verifyRemark ? $scope.verifyRemark : verifyResult == 0 ? '同意' : '拒绝',
                    updateTime: $scope.formField.updateTime
                },
                headers: {
                    "token": $rootScope.work_weixin.token
                }
            }).then(function (response) {
                if (response.code == 0) {
                    $scope.formInputDisabled();
                    $('.alert-success-verify-detail').fadeIn();
                    $('.submit-form-panel').remove();
                } else if (response.code == 1) {
                    alert(response.message);
                    $rootScope.re_login();
                } else {
                    alert(response.message);
                }
            });
        };

        $scope.changeInChina = function (flag) {
            if (!flag) {
                $scope.formField['addressProvince'] = '';
                $scope.formField['addressCity'] = '';
                $('#distpicker').distpicker('reset');
            }
        };

        $timeout(function () {
            $('textarea[autoHeight]').autoHeight();
        }, 200);

        if ($rootScope.isGateSignVerify) {
            $('#distpicker, #remark, input, select').attr('disabled', 'disabled');
            $('#datetimepicker-leave, #datetimepicker-back').attr('disabled', 'disabled');
        }

        $scope.deptTree = [];
        $scope.getDeptList = function (callback) {
            jQuery.ajax({
                url: $rootScope.apiUrl + '/user/dept/list',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                if (response.code == 0) {
                    callback && callback(response.data);
                } else {
                    alert(response.message);
                }
            });
        };
        $scope.processing = function () {
            var list = [];
            $scope.treeData.map(function (item) {
                list.push(_extends2({}, item, {
                    selectable: false
                }));
            });
            $scope.treeData = list;
            console.info($scope.treeData);
        };

        $scope.setTreeItem = function (id) {
            var options = {
                state: {
                    'disabled': true
                }
            };
            if (id == '8003') {
                // 理工二部
                return options;
            } else {
                return {};
            }
        };

        $scope.getTreeData = function (list) {
            if (!list || list.length <= 0) {
                return [];
            }
            var data = [];
            list.map(function (item) {
                var options = $scope.setTreeItem(item.deptId);
                data.push(_extends2({
                    deptName: item.deptName,
                    deptId: item.deptId,
                    selectable: item.children.length > 0 ? false : true,
                    children: $scope.getTreeData(item.children)
                }, options));
            });
            return data;
        };

        $scope.renderTree = function () {
            var list = $scope.treeData;
            $scope.treeData = $scope.getTreeData(list);
            console.info($scope.treeData);
            $scope.treeDom = $('#tree').treeview({
                data: $scope.treeData,
                levels: 1,
                expandIcon: 'tree-chevron-right',
                collapseIcon: 'tree-chevron-down',
                onNodeSelected: function onNodeSelected(event, node) {
                    $scope.$apply(function ($scope) {
                        $scope.formField.deptId = node.deptId;
                        $scope.deptName = node.deptName;
                    });
                }
            });
        };

        $scope.hide_modal = function () {
            $('#treeItem-search').val('');
            $('#dept_modal').modal('hide');
        };

        $scope.show_modal = function () {
            $('#dept_modal').modal('show');
            $scope.renderTree();
        };
        $scope.getDeptList(function (data) {
            $scope.treeData = data;
        });

        $(document).on('keyup change', '#treeItem-search', function () {
            var pattern = $('#treeItem-search').val();
            var results = $scope.treeDom.treeview('search', [pattern]);
        });
        $(document).on('click', '#clear-search-btn', function () {
            $scope.treeDom.treeview('clearSearch');
            $('#treeItem-search').val('');
        });

        $('#promise_modal').modal({backdrop: 'static', keyboard: false});
    }]);
