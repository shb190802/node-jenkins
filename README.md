# node-jenkins
使用nodejs模拟的jenkins打包vue项目功能

基本流程
* 下载代码
* 执行install 和 build
* 将代码发布到远程仓库

```javascript
	let release = new Release({
		/** build config */
		repo: 'https://github.com/shb190802/chat.git', // 仓库地址
		branch: 'master', // 编译分支 默认master
		srcPath: 'client', // 项目编译目录，一般是vue.config.js所在目录
		buildCommand: ['npm config set registry http://registry.npm.taobao.org/', 'npm install', 'npm run build'],
		outputPath: 'server/static/html', // 编译目录 默认是srcPath下 dist
		/* host config */
		remotePath: '', //YOUR_REMOTE  web项目远程目录 注意，由于会提前清空远程目录。请慎重填写地址
		host: '', // YOUR_HOST  web服务器IP地址
		username: '', // YOUR_NAME
		password: '' // YOUR_PWD
	})
	release.publish()
```



![](http://suohb.com/images/jenkins.png)

