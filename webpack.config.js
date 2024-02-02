const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: { static: './dist' },
  watch: false,
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
    //   {
    //     test:/\.(s*)css$/,
    //     use: ExtractTextPlugin.extract({ 
    //         fallback: 'style-loader',
    //         use: ['css-loader','sass-loader']
    //     })
    // },
    //   {
    //     test: /\.(png|jp(e*)g|svg)$/,  
    //     use: [{
    //         loader: 'url-loader',
    //         options: { 
    //             limit: 8000, // Convert images < 8kb to base64 strings
    //             name: 'images/[hash]-[name].[ext]'
    //         } 
    //     }]
    // }
      {
        test: /\.png/,
        type: 'asset/resource',
      }
    ],
  },
};