<template>
    <!--<div>
        <div>接受传递的参数：{{this.$route.query.userId}}</div>
        <div>欢迎{{$store.state.userInfo.userName}}登录！</div>
        <el-button type="primary" @click="logout">退出</el-button>
  </div>-->
    <el-container class="layout">
        <el-aside width="185px">
            <el-menu router class="left-menu" @select="handleSelect" @open="handleOpen"  @close="handleClose">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>导航一</span>
                    </template>
                    <el-menu-item-group>
                        <template slot="title">分组一</template>
                        <el-menu-item index="/first">选项1</el-menu-item>
                        <el-menu-item index="/login2">选项2</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>Header</el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Home',
    methods: {
        logout() {
            const userInfo = {
                userName: '',
                passWord: ''
            };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('isLogin', false);
            this.$store.dispatch('setUserInfo', userInfo);
            this.$store.dispatch('setIsLogin', false);
            this.$router.push('/login');
        },
        handleOpen(key, keyPath) { // 展开菜单
            console.log('key1:', key);
            console.log('keyPath1:', keyPath);
        },
        handleClose(key, keyPath) { // 折叠菜单
            console.log('key2:', key);
            console.log('keyPath2:', keyPath);
        },
        handleSelect(val1) {
            // this.$router.push(val1);
        }
    }
};
</script>
<style lang="scss" scoped>
    .layout{
        min-height: 100vh;
        .left-menu{
            width: 180px;
            min-height: 100vh;
        }
    }
</style>
