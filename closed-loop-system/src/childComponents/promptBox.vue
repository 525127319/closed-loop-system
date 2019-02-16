<template>

	<aside class="toast" v-bind:class="{'show':isShowPromptBox,'ok':isok ,'faild':!isok}">
		<div v-for="(item,index) in setpromptMessage" :key="index" v-text="item"></div>
	</aside>

</template>
<script>
	export default {
		name: 'app',
		data() {
			return {
				// 提示框是否显示
				isShowPromptBox: "",
				// 是否显示成功的演示
				isok: true,
			}
		},
		created: function () {
			this.getfirst()
		},
		methods: {
			// 处理选择多个经理人提示信息
			getfirst() {
				const _this = this;
				if (this.setpromptMessage.length > 0) {
					var re = /\s/; //判断后面是否有 空格特殊符号
					_this.isok = re.test(_this.setpromptMessage)
					this.isShowPromptBox = true;
					setTimeout(function () {
						_this.isShowPromptBox = "";
					}, 1500)
				}
			}
		},
		props: ["setpromptMessage"],
		watch: {
			"setpromptMessage": function () {
				const _this = this;
				if (this.setpromptMessage.length > 0) {
					var re = /\s/; //判断后面是否有 空格特殊符号
					_this.isok = re.test(_this.setpromptMessage)
					// 显示
					_this.isShowPromptBox = true;
					setTimeout(function () {
						_this.isShowPromptBox = "";
					}, 1500)
				}
			}
		}
	}
</script>