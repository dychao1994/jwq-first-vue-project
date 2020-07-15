const path = require('path');

const assetsDir = 'static';
// posix兼容方式处理路径
const posixJoin = _path => path.posix.join(assetsDir, _path);


const lastVersion = new Date().getTime();
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    publicPath: '/', // 表示在引入静态资源时，从根路径开始引入
    //  详细配置网站https://cli.vuejs.org/zh/config/#vue-config-js
    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。这个值会在 @vue/cli-plugin-eslint 被安装之后生效。
    //
    // 设置为 true 或 'warning' 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
    //
    // 如果你希望让 lint 错误在开发时直接显示在浏览器中，你可以使用 lintOnSave: 'default'。这会强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败。
    //
    // 设置为 error 将会使得 eslint-loader 把 lint 警告也输出为编译错误，这意味着 lint 警告将会导致编译失败。
    //
    // 或者，你也可以通过设置让浏览器 overlay 同时显示警告和错误：
    lintOnSave: false,
    devServer: {
        https: false,
        open: true,
        overlay: {
            warnings: false,
            errors: false
        }
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
