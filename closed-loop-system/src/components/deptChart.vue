<template>
	<article>
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
			<h1 v-text="title"></h1>
			<span class="align-right" v-on:click="goProjectDetails">事情</span>

		</header>
		<section class="main-body">
			<ul class="list-view team-member">
				<li class="list-view-item" v-for="(item,index) in departmentList" :key="index" v-on:click="see(item)">
					<span class="index" v-text="index+1">  </span>
					<div class="media">
						<img :src="item.headPortrait" alt="">
					</div>
					<div class="flex-item">
						<h3 v-text="item.realName"></h3>
					</div>
					<span class="count" v-text="item.projectSum"> </span>

				</li>
			</ul>

		</section>

	</article>
</template>


<script>
	export default {
		data() {
			return {
				// 信息
				departmentList: [],
				// 头部内容   显示所属部门
				title: ""
			}
		},
		created: function () {
			this.getdeptCharts()
		},
		methods: {
			// 获取排行榜信息
			getdeptCharts() {
				const _this = this;
				// 获取
				this.title = this.$route.params.title;
				const data = {};
				data.orgId = this.$route.params.orgId;
				this.$axiosHttp.axiosPost("work-xproject/ranking/findDepartmentUserInfo.do", data).then(response => {
					if (response.code = 200) {
						_this.departmentList = response.data;
					} else {

					}
				});

			},
			// 返回上一页
			goback() {
				this.$router.go(-1);
			},
			//返回事情详情
			goProjectDetails() {
				this.$router.push({
					name: "projectDetails",
				})
			},
			// 点击查看
			see(resData) {
				// 跳转
				this.$store.commit('SET_userStatistics_Info', resData);
				this.$router.push({
					name: "userChart",
				})
			}
		},
	}
</script>