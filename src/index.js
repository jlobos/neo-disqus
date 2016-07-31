
import WebSocket from 'ws'
import request from 'request'
import extend from 'deep-extend'

import { version } from '../package.json'

class NeoDisqus {
  constructor (options) {
    this.options = extend({
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
    }, options)

    let qs = (this.options.api_key)
    ? {
      qs: {
        access_token: this.options.access_token,
        api_key: this.options.api_key,
        api_secret: this.options.api_secret
      }
    } : { }

    this.request = request.defaults(
      extend(this.options.request_options, qs)
    )
  }

  _r (method, path, params, callback) {
    if (typeof params === 'function') {
      callback = params
      params = {}
    }

    let payload = {
      uri: `${this.options.rest_base}${path}`,
      method: method
    }

    if (method === 'GET') { payload.qs = params }
    if (method === 'POST') { payload.formData = params }

    this.request(payload, (error, response, data) => {
      if (error) return callback(error, data)

      try { data = JSON.parse(data) } catch (parseError) {
        return callback(
          new Error(`Status Code: ${response.statusCode}`),
          data
        )
      }

      if (data.code !== 0) {
        callback(data.response, data)
      } else if (response.statusCode !== 200) {
        callback(new Error(`Status Code: ${response.statusCode}`), data)
      } else {
        callback(null, data)
      }
    })
  }

  get (url, params, callback) { return this._r('GET', url, params, callback) }

  post (url, params, callback) { return this._r('POST', url, params, callback) }

  stream (url) {
    return new WebSocket(`${this.options.stream_base}${url}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36',
        'Host': 'realtime.services.disqus.com',
        'Sec-WebSocket-Version': 13,
        'Origin': 'http://disqus.com'
      }
    })
  }

}

module.exports = NeoDisqus
