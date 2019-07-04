const https = require('https')
const { Readable, Duplex } = require('stream')

const DuplexStreamer = ds => https.get('https://vapor.fm:8000/stream', res => {
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

module.exports = getStream
