<template>
	<div>
		<article>
			<header class="header">
				<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
				<h1>修改里程碑</h1>
				<span class="align-right" v-on:click="save">保存</span>
			</header>
			<section class="main-body">
				<div class="project-info">
					<h2 v-text="projectInfo.projectName"></h2>
					<!--<p v-text="projectInfo.projectCode"></p>-->
				</div>
				<div class="form">
					<!--里程碑目标视口-->
					<milepostTarget v-on:upBigTarget="changeBigTarget" v-on:upTarget="changeTarget" v-on:upDeleteTarget="deleteTarget" v-bind:setTarget="newStageInfo.projectStageName"
					    v-bind:setSmallTargetList="newStageInfo.todoList" v-bind:myMessageTarget="errorMsgInfo.projectStageNameMsg">
					</milepostTarget>
					<div class="form-item">
						<div class="label">预计完成日期</div>
						<div class="input has-icon">
							<input type="date" v-model="newStageInfo.estimatedDate">
						</div>
					</div>
					<!--交互文件视口-->
					<setfile @upFile="changeFile" @upRemoveFile="removeFile" v-bind:myFile="newStageInfo.documentList"></setfile>
					<!--标签视口-->
					<getlabel @upTag="changeTag" v-bind:myMessage="newStageInfo.tagList" v-bind:isHaveTagListAll="newStageInfo.listTagAll"></getlabel>
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
				// 请求回来的信息 进行绑定
				newStageInfo: {
					projectStageId: "",
					projectName: "",
					estimatedDate: "",
					projectStageName: "",
					tagList: [],
					documentList: [],
					listTagAll: [],
					todoList: [],
					lastStageUpdate: ""
				},
				// 里程碑成员
				memberValue: "",
				//  保存删除的文件信息
				removeFileInfo: [],
				//  保存删除的目标信息
				removeTargetInfo: [],
				// 事情的数据
				projectInfo: {},
				// 错误提示信息
				errorMsgInfo: {
					projectStageNameMsg: "",
				},
				// 获取的里程碑成员信息
				memberInfo: [],
				// 提示信息
				promptMessage: [],

			}
		},
		created: function () {
			// 获取来事情里程碑Id并请求数据
			this.getProjectStageInfo()
			// 获取阶事情名和代号
			this.getProjectName()
		},

		methods: {
			// 获取来事情里程碑Id并请求数据
			getProjectStageInfo() {
				// 获取里程碑id
				this.newStageInfo.projectStageId = this.$route.params.projectEditorStageId
				// 发送请求
				const data = {}
				data.projectStageId = this.$route.params.projectEditorStageId
				const _this = this
				// 发送请求
				this.$axiosHttp.axiosPost("work-xproject/projectStage/findOneStage.do", data).then(response => {
					if (response.code = 200) {
						_this.newStageInfo = response.data
						// 修改时间格式
						_this.newStageInfo.estimatedDate = own.modifyTime(_this.newStageInfo.estimatedDate)
					}
				});
			},
			// 获取阶事情名和代号
			getProjectName() {
				if (this.$route.params.getProjectInfo) {
					this.projectInfo = this.$route.params.getProjectInfo
				}
			},
			// 返回上一级
			goback() {
				this.$router.replace("/projectDetails")
			},
			// 点击保存
			save() {
				const _this = this
				// 判断数据
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
				//    处理下数据
				this.newStageInfo.listTagAll = []
				// 深拷贝
				const data = JSON.parse(JSON.stringify(this.newStageInfo))
				// data.documentList = this.newStageInfo.documentList.concat(this.removeFileInfo);
				data.todoList = this.newStageInfo.todoList.concat(this.removeTargetInfo);
				data.listTagAll = [];
				//判断发送请求
				if (JSON.stringify(this.errorMsgInfo) == "{}") {
					// 发送请求
					this.$axiosHttp.axiosPost("work-xproject/projectStage/updateStage.do", data).then(response => {
						if (response.code == 606) {
							_this.promptMessage.push("里程碑修改保存成功 ")
							// 跳转到详情页
							setTimeout(function () {
								_this.$router.replace("/projectDetails")
							}, 1200)
						} else if (response.code == 604) {
							_this.promptMessage.push("不能选择以前的时间")
						} else if (response.code == 902) {
							_this.promptMessage.push("标签不合法")
						} else if (response.code == 903) {
							_this.promptMessage.push("文件不合法")
						} else if (response.code == 609) {
							_this.promptMessage.push("里程碑名字太长");
						} else if (response.code == 610) {
							_this.promptMessage.push("该里程碑已经结束");
						} else if (response.code == 915) {
							_this.promptMessage.push("该事情已经结束");
						} else if (response.code == 912) {
							_this.promptMessage.push("未找到事情");
						} else if (response.code == 607) {
							_this.promptMessage.push("找不到该里程碑");
						} else if (response.code == 611) {
							_this.promptMessage.push("状态已变更，请返回重试");
						} else {
							_this.promptMessage.push("里程碑修改保存失败")
						}
					});
				}
			},

			// 获取子组件传过来的标签信息
			changeTag(tag) {
				this.newStageInfo.tagList = tag
			},
			// 获取子组件传过来的文件信息
			changeFile(file) {
				this.newStageInfo.documentList = own.handleFile(file)
			},
			// 获取子组件传过来的删除文件信息
			removeFile(resFile) {
				this.removeFileInfo.push(resFile)
			},
			// 获取子组件传过来的里程碑小目标信息列表
			changeTarget(targetList) {
				this.todoList = targetList
			},
			// 获取子组件传过来的里程碑总目标信息
			changeBigTarget(resTarget) {
				this.newStageInfo.projectStageName = resTarget
			},
			// 获取子组件传过来的删除文件
			deleteTarget(resRemovetarget) {
				this.removeTargetInfo.push(resRemovetarget)
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