<template>
	<div class="files-wrapper">
		<div class="form-item">
			<div class="label">交付文件</div>
			<div class="input">

			</div>
			<span class="icon icon-add" v-on:click="custom()"></span>

		</div>
		<ul class="files">
			<!--文件列表-->
			<li v-for="(item,index) in allAddFiles" :key="index">
				<span class="icon icon-file"></span>
				<p class="report" v-text="item.name"></p>
				<span class="icon icon-close" v-on:click="remove(index,item)"></span>
			</li>
		</ul>
		<!--新增文件-->
		<aside class="action-sheet" v-bind:class="{ 'show': isShowChildOrgList}">

			<div class="form">
				<div class="form-item">
					<div class="input">
						<input type="text" v-focus v-if="isShowChildOrgList" placeholder="请输入文件名" v-model="addFiles">
					</div>
					<button class="button" v-on:click="affirm">提交</button>
				</div>
			</div>
			<div class="mask" v-on:click="cancel"></div>
		</aside>
		<!--删除文件-->
		<aside class="dialog" v-bind:class="{ 'show': isShowFileEnd}">
			<section>
				<h3>确定删除此文件？</h3>
				<section>
					有可能将文件在硬盘中移除
				</section>
				<footer>
					<button v-on:click="cancelDeleteFile">取消</button>
					<button v-on:click="affirmDeleteFile()">确认</button>
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
				// 文件列表
				allAddFiles: [],
				// 新增文件输入框是否显示
				isShowChildOrgList: false,
				addFilesobject: {},
				// 新增文件的文件名
				addFiles: "",
				// 保存旧的
				oldFiles: [],
				// 错误提示信息
				promptMessage: [],
				// 删除文件提示框
				isShowFileEnd: "",
				// 删除文件的信息
				index: "",
				item: ""
			}
		},
		created: function () {
			// 获取传过来的文件
			this.getMyFile()
		},
		methods: {
			// 获取传过来的文件
			getMyFile() {
				if (this.myFile) {
					this.allAddFiles = this.myFile;
				}
			},
			// 点击新增
			custom() {
				this.isShowChildOrgList = !this.isShowChildOrgList;
			},
			// 点击取消新增文件
			cancel() {
				this.isShowChildOrgList = !this.isShowChildOrgList;
				this.addFiles = "";
			},
			// 点击取消删除文件
			cancelDeleteFile() {
				// 取消删除文件
				this.isShowFileEnd = ""
			},
			// 点击确认添加文件名
			affirm() {
				if (!this.addFiles) {
					return;
				} else if (this.oldFiles.indexOf(this.addFiles) != -1) {
					// 判断是否重复
					this.promptMessage.push("文件名重复")
				} else {
					var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
					if (this.addFiles.match(regRule)) {
						this.promptMessage.push("不支持输入表情");
						return;
					}
					this.oldFiles.push(this.addFiles)
					// 以对象的形式传过去
					this.addFilesobject.name = this.addFiles;
					// 保存进数组
					this.allAddFiles.unshift(this.addFilesobject);
					// 取消输入框 并清空
					this.isShowChildOrgList = !this.isShowChildOrgList;
					this.addFiles = "";
					// 传值给父组件
					this.$emit('upFile', this.allAddFiles);
					this.addFilesobject = {};
				}
			},

			// 点击移除文件
			remove(resIndex, resItem) {
				//    提示框
				this.isShowFileEnd = !this.isShowFileEnd;
				// 绑定数据
				this.index = resIndex;
				this.item = resItem;

			},
			// 确认删除文件
			affirmDeleteFile() {
				// 隐藏提示框
				this.isShowFileEnd = "";
				// 删除
				this.allAddFiles.splice(this.index, 1);
				//修改并 传值给父组件
				this.item.isDelete = 1;
				this.$emit('upRemoveFile', this.item);
			}
		},
		// 定义子组件
		components: {
			promptBox: promptBox
		},
		props: ["myFile"],
		watch: {
			"myFile": function () {
				if (this.myFile && this.myFile.length > 0) {
					this.allAddFiles = this.myFile;
				}
			}
		}
	}
</script>