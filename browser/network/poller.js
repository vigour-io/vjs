var ajax = require('./ajax')
  , poller = exports

poller.poll = function poll(label, req, time, handler){
  poller[label] = true
  req.complete = req.error = resHandler

  ajax(req)

  function resHandler(res){
    if(!handler(res)){
      setTimeout(function(){
        if(poller[label])
          ajax(req)
      }, time)
    }else{
      poller[label] = false
    }
  }
}
