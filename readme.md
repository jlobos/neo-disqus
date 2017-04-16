# [![neo-disqus](https://a.disquscdn.com/dotcom/d-2407bda/img/brand/disqus-logo-blue-transparent.png)](https://github.com/jlobos/neo-disqus)

[![Build Status](https://travis-ci.org/jlobos/neo-disqus.svg?branch=master)](https://travis-ci.org/jlobos/neo-disqus) [![Build status](https://ci.appveyor.com/api/projects/status/8bjk60ll5wt0jc1q?svg=true)](https://ci.appveyor.com/project/jlobos/neo-disqus) [![bitHound Code](https://www.bithound.io/github/jlobos/neo-disqus/badges/code.svg)](https://www.bithound.io/github/jlobos/neo-disqus) [![bitHound Dependencies](https://www.bithound.io/github/jlobos/neo-disqus/badges/dependencies.svg)](https://www.bithound.io/github/jlobos/neo-disqus/master/dependencies/npm)

Client library for the [Disqus API](https://disqus.com/api/docs/) and Real-Time comments. :sparkles:

## Install

```
$ npm install --save neo-disqus
```

## Usage

```js
const Disqus = require('neo-disqus')

const client = new Disqus({
  access_token: '',
  api_key: '',
  api_secret: ''
})

const params = { forum: 'jaidefinichon', limit: 2 }

// Callback
client.get('forums/listThreads', params, (err, posts) => {
  console.log(err, posts)
})

// Promise
client.get('forums/listThreads', params).then(posts => {
  console.log(posts)
})
```

## REST API

You simply need to pass the endpoint and parameters to one of convenience methods. Take a look at the [documentation site](https://disqus.com/api/docs/) to reference available endpoints.

```js
// Callback
client.get(path, params, callback)
client.post(path, params, callback)

// Promise
client.get(path, params).then().catch()
client.post(path, params).then().catch()
```

Example, [get list of trending threads](https://disqus.com/api/docs/trends/listThreads/):

```js
client.get('trends/listThreads', (error, trending) => {
  console.log(trending)
})
```

## Real Time

The `stream` method return instance of [WebSocket](https://github.com/websockets/ws).

Example, streaming comments:

```js
const params = { forum: 'jaidefinichon', limit: 1 }

client.get('forums/listThreads', params, (e, lastThreads) => {
  if (e) return console.error(e)

  const id = lastThreads.response[0].id
  const stream = client.stream(`thread/${id}`)

  stream.on('open', () => { console.log('connected') })

  stream.on('message', (message) => {
    message = JSON.parse(message)
    console.log(message)
  })
})
```

## License

MIT
