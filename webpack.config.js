const path = require("path");
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


module.exports = (env) => {
  const mode = 'development';
  return {
    mode: mode,
    entry: {
      'app': './src/js/main.js'
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
    cache: true,
    devtool: 'inline-source-map',
    resolve: {
      fallback: {
        'fs': false,
        'path': false,
      }, alias: {
        'src': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        DEV_ENV: JSON.stringify(mode)
      }),
      new htmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'src/index.html'),
        inject: "head",
        scriptLoading: "defer"
      })
    ],
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              esModule: false
            }
          }]
        }, {
        test: /\.(png|gif|svg|jpe?g)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name]-[hash].[ext]',
          }
        }]
      }, {
        test: /\.s[ca]ss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: mode === 'development' ? 'css/[name].css' : 'css/[name]-[hash].css'
            }
          }, {
            loader: 'extract-loader',
            options: {
            }
          }, 'css-loader', 'postcss-loader', 'sass-loader']
      }]
    }
  };
}
