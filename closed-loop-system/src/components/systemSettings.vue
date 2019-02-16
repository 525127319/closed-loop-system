<template>
	<article>
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
			<h1>推送设置</h1>
			<span class="align-right" v-on:click="save">保存</span>
		</header>
		<section class="main-body">
			<div class="form-grid">
				<div class="form-sub-title">
					<span class="field">事情</span>
					<span class="field">里程碑</span>
					<span class="field">动态</span>
					<span class="field">回复</span>
				</div>
				<div class="form-grid-item" v-for="(item,index) in pushList" :key="index">
					<div class="label" v-text="'事情名:'+item.projectName"></div>
					<div class="input">
						<input type="checkbox" v-on:click='item.notificationProject==1?item.notificationProject=0:item.notificationProject=1' v-bind:checked="item.notificationProject"
						    :id="'project1'+index" />
						<label :for="'project1'+index"></label>
						<input type="checkbox" v-on:click='item.notificationStage==1?item.notificationStage=0:item.notificationStage=1' v-bind:checked="item.notificationStage"
						    :id="'stage1'+index" />
						<label :for="'stage1'+index"></label>
						<input type="checkbox" v-on:click='item.notificationDynamic==1?item.notificationDynamic=0:item.notificationDynamic=1' v-bind:checked="item.notificationDynamic"
						    :id="'event1'+index" />
						<label :for="'event1'+index"></label>
						<input type="checkbox" v-on:click='item.notificationReply==1?item.notificationReply=0:item.notificationReply=1' v-bind:checked="item.notificationReply"
						    :id="'reply1'+index" />
						<label :for="'reply1'+index"></label>
					</div>
				</div>
			</div>
		</section>

		<!--信息提提示框-->
		<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
	</article>
</template>
<script>
	import promptBox from "../childComponents/promptBox.vue"
	export default {
		name: 'app',
		data() {
			return {
				// 推送数据
				pushList: [],
				// 提示信息
				promptMessage: [],
			}
		},
		created: function () {
			//  获取推送
			this.getSystem()
		},
		methods: {
			//  获取推送
			getSystem() {
				const _this = this
				this.$axiosHttp.axiosPost("work-xproject/projectNotification/findAllNotification.do").then(response => {
					// 判断返回信息
					if (response.code == 200) {
						_this.pushList = response.data;
					} else {
						_this.promptMessage.push("获取推送状态失败");
					}
				})
			},

			// 保存
			save() {
				const _this = this;
				const data = {
					"pushList": this.pushList
				};
				this.$axiosHttp.axiosPost("work-xproject/projectNotification/updateNotification.do", data).then(
					response => {
						// 判断返回信息
						if (response.code == 200) {
							_this.promptMessage.push("推送设置成功 ");
							//     跳转到列表页
							setTimeout(function () {
								_this.$router.replace("/ProjectList");
							}, 1200)
						} else {
							_this.promptMessage.push("推送状态设置失败");
						}
					})
			},
			// 返回上一页 列表页
			goback() {
				this.$router.replace("/projectList");
			},
		},
		// 定义子组件
		components: {
			promptBox: promptBox,
		},
	}
</script>