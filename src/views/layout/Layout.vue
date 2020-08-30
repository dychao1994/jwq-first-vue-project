<template>
    <!--<div>
        <div>接受传递的参数：{{this.$route.query.userId}}</div>
        <div>欢迎{{$store.state.userInfo.userName}}登录！</div>
        <el-button type="primary" @click="logout">退出</el-button>
  </div>-->
    <el-container class="layout">
        <el-aside width="160px">
            <div class="logo-header">
                <img src="@/assets/img/logo.png" alt="">
                <span>学习中心</span>
            </div>
            <el-menu
                :text-color="modeConfig[mode].textColor"
                :active-text-color="modeConfig[mode].activeTextColor"
                :background-color="modeConfig[mode].backgroundColor"
                :default-active="activeIndex"
                router
                class="left-menu"
                :class="mode + '-menu'"
                @select="handleSelect"
                @open="handleOpen"
                @close="handleClose">
                <el-menu-item index="/jobExample">
                    <i class="iconfont icon-learning-table" />
                    工作例子
                </el-menu-item>
                <el-menu-item index="/table">
                    <i class="iconfont icon-learning-table" />
                    表格
                </el-menu-item>
                <el-menu-item index="/richText">
                    <i class="iconfont icon-learning-rich-text" />
                    富文本
                </el-menu-item>
                <el-menu-item index="/baiduMap">
                    <i class="iconfont icon-learning-map" />
                    百度地图
                </el-menu-item>
                <el-menu-item index="/aceEditor">
                    <i class="iconfont icon-learning-editor" />
                    aceEditor
                </el-menu-item>
                <el-menu-item index="/liuYao">
                    <i class="iconfont icon-learning-wuxing" />
                    六爻
                </el-menu-item>
                <el-menu-item index="/advancedSearch">
                    <i class="iconfont icon-learning-wuxing" />
                    高级检索
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="header">
                <el-button type="default" size="mini" icon="iconfont icon-learning-quit" circle @click="logout"></el-button>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Layout',
    props: {
        mode: {
            type: String,
            default: 'dark'
        }
    },
    data() {
        return {
            modeConfig: {
                dark: {
                    textColor: '#FFFFFF',
                    activeTextColor: '#FFFFFF',
                    iconColor: '#FFFFFF',
                    backgroundColor: '#022348'
                },
                light: {
                    textColor: '#333333',
                    iconColor: '#666666',
                    backgroundColor: '#FFFFFF'
                },
                simple: {
                    textColor: '#333333',
                    iconColor: '#666666',
                    backgroundColor: '#EFF2F8'
                }
            }
        };
    },
    computed: {
        activeIndex() {
            return this.$route.meta.activeIndex || this.$route.path;
        }
    },
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
            this.$router.replace('/login');
            location.reload();
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
<style lang="scss">
    .layout{
        min-height: 100vh;
        .logo-header{
            height: 54px;
            background-color: $dark-bg;
            color: #ffffff;
            line-height: 54px;
            font-size: 18px;
            padding-left: 16px;
            overflow: hidden;
            display: flex;
            align-items: center;
            transition: width .3s ease-in-out;
            white-space: nowrap;
            img{
                width: 26px;
            }
            span{
                padding-left: 10px;
                font-weight: 500;
                color: white;
            }
        }
        .left-menu{
            width: 160px;
            height: calc(100% - 54px);
            border-right: 0;
            overflow-y: auto;
            overflow-x: hidden;
            /deep/.el-submenu__title:hover{
                background:  transparent  !important;
            }

            .el-menu-item{
                &:hover{
                    background:transparent !important;
                }
            }
            .el-menu-item, /deep/.el-submenu__title{
                height: 40px;
                line-height: 40px;
            }
            .el-submenu .el-menu-item{
                min-width: 160px;
            }
            .el-submenu.is-active.is-opened{
                background: transparent !important;
                .el-submenu__title{
                    background:transparent !important;
                }
            }
            .iconfont{
                vertical-align: middle;
                margin-right: 6px;
                width: 24px;
                text-align: center;
                font-size: 16px !important;
            }
        }
        .dark-menu {
            .el-menu-item.is-active{
                background: $primary !important;
            }
            .el-submenu.is-active{
                background: $primary !important;
                .el-submenu__title{
                    background: $primary !important;
                }
            }
            i{
                color: #FFFFFF;
            }
        }

        .light-menu {
            i{
                color: $text-regular;
            }
            .el-menu-item.is-active{
                background: $primary-light !important;
                border-right: 3px solid $primary;
                color: $primary;
                i{
                    color: $primary;
                }
            }
            .el-submenu.is-active.is-opened{
                border-right: none;
            }
            .el-submenu.is-active{
                background: $primary-light !important;
                border-right: 3px solid $primary;
                .el-submenu__title{
                    background: $primary-light !important;
                }
            }

        }

        .simple-menu{
            .el-menu-item{
                border-left: 2px solid $simple-bg;
            }
            .el-menu-item.is-active{
                background: white !important;
                border-left: 2px solid $primary;
                color: $primary;
                i{
                    color: $primary;
                }
            }
            .el-submenu.is-active.is-opened{
                border-left: none;

                .el-submenu__title{
                    color:inherit !important;
                    border-left: 2px solid $simple-bg;
                }
                i{
                    color:inherit !important;
                }
            }
            .el-submenu.is-active{
                background: white !important;

                i{
                    color: $primary !important;
                }
                .el-submenu__title{
                    background: white !important;
                    color: $primary !important;
                    border-left: 2px solid $primary;
                }
            }
        }
        //收缩的时候pop出来的二级样式

        .dark-menu-pop{
            .el-menu{
                min-width: 160px;
            }
            .el-menu-item, .el-submenu__title{
                height: 40px;
                line-height: 40px;
                &:hover{
                    background:transparent !important;
                }
            }
            .el-menu-item.is-active{
                background: $primary !important;
            }
        }
        .simple-menu-pop, .light-menu-pop{
            .el-menu{
                min-width: 160px;
            }
            .el-menu-item, .el-submenu__title{
                height: 40px;
                line-height: 40px;
                &:hover{
                    background:transparent !important;
                }
            }
            .el-menu-item.is-active{
                background:  $primary-light !important;
            }
        }
        .dark-menu-pop{
            .el-menu{
                min-width: 160px;
            }
            .el-menu-item, .el-submenu__title{
                height: 40px;
                line-height: 40px;
                &:hover{
                    background:transparent !important;
                }
            }
            .el-menu-item.is-active{
                background: $primary !important;
            }
        }
        .header{
            width: 100%;
            height: 54px !important;
            line-height: 54px;
            background: white;
            box-shadow: 0 1px 4px 0 rgba(0,21,41,0.08);
            z-index: 3;
            padding-right: 24px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .header-dropdowm{
                height: 40px;
            }
            .simple-dropdowm, .light-dropdowm{
                color: white;
            }
        }
        .simple-header,.light-header{
            background: $primary;
            box-shadow: 0 1px 4px 0 rgba(0,21,41,0.12);
        }
    }
</style>
