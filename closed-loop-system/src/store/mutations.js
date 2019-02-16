import * as types from "./mutation-types";

export default {
  //   显示loading
  [types.SET_LOADING_STATUS](state, status) {
    state.loading = status;
  },
  // 白名单
  [types.SOME_NAME_lIST](state, isWhitePeople) {
    state.isWhitePeople = isWhitePeople;
  },
  // 新建里程碑
  [types.SOME_newStageInfo_List](state, data) {
    state.newStageInfo = data;
  },
  // 搜索数据
  [types.SOME_searchData_List](state, data) {
    state.searchData = data;
  },
  // 是否可以滑动
  [types.SOME_Popup_List](state, data) {
    state.isPopupShow = data;
  },
  // 事情信息
  [types.GET_projectMessage_DATA](state, data) {
    state.projectMessage = data;
  },
  // 选中 @人
  [types.GET_selectedMan_DATA](state, data) {
    state.selectedMan = data;
  },
  // 选中 @人列表
  [types.GET_selectedList_DATA](state, data) {
    state.selectedList = data;
  },
  // 反馈内容
  [types.GET_dynamicDetail_DATA](state, data) {
    state.dynamicDetailInfo = data;
  },
  // 光标
  [types.SET_CURSOR_DATA](state, data) {
    state.cursor = data;
  },
  // 头部信息
  [types.SET_projectHead_Info](state, data) {
    state.projectHeadInfo = data;
  },
  // 用户信息
  [types.GET_user_Info](state, data) {
    state.userInfo = data;
  },
  // 个人信息
  [types.SET_userStatistics_Info](state, data) {
    state.userStatistics = data;
  },
  // 版本号
  [types.GET_version_Info](state, data) {
    state.version = data;
  },
  // 版本号
  [types.GET_from_Info](state, data) {
    state.from = data;
  },
  // token
  [types.GET_token_Info](state, data) {
    state.token = data;
  }
};
