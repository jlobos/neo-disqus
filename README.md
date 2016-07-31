# [![neo-disqus](https://a.disquscdn.com/dotcom/d-2407bda/img/brand/disqus-logo-blue-transparent.png)](https://github.com/jlobos/neo-disqus)

Client library for the [Disqus API](https://disqus.com/api/docs/) and Real-Time comments. :sparkles:

```js
import NeoDisqus from './lib/index'

const client = new NeoDisqus({
  access_token: '',
  api_key: '',
  api_secret: ''
})

const params = { forum: 'jaidefinichon', limit: 2 }
client.get('forums/listThreads', params, (error, posts) => {
  if (error) return console.error(error)
  console.log(posts)
})
```

## Installation

```
$ npm i neo-disqus
```

## REST API

You simply need to pass the endpoint and parameters to one of convenience methods.  Take a look at the [documentation site](https://disqus.com/api/docs/) to reference available endpoints.

```js
client.get(path, params, callback)
client.post(path, params, callback)
```

Example, [get list of trending threads](https://disqus.com/api/docs/trends/listThreads/):

```js
client.get('trends/listThreads', (error, trending) => {
  if (error) return console.error(error)
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

## Testing

```
$ npm install
$ npm test
```
