<template>
    <div id="app">
        <loading :show='state'></loading>
        <transition name="fade" mode="out-in">
            <!--<keep-alive include="projectList">
                <router-view></router-view>
            </keep-alive>-->
            <router-view></router-view>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">
    import {
        mapGetters
    } from 'vuex';
    import Loading from './childComponents/base/loading.vue';

    export default {
        name: 'app',
        computed: {
            ...mapGetters([
                'loading',
            ])
        },
        data() {
            return {
                state: false
            }
        },
        watch: {
            loading: function (val) {
                this.state = val;
            },
            deep: true
        },
        components: {
            Loading
        }
    }
</script>
<style type="text/css" scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>