const Router = require('./router')

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

function handler(request) {
    const init = {
        headers: {
            'content-type': 'application/json'
        },
    }
    var text = '[' +
        '{ "name":"John Doe" , "url":"https://www.cloudflare.com/" },' +
        '{ "name":"Max Chan" , "url":"https://1.1.1.1/" },' +
        '{ "name":"Peter Jackson" , "url":"https://google.com" } ]';

    const list = JSON.parse(text);
    const body = JSON.stringify(list)
    return new Response(body, init)
}

async function handleRequest(request) {
    const r = new Router()
    r.get('/', () => new Response('Hello! Go to /links to glance on our amazing looking JSON!'))
    r.get('.*/links', request => handler(request))

    const resp = await r.route(request)
    return resp
}