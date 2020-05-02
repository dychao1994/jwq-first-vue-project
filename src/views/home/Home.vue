<template>
    <div>
        <div>接受传递的参数：{{this.$route.query.userId}}</div>
        <div>欢迎{{$store.state.userInfo.userName}}登录！</div>
        <el-button type="primary" @click="logout">退出</el-button>
    </div>
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
        }
    }
};
</script>
<style scoped>

</style>
