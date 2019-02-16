<template>
    <div class="load icon icon-reload loader" :class="{ show: show }"></div>
</template>

<script>
    // import {
    //     mapGetters
    // } from 'vuex'

    export default {
        name: 'load',
        props: {
            show: {
                type: Boolean,
                default: false
            }
        }
    }
</script>