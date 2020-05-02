import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
// 创建一个store仓库
const store = new Vuex.Store({
    // 声明变量
    state: {
        title: '首页',
        // 为了在 重新刷新页面的时候保存页面的状态
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {
            userName: '',
            passWord: ''
        },
        isLogin: JSON.parse(localStorage.getItem('isLogin')) || false// 是否登录
    },
    // 获取数据
    getters: {
        title: state => state.title,
        userInfo: state => state.userInfo,
        isLogin: state => state.isLogin
    },
    // 修改state
    mutations: {
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_IS_LOGIN: (state, isLogin) => {
            state.isLogin = isLogin;
        }
    },
    // 行为-异步
    actions: {
        setUserInfo: ({commit}, userInfo) => {
            commit('SET_USER_INFO', userInfo);
        },
        setIsLogin: ({commit}, isLogin) => {
            commit('SET_IS_LOGIN', isLogin);
        }
    }
});
export default store;
