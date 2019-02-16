import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const state = {
  loading: false, //loading,
  isWhitePeople: "", //白名单
  newStageInfo: [], //新建里程碑信息
  searchData: [], //主页面搜索数据
  isPopupShow: "", //是否可以滑动
  projectMessage: {}, //事情id
  selectedMan: {}, //选中的人
  selectedList: [], //选中的人
  dynamicDetailInfo: {}, //反馈内容
  cursor: "", //光标的位置
  projectHeadInfo: "", //专案头部的信息
  userInfo: "", //用户信息
  userStatistics: "", //个人信息
  version: "", //版本号
  from:"",//智慧工厂带过来的信息
  token:"",//token
};
/*
 *       state: Vuex状态存储
 *       getters: 获取state状态信息
 *       mutations: 更改Vuex的store 中的状态的唯一方法是提交 mutation
 *       actions: 通过Action提交mutation,可以包含任意异步操作
 *       mutation-types: mutations类型，通过key值指向mutations
 */
// const debug = process.env.NODE_ENV !== 'production';   //非生产环境下，进入debug模式

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
});
