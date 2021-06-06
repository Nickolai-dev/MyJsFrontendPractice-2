const path = require("path");
const fs = require('fs');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dist_path = fs.existsSync('/var/www/') ? '/var/www/my-nodejs-project/' : path.resolve(__dirname, 'dist');

module.exports = (env) => {
  const mode = 'development';
  return {
    mode: mode,
    entry: {
      'app': './src/js/main.js'
    },
    output: {
      filename: '[name]-[contenthash].bundle.js',
      path: dist_path,
    },
    cache: true,
    devtool: 'inline-source-map',
    resolve: {
      fallback: {
        'fs': false,
        'path': false,
        'getUrl': false
      }, alias: {
        'src': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        DEV_ENV: JSON.stringify(mode),
        DEV_FAKE_SERVER: true,
      }),
      new htmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'src/index.html'),
        inject: "head",
        scriptLoading: "defer"
      }), new CopyWebpackPlugin({
        patterns: [{
          from: path.resolve(__dirname, '.htaccess'),
          to: dist_path
        }, {
          from: path.resolve(__dirname, 'src/img/contact/'),
          to: path.resolve(dist_path, 'img/contact/')
        }, {
          from: path.resolve(__dirname, 'node_modules/tinymce/'),
          to: path.resolve(dist_path, 'tinymce/')
        }]
      }),
    ],
    module: {
      rules: [{
          test: /\.html$/,
          include: [
            path.resolve(__dirname, 'src')
          ], exclude: [
            path.resolve(__dirname, 'src/components')
          ],
          use: [{
            loader: 'html-loader',
            options: {
              esModule: false,
            }
          }]
        }, {
          test: /\.html$/,
          include: [
            path.resolve(__dirname, 'src/components')
          ],
          use: [{
            loader: 'html-loader',
            options: {
              esModule: false,
              sources: false,
              minimize: {
                collapseWhitespace: true
              }
            }
          }]
        }, {
        test: /\.(png|gif|svg|jpe?g)$/i,
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name]-[hash].[ext]',
          }
        }]
      }, {
        test: /\.(png|gif|svg|jpe?g)$/i,
        include: [
          path.resolve(__dirname, 'node_modules')
        ],
        use: [{
          loader: 'url-loader',
          options: {
            limit: true // this option kinda cringe
          }
        }]
      }, {
        test: /font.*/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          }
        }]
      }, {
        test: /\.s[ca]ss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/[name]-[md4:hash:hex:8].css'
            }
          }, {
            loader: 'extract-loader',
            options: {
              publicPath: '../'
            }
          }, 'css-loader', 'postcss-loader', 'sass-loader']
      }, {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'node_modules/ion-rangeslider/css'),
          path.resolve(__dirname, 'node_modules/jquery-colpick/css'),
        ],
        use: [
          'raw-loader'
        ]
      }, {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'node_modules/malihu-custom-scrollbar-plugin/'),
          path.resolve(__dirname, 'node_modules/codemirror/'),
        ], use: [
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              sourceMap: false
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      }]
    }
  };
}
