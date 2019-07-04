const https = require('https')
const { Readable, Duplex } = require('stream')

let headers = {}
const getHeaders = () => {
  return headers
}

class HeadersInfo {
  constructor ()
}

const DuplexStreamer = ds => https.get('https://vapor.fm:8000/stream', res => {
  Object.keys(res.headers).forEach(h => {
    if (h.indexOf('icy') === -1) return
    headers[h] = res.headers[h]
  })

  ds.readable = true
  ds.setEncoding('binary')
  ds.resume()
  res.setEncoding('binary')
  res.on('data', chunk => ds.push(chunk))
}).on('error', e => console.error(`Got error: ${e.message}`))

const getStream = () => {
  const MusicStream = new Duplex()
  MusicStream._read = _ => 0;
  DuplexStreamer(MusicStream)
  return MusicStream
}

module.exports = { getStream, getHeaders }
