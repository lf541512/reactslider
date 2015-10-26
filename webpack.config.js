/**
 * Created by 95 on 2015/10/26.
 */
module.exports = {
    entry: './index.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    resolve: {  //
        extensions: ['', '.coffee', '.js']
    },

    module: {
        loaders: [
            { test: /\.(js|jsx)$/, loaders: ['babel-loader'] },
            { test: /\.css$/, loaders: ['style-loader','css-loader'] },
            { test: /\.(png|jpg)$/, loaders: ['url-loader?size=8192'] }
        ]
    }
}