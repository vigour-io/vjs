var http = require('http')
http.createServer(function (req, res) {
  req.rcnt = 1
  console.log('hey!')

  res.writeHead(200,
    {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Transfer-Encoding': 'chunked'
    })
  var t = setInterval(function () {
    req.rcnt++
    res.write(String(' funsies! '))
    if (req.rcnt === 20) {
      clearInterval(t)
      res.end('?')
    }
  }, 50)
}).listen(3030)
