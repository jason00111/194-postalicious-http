const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text({ type: 'text/plain' }))

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/plain')
  res.status(200).send('Welcome to Sandbox!')
})

app.get('/search', (req, res) => {
  res.set('Content-Type', 'text/plain')
  if ('q' in req.query) {
    res.status(200).send(`You searched for: "${req.query.q}"`)
  } else {
    res.status(400).send('You didn\'t provide a search query term :(')
  }
})

app.post('/things', (req, res) => {
  res.set('Content-Type', 'text/plain')
  console.log('req.body:', req.body)
  res.status(201).send(`New thing created: "${req.body}"!`)
})

app.get('/somefile', (req, res) => {
  if (req.accepts('text/plain')) {
    res.set('Content-Type', 'text/plain')
    res.status(200).send('This is a plain text file')
  } else if (req.accepts('text/html')) {
    res.set('Content-Type', 'text/html')
    res.status(200).send('<!DOCTYPE html><html><body>This is an HTML file</body></html>')
  } else {
    res.status(400).end()
  }
})

app.get('/myjsondata', (req, res) => {
  if (req.accepts('application/json')) {
    res.set('Content-Type', 'application/json')
    res.status(200).send({ "title": "some JSON data" })
  } else {
    res.status(400).end()
  }
})

app.get('/old-page', (req, res) => {
  res.location('http://localhost:3000/newpage')
  res.status(301).end()
})

app.post('/admin-only', (req, res) => {
  res.status(403).end()
})

app.get('/not-a-page', (req, res) => {
  res.status(404).end()
})

app.get('/server-error', (req, res) => {
  res.status(500).end()
})

app.listen(3000, () => console.log('sandbox-server listening on port 3000'))
