<template>
	<article>
		<header class="header">
			<span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
			<h1>个人统计信息</h1>
			<span class="align-right" v-on:click="goProjectDetails">事情</span>
		</header>
		<section class="main-body">
			<div class="user-profile">
				<div class="avatar">
					<img :src="headPortrait" alt="">
				</div>
				<h2 v-text="userName"></h2>
				<div class="dept button" v-on:click="goDeptChart" v-text="department.title">
				</div>
			</div>


			<ul class="project-count">
				<li v-on:click="goParticipateChart">
					<span v-text="SumData.projectSum"></span>
					<span>参与事情</span>
				</li>
				<li v-on:click="goDynamicChart">
					<span v-text="SumData.dynamicSum"></span>
					<span>反馈</span>
				</li>
				<li v-on:click="goCommentChart">
					<span v-text="SumData.replySum"></span>
					<span>回复</span>
				</li>
				<li v-on:click="goLikesChart">
					<span v-text="SumData.likeSum"></span>
					<span>点赞</span>
				</li>
			</ul>

			<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
			<div class="chart" id="myEcarts" :style="{height: '350px'}"></div>

		</section>

	</article>
</template>


<script>
	export default {
		data() {
			return {
				// 图表库
				mycharts: "",
				// 图表库数据信息
				myOption: "",
				// 头像
				headPortrait: "",
				// 用户名
				userName: "",
				// 部门
				department: "",
				// 总的统计数
				SumData: {}
			}
		},
		created: function () {
			//请求活跃度
			this.getActivityDegree()
		},
		mounted: function () {
			// 基于准备好的dom，初始化echarts实例
			this.mycharts = this.$echarts.init(document.getElementById('myEcarts'))
			// 指定图表的配置项和数据
			this.myOption = {
				title: {
					show: false,
					text: '活跃度',
					subtext: '参与次数',
					left: '20px',
					align: 'center',
					textStyle: {
						color: '#ffcc00',
					},
				},
				color: ['#007aff', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074',
					'#546570', '#c4ccd3'
				],
				tooltip: {
					show: true,
					dataView: false,
				},
				legend: {
					// data: ['参与次数']
				},
				xAxis: {
					data: ["", "", "", "", "", "", ""]
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: '{value}次'
					}
				},
				series: [{
					name: '参与次数',
					type: 'line',
					data: [0, 0, 0, 0, 0, 0, 0],
					// data: [5, 20, 36, 10, 10, 20, 18],
					markPoint: {
						data: [
							// {
							// 	name: '最大值',
							// 	type: 'max'
							// },
							// {
							// 	name: '最小值',
							// 	type: 'min',
							// 	color: 'green',
							// },
						]
					},
					markLine: {
						data: [{
								name: '平均线',
								// 支持 'average', 'min', 'max'
								type: 'average'
							},
							{
								name: 'Y 轴值为 100 的水平线',
								yAxis: 100
							},
						]
					},
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			this.mycharts.setOption(this.myOption);
		},
		methods: {
			// 获取活跃度
			getActivityDegree() {
				const _this = this;
				const data = {};
				data.userId = this.$store.state.userStatistics.userId;
				this.$axiosHttp.axiosPost("work-xproject/ranking/findUserVitalityInSevenDay.do", data).then(response => {
					if (response.code = 200) {
						// 头像
						_this.headPortrait = response.data.headPortrait;
						// 用户名
						_this.userName = response.data.userName;
						// 所属部门
						_this.department = response.data.department;
						// 活跃
						_this.myOption.series[0].data = response.data.vitalitySum;
						//时间
						_this.myOption.xAxis.data = response.data.countDate;
						//  总的统计数
						_this.SumData = response.data.SumData
						// 调用图表库
						_this.mycharts.setOption(_this.myOption);
					} else {
						console.log("获取失败")
					}
				});
			},
			// 跳转的部门排行榜
			goDeptChart() {
				this.$router.push({
					name: "deptChart",
					params: this.department
				})
			},


			// 跳转到参与事情排行榜
			goParticipateChart() {
				this.$router.push({
					name: "participateChart"
				})
			},
			// 跳转到回复(评论)排行榜
			goCommentChart() {
				this.$router.push({
					name: "commentChart"
				})
			},
			// 跳转到反馈排行榜
			goDynamicChart() {
				this.$router.push({
					name: "dynamicChart"
				})
			},
			// 跳转到点赞排行榜
			goLikesChart() {
				this.$router.push({
					name: "LikesChart"
				})
			},

			// 返回上一页
			goback() {
				this.$router.push({
					name: "projectParticipant",
				})
			},

			//返回事情详情
			goProjectDetails() {
				this.$router.push({
					name: "projectDetails",
				})
			}
		},
	}
</script>