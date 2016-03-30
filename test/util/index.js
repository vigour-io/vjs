var fs = require('fs')
  , gaston = require('gaston')
  , log = require('./log')

exports.test = function (dir, hash, fn, complete) {
  fs.readdir('test/'+dir, function (err,data) {
    var done = 0
      , l = data.length
    for (var i in data) {
      if(data[i][0]!=='.') { //use gitIgnore for this
        fn(data[i], hash, function () {
          done++
          if (done === l) complete && complete()
        })
      }
      else {
        l--
        if (done === l) complete && complete()
      }
    }
  })
}

exports.server = require('http').createServer(function (req, res) {
  res.writeHeader(200, {"Content-Type": "text/html"});
  var folder = __dirname+'/..'+req.url
  fs.readFile(folder, function (err, data) {
    if(err && !/.[a-z0-9]{2,4}$/.test(req.url)) {
      var html
      /*
        indexFile
        , debug
        , jsBuildFileName
        , buildFolder
        , callback
        , dontwatch
      */
      gaston.prepare(folder,function() {
        var rdy = 1
        , callback = function() {
          rdy--          
          if(!rdy) fs.readFile(folder+'index.html','utf8',function(err,data) {
            res.end(data)
          })
        }
        gaston.compileJs('index.js',false,'bundle.js',folder,callback,true)
        // gaston.compileLess('index.js','bundle.css',folder,false,true)
      })
    } else {
      res.end(data)
    }
  })
}).listen(8888)