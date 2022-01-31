const $ = (selector) => document.querySelector(selector)

let token = ""

function init() {
	if (!(token = localStorage.getItem("token"))) {
		return
	}

	refreshList()
	refreshDetail()
	clearForm()
	document.body.classList.add("loggedin")
	loadUser().then(showUser)
}

function login() {
	const currentURL = new URL(location)
	currentURL.pathname = "/login"

	const loginURL = new URL("/login", "https://demo-idp.couper.io")
	loginURL.searchParams.set("callback", currentURL.href)
	loginURL.searchParams.set("spid", "local")
	location.href = loginURL
}

function logout() {
	token = ""
	localStorage.removeItem("token")
	document.body.classList.remove("loggedin")
}

function loadUser() {
	return _fetch("/userinfo")
}

function showUser(user) {
	$("#user .name").textContent = user.name
	$("#user .picture").textContent = user.picture
}

function handleError(response) {
	if (response.status === 403) {
		logout()
	}

	return Promise.reject(response.status)
}

function _fetch(uri, options) {
	options = options ?? {}
	options.headers = options.headers ?? {}
	options.headers["Authorization"] = "Bearer " + token

	return fetch(uri, options).then(response => {
		return response.ok ? response.json() : handleError(response)
	})
}

function loadList() {
	return _fetch("/api/countries")
}

function loadCountry(id) {
	return _fetch("/api/country/" + id)
}

function storeCountry(id, data) {
	return _fetch("/api/country/" + id, {
		method: 'POST',
		body: data,
		headers: {'Content-Type': 'application/json'}
	})
}

function deleteCountry(id) {
	return _fetch("/api/country/" + id, {method: 'DELETE'})
}

function showList(json) {
	const listElement = $("#list")
	listElement.innerHTML = ""
	json.forEach(item => {
		const html = `<li><a href="#${item}">${item}</a></li>`
		appendHTML(listElement, html)
	})
}

function showCountry(id, json) {
	const infoElement = $("#info")
	const html = `<h2><span class="flag">${json.flag}</span> ${json.name}</h2><ul>`
	infoElement.innerHTML = html

	Object.keys(json).forEach(key => {
		if (key !== "name" && key !== "flag") {
			const value = json[key]
			const html = `<li><b>${key}</b>: ${value}</li>`
			appendHTML(infoElement, html)
		}
	})

	fillForm(id, json)
}

function fillForm(name, json) {
	const form = $("#form")
	form.name.value = name
	form.data.value = JSON.stringify(json, null, "  ")
}

function clearForm() {
	const jsonTemplate = {
		"name":       "",
		"area":       0,
		"population": 0,
		"capital":    "",
		"currency":   "",
		"timezone":   "+0000",
		"tld":        "",
		"iso-639":    "",
		"iso-3166":   "",
		"flag":       ""
	}

	fillForm("", jsonTemplate)
}

function appendHTML(container, html) {
	container.insertAdjacentHTML('beforeend', html)
}

function refreshList() {
	loadList().then(showList)
}

function refreshDetail() {
	const hash = decodeURIComponent(document.location.hash.substring(1))
	if (hash != "") {
		loadCountry(hash).then(json => {
			showCountry(hash, json)
		})
	} else {
		history.pushState({}, null, "#")
	}
}
