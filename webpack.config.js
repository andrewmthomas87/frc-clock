/**
 * Configuration file for webpack build
 */

var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var extractLess = new ExtractTextPlugin({ filename: '[name].css' })		// [name] resolves to name of bundle

module.exports = {
	context: path.resolve('./src'),
	devtool: 'eval',
	entry: {
		app: 'index.tsx'
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{
				test: /\.less$/,
				use: extractLess.extract({
					use: [
						{ loader: 'css-loader', options: { importLoaders: 1 } },
						{ loader: 'postcss-loader' },
						{ loader: 'less-loader' }
					],
					fallback: 'style-loader'
				})
			}
		]
	},
	output: {
		path: path.resolve('./build'),
		filename: '[name].js'					// [name] resolves to name of bundle
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),		// Does not emit bundle if there are any errors
		extractLess
	],
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		modules: [
			path.resolve('./src'),
			'node_modules'
		]
	},
	target: 'web'
}
