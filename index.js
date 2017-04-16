const request = require('request-promise')
const WebSocket = require('ws')

const { version } = require('./package.json')

module.exports = class {
  constructor (options) {
    this.options = Object.assign({
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
      Object.assign(this.options.request_options, qs)
    )
  }

  _r (method, path, params = {}, callback) {
    if (typeof params === 'function') {
      callback = params
    }

    let payload = {
      uri: `${this.options.rest_base}${path}`,
      method: method,
      json: true
    }

    if (method === 'GET') { payload.qs = params }
    if (method === 'POST') { payload.formData = params }

    const promise = this.request(payload)

    if (callback && typeof callback === 'function') {
      promise.then(callback.bind(null, null), callback)
    }

    return promise
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
