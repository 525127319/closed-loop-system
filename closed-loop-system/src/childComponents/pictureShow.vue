<template>
    <div class="images-wrapper">
        <ul class="post-images">
            <li v-for="(itemImg,index) in setphotoList" :key="index">
                <!--  <img :src="itemImg.showPhotograth" v-on:click.stop="bigimage(itemImg.showPhotograth,itemImg.photographId)" alt=""> -->
                <img :src="itemImg.showPhotograth" v-on:click.stop="showImage(itemImg)" alt="">
            </li>
        </ul>
        <!--信息提提示框-->
        <promptBox v-bind:setpromptMessage="promptMessage"></promptBox>
    </div>

</template>


<script>
    import jsBridge from "../common/addPicture.js"
    import promptBox from "./promptBox.vue";


    export default {
        data() {
            return {
                // 提示信息
                promptMessage: [],
            }
        },
        created: function () {},
        methods: {
            // 预览图片
            showImage(resImg) {
                if (!this.$store.state.version) {
                    this.promptMessage.push("版本过低，请升级至最新版本");
                    return;
                }
                const _this = this;
                var RowNnumber = this.setphotoList.indexOf(resImg) || 0;
                //  处理一下预览原图的list 高清图片
                var imgList = [];
                this.setphotoList.forEach((vaule, index) => {
                    imgList.push(vaule.originalPhoto)
                });
                jsBridge.callHandler('previewImage', {
                    'current': resImg.showPhotograth, // 当前显示图片的http链接
                    'urlList': imgList, //当前显示图片的list
                    'RowNnumber': RowNnumber, //该图片在列表的位置
                    'isDelete': false //是否需要删除功能
                }, function (response) {

                })
            }
        },
        props: ["setphotoList"],
        // 定义子组件
        components: {
            promptBox: promptBox
        },
    }
</script>