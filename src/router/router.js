import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/login/Login.vue';
import Home from '@/views/home/Home.vue';

// 2.通过Vue的use方法注入Router
Vue.use(Router);

const router = new Router({
    // 指定路由选中时的样式类名
    linkActiveClass: 'active',
    hashbang: true, // 将路径格式化为#!开头
    history: true, // 启用HTML5 history模式，可以使用pushState和replaceState来管理记录
    /**
	 * 4.@desc 路由配置配置具体的路径
	 */
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login // 需要跳转的组件
        },
        {
            path: '/',
            name: 'Home',
            component: Home // 需要跳转的组件
        }
    ]
});
router.beforeEach((to, from, next) => {
    const isLogin = window.localStorage.getItem('isLogin');// 路由守卫
    if (isLogin == 'true') {
        next();
    } else {
        if (to.path == '/login') {
            next();
        } else {
            next('/login');
        }
    }
});
// 5.导出路由
export default router;
