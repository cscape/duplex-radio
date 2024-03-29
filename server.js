const http = require('http')
const getStream = require('./streamer')

const { MusicStream, GetHeaders } = getStream()

const StatusHandler = (req, res) => {
  const status = 200
  res.writeHead(status, {'Content-Type': 'application/json'})
  res.write(JSON.stringify({
    status: status,
    message: 'OK'
  }))
  res.end()
}

const StreamHandler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Cache-Control': 'no-cache',
    'X-Powered-By': 'Cyberscape Jukebox',
    'Access-Control-Allow-Origin': '*',
    ...GetHeaders()
  })
  res.write('\r\n\r\n')
  MusicStream.pipe(res)
}

const Error404Handler = (req, res) => {
  const status = 404
  res.writeHead(status, {'Content-Type': 'application/json'})
  res.write(JSON.stringify({
    status: status,
    message: 'Resource not found.'
  }))
  res.end()
}

const handler = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const ReqUrl = req.url.indexOf('/') === 0 ? req.url.substr(1).split('/') : [null]
  switch (ReqUrl[0]) {
    case 'status': return StatusHandler(req, res); break
    case 'stream': return StreamHandler(req, res); break
    default: return Error404Handler(req, res); break
  }
}

http.createServer(handler).listen(process.env.PORT)
