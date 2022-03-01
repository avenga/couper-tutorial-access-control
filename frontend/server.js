const express = require('express')
const proxy = require('http-proxy-middleware')

const PORT = 3000
const BACKEND_URL = "http://localhost:8080/"

const app = express()

app.use(express.static(__dirname + '/public', {
	setHeaders: (res, path) => {
		res.set("Server", "Express")
	}
}))

const proxyMiddleware = proxy.createProxyMiddleware({
	target: BACKEND_URL,
	changeOrigin: true,
	onProxyRes(proxyRes, req, res) {
		log(req, proxyRes)
	}
})

function log(req, res) {
	const type = (res.headers["content-type"] ?? "-").split(';')[0]
	console.info(new Date(), ":" + PORT, req.method, req.originalUrl, res.statusCode, type)
}

app.use('/api', proxyMiddleware)

app.disable('x-powered-by')
app.listen(PORT, () => console.info(`frontend serving on http://localhost:${PORT}/...`))
