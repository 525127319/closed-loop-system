<template>
    <div>
        <article>
            <header class="header">
                <span class="align-left icon icon-arrow-left" v-on:click.stop="goback"></span>
                <h1>开启事情</h1>
                <span class="align-right" v-on:click.stop="save">保存</span>
            </header>
            <section class="main-body">
                <div class="form">
                    <div class="form-item ">
                        <div class="label">主题</div>
                        <div class="input ">
                            <input type="text" placeholder="事情的主题" v-model="projectInfo.projectName">
                        </div>
                        <p class="alert-message " v-text="errorMsgInfo.projectNameMsg" v-show="!projectInfo.projectName" v-bind:class="{'show':errorMsgInfo.projectNameMsg}"></p>
                    </div>

                    <div class="form-item code">
                        <div class="label">代号</div>
                        <div class="input">
                            <input type="text" placeholder="事情的代号" v-model="projectInfo.projectCode">
                        </div>
                        <!--<p class="alert-message " v-text="errorMsgInfo.projectCodeMsg" v-show="!projectInfo.projectCode" v-bind:class="{'show':errorMsgInfo.projectCodeMsg}"></p>-->
                    </div>

                    <div class=" form-item vertical">
                        <div class="input">
                            <textarea placeholder="事情的背景描述" v-model="projectInfo.projectDesc" v-on:input="inputFunc(projectInfo.projectDesc)"></textarea>
                        </div>
                    </div>
                    <div class="form-item" v-on:click.stop="cacheProjectAddMessage">
                        <div class="label">参与人</div>
                        <div class="input">
                            <span v-text="pmUserValue"></span>
                        </div>
                        <span class="icon icon-arrow-right"></span>
                        <p class="alert-message " v-text="errorMsgInfo.memberListMsg" v-show="projectInfo.memberList.length<1" v-bind:class="{'show':errorMsgInfo.memberListMsg}"></p>
                    </div>

                    <div class="form-item">
                        <div class="label">负责人</div>
                        <div class="input">
                            <select v-model="projectInfo.pmName">
                            <option v-for="(option,index) in projectInfo.memberList" v-bind:value="option.memberName" v-text="option.memberName" :key="index">
                            </option>
                            </select>
                        </div>
                        <p class="alert-message " v-text="errorMsgInfo.ManagerMsg" v-show="!projectInfo.pmName" v-bind:class="{'show':errorMsgInfo.ManagerMsg}"></p>
                    </div>
                    <!--标签视口-->
                    <getlabel @upTag="changeTag" v-bind:myMessage="projectInfo.tagList"></getlabel>
                    <!--信息提提示框-->
                    <promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
                </div>
            </section>
        </article>
    </div>
</template>
<script>
    /**导入子组件
     *own 自己封装的js方法
     *getlabel  标签子组件
     *promptBox 提示框子组件
     **/
    import getlabel from '../childComponents/label.vue'
    import promptBox from "../childComponents/promptBox.vue"
    import own from '../common/ownPackage.js'


    export default {
        name: 'app',
        data() {
            return {
                projectInfo: {
                    projectName: "",
                    projectCode: "",
                    projectDesc: "",
                    memberList: [],
                    tagList: [],
                    //  经理人id
                    pmId: "",
                    pmName: ""
                },
                // 错误提示信息
                errorMsgInfo: {
                    projectNameMsg: "",
                    // projectCodeMsg: "",
                    memberListMsg: "",
                    ManagerMsg: "",
                },
                // 提示信息
                promptMessage: [],
                // 项目参与人的信息
                participantslist: [],
                // 经理人名字显示字段
                pmUserValue: "",
                //  经理人
                Manager: [],
            }
        },
        created: function () {
            // 获取缓存
            this.gainProjectAddMessage();
            // 获取参与人
            this.getPmUserMessage();
        },
        methods: {
            // 获取传过来的参与人信息
            getPmUserMessage() {
                this.promptMessage = [];
                if (this.$route.params.selectUserList) {
                    // 绑定经理人
                    this.projectInfo.memberList = own.handle(this.$route.params.selectUserList);
                    this.pmUserValue = own.getPmUsername(this.$route.params.selectUserList);
                    this.participantslist = this.$route.params.selectUserList;
                    //  负责人为空时 默认选第一个
                    var istrue = this.projectInfo.memberList.find(value => {
                        return value.memberName == this.projectInfo.pmName;
                    })
                    if (!this.projectInfo.pmName || !istrue) {
                        this.projectInfo.pmName = this.projectInfo.memberList[0].memberName
                    }
                } else {
                    this.participantslist = this.projectInfo.memberList;
                }
            },

            // 获取子组件传过来的标签信息
            changeTag(tag) {
                this.projectInfo.tagList = tag;
            },

            // 返回上一页
            goback() {
                this.$router.replace("/projectList");
                //点击保存删除本地缓存
                sessionStorage.removeItem('projectAddMessage');
            },
            // 输入判断事件
            inputFunc(resString) {
                if (resString.length > 500) {
                    this.promptMessage.push("反馈信息已超过限制500字数");
                }
            },
            // 保存
            save() {
                const _this = this;
                // 初始化
                this.errorMsgInfo = {};
                this.promptMessage = [];
                //  选中经理人数据
                this.Manager = this.projectInfo.memberList.filter(value => {
                    return value.memberName == this.projectInfo.pmName;
                })
                if (this.Manager.length > 0) {
                    this.projectInfo.pmId = this.Manager[0].memberId;
                }
                // 去掉首尾的空格
                this.projectInfo.projectName = this.projectInfo.projectName.replace(/(^\s*)|(\s*$)/g, "");
            
                // 判断数据
                if (!this.projectInfo.projectName) {
                    this.errorMsgInfo.projectNameMsg = "请输入事情名称";
                } else {
                    var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
                    if (this.projectInfo.projectName.match(regRule)) {
                        this.promptMessage.push("不支持输入表情");
                        return;
                    }
                }

                if (this.projectInfo.projectDesc && this.projectInfo.projectDesc.length > 500) {
                    this.promptMessage.push("描述内容不能超过500字");
                    return;
                } else {
                    var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
                    if (this.projectInfo.projectDesc.match(regRule)) {
                        this.promptMessage.push("不支持输入表情");
                        return;
                    }
                }

                if (this.projectInfo.memberList.length == 0) {
                    this.errorMsgInfo.memberListMsg = "请选择项目参与人";
                }
                if (this.Manager.length == 0) {
                    this.errorMsgInfo.ManagerMsg = "请选择负责人";
                }
                // 深拷贝
                this.projectInfos = JSON.parse(JSON.stringify(this.projectInfo));
                this.projectInfos.projectDesc = this.projectInfos.projectDesc.replace(/\n/g, "<br>");
                //  绑定数据
                const data = this.projectInfos;
                // 判断输入信息  为空发送请求

                if (JSON.stringify(this.errorMsgInfo) == "{}") {
                    this.$axiosHttp.axiosPost("work-xproject/project/insertXProject.do", data).then(response => {
                        // 判断返回信息
                        if (response.code == 200) {
                            _this.promptMessage.push("新建事情保存成功 ");
                            // 删除本地缓存
                            sessionStorage.removeItem('projectAddMessage');
                            //     跳转到列表页
                            setTimeout(function () {
                                _this.$router.replace("/projectList");
                            }, 1200)
                        } else if (response.code == 400) {
                            _this.promptMessage.push("事情参数不合法");
                        } else if (response.code == 902) {
                            _this.promptMessage.push("标签不合法");
                        } else if (response.code == 904) {
                            _this.promptMessage.push("事情参与人保存失败");
                        } else if (response.code == 908) {
                            _this.promptMessage.push("事情名已经存在");
                        } else if (response.code == 909) {
                            _this.promptMessage.push("事情代号已经存在");
                        } else if (response.code == 913) {
                            _this.promptMessage.push("事情主题过长");
                        } else {
                            _this.promptMessage.push("事情保存失败");
                        }
                    });
                }
            },
            // 跳转的组织结构 设置缓存 
            cacheProjectAddMessage() {
                sessionStorage.setItem("projectAddMessage", JSON.stringify(this.projectInfo));
                // 处理数据格式 将用户添加默认选中
                if (this.participantslist.length == 0) {
                    this.participantslist.push(this.$store.state.userInfo)
                }
                this.participantslist = own.handSelectUser(this.participantslist);

                // 并跳转及传值
                this.$router.push({
                    name: 'organization',
                    params: {
                        participantslist: this.participantslist,
                    }
                });
            },
            // 获取缓存
            gainProjectAddMessage() {
                const getString = sessionStorage.getItem("projectAddMessage");
                if (getString) {
                    this.projectInfo = JSON.parse(getString);
                    this.pmUserValue = own.getPmUsername(JSON.parse(getString).memberList);
                }
            },
        },
        // 定义子组件
        components: {
            getlabel: getlabel,
            promptBox: promptBox,
        },
    }
</script>