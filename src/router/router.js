import Vue from 'vue';
import Router from 'vue-router';

const Login = () => import('@/views/login/Login.vue');
const Layout = () => import('@/views/layout/Layout.vue');

const RichText = () => import('@/views/richText/RichText.vue');
const BaiduMap = () => import('@/views/baiduMap/BaiduMap.vue');
const AceEditor = () => import('@/views/aceEditor/AceEditor.vue');
const LiuYao = () => import('@/views/liuYao/LiuYao.vue');
const AdvancedSearch = () => import('@/views/advancedSearch/AdvancedSearch.vue');

const AutoExample = () => import('@/views/jobExample/autoExample/AutoExample.vue');
const Table = () => import('@/views/jobExample/table/Table.vue');


const ChinaCalendar = () => import('@/views/chinaCalendar/ChinaCalendar.vue');

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
            redirect: '/jobExample/autoExample',
            children: [{
                path: '/jobExample/autoExample',
                name: 'autoExample',
                component: AutoExample
            }, {
                path: '/jobExample/table',
                name: 'table',
                component: Table
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
            }, {
                path: '/chinaCalendar',
                name: 'chinaCalendar',
                component: ChinaCalendar
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
