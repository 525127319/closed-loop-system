import * as types from './mutation-types'

const LATENCY = 200;
let timeout = 0;
//响应速度小于200ms，取消显示
function asyncSetLoadingStatus(data, cb) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
        cb(data);
    }, LATENCY);
};

export const setLoadingStatus = ({
    commit
}, payload) => {
    asyncSetLoadingStatus(payload, message => {
        commit(types.SET_LOADING_STATUS, payload)
    })
};




