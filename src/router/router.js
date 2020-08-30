import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/login/Login.vue';
import Layout from '@/views/layout/Layout.vue';
import Table from '@/views/table/Table.vue';
import RichText from '@/views/richText/RichText.vue';
import BaiduMap from '@/views/baiduMap/BaiduMap.vue';
import AceEditor from '@/views/aceEditor/AceEditor.vue';
import LiuYao from '@/views/liuYao/LiuYao.vue';
import AdvancedSearch from '@/views/advancedSearch/AdvancedSearch.vue';
import JobExample from '@/views/jobExample/JobExample.vue';


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
            redirect: '/aceEditor',
            children: [{
                path: '/jobExample',
                name: 'jobExample',
                component: JobExample // 需要跳转的组件
            }, {
                path: '/table',
                name: 'table',
                component: Table // 需要跳转的组件
            }, {
                path: '/richText',
                name: 'richText',
                component: RichText // 需要跳转的组件
            }, {
                path: '/baiduMap',
                name: 'baiduMap',
                component: BaiduMap // 需要跳转的组件
            }, {
                path: '/aceEditor',
                name: 'aceEditor',
                component: AceEditor // 需要跳转的组件
            }, {
                path: '/liuYao',
                name: 'liuYao',
                component: LiuYao // 需要跳转的组件
            }, {
                path: '/advancedSearch',
                name: 'advancedSearch',
                component: AdvancedSearch
            }]
        }
    ]
});
router.beforeEach((to, from, next) => {
    const isLogin = window.localStorage.getItem('isLogin');// 路由守卫
    if (isLogin && isLogin == 'true') {
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
