var isNode = (typeof window === 'undefined')
//this file is only for testing

var log

if(!isNode) {
  document.body.style.fontFamily = 'andale mono'
  document.body.style.fontSize = '12px'
  document.body.style.lineHeight = '11px'
  window.gc()
  log = function() {
    var line = document.createElement('hr')
    document.body.appendChild(line)
    for(var i in arguments) {
      var arg = document.createElement('div')
      arg.style.backgroundColor = '#eee'
      arg.style.padding = '5px'

      arg.innerHTML = typeof arguments[i] === 'string' 
        ? arguments[i].replace(/(\r)|(\n)/g,'<br/>').replace(/ /g,'&nbsp;')
        : arguments[i]
      document.body.appendChild(arg)
    }
    window.requestAnimationFrame(function() {
      document.body.scrollTop = document.body.scrollHeight;
    })
  }
}

module.exports = log || console.log