/*
 * @Author: suo
 * @Date: 2020-07-17 16:03:22
 * @LastEditTime: 2020-07-17 16:46:32
 * @LastEditors: suo
 * @Description:  项目分支配置文件，需要提前设置好
 */
module.exports = {
	'chat': {
		master: {
			/** build config */
			name: '聊天室 客户端',
			repo: 'https://github.com/shb190802/chat.git', // 仓库地址
			branch: 'master', // 编译分支 默认master
			srcPath: 'client', // 项目编译目录，一般是vue.config.js所在目录
			buildCommand: ['npm config set registry http://registry.npm.taobao.org/', 'npm install', 'npm run build'],
			outputPath: 'server/static/html', // 编译目录 默认是srcPath下 dist
			/* host config */
			remotePath: '/usr/local/nginx/html/html', //YOUR_REMOTE  web项目远程目录 注意，由于会提前清空远程目录。请慎重填写地址
			host: '', // YOUR_HOST  web服务器IP地址
			username: '', // YOUR_NAME
			password: '' // YOUR_PWD
		},
		test: {
			/** build config */
			name: '聊天室 测试分支',
			repo: 'https://github.com/shb190802/chat.git', // 仓库地址
			branch: 'master', // 编译分支 默认master
			srcPath: 'client', // 项目编译目录，一般是vue.config.js所在目录
			buildCommand: ['npm config set registry http://registry.npm.taobao.org/', 'npm install', 'npm run build'],
			outputPath: 'server/static/html', // 编译目录 默认是srcPath下 dist
			/* host config */
			remotePath: '/usr/local/nginx/html/html', //YOUR_REMOTE  web项目远程目录 注意，由于会提前清空远程目录。请慎重填写地址
			host: '', // YOUR_HOST  web服务器IP地址
			username: '', // YOUR_NAME
			password: '' // YOUR_PWD
		}
	},
	'chat2': {
		master: {
			/** build config */
			name: '聊天室2 测试分支1',
			repo: 'https://github.com/shb190802/chat.git', // 仓库地址
			branch: 'master', // 编译分支 默认master
			srcPath: 'client', // 项目编译目录，一般是vue.config.js所在目录
			buildCommand: ['npm config set registry http://registry.npm.taobao.org/', 'npm install', 'npm run build'],
			outputPath: 'server/static/html', // 编译目录 默认是srcPath下 dist
			/* host config */
			remotePath: '/usr/local/nginx/html/html', //YOUR_REMOTE  web项目远程目录 注意，由于会提前清空远程目录。请慎重填写地址
			host: '', // YOUR_HOST  web服务器IP地址
			username: '', // YOUR_NAME
			password: '' // YOUR_PWD
		},
		test: {
			/** build config */
			name: '聊天室2 测试分支2',
			repo: 'https://github.com/shb190802/chat.git', // 仓库地址
			branch: 'master', // 编译分支 默认master
			srcPath: 'client', // 项目编译目录，一般是vue.config.js所在目录
			buildCommand: ['npm config set registry http://registry.npm.taobao.org/', 'npm install', 'npm run build'],
			outputPath: 'server/static/html', // 编译目录 默认是srcPath下 dist
			/* host config */
			remotePath: '/usr/local/nginx/html/html', //YOUR_REMOTE  web项目远程目录 注意，由于会提前清空远程目录。请慎重填写地址
			host: '', // YOUR_HOST  web服务器IP地址
			username: '', // YOUR_NAME
			password: '' // YOUR_PWD
		}
	}
}