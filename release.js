const exec = require('child_process').exec
const path = require('path')
const Sftp = require('ssh2-sftp-client')
// const download = require('download-git-repo')
const fse = require('fs-extra')
const moment = require('moment')
require('colors')


const COMMAND = ['npm config set registry http://registry.npm.taobao.org/', 'npm install', 'npm run build']
const WORKSPACE = path.join(__dirname, 'workspace')
const BUILD_HISTORY = path.join(WORKSPACE, 'build-history.txt')

class Release {
	constructor(options) {
		if (!options.repo) {
			throw new Error('need repository !!!')
		}
		this.repo = options.repo
		this.projectName = /\/([^/]+)?.git$/.exec(this.repo)[1]
		this.branch = options.branch || 'master'
		this.srcPath = options.srcPath || ''
		this.buildCommand = options.buildCommand || COMMAND
		this.outputPath = options.outputPath || 'dist'
		this.remotePath = options.remotePath || ''
		this.host = options.host || ''
		this.username = options.username || ''
		this.password = options.password || ''
	}

	async publish () {
		let lastBuildTime = this.getLastBuildTime()
		let time = +new Date
		console.log('publish start at', moment().format('YYYY-MM-DD HH:mm:ss'))
		if (lastBuildTime > 0) {
			console.log(`预计编译时间为${lastBuildTime}s!!!`)
		}
		await this.downloadRepo()
		for (let i = 0, len = this.buildCommand.length; i < len; i++) {
			await this.exec(this.buildCommand[i])
		}
		let sourcePath = path.join(WORKSPACE, this.projectName, this.outputPath) // 编译后的本地dist目录
		if (this.host && this.username && this.password && this.remotePath) {
			if (!/^(\/[^/]+){3}/.test(this.remotePath)) {
				throw new Error('为了安全考虑，不允许使用根目录、一级目录、二级目录做发布目录！！！')
			}
			let client = new Sftp()
			console.log('连接web服务器'.yellow)
			await client.connect({
				host: this.host,
				username: this.username,
				password: this.password
			})
			console.log(`mkdir ${this.remotePath}`.green)
			await client.mkdir(this.remotePath, true)
			console.log(`传输文件【${sourcePath}】===>【${this.remotePath}】`.green)
			await client.uploadDir(sourcePath, this.remotePath) // 将本地文件夹传输到远程
			console.log('文件传输完毕'.green)
			client.end()
		} else if (this.remotePath) {
			/**
			 * 如果编译和发布在同一台服务器，进入当前逻辑
			 * 不过不建议这样，建议直接修改vue.config.js里边的output
			 */
			if (!/^(\/[^/]+){3}/.test(this.remotePath)) {
				throw new Error('为了安全考虑，不允许使用根目录、一级目录、二级目录做发布目录！！！')
			}
			fse.removeSync(this.remotePath)
			fse.moveSync(sourcePath, this.remotePath)
		}
		time = ~~((+new Date - time) / 1000)
		console.log('publish end at', moment().format('YYYY-MM-DD HH:mm:ss'), `used ${time} sceond!`)
		this.saveBuildInfo(time)
	}
	// 下载代码
	downloadRepo () {
		return new Promise(async (resolve, reject) => {
			let tempPath = path.join(WORKSPACE, `temp/${this.projectName}`) // 代码临时目录
			let workPath = path.join(WORKSPACE, this.projectName) // 代码工作区域目录
			let dependPath = path.join(WORKSPACE, this.projectName, this.srcPath, 'node_modules') // 工作区中node_modules目录
			let tempDependPath = path.join(WORKSPACE, `depned/${this.projectName}/node_modules`) // 缓存node_modules目录

			if (fse.pathExistsSync(tempPath)) {
				console.log(`清除临时代码目录:${tempPath}`.yellow)
				fse.removeSync(tempPath)
			}
			let command = `git clone -b ${this.branch} ${this.repo} ${tempPath}`
			await this.exec(command, WORKSPACE)
			console.log(`拉取文件成功！`.green)
			if (fse.pathExistsSync(workPath)) {
				if (fse.pathExistsSync(dependPath)) {
					console.log('保存工作目录node_modules'.green)
					fse.removeSync(tempDependPath)
					fse.moveSync(dependPath, tempDependPath)
				}
				console.log('清空工作区目录'.yellow)
				fse.removeSync(workPath)
			}
			console.log('构建新的工作目录'.green)
			await this.sleep(100)
			fse.moveSync(tempPath, workPath)
			if (fse.pathExistsSync(tempDependPath)) {
				console.log('恢复node_modules'.green)
				fse.removeSync(dependPath)
				fse.moveSync(tempDependPath, dependPath)
			}
			resolve(true)
		})
	}

	// 执行编译命令
	exec (cmd, cwdPath) {
		console.log(cmd.green)
		let options = {
			cwd: cwdPath || path.join(WORKSPACE, this.projectName, this.srcPath)
		}
		return new Promise((resolve, reject) => {
			let handler = exec(cmd, options)
			handler.stdout.on('data', data => {
				console.log(data.yellow)
			})
			handler.stderr.on('data', data => {
				console.log(data)
			})
			handler.on('close', code => {
				resolve()
			})
			handler.on('error', err => {
				reject(err)
			})
		})
	}

	saveBuildInfo (time) {
		let buildInfo = {}
		if (fse.pathExistsSync(BUILD_HISTORY)) {
			buildInfo = JSON.parse(fse.readFileSync(BUILD_HISTORY, 'utf8'))
		}
		buildInfo[this.projectName] = {
			buildAt: moment().format('YYYY-MM-DD HH:mm:ss'),
			repo: this.repo,
			branch: this.branch,
			projectName: this.projectName,
			buildTime: time
		}
		fse.writeFileSync(BUILD_HISTORY, JSON.stringify(buildInfo), 'utf8')
	}

	getLastBuildTime () {
		if (fse.pathExistsSync(BUILD_HISTORY)) {
			let buildInfo = JSON.parse(fse.readFileSync(BUILD_HISTORY, 'utf8'))
			return buildInfo[this.projectName] ? buildInfo[this.projectName].buildTime : -1
		}
		return -1
	}

	sleep (time) {
		time = Math.max(time, 10) // 最少sleep 10ms
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, time)
		})
	}
}

module.exports = Release