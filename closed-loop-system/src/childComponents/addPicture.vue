<template>
    <div class="album-upload">

        <input type="button" v-on:click="testWebViewJavascriptBridge" />

        <!--  <input type="file" multiple accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="uploadImg($event)" /> -->

        <label class="icon icon-plus"></label>
    </div>

</template>
<script>
    import jsBridge from "../common/addPicture.js"
    export default {
        name: "image-html5-upload",
        data() {
            return {
                datas: ""
            }
        },
        created: function () {},
        methods: {
            // "uploadImg": function (e) {
            //     var files = [];
            //     if (typeof e.target === 'undefined') files = e[0];
            //     else files = e.target.files;
            //     files = Array.from(files);
            //     if (files.length > 9) {
            //         this.$emit('errorMessage', "一次上传不要超过9张");
            //         return;
            //     } else if (files.length == 0) {
            //         return;
            //     }
            //     var data = new FormData();
            //     files.forEach((file) => {
            //         data.append("files", file);
            //     });
            //     data.append("directory", "x-project-images");
            //     data.append("uploadFile", true);
            //     const _this = this;
            //     _this.$axiosHttp.axiosUpload('http://iacloud.ceway.com.cn/file/upload/changeImg', data).then(
            //         response => {
            //             if (response.ok == 1) {
            //                 _this.$emit('changeStatus', response.data);
            //             } else {
            //                 _this.$emit('errorMessage', "网络延迟上传失败");
            //             }
            //         })
            // },
            // ios原生方法
            testWebViewJavascriptBridge: function () {
                if (this.imgLength >= 9) {
                    this.$emit('errorMessage', "建议一个反馈不超过9张图");
                    return;
                } else if (!this.$store.state.version) {
                    this.$emit('errorMessage', "版本过低，请升级至最新版本");
                    return;
                }
                const _this = this;
                _this.$store.dispatch('setLoadingStatus', true);
                jsBridge.callHandler('chooseImage', {
                    'system': 'x-project', //图片保存的文件加
                    'count': 9, // 图片数量，默认不超过9张
                    'sizeType': 'original', // 可以指定是原图还是压缩图，默认二者都有
                    'sourceType': ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                }, function (response) {
                    _this.$store.dispatch('setLoadingStatus', false);
                    // 转成json对象
                    response = JSON.parse(response);

                    if (response.ok == 1) {
                        _this.$emit('changeStatus', response.data);
                    } else {
                        _this.$emit('errorMessage', "网络延迟上传失败");
                    }
                });
            },
        },
        props: ["imgLength"],
    }
</script>