<template>
    <div class="login">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="账号" prop="userName" :rules="[{ required: true, message: '账号不能为空'}]">
                <el-input v-model="form.userName"  placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passWord"  :rules="[{ required: true, message: '密码不能为空'}]">
                <el-input v-model="form.passWord"  placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="primary" @click="edit">修改</el-button>
        <div>{{title}}</div>
        <div v-if="$store.state.isLogin">已登录</div>
        <div v-else>未登录</div>
        <div>{{$store.state.isLogin? '已登录' : '未登录'}}</div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';// 引入vuex-mapGettersf方法
export default {
    name: 'Login',
    data() {
        return {
            form: {
                userName: '',
                passWord: ''
            }
        };
    },
    computed: {
        ...mapGetters(['title'])
    },
    methods: {
        login() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    /**
                     * l路径跳转
                     * this.$router.push({path: '/home', params: {userId: 1}});
                     * 2.命名路由传递参数可以使用params或query来传递
                     * this.$router.push({name: 'Home', query: {userId: 1}});
                     */
                    localStorage.setItem('userInfo', JSON.stringify(this.form));// 存字符串
                    localStorage.setItem('isLogin', true);
                    this.$store.dispatch('setUserInfo', this.form);
                    this.$router.push({path: '/first', params: {userId: 1}});
                } else {
                    this.$message.error('请根据页面提示填写内容！');
                    return false;
                }
            });
        },
        edit() {
            this.$store.dispatch('setIsLogin', true);
        }
    }
};
</script>

<style lang="scss" scoped>
    .login{
        border: 1px solid red;
    }

</style>
