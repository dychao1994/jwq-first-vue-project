<template>
    <!--<div class="login">
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
    </div>-->
    <div class="login">
        <div class="container demo-1">
            <div class="content">
                <div id="large-header" class="large-header" :style="{height: height}">
                    <canvas id="demo-canvas"></canvas>
                    <div class="logo_box">
                        <h3>欢迎你</h3>
                        <el-form ref="form" :model="form" label-width="80px">
                            <div class="input_outer">
                                <span class="u_user"></span>
                                <input v-model="form.userName" name="logname" class="text" style="color: #FFFFFF !important" type="text" placeholder="请输入账户">
                            </div>
                            <!--<el-form-item label="账号" prop="userName" :rules="[{ required: true, message: '账号不能为空'}]">
                                <el-input v-model="form.userName"  placeholder="请输入账号"></el-input>
                            </el-form-item>-->
                            <div class="input_outer">
                                <span class="us_uer"></span>
                                <input v-model="form.passWord" name="logpass" class="text" style="color: #FFFFFF !important; position:absolute; z-index:100;" type="password" placeholder="请输入密码" @keyup.enter="login">
                            </div>
                            <!--<el-form-item label="密码" prop="passWord"  :rules="[{ required: true, message: '密码不能为空'}]">
                                <el-input v-model="form.passWord"  placeholder="请输入密码" type="password"></el-input>
                            </el-form-item>-->
                            <div class="mb2" @click="login"><span class="act-but submit">登录</span></div>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
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
        ...mapGetters(['title']),
        height() {
            return `${window.innerHeight}px`;
        }
    },
    mounted() {
        require('../../assets/js/EasePack.min.js');
        require('../../assets/js/html5.js');
        require('../../assets/js/rAF.js');
        require('../../assets/js/TweenLite.min.js');
        require('../../assets/js/login.js');
        // this.$store.dispatch('setIsLogin', true);
        // this.$router.push({path: '/', params: {userId: 1}});
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
                    this.$router.push({path: '/', params: {userId: 1}});
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
    @import "../../assets/css/component.css";
    @import "../../assets/css/normalize.css";
    .login{
        background: #fff;
        color: #383a3c;
        font-weight: 400;
        font-size: 1em;
        line-height: 1.25;
        font-family: 'Raleway', Calibri, Arial, sans-serif;
        a, button {
            outline: none;
        }

        a {
            color: #566473;
            text-decoration: none;
        }

        a:hover, a:focus {
            color: #34495e;
        }

        section {
            padding: 1em;
            text-align: center;
        }

        p.ref {
            text-align: center;
            padding: 2em 1em;
        }
        .mb2{
            cursor: pointer;
            .act-but{
                background-color: $primary;
            }
        }
    }

    /*dede58.com 做最好的织梦整站模板下载网站
    *, *:after, *:before { -webkit-box-sizing: border-box; box-sizing: border-box; }
    .clearfix:before, .clearfix:after { content: ''; display: table; }
    .clearfix:after { clear: both; }*/



</style>
