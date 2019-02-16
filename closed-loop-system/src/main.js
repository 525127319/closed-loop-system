import "babel-polyfill";
import Vue from "vue";
import app from "./app.vue";
import vueRouter from "vue-router";
import Axios from "axios";
import store from "./store/index";
import "./assets/css/index.css";
import Utils from "./common/utils.js";
import AxiosConfig from "./config/axiosConfig.js";
import AxiosHttp from "./common/axiosHttp.js";
import Bus from "./common/busVue.js";
import RouteConfig from "./config/routeConfig.js";
// import echarts from "echarts";

// 改写原型链，注册全局方法
Vue.prototype.$axios = Axios;
Vue.prototype.$axios_config = AxiosConfig;
Vue.prototype.$utils = Utils;
Vue.prototype.$axiosHttp = AxiosHttp;
Vue.prototype.$bus = Bus;
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

// Vue.config.silent = true;
// 定义并配置路由
Vue.use(vueRouter);

const router = new vueRouter({
  routes: RouteConfig.routes
});

// 注册一个全局自定义指令 v-focus
Vue.directive("focus", {
  // 当绑定元素插入到 DOM 中。
  inserted: function(el) {
    // 聚焦元素
    el.focus();
  }
});
var vue = new Vue({
  el: "#app",
  router,
  store,
  // created: function() {
  //   // pro的环境请取消以下代码注释
  //   // 添加手机端传过来的token放入请求头中
  //   const token = Utils.getUrlKey("token");
  //   // 保存版本号
  //   const version = Utils.getUrlKey("version");
  //   // 保存版本号
  //   const from = Utils.getUrlKey("from");
  //   // 保存从智慧工厂调过来的字段信息
  //   this.$store.commit("GET_from_Info", from);
  //   // 保存头部信息
  //   this.$store.commit("GET_version_Info", version);
  //    // 保存token
  //   this.$store.commit("GET_token_Info", token);
 
  //   AxiosConfig.headers.Authorization = "Bearer " + token;
  // },
  render: h => h(app)
});
