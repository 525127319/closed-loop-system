<template>
	<article v-bind:class="{'scroll-fix':this.$store.state.isPopupShow}">
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
			<h1>事情</h1>
			<!--编辑事情-->
			<span class="align-right icon icon-menu" v-on:click="showprojecInfo" v-if="projectStatus!=3&&teamMember"></span>
		</header>
		<section class="main-body project-detail ">
			<div class="project" v-bind:class="{ 'finished':projectStatus==3,'opened':isOvert  }">
				<div class="project-info">
					<h2 v-text="projectName"></h2>
					<div class="follow" v-on:click.stop="follow(isFollow)" v-bind:class="{'followed':isFollow}" v-if="isFollow==1">
						<span>已关注</span>
					</div>
					<div class="follow" v-on:click.stop="follow(isFollow)" v-bind:class="{'followed':isFollow}" v-if="isFollow==0">
						<span>关注</span>
					</div>
					<p v-text="'负责人 ' + pmName"></p>
					<p class="project-desc" v-html="projectDesc"></p>
					<!--标签列表-->
					<ul class="tags">
						<li v-for="item in tagList" :key="item.projectTagId" v-text="item.projectTagName"></li>
					</ul>
				</div>
				<ul class="project-count">
					<li v-on:click.stop="projectParticipant">
						<span v-text="projectSumPeople"></span>
						<span>总人数</span>
					</li>
					<!--<li>
						<span v-text="projectSumDocument"></span>
						<span>交付文件总数</span>
					</li>-->
					<li>
						<span v-text="getProjectInfo.projectDay"></span>
						<span>进行天数</span>
					</li>
					<li>
						<span v-text="projectEvent"></span>
						<span><strong>反馈</strong>信息数</span>
					</li>
				</ul>
			</div>
			<!--里程碑列表-->
			<div class="project-stage" v-for="(item,index) in stageList" :key="index" v-bind:class="{'overdue':item.isOverdue, 'expand':item.isShowTrends, 'finished':item.stageStatus==3}">
				<div class="progress" v-bind:style="'height:calc('+item.Percentage+'% - 3.25rem)'"></div>
				<span class="icon icon-arrow-up"></span>
				<div class="card-view" v-on:click.stop="dynamicRequestEvent(item)">
					<div class="milestone">
						<p class="badge" v-text="item.stageNumber"></p>
					</div>
					<div class="project-stage-info" v-on:click.stop="dynamicRequestEvent(item)">
						<h3 class="project-stage-name" v-text="item.projectStageName"></h3>
						<p v-if="item.stageStatus==3">
							<span v-text="item.beginTime"></span> - <span v-text="item.overTime"></span> (
							<em v-text="item.realEndTime"></em>) 共耗时
							<span v-text="item.nowTime"></span>
						</p>
						<div v-else>
							<span v-text="item.beginTime"></span> - <span v-text="item.overTime"></span>
							<span class="cd count-down" v-text="item.nowTime" v-if="item.isOverdue==0"></span>
						</div>
						<ul class="tags">
							<li v-for="(item,index) in item.tagList" :key="index" v-text="item.projectTagName"></li>
						</ul>
					</div>
					<span class="button icon icon-add-list" v-on:click.stop="addSmallTarget()" v-if="teamMember"></span>
				</div>
				<ul class="todo-list">
					<li v-bind:class="{'done':target.todolistStatus}" v-for="(target,index) in item.todoList" :key="index" v-on:click.stop="endSmallTarget(target,item.projectStageId,item.stageStatus)">
						<span class="icon icon-checkbox"></span>
						<h4 v-text="target.todolistName"></h4>
						<span class="icon icon-close" v-if="target.todolistStatus!=1 && item.stageStatus!=3&&teamMember" v-on:click.stop="removeTodolistName(target,item.projectStageId,item.stageStatus)"></span>
					</li>
				</ul>
				<!--反馈信息组件-->
				<dynamicRequest v-show="item.isShowTrends" v-on:deleteD="eventReduction" v-bind:setDynamicList="item" v-bind:setProjectInfo="getProjectInfo"
				    v-bind:setProjectStageId="item.projectStageId">
				</dynamicRequest>
			</div>
		</section>
		<div class="icon icon-feedback float-button" @click="jumpSituation" v-if="(projectStatus!=3&&isShowAdd) || stageList.length==0"></div>
		<div class="icon icon-plus float-button ms" @click="jumpStage" v-if="projectStatus!=3&&!isShowAdd&&stageList.length>0&&teamMember">
			<span class="badge">?</span>
		</div>
		<!-- 事情菜单 -->
		<aside class="action-sheet" v-bind:class="{ 'show':isShowproject}">
			<ul class="menu">
				<li v-on:click.stop="showProject(getProjectInfo.projectId)">更改事情</li>
				<li v-on:click.stop="endProject(getProjectInfo.projectId)" v-if="stageList.length>0">闭环事情</li>
				<li class="sp" v-on:click.stop="showStage(firstStage.projectStageId)" v-if="stageList.length>0&&firstStage.stageStatus!=3">修改里程碑</li>
				<li v-on:click.stop="endStage(firstStage.projectStageId)" v-if="stageList.length>0&&firstStage.stageStatus!=3">结束里程碑</li>
				<!--<li v-on:click.stop="deleteStage(firstStage)" v-if="stageList.length>0&&firstStage.stageStatus!=3">删除里程碑</li>-->
				<li v-on:click="jumpStage" v-show="projectStatus!=3&&!isShowAdd">新建里程碑</li>
				<li class="cancel sp" v-on:click.stop="putAway">取消</li>
			</ul>
			<div class="mask" v-on:click.stop="putAway"></div>
		</aside>

		<!--信息提示框-->
		<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
		<!-- 捕获没有token的情形 -->
		<aside class="dialog " v-bind:class="{ 'show': isInvalid}">
			<section>
				<h3>登录信息已过期</h3>
				<section>请尝试返回后，重新进入闭环系统</section>
				<footer>
					<button v-on:click.stop="goBackApp">返回</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
		<!--结束事情-->
		<aside class="dialog" v-if="isShowEnd" v-bind:class="{ 'show': isShowEnd}">
			<section>
				<h3>确定闭环事情?</h3>
				<section>闭环的事情将不能再做任何操作</section>
				<footer>
					<button v-on:click.stop="cancel">取消</button>
					<button v-on:click.stop="affirm(getProjectInfo.projectId)">确认</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
		<!--结束子里程碑-->
		<aside class="dialog" v-if="isEndTarget" v-bind:class="{ 'show': isEndTarget}">
			<section>
				<h3>确定结束小目标?</h3>
				<section v-text="endTargetInfo.todolistName"> </section>
				<footer>
					<button v-on:click.stop="cancel">取消</button>
					<button v-on:click.stop="targetEnd(endTargetInfo)">确认</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
		<!--删除里程碑-->
		<aside class="dialog" v-if="isShowStageEnd" v-bind:class="{'show': isShowStageEnd}">
			<section>
				<h3>确定删除此里程碑?</h3>
				<section>将删除所有的反馈及关联评论点赞数据</section>
				<footer>
					<button v-on:click.stop="cancel">取消</button>
					<button v-on:click.stop="affirmEndStage()">确认</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
		<!--新增里程碑0 的小目标-->
		<aside class="dialog" v-if="isShowAddStage" v-bind:class="{'show': isShowAddStage}">
			<section>
				<h3>新增小目标</h3>
				<section>
					<input type="text" v-focus v-model="addStageInfo">
				</section>
				<footer>
					<button v-on:click.stop="cancel">取消</button>
					<button v-on:click.stop="affirmAddStage()">确认</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
		<!--删除小目标-->
		<aside class="dialog" v-if="isShowRemove" v-bind:class="{ 'show': isShowRemove}">
			<section>
				<h3>确定删除该小目标？</h3>
				<footer>
					<button v-on:click="cancel">取消</button>
					<button v-on:click="affirmDeleteTarget()">确认</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
	</article>
</template>

<script>
	/**
	 *own 自己封装的js方法
	 * dynamicRequest 反馈子组件
	 * promptBox 提示框
	 * dropdown 下拉框
	 * */
	import dynamicRequest from '../childComponents/dynamicRequest.vue'
	import promptBox from "../childComponents/promptBox.vue"
	import own from '../common/ownPackage.js'
	import Vue from 'vue'

	export default {
		name: 'app',
		data() {
			return {
				// 获取过来的头部信息
				getProjectInfo: {
					// 事情id
					projectId: "",
					// 事情代号
					projectCode: "",
					// 事情进行天数
					projectDay: "",
					// 自己绑定的数据
					// 事情名
					projectName: "",
					// 事情的状态
					projectStatus: "",
				},

				// 获取里程碑信息传递的数据
				detailsData: {
					projectId: "",
				},
				// 事情描述
				projectDesc: "",
				// 总人数
				projectSumPeople: "",
				// 总文件
				projectSumDocument: "",
				// 事件数
				projectEvent: "",
				// 事情的状态
				projectStatus: "",
				// 负责人
				pmName: "",
				// 标签列表
				tagList: [],
				// 事情名
				projectName: "",
				// 里程碑列表
				stageList: [],
				// 里程碑Id
				projectStageId: "",
				// 请求里程碑反馈的信息
				projectStageMessage: {
					projectId: "",
					projectStage: "", //里程碑的id
					page: "1", //页码
					number: "10" //每页显示的数量
				},
				// 传新建反馈的信息
				projectDynamicInfo: {
					projectStageId: "",
					projectId: "",
					projectStageName: "",
				},
				// 结束里程碑信息
				projectStageInfo: {
					projectStageId: "",
				},
				// 是否显示
				isShowAdd: "",
				// 请求文件的数据
				projectFile: {
					projectId: "", //事情id
					number: "", //目前没用请传入空，留待后期作分页
					page: "", //目前没用请传入空，留待后期作分页
					projectStageId: "" //里程碑id
				},
				// 保存提示信息
				promptMessage: [],
				// 结束事情
				isShowEnd: "",
				// 结束里程碑
				isShowStageEnd: "",
				// 显示出现编辑功能模块
				isShowproject: "",
				// 显示里程碑编辑
				isShowStage: "",
				// 显示里程碑0 的新增小目标
				isShowAddStage: "",
				// 显示里程碑0 的新增小目标内容
				addStageInfo: "",
				// 删除里程碑的Id
				endProjectStageId: "",
				// 是否结束子目标
				isEndTarget: "",
				// 是否删除子目标
				isShowRemove: "",
				// 要删除的小目标内容
				removeSmalltarget: "",
				// 结束子目标的数据
				endTargetInfo: "",
				// 是否关注
				isFollow: "",
				// 是否token失效
				isInvalid: "",
				// 操作的里程碑
				firstStage: {},
				// 是否为公开的事情
				isOvert: "",
				// 是否 为团队成员
				teamMember: ""
			}
		},
		created: function () {
			// 获取传过来的信息
			this.getProjectMessage();
			// 请求里程碑信息
			this.projectDetails();
		},
		methods: {
			// 显示事情编辑
			showprojecInfo() {
				this.isShowproject = !this.isShowproject;
			},
			// 返回上一页
			goback() {
				this.$router.replace("/projectList");
			},
			// 跳转到新建里程碑
			jumpStage() {
				// 跳转传参
				this.$router.push({
					name: 'projectNewStage',
					params: {
						getProjectInfo: this.getProjectInfo
					}
				})
			},
			// 跳转到新建反馈
			jumpSituation() {
				this.projectDynamicInfo.projectId = this.getProjectInfo.projectId;
				// 跳转传参
				this.$router.push({
					name: 'projectNewSituation',
					params: this.projectDynamicInfo
				})
			},
			// 获取获取传过来的信息
			getProjectMessage() {
				// 判断是否含有token
				if (this.$route.query.projectId && this.$route.query.token) {
					// 取token
					this.getProjectInfo.projectId = this.$route.query.projectId;
					var token = this.$route.query.token;
					
					// 赋值给请求头
					this.$axios_config.headers.Authorization = 'Bearer ' + token;
					// 保存头部信息
					this.$store.commit('SET_projectHead_Info', this.getProjectInfo);
				} else {
					// 没有token的获取路由参数
					if (this.$route.query.projectId) {
						this.getProjectInfo = this.$route.query;
						// 保存头部信息
						this.$store.commit('SET_projectHead_Info', this.getProjectInfo);
					} else {
						//取头部信息
						this.getProjectInfo = this.$store.state.projectHeadInfo;
					}
				}
			},
			// 请求里程碑信息
			projectDetails() {
				this.detailsData.projectId = this.getProjectInfo.projectId;
				const data = this.detailsData;
				// 发送请求
				const _this = this;
				this.$axiosHttp.axiosPost("work-xproject/project/findStage.do", data).then(response => {
					// 绑定标签信息
					if (response.code == 200) {
						// 绑定标签信息
						_this.tagList = response.data.tagList;
						// 绑定里程碑信息
						_this.stageList = own.processStageData(response.data.stageList);
						// 第一个里程碑信息
						_this.firstStage = _this.stageList[0];
						// 绑定状态
						_this.projectStatus = response.data.projectStatus;
						_this.getProjectInfo.projectStatus = response.data.projectStatus;
						// 绑定总人数
						_this.projectSumPeople = response.data.projectSumPeople;
						// 绑定总文件
						_this.projectSumDocument = response.data.projectSumDocument;
						// 绑定事情名
						_this.projectName = response.data.projectName;
						_this.getProjectInfo.projectName = response.data.projectName;
						// 绑定事情名
						_this.pmName = response.data.pmName;
						// 总事件
						_this.projectEvent = response.data.projectEvent;
						// 事情描述
						_this.projectDesc = response.data.projectDesc;
						// 事情进行天数
						_this.getProjectInfo.projectDay = response.data.projectDay;
						// 事情代号
						_this.getProjectInfo.projectCode = response.data.projectCode;
						// 是否为公开的事情
						_this.isOvert = response.data.isOvert;
						// 是否为 团队成员
						_this.teamMember = response.data.teamMember;
						// 是否关注
						_this.isFollow = response.data.isFollow
						// 保存里程碑id 里程碑名  传入新建反馈  空里程碑处理
						let res = _this.stageList.filter(value => {
							return value.stageStatus != 3;
						})
						if (res.length > 0) {
							_this.projectDynamicInfo.projectStageId = res[0].projectStageId;
							_this.projectDynamicInfo.projectStageName = res[0].projectStageName;
							_this.isShowAdd = true;
						} else {
							// 没有里程碑  里程碑id为空
							_this.projectDynamicInfo.projectStageId = "";
							_this.isShowAdd = false;
						}
					} else if (response.code == 10005) {
						_this.isInvalid = !_this.isInvalid;
					}
				});
			},
			// 点击加载反馈
			dynamicRequestEvent(stageInfo) {
				const _this = this;
				//    收起任务编辑
				this.isShowproject = "";
				//    收起里程碑编辑
				stageInfo.isShowStage = "";
				// 保存十分逾期状态
				var overTime = stageInfo.isOverdue;
				stageInfo.isShowTrends = !stageInfo.isShowTrends;

				// 发送请求数据
				this.projectStageMessage.projectStageId = stageInfo.projectStageId;
				this.projectStageMessage.projectId = this.getProjectInfo.projectId;
				this.projectStageMessage.page = "1";
				const data = this.projectStageMessage;
				stageInfo.dynamicList = [];
				//    展开才触发请求
				if (stageInfo.isShowTrends == true) {
					this.$axiosHttp.axiosPost("work-xproject/project/findDynamic.do", data).then(response => {
						if (response.code == 200) {
							stageInfo.dynamicList = response.data.dynamicList;
							stageInfo.isOverdue = response.data.isOverdue;
							stageInfo.dynamicSum = response.data.dynamicSum;
							stageInfo.isOverdue = overTime;
						}
					});
				}
			},
			// 编辑事情按钮
			showProject(resProjectId) {
				// 跳转编辑事情
				this.$router.push({
					name: 'projectEditor',
					params: {
						EditorProjectId: resProjectId
					}
				})
			},
			//修改里程碑按钮
			showStage(resProjectStageId) {
				this.$router.push({
					name: 'projectEditorStage',
					params: {
						projectEditorStageId: resProjectStageId,
						getProjectInfo: this.getProjectInfo
					}
				})
			},
			// 进入文件列表
			filelist(resprojectStageId) {
				// 绑定数据
				this.projectFile.projectId = this.getProjectInfo.projectId;
				this.projectFile.projectStageId = resprojectStageId;

				// 跳转文件页传参
				this.$router.push({
					name: 'projectFiles',
					params: {
						projectFileMessage: this.projectFile
					}
				})
			},
			// 进入事情参与人页面
			projectParticipant() {
				this.$router.push({
					name: 'projectParticipant',
				})
			},
			// 里程碑编辑
			stageEvent(resdata) {
				resdata.isShowStage = !resdata.isShowStage;
			},
			// 事情结束
			endProject() {
				// 隐藏编辑
				this.isShowproject = ""
				// 弹出选择框
				this.isShowEnd = true;
			},
			//    事情结束确认
			affirm(resProjectId) {
				this.promptMessage = [];
				// 选择框消失
				this.isShowEnd = "";
				const _this = this;
				const data = {};
				data.projectId = resProjectId;

				this.$axiosHttp.axiosPost("work-xproject/project/finishProject.do", data).then(response => {
					if (response.code == 200) {
						_this.promptMessage.push("事情闭环成功 ");
						// 刷新数据
						_this.projectDetails();
					} else if (response.code == 915) {
						_this.promptMessage.push("事情已经闭环,请重新确认");
					}
				});
			},
			//   取消 事情结束
			cancel() {
				// 选择框消失
				this.isShowEnd = "";
				this.isShowStageEnd = "";
				this.isEndTarget = "";
				this.isShowAddStage = "";
				this.isShowRemove = "";
				//  设置
				this.$store.commit('SOME_Popup_List', false);
			},
			// 点击其他区域  收起来 事情编辑
			putAway(resItem) {
				// 隐藏事情编辑
				this.isShowproject = "";
				// 隐藏里程碑编辑
				resItem.isShowStage = ""
			},
			// 结束里程碑
			endStage(resStageId) {
				this.projectStageInfo.projectStageId = resStageId;
				this.$router.push({
					name: 'projectStageEnd',
					params: this.projectStageInfo
				})
			},
			// 结束子里程碑
			endSmallTarget(resTarget, StageId, resStageStatus) {
				if (resTarget.todolistStatus == 1 || resStageStatus == 3 || this.teamMember == false) return;
				this.isEndTarget = !this.isEndTarget
				// 绑定里程碑id
				resTarget.projectStageId = StageId;
				// 绑定数据
				this.endTargetInfo = resTarget;
				//  设置
				this.$store.commit('SOME_Popup_List', true);
			},
			// 确认结束小目标
			targetEnd(resTargetEnd) {
				this.promptMessage = [];
				// 隐藏操作框
				this.isEndTarget = "";
				// 绑定数据
				const _this = this;
				const data = resTargetEnd;
				//  设置
				this.$store.commit('SOME_Popup_List', false);
				this.$axiosHttp.axiosPost("work-xproject/projectStage/finishSonStage.do", data).then(response => {
					if (response.code == 200) {
						_this.promptMessage.push("小目标结束成功 ");
						_this.projectDetails();
					} else if (response.code == 612) {
						_this.promptMessage.push("该子目标已经结束");
					} else {
						_this.promptMessage.push("操作失败");
					}
				});
			},
			// 删除里程碑
			// deleteStage(resItem) {
			// 	// 弹出选择框
			// 	this.isShowStageEnd = true;
			// 	// 隐藏里程碑编辑
			// 	resItem.isShowStage = "";
			// 	this.endProjectStageId = resItem.projectStageId;
			// },
			// 确认删除里程
			// affirmEndStage() {
			// 	this.promptMessage = [];
			// 	const _this = this;
			// 	const data = {};
			// 	data.projectStageId = this.endProjectStageId;
			// 	this.$axiosHttp.axiosPost("work-xproject/projectStage/deleteStage.do", data).then(response => {
			// 		if (response.code == 605) {
			// 			_this.promptMessage.push("里程碑删除成功 ");
			// 			// 隐藏选择框
			// 			_this.isShowStageEnd = "";
			// 			_this.isShowproject = "";
			// 			// 刷新数据
			// 			_this.projectDetails();
			// 		} else {
			// 			_this.promptMessage.push("里程碑删除失败");
			// 		}
			// 	});
			// },
			// 监听删除了反馈  事件数减少
			eventReduction() {
				this.projectEvent--;
			},
			// 里程碑0 弹出新增小目标
			addSmallTarget() {
				this.isShowAddStage = true;
				//  设置
				this.$store.commit('SOME_Popup_List', true);
			},
			// 里程碑0 确认新增小目标
			affirmAddStage() {
				this.promptMessage = [];
				// 绑定数据
				const data = {};
				data.projectStageId = this.firstStage.projectStageId;
				data.todolistName = this.addStageInfo;
				// 去掉首位的空格
				this.addStageInfo = this.addStageInfo.replace(/(^\s*)|(\s*$)/g, "");
				// 为空  提示用户
				if (this.addStageInfo == "") {
					this.promptMessage.push("请输入内容");
					return;
				}
				if (this.addStageInfo) {
					//  设置
					this.$store.commit('SOME_Popup_List', false);
					this.$axiosHttp.axiosPost("work-xproject/projectStage/insertSonStage.do", data).then(response => {
						if (response.code == 200) {
							// 隐藏选择框
							this.isShowAddStage = "";
							// 清空输入框
							this.addStageInfo = "";
							// 刷新数据
							this.projectDetails();
						} else if (response.code == 613) {
							this.promptMessage.push("小目标名重复");
						}
					});
				}
			},
			// 删除小目标 弹出选择框
			removeTodolistName(resTarget, StageId, resStageStatus) {
				if (resTarget.todolistStatus == 1 || resStageStatus == 3) return;
				this.isShowRemove = !this.isShowRemove
				// 绑定里程碑id
				resTarget.projectStageId = StageId;
				// 绑定数据
				this.removeSmalltarget = resTarget;
				//  设置
				this.$store.commit('SOME_Popup_List', true);
			},
			//确认删除小目标
			affirmDeleteTarget() {
				//  设置
				this.$store.commit('SOME_Popup_List', false);
				// 绑定数据
				const data = {};
				data.projectStageId = this.removeSmalltarget.projectStageId;
				data.todolistId = this.removeSmalltarget.todolistId;
				this.$axiosHttp.axiosPost("work-xproject/projectStage/deleteSonStage.do", data).then(response => {
					if (response.code == 200) {
						// 隐藏选择框
						this.isShowRemove = "";
						// 刷新数据
						this.projectDetails();
					}
				});
			},
			// 点击关注
			follow(resItem) {
				const data = {};
				data.projectId = this.getProjectInfo.projectId;
				this.$axiosHttp.axiosPost("work-xproject/projectNotification/followProject.do", data).then(response => {
					if (response.code == 200) {
						this.isFollow = response.data.isFollow
					}
				});
			},
			// 点击返回app页面
			goBackApp() {
				//返回app页
				if (typeof JSInterface === "undefined") {
					window.location.href = "next://http://iacloud.ceway.com.cn/app-xproject/"
				} else {
					JSInterface.changeActivity();
				}
			},
		},
		// 定义子组件
		components: {
			dynamicRequest: dynamicRequest,
			promptBox: promptBox,
		},
	}
</script>