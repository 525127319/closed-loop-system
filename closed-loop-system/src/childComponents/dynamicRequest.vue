<template>
	<div class="events">
		<!--反馈框-->
		<!-- <div class="event" v-show="dynamicRequest&&dynamicRequest.length==0">
			<p>此里程碑目前没有反馈</p>
		</div> -->
		<div class="event" v-for="(item,index) in dynamicRequest" :key="index">
			<p class="time" v-text="item.month"></p>
			<div class="post-author">
				<div class="avatar"><img :src="item.headPortrait" alt=""></div>
				<em v-text="item.createUserName"></em>

			</div>
			<div class="post-content" v-html="item.dynamicDetail"></div>
			<!--图片展示子组件-->
			<pictureShow v-bind:setphotoList="item.showPhotograthList"></pictureShow>
			<!--标签列表-->
			<ul class="tags">
				<li v-for="(item,index) in item.tagList" :key="index" v-text="item.projectTagName"></li>
			</ul>
			<div class="post-action">
				<p v-text="item.realDate"></p>
				<em v-on:click="deleteDynamic(item,index)" v-if=" setDynamicList.stageStatus != 3&&item.isCreateUser&&item.finishStatus!=7">删除</em>
				<div class="icon-buttons">
					<button class="button" v-on:click.stop="comment(item)">
							<span class="icon icon-chat"></span>
							<span v-text="item.replyNumber"></span> 
						</button>
					<!--点赞-->
					<button class="button" v-on:click.stop="fabulous(item)">
							<span class="icon " v-bind:class="{'icon-heart': !item.isLike,'icon-heart-fill':item.isLike}"></span>
							 <span v-text="item.dynamicLikeNumber"></span> 
						</button>
				</div>
			</div>
			<div class="replies" v-show="item.replyList.length>0||item.dynamicLikeUserNameList.length>0">
				<div class="like" v-if="item.dynamicLikeUserNameList.length>0">
					<span class="icon icon-heart"></span>
					<em v-for="(LikeUserNameInfo,index) in item.dynamicLikeUserNameList" :key="index" v-text="LikeUserNameInfo.dynamicUserName">
						</em>
				</div>
				<ul v-show="item.replyList.length>0">
					<li v-for="(dynamic,index) in item.replyList" :key="index" v-on:click="comments(dynamic,item.dynamicId)">
						<em v-text="dynamic.replyUserName"></em>
						<span v-if="dynamic.replyByUserId">回复</span>
						<em v-if="dynamic.replyByUserId" v-text="dynamic.replyByUserName"></em>
						<span v-text="dynamic.replyDetail"></span>
					</li>
				</ul>
			</div>
		</div>
		<!--点击加载更多-->
		<div class="more" v-on:click="getMore()" v-if="isMoreShow">
			点击加载更多
		</div>
		<!-- <div class="event first">
			<p class="time">
				<span v-text="this.setDynamicList.nowTime"></span>
			</p>
			<div class="post-author">
				<div class="avatar"><img :src="this.setDynamicList.stageCreateHeadPortrait"></div>
				<em>{{this.setDynamicList.stageCreateRealName}} 开启了事情</em>
			</div>
			<div class="post-action">
				<p v-text="this.setDynamicList.realOverTime"></p>
			</div>
		</div> -->
		<!--评论信息提提示框-->
		<!--<aside class="action-sheet" v-bind:class="{ 'show': isShowComment}" >-->

		<aside class="dialog" v-if="isShowComment" v-bind:class="{ 'show': isShowComment}">
			<section>
				<h3>新建回复</h3>
				<section>
					<input type="text" v-focus :placeholder="promptReplyUserName" v-model="commentInfo" v-on:input="inputFunc(commentInfo)">
				</section>
				<footer>
					<button v-on:click.stop="cancel">取消</button>
					<button v-on:click.stop="affirm">确认</button>
				</footer>
			</section>
			<div class="mask" v-on:click.stop="cancel"></div>
		</aside>
		<!--信息提示框-->
		<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
		<!--删除此反馈-->
		<aside class="dialog" v-if="isShowdynamicdelete" v-bind:class="{'show' : isShowdynamicdelete}">
			<section>
				<h3>确定删除此反馈?</h3>
				<section>
					此操作将删除此反馈及所有的评论和点赞信息。
				</section>
				<footer>
					<button v-on:click.stop="cancel">取消</button>
					<button v-on:click.stop="affirmDeleteDynamic()">确认</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
	</div>
</template>
<script>
	/** 导入子组件
	 * own 自己封装的js方法
	 * promptBox 提示框
	 * pictureShow 图片展示
	 **/
	import promptBox from "./promptBox.vue"
	import own from '../common/ownPackage.js'
	import pictureShow from "../childComponents/pictureShow.vue"

	export default {
		name: 'app',
		data() {
			return {
				// 事情id
				projectId: "",
				// 里程碑的id
				ProjectStageId: "",
				// 反馈信息
				dynamicRequest: [],
				// 信息框是否显示
				isShowComment: "",
				// 输入框内容
				commentInfo: "",
				// 回复信息框
				commentData: {
					replyDetail: "",
					replyByUserId: "",
					dynamicId: "",
					projectId: ""
				},
				// 点赞
				fabulousInfo: {
					dynamicId: "",
					projectId: ""
				},
				// 点赞的图标变化
				isFabulousSign: "",
				// 修改的反馈index
				dynamicIndex: "",

				// 请求里程碑反馈的信息
				projectDynamicMessage: {
					projectId: "",
					projectStageId: "", //里程碑的id
					page: 1, //页码
					number: 10 //每页显示的数量
				},
				// 是否显示更多
				isMoreShow: true,
				// 保存提示信息
				promptMessage: [],
				// 删除反馈的提示框
				isShowdynamicdelete: "",
				// 删除反馈的数据
				index: "",
				item: "",
				//回复信息提示请输入评论内容
				promptReplyUserName: "请输入评论内容",
			}
		},
		created: function () {
			this.getData();
		},
		methods: {
			//  获取到传过来的反馈信息
			getData() {
				if (this.dynamicRequest.length == 0) {
					// 反馈
					this.dynamicRequest = JSON.parse(JSON.stringify(this.setDynamicList.dynamicList));
					// 是否显示加载更多
					this.isMoreShow = this.setDynamicList.dynamicSum;
					this.projectId = this.setProjectInfo.projectId;
					this.ProjectStageId = this.setProjectStageId;
					//   调用
					own.setTime(this.dynamicRequest);
				}
			},
			// 点击评论图标触发
			comment(resDynamic) {
				// 里程碑就阻止点击事件
				if (this.setDynamicList.stageStatus == 3) return;
				// 设置placeholder				
				this.promptReplyUserName = '请输入评论内容';
				this.commentData.dynamicId = resDynamic.dynamicId;
				this.commentData.replyByUserId = "";
				// 触发弹框
				this.isShowComment = !this.isShowComment;
				this.$store.commit('SOME_Popup_List', true);
				//  获取修改反馈的index
				function findCherries(fruit) {
					return fruit.dynamicId === resDynamic.dynamicId;
				}
				this.dynamicIndex = this.dynamicRequest.findIndex(findCherries);
			},
			// 点击评论内容触发
			comments(resDynamic, resDynamicId) {
				// 里程碑就阻止点击事件
				if (this.setDynamicList.stageStatus == 3) return;
				// 设置placeholder
				this.promptReplyUserName = "回复 " + resDynamic.replyUserName;
				// 获取传过来的replyByUserId何dynamicId
				this.commentData.replyByUserId = resDynamic.replyUserId;
				this.commentData.dynamicId = resDynamicId;
				// 触发弹框
				this.isShowComment = !this.isShowComment;
				this.$store.commit('SOME_Popup_List', true);
				//  获取修改反馈的index
				function findCherries(fruit) {
					return fruit.dynamicId === resDynamicId;
				}
				this.dynamicIndex = this.dynamicRequest.findIndex(findCherries);
			},
			// 点赞
			fabulous(resDynamicData) {
				// 里程碑就阻止点击事件
				if (this.setDynamicList.stageStatus == 3) return;
				// 制空提示框
				this.promptMessage = [];
				const _this = this
				// 绑定点赞提交的数据
				this.fabulousInfo.dynamicId = resDynamicData.dynamicId;
				this.fabulousInfo.projectId = this.projectId;
				const data = this.fabulousInfo;
				this.$axiosHttp.axiosPost("work-xproject/projectDynamicLike/insertDynamicLike.do", data).then(response => {
					if (response.code == 200) {
						resDynamicData.dynamicLikeNumber = response.data.dynamicLikeNumber;
						resDynamicData.dynamicLikeUserNameList = response.data.dynamicLikeUserNameList
						resDynamicData.isLike = response.data.isLike
					}
				});
			},
			//确认
			affirm() {
				// 评论信息的确认事件
				const _this = this;
				// 去掉首位的空格
				this.commentInfo = this.commentInfo.replace(/(^\s*)|(\s*$)/g, "");
				// 为空  提示用户
				if (this.commentInfo == "") {
					this.promptMessage.push("请输入内容");
					return;
				}
				if (this.commentInfo) {
					// 隐藏输入框
					this.isShowComment = !this.isShowComment;
					//  设置
					this.$store.commit('SOME_Popup_List', false);

					this.commentData.replyDetail = this.$utils.base64Encode(this.commentInfo);
					this.commentData.projectId = this.projectId;
					const data = this.commentData;
					this.$axiosHttp.axiosPost("work-xproject/projectReply/insertReply.do", data).then(response => {
						if (response.code == 200) {
							_this.dynamicRequest.splice(_this.dynamicIndex, 1, response.data[0]);
							own.setTime(_this.dynamicRequest);
						} else {
							_this.promptMessage.push("回复参数错误");
						}
					});
					this.commentInfo = "";
				}
			},
			// 取消
			cancel() {
				// 删除反馈选择框消失
				this.isShowdynamicdelete = ""
				this.isShowComment = "";
				this.commentInfo = "";
				//  设置为
				this.$store.commit('SOME_Popup_List', false);
			},
			// 输入判断事件
			inputFunc(resting) {
				if (resting.length > 300) {
					this.promptMessage.push("评论字数已超过限制300字");
				}
			},
			// 点击加载更多
			getMore() {
				const _this = this
				this.projectDynamicMessage.projectStageId = this.ProjectStageId;
				this.projectDynamicMessage.projectId = this.projectId;
				this.projectDynamicMessage.page++;
				const data = this.projectDynamicMessage;
				this.$axiosHttp.axiosPost("work-xproject/project/findDynamic.do", data).then(response => {
					if (response.code == 200) {
						_this.dynamicRequest = _this.dynamicRequest.concat(response.data.dynamicList);
						_this.isMoreShow = response.data.dynamicSum;
						own.setTime(_this.dynamicRequest);
					}
				});
			},
			// 点击删除反馈
			deleteDynamic(resItem, resIndex) {
				// 里程碑就阻止点击事件
				if (this.setDynamicList.stageStatus == 3 || resItem.finishStatus == 7) return;
				//  设置
				this.$store.commit('SOME_Popup_List', true);
				// 弹出选择框
				this.isShowdynamicdelete = !this.isShowdynamicdelete;
				this.item = resItem;
				this.index = resIndex;
			},
			// 确认删除此反馈
			affirmDeleteDynamic() {
				//  设置
				this.$store.commit('SOME_Popup_List', false);
				const _this = this
				// 绑定请求的数据
				const data = {};
				data.dynamicId = this.item.dynamicId;
				//   删除数据请求
				this.$axiosHttp.axiosPost("work-xproject/projectDynamic/deleteDynamic.do", data).then(response => {
					if (response.code == 200) {
						// 删除反馈选择框消失
						_this.isShowdynamicdelete = "";
						// 提交删除事件
						_this.$emit("deleteD", "删除了")
						// 刷新数据
						_this.projectDynamicMessage.projectStageId = this.ProjectStageId;
						_this.projectDynamicMessage.projectId = this.projectId;

						const data = this.projectDynamicMessage;
						_this.$axiosHttp.axiosPost("work-xproject/project/findDynamic.do", data).then(response => {
							if (response.code == 200) {
								_this.dynamicRequest = response.data.dynamicList;
								_this.isMoreShow = response.data.dynamicSum;
								own.setTime(_this.dynamicRequest);
							} else {
								_this.dynamicRequest = []
							}
						});
					}
				});
			},
		},
		props: ["setDynamicList", "setProjectInfo", "setProjectStageId"],
		// 定义子组件
		components: {
			promptBox: promptBox,
			pictureShow: pictureShow
		},
		// 监听数据
		watch: {
			"setDynamicList.dynamicList": {
				handler: function () {
					if (this.setDynamicList) {
						// 反馈
						this.dynamicRequest = JSON.parse(JSON.stringify(this.setDynamicList.dynamicList));
						// 是否显示加载更多
						this.isMoreShow = this.setDynamicList.dynamicSum;
						// 是否显示同意拒绝
						own.setTime(this.dynamicRequest);
						this.projectDynamicMessage.page = "1";
					}
				},
				deep: true
			}
		}
	}
</script>