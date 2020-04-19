<template>
    <div class="login">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="账号" prop="username" :rules="[{ required: true, message: '账号不能为空'}]">
                <el-input v-model="form.username"  placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password"  :rules="[{ required: true, message: '密码不能为空'}]">
                <el-input v-model="form.password"  placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="open">登录</el-button>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            form: {
                username: '',
                password: ''
            }
        };
    },
    methods: {
        open() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // this.$router.push({path:'/home'},params: { userId:1}) //l路径跳转
                    // 2.命名路由传递参数可以使用params或query来传递
                    this.$router.push({name: 'Home', query: {userId: 1}});
                } else {
                    this.$message.error('请根据页面提示填写内容！');
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    .login{
        border: 1px solid red;
    }

</style>
