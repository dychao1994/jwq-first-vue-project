const path = require('path');

const assetsDir = 'static';
// posix兼容方式处理路径
const posixJoin = _path => path.posix.join(assetsDir, _path);


const lastVersion = new Date().getTime();
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    publicPath: '/', // 表示在引入静态资源时，从根路径开始引入
    devServer: {
        https: false,
        open: true
        // port: '8081',
        // historyApiFallback: {
        //     index: '/healthview/index.html' // 与output的publicPath有关(HTMLplugin生成的html默认为index.html)
        // }
    },
    css: {
        // 启用 CSS modules for all css / pre-processor files.
        modules: false,
        // css预设器配置项
        loaderOptions: {
            // pass options to sass-loader
            sass: {
                // 引入全局变量样式,@使我们设置的别名,执行src目录
                data: `
                    @import "@/assets/css/common.scss";
                `
            }
        }
    },
    configureWebpack: config => {
        // 自动补全识别后缀
        config.resolve.extensions = ['.js', '.vue', '.json'];
    },

    chainWebpack: config => {
        /**
         * 删除懒加载模块的 prefetch preload，降低带宽压力
         */
        config.plugins
            .delete('prefetch')
            .delete('preload');
        // config.resolve.alias
        //   .set('vue$', 'vue/dist/vue.esm.js')
        //   .set('@', resolve('src'))
        // 清除警告

        config.when(isProd, config =>
            // 生产环境js增加版本号
            config.output
                .set('filename', posixJoin(`js/${lastVersion}-[name].[chunkhash].js`))
                .set('chunkFilename', posixJoin(`js/${lastVersion}-[id].[chunkhash].js`))
        );
    }
};
