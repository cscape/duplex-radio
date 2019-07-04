const https = require('https')
const { Readable, Duplex } = require('stream')

class HeadersInfo {
  constructor () {
    this.headers = {}
    return this
  }
  setHeader (prop, val) {
    this.headers[prop] = val
  }
}

const DuplexStreamer = (ds, hd) => https.get('https://vapor.fm:8000/stream', res => {
  Object.keys(res.headers).forEach(h => {
    if (h.indexOf('icy') === 0 || h.indexOf('ice') === 0) {
      hd.setHeader(h, res.headers[h])
    }
  })

  ds.readable = true
  ds.setEncoding('binary')
  ds.resume()
  res.setEncoding('binary')
  res.on('data', chunk => ds.push(chunk))
}).on('error', e => console.error(`Got error: ${e.message}`))

const getStream = () => {
  const Headers = new HeadersInfo()
  const MusicStream = new Duplex()
  MusicStream._read = _ => 0;
  DuplexStreamer(MusicStream, Headers)
  return { MusicStream, GetHeaders: () => Headers.headers }
}

module.exports = getStream
