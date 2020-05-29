const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const ROOT = path.resolve(__dirname);

var config = (env, options) => {
    let isProduction;

    if (env && env.NODE_ENV && env.NODE_ENV !== 'development') {
        isProduction = true;
    } else if (options && options.mode === 'production') {
        isProduction = true;
    } else {
        isProduction = false;
    }
    
    return {
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        entry: {
            app: path.join(ROOT, '/assets/app.js'),
            style: path.join(ROOT, '/assets/app.scss'),
        },
        output: {
            path: ROOT + '/wwwroot/',
            filename: isProduction ? 'assets/js/[name].js' : 'assets/js-dev/[name].js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: true,
                                importLoaders: 2,
                                sourceMap: true,
                                publicPath: "/assets",
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                publicPath: "/assets",
                            }
                        },
                    ]
                },
                {
                    test: /\.js(x)?$/,
                    exclude: /(node_modules|wwwroot)/,
                    use: {
                        loader: 'eslint-loader',
                        options: {
                            configFile: path.resolve(ROOT, '.eslintrc')
                        },
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                publicPath: '/assets',
                filename: isProduction ? 'assets/css/[name].css' : 'assets/css-dev/[name].css'
            }),
            new StyleLintPlugin({
                configFile: path.resolve(ROOT, '.stylelintrc'),
                context: path.join(ROOT, "/assets"),
                files: '**/*.scss',
                failOnError: false,
                quiet: false,
            })
        ],
    }
};

module.exports = config;
