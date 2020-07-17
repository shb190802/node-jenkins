const Release = require('./release')
const fse = require('fs-extra')
const moment = require('moment')
const config = require('./config')

module.exports.publish = async ({project,branch}) =>{
	let time = +new Date()
	let release = new Release(config[project][branch])
	fse.writeFileSync('db.txt',`building [${project}#${branch}] start at ${moment().format('YYYY-MM-DD HH:mm:ss')}`)
	try{
		await release.publish()
		fse.writeFileSync('db.txt',`build success [${project}#${branch}] end at ${moment().format('YYYY-MM-DD HH:mm:ss')}`)
	}catch(e){
		console.log(e)
		console.log('构建错误',moment().format('YYYY-MM-DD HH:mm:ss'))
		fse.writeFileSync('db.txt',`build error [${project}#${branch}] start at ${moment().format('YYYY-MM-DD HH:mm:ss')}`)
	}
	time = new Date - time
}

