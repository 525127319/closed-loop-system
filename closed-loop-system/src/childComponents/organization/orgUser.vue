<template>

	<ul class="list-view">
		<li v-for="(item,index) in crewOrgUserList" :key="index" v-on:click.stop="selectUser($event,item)">
			<div class="list-view-item user">
				<span class="icon icon-user"></span>
				<div class="flex-item" v-bind:class="{ 'color-g': isShowChildOrgList}" v-text="item.realName"></div>
				<span class="icon" v-bind:class="{ 'icon-checkbox': !item.isSelect,'icon-checkbox-checked': item.isSelect}"></span>
			</div>
		</li>
	</ul>

</template>
<script>
	//  组织架构人员组件 
	export default {
		name: 'crewOrgUser',
		data:function() {
			return {
				director: "",
				isShowChildOrgList: "",
				selectUserList:[], //选中的用户
				orgId:"", // 组织id，用来标识本组件隶属于哪个组织，为处理数据时能够精确查找，提高效率
			}
		},
		created: function () {
			// 处理移除人员的通知
			this.$bus.$on("parentRemoveUser", (removeUser) => {
				if(removeUser.orgId == this.orgId) {
					var delIndex = this.selectUserList.findIndex((fItem) =>{
						return fItem.userId == removeUser.userId
					});
					if(delIndex > -1){
						this.selectUserList.splice(delIndex,1);
						var crewOrgUser = this.crewOrgUserList.find((fItem) =>{
							return fItem.userId == removeUser.userId
						});
						if(crewOrgUser){
							crewOrgUser.isSelect = false;
						}
					}
				}
			})
			// 获取父组件传过来的选中的人员信息
			this.selectUserList = this.crewOrgUserList.filter((u) =>{
				return u.isSelect == true;
			});
		},
		mounted: function () {
			this.orgId = this.parentOrgId;
		},
		methods: {
			// 选择用户
			selectUser($event, selectUserInfo) {
				$event.stopPropagation();
				var resUser = this.selectUserList.find((fItem) =>{
					return fItem.userId == selectUserInfo.userId
				});
				if(resUser){
					resUser.isSelect = false;
					selectUserInfo.isSelect = false;
				}
				else{
					selectUserInfo.isSelect = true;
					this.selectUserList.push(selectUserInfo);
				}
				// 通知parentOrg更新数据
				this.$bus.$emit("selectUser", this.selectUserList);
				// 整理数据，只取出选中的人员
				this.selectUserList = this.selectUserList.filter((u) => {
					return u.isSelect == true;
				});
			}
		},
		props: ['crewOrgUserList','parentOrgId'],
	}
</script>