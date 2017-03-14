const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.get('/', (req, res) => {
  
})

app.listen(3001, () => console.log('postalicious server listening on port 3001'))
