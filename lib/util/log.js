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

      var logit = arguments[i]

      if(logit && logit.$toString ) {
        logit = logit.$toString()
        console.log(logit)
        // logit = logit.replace(/\s/g, '&nbsp;')
        // console.log(logit.replace(/\\n/g, '<br/>'))
      }

      arg.innerHTML = typeof logit === 'string' 
        ? logit.replace(/(\r)|(\n)/g,'<br/>')
               .replace(/ /g,'&nbsp;')
               .replace(/\\n/g, '<br/>&nbsp;&nbsp;')
        : logit
      document.body.appendChild(arg)
    }

    window.requestAnimationFrame(function() {
      document.body.scrollTop = document.body.scrollHeight
    })

  }
}

module.exports = log || console.log