const https = require('https')
const { Duplex } = require('stream')

const DuplexStreamer = ds => https.get('https://vapor.fm:8000/stream', res => {
  ds.readable = true
  ds.setEncoding('binary')
  res.setEncoding('binary')
  res.pipe(ds)
}).on('error', e => console.error(`Got error: ${e.message}`))

const getStream = () => {
  const MusicStream = new Duplex()
  DuplexStreamer(MusicStream)
  return MusicStream
}

module.exports = getStream
