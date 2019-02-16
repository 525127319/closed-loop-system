<template>
	<div>
		<article>
			<header class="header">
				<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
				<h1>结束里程碑</h1>
				<span class="align-right" v-on:click.stop="confirmEnd()">确认结束</span>
			</header>
			<section class="main-body">
				<div class="form">
					<div class="form-item vertical ">
						<div class="input">
							<textarea placeholder="输入项目的最新反馈..." v-model="projectStageEndInfo.dynamicDetail"></textarea>
						</div>
					</div>
					<!--标签视口-->
					<!--<getlabel @upTag="changeTag" v-bind:myMessage="projectStageEndInfo.tagList"></getlabel>-->
				</div>
				<!--信息提提示框-->
				<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
			</section>
		</article>
	</div>
</template>
<script>
	/**
	 * getlabel 标签组件
	 * promptBox 提示框
	 * */
	// import getlabel from '../childComponents/label.vue'
	import promptBox from "../childComponents/promptBox.vue"

	export default {
		name: 'app',
		data() {
			return {
				// 数据
				projectStageEndInfo: {
					projectStageId: "",
					dynamicDetail: "",
					// tagList: [],
				},
				// 保存提示信息
				promptMessage: [],
				// 小目标名字
				// todolistName: ""
			}
		},
		created: function () {
			// 获取详情页传过来的信息
			this.getProjectStageEnd();
		},
		methods: {
			// 获取详情页传过来的数据
			getProjectStageEnd() {
				// 保存详情页传过来的数据 里程碑Id
				this.projectStageEndInfo.projectStageId = this.$route.params.projectStageId;
			},
			// 获取子组件传过来的标签信息
			changeTag(tag) {
				this.projectStageEndInfo.tagList = tag;
			},
			// 返回
			goback() {
				this.$router.replace("/projectDetails");
			},
			//   确认 结束
			confirmEnd(resStageId) {
				this.promptMessage = [];
				if (this.projectStageEndInfo.dynamicDetail && this.projectStageEndInfo.dynamicDetail.length > 300) {
					this.promptMessage.push("描述内容不能超过300字");
					return;
				} else {
					var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
					if (this.projectStageEndInfo.dynamicDetail.match(regRule)) {
						this.promptMessage.push("不支持输入表情");
						return;
					}
				}
				const _this = this;
				// 深拷贝
				const data = JSON.parse(JSON.stringify(this.projectStageEndInfo));
				// 如果为空 就赋值个默认内容
				data.dynamicDetail = this.projectStageEndInfo.dynamicDetail || "结束了里程碑";
				this.$axiosHttp.axiosPost("work-xproject/projectStage/finishStage.do", data).then(response => {
					if (response.code == 200) {
						_this.promptMessage.push("里程碑结束成功 ");
						// 跳转到详情页
						setTimeout(function () {
							_this.$router.replace("/projectDetails");
						}, 1200)
					} else if (response.code == 610) {
						_this.promptMessage.push("该里程碑已被操作,请重新确认");
					}
				});
			},
		},
		// 定义子组件
		components: {
			// getlabel: getlabel,
			promptBox: promptBox
		}
	}
</script>