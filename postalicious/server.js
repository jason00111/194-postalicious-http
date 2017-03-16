const express = require('express')
const bodyParser = require('body-parser')

const net = require('net')

const app = express()

app.use(bodyParser.text())

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.post('/sendRequest', (req, res) => {
  socket = net.connect(3000, 'localhost', function () {
    socket.end(req.body)

    let rawResponse = ''

    socket.on('data', function(chunk) {
      rawResponse += chunk
    })
    
    socket.on('end', function(){
      res.type('text')
      res.send(rawResponse)
    })
  })
})

app.listen(3001, () => console.log('postalicious server listening on port 3001'))
