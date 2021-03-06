const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
//开发模式
module.exports = merge(common, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 9001,
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: "style-loader" // 将 JS 字符串生成为 style 节点
                    },
                    {
                        loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                    },
                    {
                        loader: "sass-loader" // 将 Sass 编译成 CSS
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: '../../../public/img/',           /* 生成dist目录中css里面的图片的url地址前缀 */
                            outputPath: 'public/img/'        /* 图片输出到dist的目录前缀 */
                        }
                    }

                ]
            },
        ]
    },
    plugins: [
    ],

});