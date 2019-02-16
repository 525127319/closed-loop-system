<template>
	<article>
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
			<h1>评论排行榜</h1>
			<span class="align-right" v-on:click="goProjectDetails">事情</span>

		</header>
		<section class="main">
			<ul class="list-view team-member">

				<li class="list-view-item" v-for="(item,index) in replyList" :key="index">
					<span class="index" v-text="index+1">  </span>
					<div class="media">
						<img :src="item.headPortrait" alt="">
					</div>
					<div class="flex-item">
						<h3 v-text="item.reply_user_name"></h3>
					</div>
					<span class="count" v-text="item.replySum"> </span>
				</li>
				<!--<li class="list-view-item">
					<div class="media">
						1
					</div>
					<div class="flex-item">
						<h3>张三</h3>
					</div>
					<progress max="100" value="50"></progress>
				</li>-->
			</ul>

		</section>

	</article>
</template>


<script>
	export default {
		data() {
			return {
				// 回复信息
				replyList: []

			}
		},
		created: function () {
			this.goCommentChart()
		},
		methods: {
			// 获取评论排行榜信息
			goCommentChart() {
				const _this = this;
				this.$axiosHttp.axiosPost("work-xproject/ranking/findReplyRankingList.do").then(response => {
					if (response.code = 200) {
						_this.replyList = response.data;
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
			}
		},
	}
</script>