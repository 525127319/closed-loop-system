<template>
	<article>
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
			<h1>本事情的参与人</h1>
			<!--<span class="align-right">新增</span>-->
		</header>
		<section class="main-body">
			<ul class="list-view team-member">
				<li class="list-view-item " v-for="(item,index) in ParticipantList" :key="index" v-bind:class="{'pm':item.isPM,'selected':item.isSelected}"
				    v-on:click="select(item,index)">
					<span class="index" v-text="index+1">  </span>
					<div class="media">
						<img :src="item.headPortrait" alt="">
					</div>
					<div class="flex-item">
						<h3 v-text="item.userName"></h3>
						<p v-text="item.loginName"></p>
					</div>
				</li>
			</ul>
		</section>
	</article>
</template>
<script>
	export default {
		name: 'app',
		data() {
			return {
				// 参与人
				ParticipantList: [],
				// 选中的人
				selectedManList: [],
			}
		},
		created: function () {
			this.getFindAllTeamMan()
		},
		methods: {
			// 获取名单
			getFindAllTeamMan() {
				const data = {};
				//this.$store.state.projectHeadInfo   vuex 保存了事情id
				data.projectId = this.$store.state.projectHeadInfo.projectId

				this.$axiosHttp.axiosPost("work-xproject/project/findAllTeamMan.do", data).then(response => {
					if (response.code == 200) {
						this.ParticipantList = response.data;
					}
				}, this);
			},
			// 
			select(resitem, resindex) {

				//  查看个人热度
				if (this.$route.params.sign) {
					// 选中@的人
					// 判断是否重复
					let isRepeat = this.$store.state.selectedList.find(item => {
						return item.userId == resitem.userId
					})
					if (!isRepeat) {
						this.$store.state.selectedList.push(resitem);
						this.$store.commit('GET_selectedList_DATA', this.$store.state.selectedList);
					}
					this.$store.commit('GET_selectedMan_DATA', resitem);
					this.$router.go(-1);
				} else {
					// 跳转
					this.$store.commit('SET_userStatistics_Info', resitem);
					this.$router.push({
						name: "userChart",
					})
				}
			},
			goback() {
				this.$store.commit('GET_selectedMan_DATA', {});
				// this.$router.go(-1);

				this.$router.replace("/projectDetails");
			},
		},
	}
</script>