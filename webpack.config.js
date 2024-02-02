const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  // devtool: 'inline-source-map',
  // devServer: { static: './dist' },
  // watch: false,
  entry: {
    index: './src/index.ts'
  },
  output: {
    filename:'[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  plugins: [
    new HtmlWebpackPlugin(
      { title:"Test", template:"./src/index.html", inject:"body"},
    ),
    // new HtmlWebpackPlugin(
    //   { filename:'another.html', title:'Hello', inject:"head", template:"./src/users.html" }
    // ),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.png/,
        type: 'asset/resource',
      },
      {
        test: /\.svg/,
        type: 'asset/inline',
      }
    ],
  },
};