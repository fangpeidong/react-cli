const path = require('path');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: undefined,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
        ],
      },
      // 处理图片
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      // 字体图标
      {
        test: /\.(woff2?|ttf)$/,
        type: 'asset/resource',
      },
      // 处理js
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          plugins: [
            // "@babel/plugin-transform-runtime", // presets中包含了
            'react-refresh/babel', // 开启js的HMR功能
          ],
        },
      },
    ],
  },
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/.eslintcache'
      ),
    }),
    // 处理HTML
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new ReactRefreshWebpackPlugin(), // 解决js的HMR功能运行时全局变量的问题
    // 将public下面的资源复制到dist目录去（除了index.html）
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          toType: 'dir',
          noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略文件
            ignore: ['**/index.html'],
          },
          info: {
            // 跳过terser压缩js
            minimized: true,
          },
        },
      ],
    }),
  ],
  mode: 'development',
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 3000,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
};
