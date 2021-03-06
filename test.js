import test from 'ava'
import NeoDisqus from './index'

import { version } from './package.json'

let defaults = {}

test.before(t => {
  defaults = {
    access_token: null,
    api_key: null,
    api_secret: null,
    rest_base: 'https://disqus.com/api/3.0/',
    stream_base: 'ws://realtime.services.disqus.com/ws/2/',
    request_options: {
      headers: {
        'Accept': '*/*',
        'Connection': 'close',
        'User-Agent': `neo-disqus/${version}`
      }
    }
  }
})

test('create new instance', t => {
  const client = new NeoDisqus()
  t.true(client instanceof NeoDisqus)
})

test('has default options', t => {
  const client = new NeoDisqus()
  t.is(Object.keys(defaults).length, Object.keys(client.options).length)
  t.deepEqual(Object.keys(defaults), Object.keys(client.options))
})

test('accepts and overrides options', t => {
  const options = {
    consumer_key: 'XXXXX',
    power: 'Max',
    request_options: {
      headers: {
        'Accept': 'application/json'
      }
    }
  }

  const client = new NeoDisqus(options)
  t.true(client.options.hasOwnProperty('power'))
  t.is(client.options.power, options.power)
  t.is(client.options.consumer_key, options.consumer_key)
  t.is(
    client.options.request_options.headers.Accept,
    options.request_options.headers.Accept
  )
})
