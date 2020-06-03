const Release = require('./release')


let release = new Release({
	/** build config */
	repo: 'https://github.com/shb190802/chat.git', // 仓库地址
	branch: 'master', // 编译分支 默认master
	srcPath: 'client', // 项目编译目录，一般是vue.config.js所在目录
	buildCommand: ['npm config set registry http://registry.npm.taobao.org/', 'npm install', 'npm run build'],
	outputPath: 'server/static/html', // 编译目录 默认是codePath下 dist
	/* host config */
	remotePath: '', // web项目远程目录 注意，由于会提前清空远程目录。请慎重填写地址
	host: '', // web服务器IP地址
	username: '',
	password: ''
})
release.publish()