import moment from 'moment'

export default {
    // 封装时间格式化
    getTime: function (projectListData) {
        projectListData.forEach((projectItem, index) => {
            if (projectItem.stageList) {
                projectItem.stageList.forEach(stageItem => {
                    if (stageItem.stageStatus != 3) {
                        var countDownTime = moment(stageItem.overTime, "YYYY年MM月DD日 HH时").format("YYYY-MM-DD 23:59:59");
                        var getcountDownTime = function () {
                            var time = moment(countDownTime).diff(moment());
                            var t = null;
                            var d = null;
                            var h = null;
                            var m = null;
                            var s = null;　　　　　　　　　
                            t = time / 1000;
                            d = Math.floor(t / (24 * 3600));
                            h = Math.floor((t - 24 * 3600 * d) / 3600);
                            m = Math.floor((t - 24 * 3600 * d - h * 3600) / 60);
                            s = Math.floor((t - 24 * 3600 * d - h * 3600 - m * 60));
                            d > 0 ? d = d : d = 0;
                            stageItem.nowTime = ' 剩余时间: ' + d + '天' + h + '小时' + m + '分钟' + s + '秒';
                        }
                        getcountDownTime()
                        setInterval(function () {
                            getcountDownTime()
                        }, 1000)
                    } 
                    var getTimes = moment(stageItem.overTime, "YYYY年MM月DD日 HH时").format("YYYY-MM-DD");
                    var nowTime = moment(stageItem.realOverTime, "YYYY年MM月DD日 HH时").format("YYYY-MM-DD");
                    var getBeginTime = moment(stageItem.beginTime, "YYYY年MM月DD日 HH时").format(
                        "YYYY-MM-DD");
                    stageItem.beginTime = moment(stageItem.beginTime,
                            "YYYY年MM月DD日 HH时")
                        .format("MM月DD日");
                    stageItem.overTime = moment(stageItem.overTime,
                            "YYYY年MM月DD日 HH时")
                        .format("MM月DD日");
                    //    计算开始到现在占总共时间的多少
                    if (stageItem.isOverdue == 1) {
                        stageItem.realEndTime = moment(stageItem.realOverTime,
                                "YYYY年MM月DD日 HH时")
                            .format("MM月DD日");
                        stageItem.Percentage = 100;
                    } else if (stageItem.stageStatus == 3) {
                        stageItem.realEndTime = moment(stageItem.realOverTime,
                                "YYYY年MM月DD日 HH时")
                            .format("MM月DD日");
                        stageItem.Percentage = 100 - parseInt(stageItem.probability);
                    } else {
                        stageItem.Percentage = 100 - parseInt(stageItem.probability);
                    }
                })
            }
        })
        return projectListData;
    },
    // 封装去经理，去要显示的信息的格式
    getPmUsername: function (params) {
        const aa = params || []
        var res = aa.map(function (item, index, input) {
            if (item.realName) {
                return item.realName + ",";
            } else {
                return item.memberName + ",";
            }
        })
        var string = "";
        for (var i = 0; i < res.length; i++) {
            string += res[i];
        }
        string = string.substring(0, string.length - 1);
        return string;
    },
    //   对里程碑成员数据进行处理
    handle: function (data) {
        data = data || []
        var res = data.map((vaule, index) => {
            var m = {}
            m.memberId = vaule.userId;
            m.memberName = vaule.realName;
            m.loginName = vaule.loginName;
            return m;
        })
        return res;
    },
    // 组织结构数据做处理
    handSelectUser: function (userList) {
        userList = userList || []
        let newUserList = [];
        userList.forEach((user) => {
            let newUser = {};
            if (user.userId) {
                newUser.userId = user.userId;
            } else if (user.memberId) {
                newUser.userId = user.memberId;
            }
            newUserList.push(newUser);
        });
        return newUserList;
    },
    // 封装对里程碑信息的处理
    processStageData: function (stageList) {
        if (!stageList) return [];
        var newStageList = [];
        stageList.forEach((vaule, index) => {
            if (vaule.stageStatus != 3) {
                var countDownTime = moment(vaule.overTime, "YYYY年MM月DD日 HH时").format("YYYY-MM-DD 23:59:59");
                var getcountDownTime = function () {
                    var time = moment(countDownTime).diff(moment());
                    var t = null;
                    var d = null;
                    var h = null;
                    var m = null;
                    var s = null;　　　　　　　　　
                    t = time / 1000;
                    d = Math.floor(t / (24 * 3600));
                    h = Math.floor((t - 24 * 3600 * d) / 3600);
                    m = Math.floor((t - 24 * 3600 * d - h * 3600) / 60);
                    s = Math.floor((t - 24 * 3600 * d - h * 3600 - m * 60));
                    d > 0 ? d = d : d = 0;
                    vaule.nowTime = ' 剩余时间: ' + d + '天' + h + '小时' + m + '分钟' + s + '秒';
                }
                getcountDownTime();
                setInterval(function () {
                    getcountDownTime();
                }, 1000)
            }
            var getTimes = moment(vaule.overTime, "YYYY年MM月DD日 HH时").format("YYYY-MM-DD");
            var nowTime = moment(vaule.realOverTime, "YYYY年MM月DD日 HH时").format("YYYY-MM-DD");
            var getBeginTime = moment(vaule.beginTime, "YYYY年MM月DD日 HH时").format("YYYY-MM-DD");
            vaule.beginTime = moment(vaule.beginTime,
                    "YYYY年MM月DD日 HH时")
                .format("MM月DD日");
            vaule.overTime = moment(vaule.overTime,
                    "YYYY年MM月DD日 HH时")
                .format("MM月DD日");

            //    计算开始到现在占总共时间的多少
            if (vaule.isOverdue == 1) {
                vaule.realEndTime = moment(vaule.realOverTime,
                        "YYYY年MM月DD日 HH时")
                    .format("MM月DD日");
                vaule.Percentage = 100;
            } else if (vaule.stageStatus == 3) {
                vaule.realEndTime = moment(vaule.realOverTime,
                        "YYYY年MM月DD日 HH时")
                    .format("MM月DD日");
                vaule.Percentage = 100 - parseInt(vaule.probability);
            } else {
                vaule.Percentage = 100 - parseInt(vaule.probability);
            }
            vaule.isShowTrends = false;
            vaule.isShowStage = false;
            if (vaule.stageStatus != 3) {
                vaule.isShowTrends = true;
            }
            newStageList.push(vaule);
        })
        return newStageList;
    },
    //获取现在的时间  格式为YYYY-MM-DD
    nowTimes: moment(new Date(), "YYYY年MM月DD日 HH时").format("YYYY-MM-DD"),
    //获取现在的时间  格式为YYYY-MM-DD
    modifyTime: function (params) {
        return moment(params, "YYYY-MM-DD  hh:mm:ss").format("YYYY-MM-DD");
    },
    //   对文件进行处理
    handleFile: function (data) {
        data = data || [];
        var res = data.map((vaule, index) => {
            var empty = {};
            empty.name = vaule.name;
            if (vaule.projectDocumentId) {
                empty.projectDocumentId = vaule.projectDocumentId;
            } else {
                empty.projectDocumentId = "";
            }
            empty.isDelete = 0;
            return empty;
        })
        return res;
    },
    // 封装月日和 时间出来
    setTime: function (params) {
        params = params || [];
        params.forEach((vaule, index) => {
            //  绑定日期   *月*日
            vaule.month = vaule.createDate;
            // 处理表情
            vaule.replyList = vaule.replyList || [];
            vaule.replyList.map((replyItem, index) => {
                replyItem.replyDetail = decodeURIComponent(replyItem.replyDetail)
            })
        })
        return params;
    },
}