const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require("html-webpack-inline-svg-plugin");

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: { static: './dist' },
  entry: {
    index: './src/pages/index/Index.ts',
    stockfish: './src/pages/stockfish/Stockfish.ts',
    openings: './src/pages/openings/Openings.ts'
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
      { chunks:['index'], title:"PGN Viewer", filename: "index.html", template:"./src/pages/index/index.html", inject:"head"},
    ),
    new HtmlWebpackPlugin(
      { chunks:['stockfish'], title:'Stockfish', filename: 'stockfish.html', template:"./src/pages/stockfish/stockfish.html",  inject:"head" }
    ),
    new HtmlWebpackPlugin(
      { chunks:['openings'], title:'Chess Openings', filename: 'openings.html', template:"./src/pages/openings/openings.html",  inject:"head" }
    ),
    new HtmlWebpackInlineSVGPlugin({
      runPreEmit: true,
    }),
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
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
    ],
  },
};