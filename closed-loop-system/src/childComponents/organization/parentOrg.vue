<template>

    <article>
        <header class="header">
            <span class="align-left" @click.stop="goback">取消</span>
            <h1>选择人员</h1>
            <span class="align-right" @click.stop="confirmUser">确认</span>

        </header>
        <div class="search show">
            <input type="text" placeholder="请输入名字或编号搜索" v-model="searchContent">
            <div class="icon icon-search" @click.stop="searchUser()"></div>
        </div>
        <ul class="tags users">
            <li v-for="(userItem,index) in selectUserList" :key="index" v-text="userItem.realName" @click.stop="removeUser(userItem)"></li>
        </ul>
        <section class="main-body">
            <div class="selected">
            </div>
            <ul class="list-view">
                <li v-for="(item,index) in crewData" :key="index">
                    <div class="list-view-item" @click.stop="showChildOrgList(item)">
                        <h3 v-text="item.title"></h3>
                        <span class="icon" v-bind:class="{ 'icon-arrow-down': item.isShowChildOrgList,'icon-arrow-right': !item.isShowChildOrgList }"></span>
                    </div>
                    <orgUser v-show="item.isShowChildOrgList" v-if="item.userList.length > 0" v-bind:crewOrgUserList="item.userList" v-bind:parentOrgId="item.orgId">
                    </orgUser>
                    <crewOrg v-show="item.isShowChildOrgList" v-for="(childListItem,index) in item.childList" v-bind:WhitePeopleInfo="isWhitePeople"
                        v-bind:crewOrgInfo="childListItem" v-bind:selectUserList="selectUserList" :key="index">
                    </crewOrg>
                </li>
            </ul>
        </section>
        <!--信息提提示框-->
        <promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
    </article>

</template>

<script>
    // 导入子组件
    import promptBox from '../promptBox.vue'
    import crewOrg from './childOrg.vue'
    import orgUser from './orgUser.vue'
    // 父组织架构组件
    export default {
        name: 'app',
        data() {
            return {
                crewData: [],
                selectUserList: [], //选中的用户
                searchContent: "",
                routeFromName: "", // 上一层路由
                // 保存提示信息
                promptMessage: [],
                // 是否是白名单
                isWhitePeople: ""
            }
        },
        // 在渲染该组件的获取对应路由
        beforeRouteEnter(to, from, next) {
            next(vm => {
                // next中通过 `vm` 访问组件实例
                vm.routeFromName = from.name;
            })
        },
        created: function () {
            // 获取传过来的用户
            this.getUserInfo(this.$route.params)
                .then(() => {
                    this.getCrew();
                })
                .catch(() => {

                });
            // 接受处理orgUser组件传递过来的用户数据
            this.$bus.$on("selectUser", (orgUserList) => {
                if (orgUserList.length > 0) {
                    orgUserList.forEach((uItem, index) => {
                        var resUser = this.selectUserList.find((fItem) => {
                            return fItem.userId == uItem.userId
                        });
                        if (resUser) {
                            resUser.isSelect = uItem.isSelect;
                        } else {
                            this.selectUserList.push(uItem);
                        }
                    });
                }
                this.selectUserList = this.selectUserList.filter((u) => {
                    return u.isSelect == true;
                });
            })
        },
        watch: {
            // 监听路由变化
            '$route': 'getUserInfo'
        },
        methods: {
            // 获取传过来的用户信息
            getUserInfo(userLists) {
                // this.isWhitePeople = this.$store.state.isWhitePeople
                this.isWhitePeople = true
                // 通知childOrg组件更新数据
                // this.$bus.$emit("isShowWhitePeople", this.isWhitePeople);
                var userList = []
                userList = userLists.participantslist
                if (userList.length > 0) {
                    const _this = this;
                    var newUserData = [];
                    userList.forEach((u, index) => {
                        newUserData.push(u.userId);
                    });
                    var data = {
                        userIds: newUserData
                    };
                    return this.$axiosHttp.axiosPost("ehr-profile/user/getUserByUserIds", data).then(response => {
                        _this.selectUserList = processUserData(response.data);
                    });
                } else {
                    return new Promise((resolve, reject) => {
                        resolve('');
                    });
                }
            },
            // 请求组织架构数据
            getCrew() {
                const _this = this
                if (this.isWhitePeople) {
                    this.$axiosHttp.axiosPost("ehr-profile/org/getOrgList").then(response => {
                        _this.crewData = response.data;

                    });
                }
            },
            // 返回
            goback() {
                this.$router.go(-1)
            },
            // 下拉列表展示
            showChildOrgList(item) {
                item.isShowChildOrgList = !item.isShowChildOrgList;
                if (!item.isShowChildOrgList) return;
                const _this = this
                var data = {
                    orgId: item.orgId,
                    isWhitePeople: this.isWhitePeople,
                }
                // 判断是否是白名单用户
                if (this.isWhitePeople) {
                    this.$axiosHttp.axiosPost("ehr-profile/user/getUserByUserIds", data)
                        .then(response => {
                            var newData = processUserDataNew(response.data.userList, JSON.parse(JSON.stringify(
                                _this.selectUserList)))
                            item.userList = newData;
                        });
                }
            },
            // 移除选中的用户
            removeUser(user) {
                if (user.userId == this.$store.state.userInfo.userId) {
                    this.promptMessage.push("你将不参与此事情!")
                }
                var index = this.selectUserList.findIndex((fItem) => {
                    return fItem.userId == user.userId
                });
                if (index > -1) {
                    user.isSelect == false;
                    this.selectUserList.splice(index, 1);
                    // 通知orgUser组件更新数据
                    this.$bus.$emit("parentRemoveUser", user);
                }
            },
            // 搜索用户
            searchUser() {
                const _this = this
                var data = {
                    condition: this.searchContent
                };
                if (this.searchContent.trim() != "") {
                    this.$axiosHttp.axiosPost("ehr-profile/org/getOrganizationAndUserInfo", data).then(response => {
                        var orgList = response.data.orgList;
                        var userList = response.data.userList;
                        _this.crewData = processSearchData(orgList, userList, _this.selectUserList);
                    }).then(function () {

                    });
                } else if (this.isWhitePeople) {
                    this.$axiosHttp.axiosGet("ehr-profile/org/getOrgList").then(response => {
                        _this.crewData = response.data;
                    });
                }
            },
            // 清空搜索内容
            cleanContent() {
                this.searchContent = "";
            },
            // 选人确认
            confirmUser() {
                this.promptMessage = []
                if (this.selectUserList.length == 0) {
                    this.promptMessage.push("请选择人员")
                    return;
                }
                if (this.routeFromName != null) {
                    this.$router.push({
                        name: this.routeFromName,
                        params: {
                            selectUserList: this.selectUserList
                        }
                    });
                }
            }
        },
        components: {
            crewOrg: crewOrg,
            promptBox: promptBox,
            orgUser
        },
    }

    // 处理搜索返回的数据
    function processSearchData(orgList, userList, selectUserList) {
        if (!orgList) return [];
        var newOrgData = [];
        var newUserData = [];
        userList.forEach((user, index) => {
            // 判断该用户是否选中
            var isSelectUser = selectUserList.filter((selectUser) => selectUser.userId == user.userId);
            if (isSelectUser.length > 0) {
                user.isSelect = true;
            } else {
                user.isSelect = false;
            }
            newUserData.push(user);
        });
        orgList.forEach((parentOrg, index) => {
            if (parentOrg.childList) {
                parentOrg.childList = addUserListToOrgList(parentOrg.childList, newUserData);
            } else {
                var orgUserList = newUserData.filter((user) => user.orgId == parentOrg.orgId);
                if (orgUserList.length > 0) {
                    // 将用户添加至对应的组织当中
                    parentOrg.userList = orgUserList;
                }
            }
            newOrgData.push(parentOrg);
        });
        return newOrgData;
    }
    // 添加用户至组织(递归调用)
    function addUserListToOrgList(childOrgList, userList) {
        if ((childOrgList && childOrgList.length == 0) && (userList && userList.length == 0)) return [];
        var newChildOrgList = [];
        childOrgList.forEach((org, index) => {
            var orgUserList = userList.filter((user) => user.orgId == org.orgId);
            if (orgUserList.length > 0) {
                // 将用户添加至对应的组织当中
                org.userList = orgUserList;
            }
            // 如果存在子组织，继续递归调用
            if (org.childList) {
                org.childList = addUserListToOrgList(org.childList, userList);
            }
            newChildOrgList.push(org);
        });
        return newChildOrgList;
    }
    // 处理返回的用户数据
    function processUserData(userData) {
        if (!userData) return [];
        var newUserData = [];
        userData.forEach((user, index) => {
            user.isSelect = true;
            newUserData.push(user);
        });
        return newUserData;
    }
    // 处理返回的用户数据
    function processUserDataNew(userData, selectUserList) {
        if (!userData) return [];
        var newUserData = [];
        userData.forEach((user, index) => {
            // 判断该用户是否选中
            var isSelectUser = selectUserList.filter((selectUser) => selectUser.userId == user.userId);
            if (isSelectUser.length > 0) {
                user.isSelect = true;
            } else {
                user.isSelect = false;
            }
            newUserData.push(user);
        });
        return newUserData;
    }

</script>
