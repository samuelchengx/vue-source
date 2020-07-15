
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js',
    output: {
        format: 'umd', // amd commonjs规范，默认打包后结果挂到全局上
        file: 'dist/vue.js', // 打包出的vue.js文件
        name: 'Vue',
        sourceMap: true
    },
    plugins: [
        babel({ // 解析es6变成es5
            exclude: 'node_modules/**', //排除文件的操作
        }),
        serve({ // 开启本地服务
            open: true,
            openPage: '/public/index.html',
            port: 3000,
            contentBase: './'
        })
    ]
}

