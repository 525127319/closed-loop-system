<template>
    <div>
        <ul class="list-view">
            <li>
                <div class="list-view-item" @click.stop="showChildOrgList(crewOrgInfo)">
                    <h3 v-text="crewOrgInfo.title"></h3>
                    <span class="icon " v-bind:class="{ 'icon-arrow-down': crewOrgInfo.isShowChildOrgList ,'icon-arrow-right': !crewOrgInfo.isShowChildOrgList }">
                    </span>
                </div>
                <orgUser v-show="crewOrgInfo.isShowChildOrgList" v-if="crewOrgInfo.userList.length > 0" v-bind:crewOrgUserList="crewOrgInfo.userList"
                    v-bind:parentOrgId="crewOrgInfo.orgId">
                </orgUser>
                <crewOrg v-show="crewOrgInfo.isShowChildOrgList" v-if="crewOrgInfo.childList" v-for="(childListItem,index) in crewOrgInfo.childList"
                    v-bind:crewOrgInfo="childListItem" v-bind:selectUserList="selectUserList" v-bind:WhitePeopleInfo="WhitePeopleInfo" :key="index">
                </crewOrg>
            </li>
        </ul>
    </div>
</template>

<script>
    // 子组织组件
    import crewOrg from './childOrg.vue'
    import orgUser from './orgUser.vue'
    export default {
        name: 'crewOrg',
        data() {
            return {
                crewData: [],
                isShowChildOrgList: false,
            }
        },
        mounted: function () {},
        methods: {
            // 获取组织下的用户数据
            showChildOrgList(orgInfo) {
                this.crewOrgInfo.isShowChildOrgList = !this.crewOrgInfo.isShowChildOrgList;
                if (!this.crewOrgInfo.isShowChildOrgList) return;
                const _this = this
                var data = {
                    orgId: orgInfo.orgId,
                    isWhitePeople: this.WhitePeopleInfo,
                }
                // 判断  是否是判断
                if (this.WhitePeopleInfo) {
                    this.$axiosHttp.axiosPost("ehr-profile/user/getUserByUserIds", data)
                        .then(response => {
                            var newData = processUserData(response.data.userList, JSON.parse(JSON.stringify(_this.selectUserList)))
                            orgInfo.userList = newData;
                        });
                }
            },
        },
        // 子组件绑定
        components: {
            crewOrg,
            orgUser
        },
        // 传值 crewOrgInfo当前组织信息，selectUserList选中的人
        props: ['crewOrgInfo', 'selectUserList', "WhitePeopleInfo"]
    }
    // 处理返回的用户数据
    function processUserData(userData, selectUserList) {
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