<template>
	<div>
		<div class="form-item">
			<div class="label">目标</div>
			<div class="input">
				<input type="text" placeholder="里程碑总目标的描述..." v-model="bigTarget" v-on:input="inputFunc(bigTarget)">
			</div>
			<span class="icon icon-add" v-on:click="addTarget"></span>
			<p class="alert-message " v-text="myMessageTarget" v-show="!bigTarget" v-bind:class="{'show':myMessageTarget}"></p>
		</div>
		<ul class="todo-list" v-show="SmallTargetList.length>0">
			<li v-bind:class="{'done':item.todolistStatus}" v-for="(item,index) in SmallTargetList" :key="index">
				<span class="icon icon-checkbox"></span>
				<h4 v-text="item.todolistName"></h4>
				<span class="icon icon-close" v-if="item.todolistStatus!=1" v-on:click="remove(index,item)"></span>
			</li>
		</ul>
		<!--新增目标-->
		<aside class="dialog" v-bind:class="{ 'show': isShowTarget}">
			<section>
				<h3>增加小目标</h3>
				<section>
					<input type="text" v-if="isShowTarget" v-focus placeholder="请输入小目标的名称" v-model="SmallTarget">
				</section>
				<footer>
					<button v-on:click="cancel">取消</button>
					<button v-on:click="affirm">确认</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
		<!--删除目标-->
		<aside class="dialog" v-bind:class="{ 'show': isShowTargetEnd}">
			<section>
				<h3>确定删除该小目标？</h3>
				<!--<section>
					有可能将目标在硬盘中移除
				</section>-->
				<footer>
					<button v-on:click="cancelDeleteTarget">取消</button>
					<button v-on:click="affirmDeleteTarget()">确认</button>
				</footer>
			</section>
			<div class="mask"></div>
		</aside>
		<!--信息提提示框-->
		<promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
	</div>
</template>

<script>
	/**
	 *promptBox  提示框
	 **/
	import promptBox from "./promptBox.vue";

	export default {
		name: 'app',
		data() {
			return {
				// 总目标
				bigTarget: "",
				// 新增小目标输入框是否显示
				isShowTarget: false,
				// 新增小目标的内容
				SmallTarget: "",
				// 小目标列表
				SmallTargetList: [],
				// 提示信息
				promptMessage: [],
				// 删除目标提示框
				isShowTargetEnd: "",
				// 删除目标的信息
				index: "",
				item: "",
				// 处理数据  对象方式
				addTargetobject: {
					// 顺序
					sequence: 0
				},
			}
		},
		created: function () {
			// 获取小目标
			this.getSmallTarget();
			// 获取里程碑
			this.getBigTarget();
		},
		methods: {
			// 获取里程碑
			getBigTarget() {
				if (this.setTarget) {
					this.bigTarget = this.setTarget;
				}
			},
			// 获取小目标
			getSmallTarget() {
				if (this.setSmallTargetList) {
					this.SmallTargetList = this.setSmallTargetList;
				}
			},
			// 新增小目标
			addTarget() {
				this.isShowTarget = !this.isShowTarget
			},
			// 点击取消新增目标
			cancel() {
				this.isShowTarget = !this.isShowTarget
				this.SmallTarget = "";
			},
			// 点击移除目标
			remove(resIndex, resItem) {
				//    提示框
				this.isShowTargetEnd = !this.isShowTargetEnd;
				// 绑定数据
				this.index = resIndex;
				this.item = resItem;
			},
			// 点击取消删除目标
			cancelDeleteTarget() {
				this.isShowTargetEnd = "";
			},
			// 确认删除目标
			affirmDeleteTarget() {
				// 隐藏提示框
				this.isShowTargetEnd = "";
				// 删除
				this.SmallTargetList.splice(this.index, 1);
				// //修改并 传值给父组件
				this.$emit('upTarget', this.SmallTargetList);
				// 删除的
				this.item.isDelete = 1;
				this.$emit('upDeleteTarget', this.item);
			},
			// 点击确认添加目标名
			affirm() {
				// 判断是否重复
				let isRepeat = this.SmallTargetList.find(item => {
					return item.todolistName == this.SmallTarget
				})
				if (!this.SmallTarget) {
					return;
				} else if (isRepeat) {
					// 判断是否重复
					this.promptMessage.push("目标名重复")
				} else {
					var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
					if (this.SmallTarget.match(regRule)) {
						this.promptMessage.push("不支持输入表情");
						return;
					}
					//   存进小目标列表  以对象的形式传过去
					this.addTargetobject.todolistName = this.SmallTarget;
					this.addTargetobject.isDelete = 0;
					if (this.SmallTargetList.length == 0) {
						this.addTargetobject.sequence = 1;
					} else {
						this.addTargetobject.sequence = this.SmallTargetList[0].sequence + 1;
					}
					this.SmallTargetList.unshift(this.addTargetobject);
					// 取消输入框 并清空
					this.isShowTarget = !this.isShowTarget;
					this.SmallTarget = "";
					// 传值给父组件
					this.$emit('upTarget', this.SmallTargetList);
					this.addTargetobject = {};
				}
			},

			//   输入总目标
			inputFunc(resBigTarget) {
				this.$emit('upBigTarget', resBigTarget);
			},
		},

		props: ["myMessageTarget", "setTarget", "setSmallTargetList"],
		watch: {
			"setTarget": function () {
				if (this.setTarget) {
					this.bigTarget = this.setTarget;
				}
			},
			"setSmallTargetList": function () {
				if (this.setSmallTargetList) {
					this.SmallTargetList = this.setSmallTargetList;
				}
			}
		},
		// 定义子组件
		components: {
			promptBox: promptBox
		},
	}
</script>