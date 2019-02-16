<template>
	<article>
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
			<h1>关于闭环系统</h1>
			<!--<span class="align-right">新增</span>-->
		</header>
		<section class="main-body">
			<div class="about">
				<h2>闭环系统</h2>
			</div>
			<ul class="step">
				<li>
					<div class="date">2017 10 28</div>
					<h2>V1.2.0</h2>
					<p><em>增加js桥接</em> 优化图片上传的功能</p>
					<p>解决组织选人的问题</p>
					<p>修复UI的一些小细节</p>
				</li>
				<li>
					<div class="date">2017 10 12</div>
					<h2>V1.1.0</h2>
					<p><em>增加公开的事情</em></p>
					<p><em>新增反馈中的@功能 (部分安卓机器不支持)</em></p>
					<p>新建事情自动增加一个里程碑和反馈</p>
					<p>修改小目标的添加和删除方式</p>
					<p>增加里程碑倒计时</p>
					<p><em>调整UI样式</em></p>
					<p>修改ios 日期bug，更新banner图，选人页面不会出滚动条</p>
					<p>修改负责人bug</p>
				</li>
				<li>
					<div class="date">2017 09 22</div>
					<h2>V1.0.1</h2>
					<p><em>增加小目标</em></p>
					<p>给app增加beta字样</p>
					<p>首页标注已结束的里程碑</p>
					<p>小目标排序和placeholder的提示</p>
					<p>还会弹出登录超时的提醒</p>
					<p>推送的信息点击进入后，直接录入反馈会报错</p>
					<p>列表默认20条，反馈默认20条</p>
					<p>事件数修改为反馈信息数</p>
					<p>输入小目标的方式改为弹窗，最好可以tab切换下一个。</p>
					<p>参与人默认关注事情</p>
					<p>首页标题栏文字，根据过滤项来显示完整的文字，如：我关注的事情</p>
					<p>关注的样式</p>
					<p>进度条按照小时来计算，样式为引线燃烧的炸弹，逾期为爆炸。</p>
				</li>
				<li>
					<div class="date">2017 09 09</div>
					<h2>V1.0.0</h2>
					<p>增加上传图片的功能</p>
					<p>增加推送设置的功能，推送关联事情</p>
					<p>为兼容ios完全抛弃了dropdown，改为action sheet</p>
					<p>修改toast组件</p>
				</li>

			</ul>
		</section>
	</article>
</template>
<script>
	export default {
		name: 'app',
		data() {
			return {

			}
		},
		created: function () {},
		methods: {
			goback() {
				this.$router.replace("/projectList");
			},
		},

	}
</script>