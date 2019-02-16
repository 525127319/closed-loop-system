<template>
    <article>
        <header class="header">
            <span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
            <h1>点赞排行榜</h1>
            <span class="align-right" v-on:click="goProjectDetails">事情</span>

        </header>
        <section class="main">
            <ul class="list-view team-member">

                <li class="list-view-item" v-for="(item,index) in likesList" :key="index">
                    <span class="index" v-text="index+1">  </span>
                    <div class="media">
                        <img :src="item.headPortrait" alt="">
                    </div>
                    <div class="flex-item">
                        <h3 v-text="item.create_user_name"></h3>
                    </div>
                    <span class="count" v-text="item.likeSum"> </span>
                </li>

                <!--<li class="list-view-item">
                    <div class="media">
                        1
                    </div>
                    <div class="flex-item">
                        <h3>张三</h3>
                    </div>
                    <progress max="100" value="50"></progress>
                </li>-->

            </ul>
        </section>
    </article>
</template>


<script>
    export default {
        data() {
            return {
                // 点赞信息
                likesList: []
            }
        },
        created: function () {
            this.getlikesCharts()
        },
        methods: {
            // 获取反馈排行榜信息
            getlikesCharts() {
                const _this = this;
                this.$axiosHttp.axiosPost("work-xproject/ranking/findLikeRankingList.do").then(response => {
                    if (response.code = 200) {
                        _this.likesList = response.data;
                    } else {

                    }
                });

            },
            // 返回上一页
            goback() {
                this.$router.go(-1);
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