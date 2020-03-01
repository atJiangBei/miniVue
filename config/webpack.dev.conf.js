const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	devServer:{
		port:'8082'
	},
	entry:{
		app:path.resolve(__dirname,'../src/main.js')
	},
	module:{
		rules:[
			{
				test:/\.js/,
				use:[
					{
						loader:'babel-loader'
					}
				]
			}
		]
	},
	output:{
		path:path.resolve(__dirname,'../dist'),
		filename:'[name].[hash].js'
	},
	plugins:[
		new HtmlWebpackPlugin({
			template:path.resolve(__dirname,'../index.html')
		})
	]
}