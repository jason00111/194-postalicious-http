# [Goal #194: Postalicious - Demystifying HTTP](http://jsdev.learnersguild.org/goals/194-Postalicious-Demystifying_HTTP.html)

[![](http://img.youtube.com/vi/XKOeWO7KRyA/0.jpg)](https://www.youtube.com/watch?v=XKOeWO7KRyA)

## Installation and Setup
- clone this repo
- `npm install`

requires chrome version 57 (2017-03-09) or higher since css grid is used

## Usage Instructions
- `npm run sandbox-server` or `npm run sb`
- `npm run postalicious` or `npm run pl` (in another console window or tab)
- in a browser navigate to `http://localhost:3001`

## Example
- type `GET` in the "Method" field
- type `localhost` in the "Host" field
- type `/search` in the "URI" field
- under "Query Parameters", type `q` in a "key" field and `cheese` in the adjacent "value" field
- press "Build & Send"

The request section should display:
```
GET /search?q=cheese HTTP/1.1
Host: localhost
```

and the response field should display:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 26
ETag: ...
Date: ...
Connection: keep-alive

You searched for: "cheese"
```
