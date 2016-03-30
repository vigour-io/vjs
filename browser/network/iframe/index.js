var ajax = require('../ajax')
if(window.addEventListener) {
  // console.log('init iframe -',window.location.href)
  addEventListener("message", function(e) {
    // console.log('MSG!',e.data)
    var d = JSON.parse(e.data)
      , id = d.id

    var params = d.msg
    params.complete = function(data) {
      top.postMessage(JSON.stringify({id:id,msg:data}) , '*')
    }
    params.error = function(err) {
      console.log('XHR-IFRAME', window.location.href , err)
      top.postMessage(JSON.stringify({id:id,err:err.message||true}) , '*')
    }
    params.parse = false
    ajax(params)
  }, false)
}