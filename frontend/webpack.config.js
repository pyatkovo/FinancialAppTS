const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9001,
        historyApiFallback: true,

    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin({
        template: "./index.html",
    }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                { from: "./src/styles", to: "styles" },
                { from: "./src/static", to: "static" },
                { from: "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css", to: "styles" },
                { from: "./node_modules/bootstrap-icons/font/bootstrap-icons.json", to: "styles" },

                {from: "./node_modules/@fortawesome/fontawesome-free/css/all.css", to: "styles" },
                {from: "./node_modules/@fortawesome/fontawesome-free/webfonts", to: "webfonts"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "styles" },
                {from: "./node_modules/bootstrap/dist/js/bootstrap.js", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.js", to: "js"},

            ],
        }),
    ],
};