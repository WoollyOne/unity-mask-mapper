const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        'client': './src/ts/index.tsx',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.css$/i, use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpg|png|gif)$/,
                type: 'asset/resource',
            },
        ]
    },
    resolve: {
        extensions: ['.css', '.ts', '.tsx', '.js'],
        fallback: {
            util: require.resolve("util/"),
            fs: require.resolve("fs"),
            path: require.resolve("path-browserify"),
            tls: require.resolve("tls"),
            zlib: require.resolve("zlib"),
            net: require.resolve("net"),
            url: require.resolve('url'),
            assert: require.resolve('assert'),
            crypto: require.resolve('crypto-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            buffer: require.resolve('buffer'),
            stream: require.resolve('stream-browserify'),
        }
    },
    output: {
        path: path.resolve(__dirname, "dist/public"),
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/html/index.html', to: 'index.html'},
                {from: 'src/html/index.css', to: 'index.css'},
            ]
        })
    ]
};