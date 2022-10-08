const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'public/client': './src/ts/index.tsx',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }, {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.css$/i, use: ['style-loader', 'css-loader']
            }
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
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/html/index.html', to: 'public/index.html'},
                {from: 'src/html/index.css', to: 'public/index.css'},
            ]
        })
    ]
};