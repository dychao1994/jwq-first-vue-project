import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/login/Login.vue';
import Home from '@/views/home/Home.vue';
import Table from '@/views/table/Table.vue';
import Layout from '@/views/layout/Layout.vue';

// 通过Vue的use方法注入Router
Vue.use(Router);

const router = new Router({
    linkActiveClass: 'active', // 指定路由选中时的样式类名
    hashbang: true, // 将路径格式化为#!开头
    history: true, // 启用HTML5 history模式，可以使用pushState和replaceState来管理记录
    /**
	 * @desc 路由配置配置具体的路径
	 */
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login // 需要跳转的组件
        },
        {
            path: '/',
            name: 'Layout',
            component: Layout,
            redirect: '/first',
            children: [{
                path: '/first',
                name: 'FirstPage',
                component: Table // 需要跳转的组件
            }, {
                path: '/login2',
                name: 'Login2',
                component: Home // 需要跳转的组件
            }, {
                path: '/table',
                name: 'table',
                component: Table // 需要跳转的组件
            }]
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
