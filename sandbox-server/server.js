const http = require('http')
const url = require('url')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  console.log('request received', req.url)

  const parsedUrl = url.parse(req.url)
  const parsedQuery = querystring.parse(parsedUrl.query)

  switch (parsedUrl.pathname) {
    case '/':
      if (req.method === 'GET') {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.end('Welcome to Sandbox!')
      }
      break;
    case '/search':
      if (req.method === 'GET') {
        if ('q' in parsedQuery) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end(`You searched for: "${parsedQuery.q}"`)
        } else {
          res.statusCode = 400
          res.setHeader('Content-Type', 'text/plain')
          res.end('You didn\'t provide a search query term :(')
        }
      }
      break;
    case '/things':
      if (req.method === 'POST') {
        let body = [];
        req.on('data', function(chunk) {
          body.push(chunk);
        }).on('end', function() {
          body = Buffer.concat(body).toString();

          res.statusCode = 201
          res.setHeader('Content-Type', 'text/plain')
          res.end(`New thing created: "${body}"!`)
        });
      }
      break;
    case '/somefile':
      if (req.method === 'GET') {
        if ('accept' in req.headers) {
          res.statusCode = 200
          if (req.headers.accept === 'text/plain') {
            res.setHeader('Content-Type', 'text/plain')
            res.end('This is a plain text file')
          } else if (req.headers.accept === 'text/html') {
            res.setHeader('Content-Type', 'text/html')
            res.end('<!DOCTYPE html><html><body>This is an HTML file</body></html>')
          }
        }
      }
      break;
    case '/myjsondata':
      if (req.method === 'GET') {
        if ('accept' in req.headers && req.headers.accept === 'application/json') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end('{ "title": "some JSON data" }')
        }
      }
      break;
    case '/old-page':
      if (req.method === 'GET') {
        res.statusCode = 301
        res.setHeader('Location', 'http://localhost:3000/newpage')
        res.end()
      }
      break;
    case '/admin-only':
      if (req.method === 'POST') {
        res.statusCode = 403
        res.end()
      }
      break;
    case '/not-a-page':
      if (req.method === 'GET') {
        res.statusCode = 404
        res.end()
      }
      break;
    case '/server-error':
      if (req.method === 'GET') {
        res.statusCode = 500
        res.end()
      }
      break;
    default:
  }
})

server.listen(3000, 'localhost', () => console.log('sandbox-server listening on port 3000'))
