<template>
	<article>
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
			<h1>交付文件</h1>
			<!--<span class="align-right">新增</span>-->
		</header>
		<section class="main-body">
			<ul class="list-view file-list">
				<li class="list-view-item" v-for="(item,index) in  projectFileInfoUpload" :key="index">
					<span class="icon icon-file"></span>
					<div class="flex-item">
						<h3 class="color-b" v-text="item.documentName"></h3>
						<p>
							<span v-text="item.uploadUserName"></span>
							<span v-text="item.createDate"></span> 上传
						</p>
					</div>
				</li>
				<li class="list-view-item" v-for="(item,index) in  projectFileInfoIsUpload" :key="index">
					<span class="icon icon-file has-border"></span>
					<div class="flex-item">
						<h3 v-text="item.documentName"></h3>
						<p>未上传</p>
					</div>
				</li>
			</ul>
		</section>
		<!--信息提示框-->
		<!--<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>-->
		<!--网络提示-->
		<div class="system-msg nodata" v-bind:class="{ 'show':promptMessage.length }">
			<div class="msg ">
				此里程碑没有交付文件
			</div>
		</div>
	</article>

</template>
<script>
	/**
	 * promptBox  提示框
	 * */
	// import promptBox from "../childComponents/promptBox.vue"

	export default {
		name: 'app',
		data() {
			return {
				// 文件信息
				projectFileInfo: [],
				// 有文件
				projectFileInfoUpload: [],
				// 没文件
				projectFileInfoIsUpload: [],
				// 提示信息
				promptMessage: []
			}
		},
		created: function () {
			this.getFileMessage();
		},
		methods: {
			// 获取传过来的请求文件信息
			getFileMessage() {
				this.promptMessage = []

				const _this = this;
				const data = this.$route.params.projectFileMessage;
				//   发送请求
				this.$axiosHttp.axiosPost("work-xproject/projectDocument/findDocument.do", data).then(response => {
					if (response.code == 603) {
						_this.promptMessage.push("该里程碑还没有上传文件");
					} else if (response.code == 200) {
						response.data.forEach((value, index) => {
							if (value.isUpload == 0) {
								_this.projectFileInfoIsUpload.push(value);
							} else if (value.isUpload == 1) {
								_this.projectFileInfoUpload.push(value);
							}
						})
					}
				});
			},
			// 返回上一页
			goback() {

				this.$router.replace("/projectDetails");
			},
		},
		// components: {
		// 	promptBox
		// }
	}
</script>