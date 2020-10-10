const Router = require('./router')
var text = '[' +
    '{ "name":"Cloudflare" , "url":"https://www.cloudflare.com/" },' +
    '{ "name":"1.1.1.1" , "url":"https://1.1.1.1/" },' +
    '{ "name":"Google" , "url":"https://google.com" } ]';

const list = JSON.parse(text);

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

function handler(request) {
    const init = {
        headers: {
            'content-type': 'application/json'
        },
    }
    const body = JSON.stringify(list)
    return new Response(body, init)
}

async function gatherResponse(response) {
    const {
        headers
    } = response
    const contentType = headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        return JSON.stringify(await response.json())
    } else if (contentType.includes("application/text")) {
        return await response.text()
    } else if (contentType.includes("text/html")) {
        return await response.text()
    } else {
        return await response.text()
    }
}

class LinksTransformer {
    constructor(list) {
        this.list = list
    }

    async element(element) {
        element.setInnerContent(`
        <a href="${this.list[0].url}">${this.list[0].name}</a>
        <a href="${this.list[1].url}">${this.list[1].name}</a>
        <a href="${this.list[2].url}">${this.list[2].name}</a>`, {
            html: true
        })
    }
}

class onProfileStyleTransformer {
    constructor(attributeName) {
        this.attributeName = attributeName
    }
    async element(element) {
        const attribute = element.getAttribute(this.attributeName)
        if (attribute) {
            element.setAttribute(this.attributeName, attribute.replace("display: none", ""))
        }
    }
}

class onProfileSourceTransformer {
    constructor(attributeName) {
        this.attributeName = attributeName
    }
    async element(element) {
        element.setAttribute(this.attributeName, "https://firebasestorage.googleapis.com/v0/b/mysite-2dbfb.appspot.com/o/assets%2Fimg%2FIMG_2017.jpg?alt=media&token=d6ff3a3b-ec0b-46fe-b908-e51e1ccaec51")

    }
}

class onProfileTextTransformer {
    constructor(attributeName) {
        this.attributeName = attributeName
    }
    async element(element) {
        element.setInnerContent(`Din "Max" Chan`)
    }
}

async function handleRequest(request) {
    const r = new Router()
    r.get('.*/links', request => handler(request))
    const resp = await r.route(request)
    if (resp.status == 404) {
        const init = {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        }
        const response = await fetch("https://static-links-page.signalnerve.workers.dev/", init)
        const rewrittenRes = new HTMLRewriter().on("div#links", new LinksTransformer(list)).on("div#profile", new onProfileStyleTransformer("style")).on("img#avatar", new onProfileSourceTransformer("src")).on("h1#name", new onProfileTextTransformer()).transform(response)
        const results = await gatherResponse(rewrittenRes)
        return new Response(results, init)
    }
    return resp
}