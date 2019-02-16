<template>
	<div>
		<article v-bind:class="{'scroll-fix':isPopupShow}">
			<header class="header">
				<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
				<h1>新建反馈</h1>
				<span class="align-right" v-on:click="save">提交</span>
			</header>
			<section class="main-body">
				<div class="form">
					<div class="form-item vertical ">
						<div class="input">
							<textarea placeholder="输入项目的最新反馈..." v-focus v-model="projectNewSituationInfo.dynamicDetail" v-on:input="inputFunc(projectNewSituationInfo.dynamicDetail,$event)"> 
							</textarea>
							<!--<textarea placeholder="输入项目的最新反馈..." v-focus v-model="projectNewSituationInfo.dynamicDetail" v-on:change="inputFunc(projectNewSituationInfo.dynamicDetail,$event)"> 
							</textarea>-->
						</div>
						<p class="alert-message " v-text="errorMsgInfo.projectDescMsg" v-show="!projectNewSituationInfo.dynamicDetail" v-bind:class="{'show':errorMsgInfo.projectDescMsg}"></p>
					</div>
					<!--图片上传-->
					<div class="albums">
						<ul>
							<li v-for="(img,index) in projectNewSituationInfo.photoList" :key="index">
								<img :src='img.trimPhoto' v-on:click="showImage(img)">
							</li>
						</ul>
						<!--点击跳转到图片组件-->
						<addPicture @changeStatus="changeStatusEvent" @errorMessage="getErrorMessage" v-bind:imgLength="projectNewSituationInfo.photoList.length "></addPicture>
					</div>
					<!--标签视口-->
					<getlabel @upTag="changeTag" v-bind:myMessage="projectNewSituationInfo.tagList"></getlabel>
					<!--信息提提示框-->
					<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
				</div>
			</section>
		</article>
	</div>
</template>
<script>
	/**
	 * getlabel 标签组件
	 * promptBox 提示框
	 * addPicture 获取图片
	 * */
	import getlabel from '../childComponents/label.vue'
	import promptBox from "../childComponents/promptBox.vue"
	import addPicture from "../childComponents/addPicture.vue"
	import jsBridge from "../common/addPicture.js"

	export default {
		name: 'app',
		data() {
			return {
				// 数据绑定
				projectNewSituationInfo: {
					projectStageId: "",
					dynamicDetail: "",
					projectId: "",
					tagList: [],
					photoList: []
				},
				// 图片信息
				image: [],
				// 错误提示信息
				errorMsgInfo: {
					projectDescMsg: "",
				},
				// 保存提示信息
				promptMessage: [],
				// 详情页传过来的信息
				projectDynamicInfo: {
					projectStageId: "",
					projectId: "",
				},
				// 是否正在保存
				isSave: false,
				// 保存这个地址
				resImgUrl: "",
				// 是否可以滑动
				isPopupShow: "",
				// 选中的人
				selectedManList: [],
				// 光标位置
				range: "",
			}
		},
		created: function () {
			// 获取详情页传过来的信息
			this.getProjectDynamicInfo();
			//获取选中的人
			this.getselectedMan();
		},
		methods: {
			// 获取详情页传过来的数据
			getProjectDynamicInfo() {
				// 保存详情页传过来的数据
				if (this.$route.params.projectId) {
					this.projectDynamicInfo = this.$route.params;
					//  里程碑Id
					this.projectNewSituationInfo.projectStageId = this.projectDynamicInfo.projectStageId;
					// 事情Id
					this.projectNewSituationInfo.projectId = this.projectDynamicInfo.projectId;
					// 为空就绑定数据保存ID
					this.$store.commit('GET_projectMessage_DATA', this.$route.params);
				} else {
					this.projectDynamicInfo = this.$store.state.projectMessage;
					//  里程碑Id
					this.projectNewSituationInfo.projectStageId = this.projectDynamicInfo.projectStageId;
					// 事情Id
					this.projectNewSituationInfo.projectId = this.projectDynamicInfo.projectId;
				}
			},
			getselectedMan() {
				if (JSON.stringify(this.$store.state.selectedMan) != "{}" && this.$store.state.dynamicDetailInfo) {
					//  反馈的
					this.projectNewSituationInfo = this.$store.state.dynamicDetailInfo;

					var name = this.$store.state.selectedMan.userName + ' ';
					var tmpStr = this.$store.state.dynamicDetailInfo.dynamicDetail;
					var range = this.$store.state.cursor;

					// 光标位置前面的内容
					var rangePosition = tmpStr.substring(0, range);
					// 处理兼容性    
					if (rangePosition.charAt(rangePosition.length - 1) != '@') {
						rangePosition = rangePosition + "@";
					}
					this.projectNewSituationInfo.dynamicDetail = rangePosition + name + tmpStr.substring(range,
						tmpStr.length);
				} else if (this.$store.state.dynamicDetailInfo && JSON.stringify(this.$store.state.dynamicDetailInfo) != "{}") {

					this.projectNewSituationInfo = this.$store.state.dynamicDetailInfo;
				}
			},
			// 获取子组件传过来的标签信息
			changeTag(tag) {
				this.projectNewSituationInfo.tagList = tag;
			},
			// 返回
			goback() {
				this.$router.replace("/projectDetails");
				// 保存反馈内容
				this.$store.commit('GET_dynamicDetail_DATA', this.projectNewSituationInfo);
				// 置空@的人
				this.$store.commit('GET_selectedMan_DATA', {});
			},
			// 输入判断事件
			inputFunc(resString, $event) {
				if ($event.data) {
					if (/@$/.test($event.data)) {
						this.$router.push({
							name: 'projectParticipant',
							params: {
								sign: true
							}
						})
						// 保存反馈内容
						this.$store.commit('GET_dynamicDetail_DATA', this.projectNewSituationInfo);
						// 保存光标的位置
						this.$store.commit('SET_CURSOR_DATA', $event.target.selectionStart);
					}
				} else {
					//处理 没提供inputevent 对象的安卓机器
					var str = $event.target.value
					if (str.charAt(str.length - 1) == '@') {
						this.$router.push({
							name: 'projectParticipant',
							params: {
								sign: true
							}
						})
						// 保存反馈内容
						this.$store.commit('GET_dynamicDetail_DATA', this.projectNewSituationInfo);
						// 保存光标的位置
						this.$store.commit('SET_CURSOR_DATA', $event.target.selectionStart);
					}
				}

				// if (resString.length > 150) {
				// 	this.promptMessage.push("反馈信息已超过限制150字数");
				// }
			},
			// 保存
			save() {
				// 判断
				if (this.isSave) return;
				// 赋值
				this.isSave = true;
				const _this = this;
				// 制空
				this.promptMessage = [];
				this.errorMsgInfo = {};
				// 判断数据
				if (!this.projectNewSituationInfo.dynamicDetail) {
					_this.errorMsgInfo.projectDescMsg = "请输入反馈信息";
					// 还原判断数据
					this.isSave = "";
				} 
				// else if (this.projectNewSituationInfo.dynamicDetail.length > 150) {
				// 	_this.promptMessage.push("反馈信息不能超过150字");
				// 	// 还原判断数据
				// 	this.isSave = "";
				// 	return;
				// }
				 else {
					var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
					if (this.projectNewSituationInfo.dynamicDetail.match(regRule)) {
						this.promptMessage.push("不支持输入表情");
						// 还原判断数据
						this.isSave = "";
						return;
					}
					//    内容为空个 或换行
					var strValue = this.projectNewSituationInfo.dynamicDetail;
					strValue = strValue.replace(/\n/g, '');
					if (javaTrim(strValue) == "") {
						this.promptMessage.push("请输入内容");
						// 还原判断数据
						this.isSave = "";
						return;
					}
				}

				// 深拷贝
				this.projectNewSituationInfos = JSON.parse(JSON.stringify(this.projectNewSituationInfo));
				this.projectNewSituationInfos.dynamicDetail = this.projectNewSituationInfos.dynamicDetail.replace(/\n/g, "<br>");
				// @人员
				var seekList = [];
				this.$store.state.selectedList.forEach(item => {
					if (this.projectNewSituationInfo.dynamicDetail.indexOf('@' + item.userName) > 0) {
						var loginName = {}
						loginName.loginName = item.loginName
						seekList.push(loginName)
					}
				})
				this.projectNewSituationInfos.seekList = seekList;
				// 赋值
				const data = this.projectNewSituationInfos;
				if (JSON.stringify(this.errorMsgInfo) == "{}") {
					this.$axiosHttp.axiosPost("work-xproject/projectDynamic/insertDynamic.do", data).then(response => {
						if (response.code == 200) {
							_this.promptMessage.push("反馈成功 ");
							// 跳转到详情页
							setTimeout(function () {
								_this.$router.replace("/projectDetails");
								_this.isSave = false;
							}, 1200)
							// 保存成功 置空
							this.$store.commit('GET_selectedMan_DATA', {});
							this.$store.commit('GET_dynamicDetail_DATA', "");
						} else if (response.code == 400) {
							_this.promptMessage.push("反馈参数不合法");
							_this.isSave = false;
						} else if (response.code == 902) {
							_this.promptMessage.push("标签不合法");
							_this.isSave = false;
						} else if (response.code == 610) {
							_this.promptMessage.push("该里程碑已经结束");
							_this.isSave = false;
						} else if (response.code == 915) {
							_this.promptMessage.push("该事情已经闭环");
							_this.isSave = false;
						} else if (response.code == 607) {
							_this.promptMessage.push("找不到该里程碑");
							_this.isSave = false;
						} else if (response.code == 912) {
							_this.promptMessage.push("未找到事情");
							_this.isSave = false;
						} else {
							_this.promptMessage.push("反馈保存失败");
							_this.isSave = false;
						}
					});
				}
			},
			//   点击跳转到图片组件
			jumpAddPictrue() {
				this.$router.push({
					name: 'addPicture'
				})
			},
			// 获取图片地址
			changeStatusEvent(resImages) {
				if (this.projectNewSituationInfo.photoList.concat(resImages).length > 9) {
					this.promptMessage.push("建议不超过9张图")
					return;
				};
				this.projectNewSituationInfo.photoList = this.projectNewSituationInfo.photoList.concat(resImages);
			},
			// 获取错误信息
			getErrorMessage(resErrorMessage) {
				this.promptMessage.push(resErrorMessage)
			},
			// 点击放大预览 可以删除
			showImage(resImgUrl) {
				const _this = this;
				//  处理一下预览原图的list 高清图片
				var imgList = [];
				this.projectNewSituationInfo.photoList.forEach((vaule, index) => {
					imgList.push(vaule.originalPhoto)
				});
				var RowNnumber = this.projectNewSituationInfo.photoList.indexOf(resImgUrl) || 0;
				jsBridge.callHandler('previewImage', {
					'current': resImgUrl.originalPhoto, // 当前显示图片的原图http链接
					'urlList': imgList, //当前显示图片的list
					'RowNnumber': RowNnumber, //该图片在列表的位置
					'isDelete': true //是否需要删除功能
				}, function (response) {
					// 转成json对象
					response = JSON.parse(response);
					// 赋值
					_this.projectNewSituationInfo.photoList = _this.projectNewSituationInfo.photoList.filter(function (item) {
						let find = response.find(newArrItem => {
							return newArrItem == item.originalPhoto;
						});
						if (find) {
							return true;
						} else {
							return false;
						}
					})
				})
			}
		},
		// 定义子组件
		components: {
			getlabel: getlabel,
			promptBox: promptBox,
			// 图片选择
			addPicture: addPicture,
		}
	}
	//  判断为空格  换行
	function javaTrim(str) {
		for (var i = 0;
			(str.charAt(i) == ' ') && i < str.length; i++);
		if (i == str.length) return ''; //whole string is space  
		var newstr = str.substr(i);
		for (var i = newstr.length - 1; newstr.charAt(i) == ' ' && i >= 0; i--);
		newstr = newstr.substr(0, i + 1);
		return newstr;
	}
</script>