const path = require("path");
const HTMLWebpackPligin = require('html-webpack-plugin');
module.exports = function (_env, argv) {
    const isProduction = argv.mode === "production";
    const isDevelopment = !isProduction;

    return {
        devtool: isDevelopment && "cheap-module-source-map",
        entry: {
            bundle:path.resolve(__dirname,'src/index.js')
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].[contenthash:8].js",
            publicPath: "/"
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            envName: isProduction ? "production" : "development"
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader"
                    ]
                }
            ]
        },
        Plugin:[
            new HTMLWebpackPligin({
                title:'Web Pack',
                filename:'index.html'
            })
        ],
        resolve: {
            extensions: [".js", ".jsx"]
        }
    };
};