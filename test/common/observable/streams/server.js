var http = require('http')

console.log('server start')
http.createServer(function(req,res) {
  req.rcnt = 1

  res.writeHead(200,
    {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Transfer-Encoding': 'chunked'
  })
  var t = setInterval(function() {
    req.rcnt++
    console.log('res server send')


    res.write(String(' funsies! '))
    if(req.rcnt===20) {
      console.log('res end')

      clearInterval(t)
      res.end('?')
    }
  } , 50)
}).listen( 3030 )
