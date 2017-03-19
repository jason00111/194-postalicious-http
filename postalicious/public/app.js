const methodInput = document.getElementById('method')
const uriInput = document.getElementById('uri')
const hostInput = document.getElementById('host')

const queryKeys = document.getElementsByClassName('queryKey')
const queryValues = document.getElementsByClassName('queryValue')

const headerKeys = document.getElementsByClassName('headerKey')
const headerValues = document.getElementsByClassName('headerValue')

const bodyInput = document.getElementById('body')

const rawRequestDiv = document.getElementById('rawRequest')
const rawResponseDiv = document.getElementById('rawResponse')

const historySelect = document.getElementById('history')

const methods = [
  'GET',
  'POST'
]

populateHistorySelect()

function populateHistorySelect () {
  while (historySelect.hasChildNodes()) {
    historySelect.removeChild(historySelect.lastChild)
  }

  const labelOption = document.createElement('option')
  labelOption.value = -1
  labelOption.innerText = 'History'
  historySelect.appendChild(labelOption)

  const history = JSON.parse(localStorage.requests)

  history.forEach((request, index) => {
    const option = document.createElement('option')
    option.value = index
    option.innerText = `${request.method} ${request.host}${request.uri}`
    historySelect.appendChild(option)
  })
}

function remember () {
  const index = parseInt(historySelect.value)

  clearFields()

  if (index === -1) return

  const history = JSON.parse(localStorage.requests)
  const request = history[index]

  methodInput.value = request.method
  hostInput.value = request.host
  uriInput.value = request.uri

  if ('queries' in request) {
    request.queries.forEach((query, index) => {
      for (let key in query) {
        queryKeys[index].value = key
        queryValues[index].value = query[key]
      }
    })
  }

  if ('headers' in request) {
    request.headers.forEach((header, index) => {
      for (let key in header) {
        headerKeys[index].value = key
        headerValues[index].value = header[key]
      }
    })
  }

  if ('body' in request) {
    bodyInput.value = request.body
  }
}

function clearFields () {
  methodInput.value = null
  hostInput.value = null
  uriInput.value = null
  bodyInput.value = null

  Array.from(queryKeys).forEach((queryKey, index) => {
    queryKey.value = null
    queryValues[index].value = null
  })

  Array.from(headerKeys).forEach((headerKey, index) => {
    headerKey.value = null
    headerValues[index].value = null
  })
}

function build () {
  if (!methods.find(method => method === methodInput.value)) {
    alert(`You must enter one of these methods: ${methods.join(', ')}`)
    return
  }

  if (!hostInput.value) {
    alert('You must enter a host')
    return
  }

  if (!uriInput.value) {
    alert('You must enter a URI')
    return
  }

  rawResponseDiv.textContent = ''

  let request = `${methodInput.value} ${uriInput.value}`

  const requestObject = {
    method: methodInput.value,
    host: hostInput.value,
    uri: uriInput.value,
  }

  if (methodInput.value === 'GET') {
    const queryKeysArray = Array.from(queryKeys).map(input => input.value)
    const queryValuesArray = Array.from(queryValues).map(input => input.value)

    const queries = queryKeysArray.reduce((queries, key, index) => {
      if (key.length !== 0 && queryValuesArray[index].length !== 0) {
        queries.push(`${key}=${queryValuesArray[index]}`)
        if (!('queries' in requestObject)) {
          requestObject.queries = []
        }
        requestObject.queries.push({[key]: queryValuesArray[index]})
      }
      return queries
    }, [])

    if (queries.length !== 0) {
      request += `?${queries.join('&')}`
    }
  }

  request += ` HTTP/1.1\r\nHost: ${hostInput.value}\r\n`

  const headerKeysArray = Array.from(headerKeys).map(input => input.value)
  const headerValuesArray = Array.from(headerValues).map(input => input.value)

  const headers = headerKeysArray.reduce((headers, key, index) => {
    if (key.length !== 0 && headerValuesArray[index].length !== 0) {
      headers.push(`${key}: ${headerValuesArray[index]}`)
      if (!('headers' in requestObject)) {
        requestObject.headers = []
      }
      requestObject.headers.push({[key]: headerValuesArray[index]})
    }
    return headers
  }, [])

  if (bodyInput.value.length !== 0) {
    headers.push(`Content-Length: ${bodyInput.value.length}`)
    headers.push('Content-Type: text/plain')
    requestObject.body = bodyInput.value
  }

  if (headers.length !== 0) {
    request += `${headers.join('\r\n')}`
  }

  request += '\r\n\r\n'

  if (bodyInput.value.length !== 0) {
    request += bodyInput.value
  }

  rawRequestDiv.textContent = request

  const previousRequests = localStorage.requests
    ? JSON.parse(localStorage.requests)
    : []

  previousRequests.push(requestObject)

  localStorage.setItem('requests', JSON.stringify(previousRequests))

  populateHistorySelect()

  return request
}

function buildAndSend () {
  const requestString = build()

  const xhrRequest = new XMLHttpRequest()
  xhrRequest.open("POST", 'http://localhost:3001/sendRequest')

  xhrRequest.onload = function () {
    if (xhrRequest.readyState === xhrRequest.DONE) {
      rawResponseDiv.textContent = xhrRequest.response
    }
  }

  xhrRequest.send(requestString)
}
