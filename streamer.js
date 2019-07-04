const https = require('https')
const { Readable } = require('stream')

const DuplexStreamer = ds => https.get('https://vapor.fm:8000/stream', res => {
  ds.readable = true
  ds.setEncoding('binary')
  ds.resume()
  res.setEncoding('binary')
  res.on('data', chunk => ds.emit('data', chunk))
}).on('error', e => console.error(`Got error: ${e.message}`))

const getStream = () => {
  const MusicStream = new Readable()
  DuplexStreamer(MusicStream)
  return MusicStream
}

module.exports = getStream
