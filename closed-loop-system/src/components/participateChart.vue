<template>
    <article>
        <header class="header">
            <span class="align-left icon icon-arrow-left" v-on:click="goback"></span>
            <h1>参与事情排行榜</h1>
            <span class="align-right" v-on:click="goProjectDetails">事情</span>

        </header>
        <section class="main">
            <ul class="list-view team-member">
                <li class="list-view-item" v-for="(item,index) in ParticipatList" :key="index">
                    <span class="index" v-text="index+1">  </span>
                    <div class="media">
                        <img :src="item.headPortrait" alt="">
                    </div>
                    <div class="flex-item">
                        <h3 v-text="item.user_name"></h3>
                    </div>
                    <span class="count" v-text="item.projectSum"> </span>
                </li>
            </ul>

        </section>

    </article>
</template>


<script>
    export default {
        data() {
            return {
                // 参与事情排行榜信息
                ParticipatList: []
            }
        },
        created: function () {
            this.getParticipateChart()
        },
        methods: {
            // 获取参与事情排行榜信息
            getParticipateChart() {
                const _this = this;
                this.$axiosHttp.axiosPost("work-xproject/ranking/findProjectRankingList.do").then(response => {
                    if (response.code = 200) {
                        _this.ParticipatList = response.data;
                    } else {

                    }
                }, this);

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