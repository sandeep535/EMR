const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', 
    // publicPath: (resourcePath, context) => {
    //   if (typeof window !== 'undefined') {
    //     const tenant = window.location.pathname.split('/')[2] || 'default-tenant';
    //     return `/login/${tenant}`;
    //   } else{
    //     return `/login/emr2`;
    //   }
    // },
  },
  ignoreWarnings: [/Critical dependency:/],
  plugins: [
   
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
        '@src': path.resolve(__dirname, 'src/')
      }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ ["@babel/preset-react", { "runtime": "automatic" }],
            "@babel/preset-env"]
          },
        },
      },
      {
        test: /\.css$/, // Handles .css files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Handles image files
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]', // Preserves original file structure
          },
        },
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'dist'), 
   // compress: true,
    port: 3000,
    open: true,
    // open: 'http://localhost:3000/login/emr2',
    // historyApiFallback: {
    //   index: '/login/emr2', // Optional: Set a fallback route if desired
     
    // },
  },
};
