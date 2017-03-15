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

const methods = [
  'GET',
  'POST'
]

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

  let request = `${methodInput.value} ${uriInput.value}`

  if (methodInput.value === 'GET') {
    const queryKeysArray = Array.from(queryKeys).map(input => input.value)
    const queryValuesArray = Array.from(queryValues).map(input => input.value)

    const queries = queryKeysArray.reduce((queries, key, index) => {
      if (key.length !== 0 && queryValuesArray[index].length !== 0) {
        queries.push(`${key}=${queryValuesArray[index]}`)
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
    }
    return headers
  }, [])

  if (bodyInput.value.length !== 0) {
    headers.push(`Content-Length: ${bodyInput.value.length}`)
  }

  if (headers.length !== 0) {
    request += `${headers.join('\r\n')}`
  }

  request += '\r\n\r\n'

  if (bodyInput.value.length !== 0) {
    request += bodyInput.value
  }

  rawRequestDiv.textContent = request

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
