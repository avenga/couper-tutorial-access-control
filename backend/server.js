const express = require("express")
const fs = require("fs")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()
const jsonParser = bodyParser.json()

const DATA_DIR = __dirname + "/data/countries/"

app.use(function(req, res, next) {
    res.header('Server', 'Express')
    next()
})

app.get("/api/countries", (req, res) => {
	fs.readdir(DATA_DIR, (err, files) => {
		const data = []
		files.forEach(file => {
			data.push(path.basename(file, '.json'))
		})

		res.type('json').send(data)
		log(req, res)
	})
})

app.get("/api/country/:country", (req, res) => {
	const filename = path.join(DATA_DIR, req.params.country + ".json")
	res.type('json').sendFile(filename)
	log(req, res)
})

app.post("/api/country/:country", jsonParser, (req, res) => {
	if (req.params.country === "") {
		throw "missing id"
	}

	const filename = path.join(DATA_DIR, req.params.country + ".json")
	const data = JSON.stringify(req.body)

	fs.stat(filename, (err, stats) => {
		if (err) {
			const url = req.protocol + "://" +  req.headers.host + '/api/country/' + req.params.country
			res.header("Location", url)
			res.status(201)
		}

		fs.writeFileSync(filename, data)
		res.type('json').send(data)
		log(req, res)
	})
})

app.delete("/api/country/:country", (req, res) => {
	if (req.params.country === "") {
		throw "missing id"
	}

	const filename = path.join(DATA_DIR, req.params.country + ".json")
	fs.unlinkSync(filename)
	res.type('json').send("{}")
	log(req, res)
})

const PORT = 3001
app.listen(PORT, () => console.log(`backend serving on http://localhost:${PORT}/...`))
app.disable('x-powered-by')

function log(req, res) {
	const requestHeaders = req.headers
	const responseHeaders = res.getHeaders()

	const user = requestHeaders["user"] ?? "-"
	const requestID = requestHeaders["couper-request-id"] ?? "-"
	const type = (responseHeaders["content-type"] ?? "-").split(';')[0]
	console.info(new Date(), ":" + PORT, req.method, req.url, res.statusCode, type, user, requestID)
}
