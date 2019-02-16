<template>
	<div class="tags-wrapper">
		<!--自定义标签-->
		<div class="form-item">
			<div class="label">标签</div>
			<div class="input">
				<ul class="tags">
					<li v-for="(item,index) in newArr" :key="index" v-on:click="deleteTag(item,index)" v-text="item.projectTagName"></li>
				</ul>
			</div>
			<span class="add-tag icon icon-add" v-on:click="custom()"></span>
		</div>
		<!--标签列表-->
		<ul class="tags">
			<li v-for="(item,index) in items" :key="index" v-on:click="selact(item,index)" v-text="item.projectTagName"></li>
		</ul>
		<!--自定义标签框-->
		<aside class="action-sheet" v-bind:class="{ 'show': isShowChildOrgList}">
			<div class="form">
				<div class="form-item">
					<div class="input">
						<input type="text" autofocus="true" placeholder="请输入自定义标签" v-model="LabelName">
					</div>
					<button class="button" v-on:click="affirm">提交</button>
				</div>
			</div>
			<div class="mask" v-on:click="cancel"></div>
		</aside>
		<!--信息提提示框-->
		<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
	</div>
</template>

<script>
	/**
	 * promptBox   提示框
	 * 
	 */
	import promptBox from './promptBox.vue'

	export default {
		name: 'app',
		data() {
			return {
				// 标签列表数据
				items: [],
				// 选中列表数据
				newArr: [],
				// 自定义标签是否提示
				isShowChildOrgList: false,
				// 自定义标签的内容
				LabelName: "",
				// 输入内容为空提示框是否提示
				nullValueshow: "",
				// 提示信息
				promptMessage: [],
			}
		},

		created: function () {

			// // 获取传递过来的标签信息
			// this.getMyMessage();


			// // 获取标签信息
			// this.addProjectTag();

		},
		methods: {

			// 获取传递过来的修改标签信息
			getMyMessage() {
				if (this.myMessage) {
					this.newArr = this.myMessage;
				}
			},
			// 请求标签列表数据
			addProjectTag() {
				const _this = this;
				// 制空
				this.promptMessage = [];
				this.$axiosHttp.axiosPost("work-xproject/projectTag/findAllTag.do").then(response => {
					if (response.code == 200) {
						_this.items = response.data;
						_this.items = _this.items.filter(function (item) {
							let find = _this.newArr.find((newArrItem) => {
								return newArrItem.projectTagName === item.projectTagName;
							});
							if (find) {
								return false;
							} else {
								return true;
							}
						})
					} else if (response.code == 901) {
						this.promptMessage.push("标签库为空");
					}
				});
			},
			// 添加标签
			selact(item, index) {
				if (this.newArr.length >= 10) {
					this.promptMessage.push("标签过多");
					return;
				}
				// 从标签列表中移除
				this.items.splice(index, 1);
				// 添加到选中列表
				this.newArr.push(item);
				// 传值给父组件
				this.$emit('upTag', this.newArr);
			},
			// 删除标签
			deleteTag(item, index) {
				this.newArr.splice(index, 1);
				this.items.push(item);
			},
			// 新增
			custom() {
				this.isShowChildOrgList = !this.isShowChildOrgList;
				this.nullValueshow = "";
			},
			// 取消
			cancel() {
				this.isShowChildOrgList = !this.isShowChildOrgList;
				this.nullValueshow = "";
				this.LabelName = "";
			},
			// 确认
			affirm() {
				const _this = this;
				// 制空
				this.promptMessage = [];
				var data = {
					projectTagName: this.LabelName
				};
				if (!this.LabelName) {
					this.nullValueshow = true;
					return false;
				} else if (this.LabelName.length >= 12) {
					this.promptMessage.push("标签字数限制为12，请核对后再提交");
				} else {
					// 取消输入框
					this.isShowChildOrgList = !this.isShowChildOrgList;
					this.$axiosHttp.axiosPost("work-xproject/projectTag/insertTagBase.do", data).then(response => {
						if (response.code == 200) {
							//返回标签添加到标签库
							var newTag = {}
							newTag.projectTagId = response.data.projectTagId
							newTag.projectTagName = response.data.projectTagName
							this.items.unshift(newTag)

						} else if (response.code == 905) {
							this.promptMessage.push("自定义标签重复");
						} else if (response.code == 908) {
							this.promptMessage.push("自定义标签字数不超过12个");
						} else if (response.code == 906) {
							this.promptMessage.push("自定义标签不合法");
						}
					});
					this.LabelName = "";
				}
			}
		},
		// 定义子组件
		components: {
			promptBox: promptBox,
		},
		props: ["myMessage", "isHaveTagListAll"],
		watch: {
			"myMessage": function () {
				if (this.myMessage && this.myMessage.length > 0) {
					const _this = this;
					this.newArr = this.myMessage;
					this.addProjectTag()
					// _this.items = _this.items.filter(function (item) {
					// 	let find = _this.newArr.find((newArrItem) => {
					// 		return newArrItem.projectTagName === item.projectTagName;
					// 	});
					// 	if (find) {
					// 		return false;
					// 	} else {
					// 		return true;
					// 	}
					// })
				}
			},
			// "isHaveTagListAll": function () {
			// 	if (this.isHaveTagListAll.length > 0) {
			// 		this.items = this.isHaveTagListAll;
			// 	}
			// }
		}
	}
</script>