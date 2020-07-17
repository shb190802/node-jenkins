const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaStatic = require('koa-static')
const fse = require('fs-extra')

const publish = require('./index')

const app = new Koa()
const router = new KoaRouter()

router.get('/publish', async ctx => {
	let { project, branch } = ctx.query
	if (!project || !branch) {
		ctx.body = { state: 'err', data: '需要传项目名和分支' }
	} else {
		let status = ''
		try {
			status = fse.readFileSync('./db.txt', 'utf-8')
		} catch (e) { }
		let history = ''
		try {
			history = fse.readFileSync('./workspace/build-history.txt', 'utf-8')
		} catch (e) { }
		if (status && /building/.test(status)) {
			ctx.body = { state: 'err', status, history, project, branch, data: '系统正在编译，请稍后再试！' }
		} else {
			publish.publish({ project, branch })
			ctx.body = { state: 'ok', history, project, branch }
		}
	}
})

router.get('/status', async ctx => {
	let status = ''
	try {
		status = fse.readFileSync('./db.txt', 'utf-8')
	} catch (e) { }
	let history = ''
	try {
		history = fse.readFileSync('./workspace/build-history.txt', 'utf-8')
	} catch (e) { }
	ctx.body = { state: 'ok', status, history }
})

router.get('/project', async ctx => {
	let config = require('./config')
	let project = Object.keys(config).map(project => {
		let branch = Object.keys(config[project]).map(branch => {
			return {
				name: config[project][branch].name,
				project,
				branch
			}
		})
		return {
			project,
			branch
		}
	})
	ctx.body = { state: 'ok', project }
})

app.use(KoaStatic('./static'))
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3011, err => {
	console.log(err || 'server run in port 3011!')
})
