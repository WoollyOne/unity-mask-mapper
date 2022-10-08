const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'server': './src/server.ts',
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: ["/node_modules/", "/src/ts/**"]
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
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
    externals: [nodeExternals(), "express"],
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        clean: true,
    },
};