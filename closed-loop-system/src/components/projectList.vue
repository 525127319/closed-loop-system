<template>
	<article class="home" v-bind:class="{'scroll-fix':this.$store.state.isPopupShow}">
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click.stop="goBackApp"></span>
			<h1 v-text="headInformation"></h1>
			<span class="icon icon-search align-right addtion" v-on:click.stop="search" v-show="isAbnormal"></span>
			<span class="align-right icon icon-menu" v-on:click.stop="showprojecAdd" v-show="isAbnormal"></span>
		</header>
		<ul class="tabs">
			<li v-bind:class="{'active':searchData.status==0}" v-on:click.stop="displayAll">全部 </li>
			<li v-bind:class="{'active':searchData.status==3}" v-on:click.stop="isfollow">已关注 </li>
			<li v-bind:class="{'active':searchData.status==2}" v-on:click.stop="Conscientious">负责的 </li>
			<li v-bind:class="{'active':searchData.status==1}" v-on:click.stop="partake">参与的 </li>
			<li v-bind:class="{'active':searchData.status==4}" v-on:click.stop="endProject">已闭环 </li>
		</ul>
		<div class="search" v-bind:class="{ 'show': isShowSearch}">
			<input type="text" placeholder="搜索内容" v-model="searchData.keyWorkds">
			<span class="icon icon-search" v-on:click.stop="affirm(searchData.keyWorkds)"></span>
		</div>
		<div class="load icon icon-reload loader"></div>
		<section class="main-body">
			<img src="../assets/images/banner.png" class="banner" alt="">
			<p class="tip" v-show="isShowKeyword">
				搜索关键字: <em v-text="showkeyWorkds"></em>, 共 <span v-text="projectListData.length"></span>条记录，<span class="button-inline"
				    v-on:click.stop="displayAll">显示所有</span>
			</p>
			<!--网络出错-->
			<div class="system-msg error" v-bind:class="{ 'show':isShowError,}" v-if="projectListData.length==0">
				<div class="msg ">
					网络错误，请检查网络配置
				</div>
			</div>
			<!--没事情-->
			<div class="system-msg nodata" v-if="!isShowError&&projectListData.length==0" v-bind:class="{'show':isShowNoproject}">
				<div class="msg ">
					没有数据
				</div>
			</div>

			<div class="card-view project" v-for="(item,index) in projectListData" :key="index" @click.stop="jumpDetails(item)" v-bind:class="{ 'finished':item.projectStatus==3,'opened':item.isOvert }">
				<div class="project-info">
					<h2 v-text="item.projectName"></h2>
					<p v-text="'负责人 ' + item.pmName"></p>
					<p class="project-desc" v-if="item.projectDesc" v-html="item.projectDesc"></p>
					<ul class="tags">
						<li v-for="(tagItem,index) in item.tagList" :key="index" v-text="tagItem.projectTagName"></li>
					</ul>

					<div class="follow" v-on:click.stop="follow(item)" v-bind:class="{'followed':item.isFollow}" v-if="item.isFollow==1">
						<span>已关注</span>
					</div>
					<div class="follow" v-on:click.stop="follow(item)" v-bind:class="{'followed':item.isFollow}" v-if="item.isFollow==0">
						<span>关注</span>
					</div>
				</div>
				<div class="project-stage" v-bind:class="{ 'overdue': stageItem.isOverdue,'finished':stageItem.stageStatus==3}" v-for="(stageItem,index) in item.stageList"
				    :key="index">
					<div class="milestone">
						<p class="badge" v-text="stageItem.index"></p>
					</div>
					<div class="project-stage-info">
						<h3 v-text="stageItem.projectStageName" class="project-stage-name"></h3>
						<p v-if="stageItem.stageStatus==3">
							<span v-text="stageItem.beginTime"></span> - <span v-text="stageItem.overTime"></span> (
							<em v-text="stageItem.realEndTime"></em>) 共耗时
							<span v-text="stageItem.nowTime"></span>
						</p>
						<p class="cd" v-text="stageItem.nowTime" v-if="stageItem.stageStatus!=3&&stageItem.isOverdue==0"></p>
						<p class="post-content">
							<em v-text="stageItem.dynamicName"></em>
							<span v-html="stageItem.dynamicDetail"></span>
						</p>
					</div>
					<!--图片展示子组件-->
					<pictureShow v-bind:setphotoList="stageItem.showPhotograthList"></pictureShow>
				</div>
			</div>
			<!--加载更多-->
			<div class="more" v-on:click.stop="getMore" v-show="isShowmore">加载更多</div>
		</section>
		<div class="icon icon-plus float-button" v-on:click.stop="projectAddEvent"></div>


		<aside class="action-sheet" v-bind:class="{ 'show':isShowprojectAdd}">
			<ul class="menu">
				<li v-on:click.stop="projectAddEvent">开启事情</li>
				<li v-on:click.stop="pushSetting">推送设置</li>
				<li v-on:click.stop="aboutProject">关于闭环系统</li>
				<li class="cancel" v-on:click.stop="cancel">取消</li>
			</ul>
			<div class="mask" v-on:click.stop="cancel"></div>
		</aside>
		<!--信息提提示框-->
		<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
	</article>
</template>

<script>
	/**导入子组件  
	 * pictureShow 图片展示
	 * own 自己封装的js方法
	 * promptBox  提示框
	 **/
	import pictureShow from "../childComponents/pictureShow.vue"
	import promptBox from "../childComponents/promptBox.vue"
	import own from '../common/ownPackage.js'

	export default {
		name: 'projectList',
		data() {
			return {
				// 搜索框是否显示
				isShowSearch: "",
				// 搜索框的内容
				nullValue: "",
				// 事情列表信息
				projectListData: [],
				// 保存提示信息
				promptMessage: [],
				// 搜索框内容 按关键字查找事情
				searchData: {
					keyWorkds: "",
					page: 1, //页码
					number: 10, //每页显示的数量
					status: 0
				},
				// 传递过去的信息
				projectHeaders: {
					// 事情id
					projectId: "",
				},
				// 是否显示加载跟多
				isShowmore: "",
				// 是否异常
				isAbnormal: true,
				// 是否显示关键字
				isShowKeyword: "",
				// 是否显示事情新增
				isShowprojectAdd: "",
				// 是否显示网络出错
				isShowError: "",
				// 是否显示没有事情
				isShowNoproject: "",
				// 显示出来的搜索关键字
				showkeyWorkds: "",
				// 是否有进行中的事情
				isHaveProject: "",
				// 头部显示
				headInformation: "事情列表"
			}
		},
		created: function () {
			// 请求事情列表信息
			this.projectList()
			// 获取登录人的信息
			this.getfindUserInfo()
		},
		methods: {
			// 点击搜索
			search() {
				this.isShowSearch = !this.isShowSearch;
				this.nullValue = "";
				this.isShowprojectAdd = "";
			},
			// 确认
			affirm(resKeyword) {
				this.showkeyWorkds = resKeyword;
				// 显示关键字
				this.isShowKeyword = "true"
				this.searchData.page = 1;
				// 提示信息框内容清空
				this.promptMessage = [];
				this.isShowNoproject = "";
				const _this = this;
				// 判断是否为空
				if (this.searchData.keyWorkds) {
					// 取消输入框
					this.isShowSearch = !this.isShowSearch;
					const data = this.searchData;
					this.$axiosHttp.axiosPost("work-xproject/project/findProject.do", data).then(response => {
						if (response.code == 907) {
							_this.isShowNoproject = true;
							_this.isShowmore = "";
							_this.projectListData = [];
						} else if (response.code == 200) {
							_this.projectListData = response.data.projectList;
							_this.isShowmore = response.data.projectLoadMore;
							own.getTime(_this.projectListData);
						} else {
							_this.promptMessage.push(response.msg);
						}
					});
				} else {
					// 为空就显示全部
					this.isShowKeyword = "";
					this.isShowSearch = !this.isShowSearch;
					this.projectList();
				}
			},
			// 显示所有的事情
			displayAll() {
				this.headInformation = "事情列表";
				// 清空输入框
				this.searchData.keyWorkds = "";
				// 请求
				this.searchData.status = 0;
				this.projectList();
			},
			// 请求事情列表
			projectList(Value) {
				// 数据初始化
				this.isShowNoproject = "";
				this.isShowKeyword = "";
				this.searchData.keyWorkds = "";
				this.searchData.page = 1;
				// 分类查看
				if (this.$store.state.searchData.keyWorkds && this.$store.state.searchData.status > 0) {
					this.showkeyWorkds = this.$store.state.searchData.keyWorkds;
					this.isShowKeyword = "true";
				} else if (this.$store.state.searchData.keyWorkds && this.$store.state.searchData.status == 0) {
					this.showkeyWorkds = this.$store.state.searchData.keyWorkds;
					this.searchData = this.$store.state.searchData;
					this.isShowKeyword = "true";
				} else if (this.$store.state.searchData.status > 0) {
					this.searchData = this.$store.state.searchData;
				}
				// title显示 headInformation
				if (this.searchData.status == 1) {
					this.headInformation = "我参与的事情";
				} else if (this.searchData.status == 2) {
					this.headInformation = "我负责的事情";
				} else if (this.searchData.status == 3) {
					this.headInformation = "我关注的事情";
				} else if (this.searchData.status == 4) {
					this.headInformation = "已闭环的事情";
				}
				const _this = this;
				const data = Value || this.searchData;
				this.$axiosHttp.axiosPost("work-xproject/project/findProject.do", data).then(response => {
					if (response.code == 900) {
						_this.isShowNoproject = true;
						_this.isShowmore = "";
						_this.isHaveProject = !_this.isHaveProject;
						_this.projectListData = [];
					} else if (response.code == 200) {
						_this.projectListData = response.data.projectList;
						_this.isShowmore = response.data.projectLoadMore;
						// 绑定白名单数据
						this.$store.commit('SOME_NAME_lIST', response.data.isWhitePeople);
						own.getTime(_this.projectListData);
					} else if (response.code == 907) {
						_this.isShowNoproject = true;
					} else {
						// 显示
						_this.isShowError = "true";
						_this.isAbnormal = "";
					}
				});
			},
			// 点击跳转到详情页
			jumpDetails(item) {
				// 存请求的数据
				this.$store.commit('SOME_searchData_List', this.searchData);
				//绑定 存数据
				this.projectHeaders.projectId = item.projectId;
				// 跳转传参
				this.$router.push({
					name: 'projectDetails',
					query: this.projectHeaders
				});
			},
			// 点击展开列表
			showprojecAdd() {
				this.isShowprojectAdd = !this.isShowprojectAdd;
				// 收起搜索
				this.isShowSearch = "";
			},
			// 跳转到新增页面
			projectAddEvent() {
				//  默认
				this.searchData.status = 0;
				this.$store.commit('SOME_searchData_List', this.searchData);
				this.$router.push({
					name: 'projectAdd',
				});
			},
			// 跳转到推送页面
			pushSetting() {
				this.$router.push({
					name: 'systemSettings',
				});
			},
			// 跳转到关于闭环系统信息页面
			aboutProject() {
				this.$router.push({
					name: 'aboutProject',
				});
			},
			// 点击返回app页面
			goBackApp() {
				//返回app页
				if (this.$store.state.from) {
					window.location.href = "http://test.ceway.com.cn:7070/factory/#/showList?token=" + this.$store.state.token;
				} else if (typeof JSInterface === "undefined") {
					window.location.href = "next://http://iacloud.ceway.com.cn/app-xproject/";
				} else {
					JSInterface.changeActivity();
				}
			},
			// 点击加载更多
			getMore() {
				const _this = this;
				this.searchData.page++;
				const data = this.searchData;
				this.$axiosHttp.axiosPost("work-xproject/project/findProject.do", data).then(response => {
					if (response.code == 200) {
						_this.projectListData = _this.projectListData.concat(own.getTime(response.data.projectList));
						_this.isShowmore = response.data.projectLoadMore;
					}
				});
			},
			// 点击空白区域 隐藏事情编辑列表
			cancel() {
				this.isShowprojectAdd = "";
			},
			// 点击关注
			follow(resItem) {
				const data = {};
				data.projectId = resItem.projectId;
				this.$axiosHttp.axiosPost("work-xproject/projectNotification/followProject.do", data).then(response => {
					if (response.code == 200) {
						resItem.isFollow = response.data.isFollow
					}
				});
			},
			// 获取已关注
			isfollow() {
				this.searchData.status = 3;
				this.projectList(this.searchData)
			},
			// 获取负责的
			Conscientious() {
				this.searchData.status = 2;
				this.projectList(this.searchData)
			},
			// 获取参与
			partake() {
				this.searchData.status = 1;
				this.projectList(this.searchData)
			},
			// 已闭环的的
			endProject() {
				this.searchData.status = 4;
				this.projectList(this.searchData);
			},
			// 获取登录人的信息
			getfindUserInfo() {
				// 没有登录人信息  就获取
				if (this.$store.state.userInfo == "") {
					this.$axiosHttp.axiosPost("work-xproject/project/findUserInfo.do").then(response => {
						if (response.code == 200) {
							//   绑定用户信息
							this.$store.commit('GET_user_Info', response.data);
						}
					});
				}
				// 置空反馈内容
				this.$store.commit('GET_dynamicDetail_DATA', "");


			}
		},
		// 定义子组件
		components: {
			promptBox: promptBox,
			pictureShow: pictureShow
		},
	}
</script>