<template>
	<div>
		<article>
			<header class="header">
				<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
				<h1>新增里程碑</h1>
				<span class="align-right" v-on:click="save">保存</span>
			</header>
			<section class="main-body">
				<div class="project-info">
					<h2 v-text="projectMessage.projectName"></h2>
					<p v-text="projectMessage.projectCode"></p>
				</div>
				<div class="form">
					<!--里程碑目标视口-->
					<milepostTarget v-on:upBigTarget="changeBigTarget" v-on:upTarget="changeTarget" v-bind:myMessageTarget="errorMsgInfo.projectStageNameMsg"
					    v-bind:setTarget="newStageInfo.projectStageName" v-bind:setSmallTargetList="newStageInfo.todoList">
					</milepostTarget>
					<div class="form-item">
						<div class="label">预计完成日期</div>
						<div class="input">
							<input type="date" v-model="newStageInfo.estimatedDate">
						</div>
					</div>
					<!--交互文件视口-->
					<setfile @upFile="changeFile" v-bind:myFile="newStageInfo.documentList"></setfile>
					<!--标签视口-->
					<getlabel @upTag="changeTag" v-bind:myMessage="newStageInfo.tagList"></getlabel>
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
	 * getlabel 标签子组件
	 *promptBox  提示框
	 *setfile  文件子组件
	 *milepostTarget 里程碑子组件
	 **/
	import getlabel from '../childComponents/label.vue'
	import setfile from '../childComponents/fileSystem.vue'
	import promptBox from "../childComponents/promptBox.vue"
	import milepostTarget from "../childComponents/milepostTarget.vue"
	import own from '../common/ownPackage.js'

	export default {
		name: 'app',
		data() {
			return {
				// 数据绑定
				newStageInfo: {
					projectId: "",
					estimatedDate: "",
					projectStageName: "",
					tagList: [],
					documentList: [],
					todoList: []
				},
				// 错误提示信息
				errorMsgInfo: {
					projectStageNameMsg: "",
				},
				// 获取详情页传的 事情名称
				projectMessage: {
					projectId: "",
					projectName: "",
				},
				// 提示信息
				promptMessage: [],
				// 是否正在保存
				isSave: false,

			}
		},
		created: function () {
			// 获取详情页传递过来的信息
			this.getProjectName();
		},
		mounted: function () {
			// 获取当前时间  显示为默认
			if (!this.newStageInfo.estimatedDate) {
				this.newStageInfo.estimatedDate = own.nowTimes;
			}
		},
		methods: {
			// 返回上一级
			goback() {
				this.$router.replace("/projectDetails");
				// 绑定白名单数据
				this.$store.commit('SOME_newStageInfo_List', this.newStageInfo);
			},
			// 获取子组件传过来的标签信息
			changeTag(tag) {
				this.newStageInfo.tagList = tag;
			},
			// 获取子组件传过来的文件信息
			changeFile(file) {
				this.newStageInfo.documentList = own.handleFile(file);
			},
			// 获取子组件传过来的里程碑小目标信息列表
			changeTarget(resSmalltargetList) {
				this.newStageInfo.todoList = resSmalltargetList
			},
			// 获取子组件传过来的里程碑总目标信息
			changeBigTarget(resTarget) {
				this.newStageInfo.projectStageName = resTarget
			},

			// 获取详情页传过来的信息
			getProjectName() {
				if (this.$route.params.getProjectInfo) {
					this.projectMessage = this.$route.params.getProjectInfo;
				}
				// 注入ID
				this.newStageInfo.projectId = this.projectMessage.projectId;
				if (this.$store.state.newStageInfo.projectStageName) {
					this.newStageInfo = this.$store.state.newStageInfo
				}

			},

			// 点击保存
			save() {
				// 判断
				if (this.isSave) return;
				// 赋值
				this.isSave = true;

				const _this = this
				// 初始化
				this.promptMessage = []
				this.errorMsgInfo = {}
				// 判断数据
				if (!this.newStageInfo.projectStageName) {
					_this.errorMsgInfo.projectStageNameMsg = "请输入里程碑目标";
					// 还原判断
					this.isSave = false;
				} else {
					var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
					if (this.newStageInfo.projectStageName.match(regRule)) {
						this.promptMessage.push("不支持输入表情");
						this.isSave = false;
						return;
					}
				}
				const data = this.newStageInfo;
				//判断发送请求
				if (JSON.stringify(this.errorMsgInfo) == "{}") {
					// 发送请求
					this.$axiosHttp.axiosPost("work-xproject/projectStage/insertStage.do", data).then(response => {
						if (response.code == 200) {
							_this.promptMessage.push("里程碑保存成功 ");
							// 还原
							_this.$store.commit('SOME_newStageInfo_List', []);
							//     跳转到详情页
							setTimeout(function () {
								_this.$router.replace("/projectDetails");
								_this.isSave = false;
							}, 1200)
						} else if (response.code == 600) {
							_this.promptMessage.push("里程碑参数不合法");
							_this.isSave = false;
						} else if (response.code == 902) {
							_this.promptMessage.push("标签不合法");
							_this.isSave = false;
						} else if (response.code == 903) {
							_this.promptMessage.push("文件不合法");
							_this.isSave = false;
						} else if (response.code == 604) {
							_this.promptMessage.push("不能选择以前的时间");
							_this.isSave = false;
						} else if (response.code == 608) {
							_this.promptMessage.push("已有进行中的里程碑");
							_this.isSave = false;
						} else if (response.code == 609) {
							_this.promptMessage.push("里程碑名字太长");
							_this.isSave = false;
						} else if (response.code == 915) {
							_this.promptMessage.push("该事情已经结束");
							_this.isSave = false;
						} else if (response.code == 912) {
							_this.promptMessage.push("不存在的事情");
							_this.isSave = false;
						} else if (response.code == 400) {
							_this.promptMessage.push("参数不合法");
							_this.isSave = false;
						} else {
							_this.promptMessage.push("里程碑保存失败");
							_this.isSave = false;
						}
					});
				}
			},

		},
		// 定义子组件
		components: {
			getlabel: getlabel,
			setfile: setfile,
			promptBox: promptBox,
			milepostTarget: milepostTarget
		}
	}
</script>