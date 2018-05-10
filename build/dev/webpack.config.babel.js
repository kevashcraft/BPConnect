import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

let p = (dir) => {
  return path.resolve(__dirname, '..', '..', ...dir)
}

module.exports = (env) => {

  let API_SERVER = (env && env.API_SERVER) ? env.API_SERVER : 'http://localhost:9000'

  console.log('API_SERVER', API_SERVER)

  return {
    entry: './src/site/index.js',
    output: {
      path: p(['dist', 'site']),
      publicPath: '/',
      filename: '[name]-[hash].js'
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.vue$/i,
          use: 'vue-loader'
        }, {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader'
          ]
        }, {
          test: /\.scss$/i,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }, {
          test: /\.(jpe?g|gif|ttf|woff|woff2|eot)$/i,
          use: 'file-loader?name=[path][name].[ext]'
        }, {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /(node_modules|semantic)/
        }, {
          test: /\.(png|svg)$/i,
          use: 'url-loader?name=[path][name].[ext]'
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        moment: 'moment',
        jQuery: 'jquery',
        $: 'jquery',
        'window.jQuery': 'jquery',
        jquery: 'jquery',
        'window.jquery': 'jquery',
        'window.$': 'jquery'
      }),
      new HtmlWebpackPlugin({
        template: 'src/site/index.html'
      }),
      new webpack.DefinePlugin({
        API_SERVER: `"${API_SERVER}"`
      }),
      new CopyWebpackPlugin([
        {from: 'src/site/static', flatten: true}
      ]),
      new webpack.NamedModulesPlugin()
    ],
    resolve: {
      alias: {
        '@': p(['src', 'site']),
        'jquery': require.resolve('jquery')
      }
    }
  }
}
