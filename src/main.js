import Vue from 'vue';
import App from './App.vue';
import './plugins/element.js';
import VueRouter from 'vue-router';
// 导入路由
import router from './router/router';
// 仓库
import store from './store';
// 公用样式
import './assets/css/reset.css';
//  引入阿里巴巴icon
import './assets/iconfont/iconfont.css';
// 通过Vue的use方法注入VueRouter
Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');
