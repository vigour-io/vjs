//enige wat dit moet doen is alle browser files uitlezen en results 
//save en vergelijken

var page = require('webpage').create()
	, system = require('system')
  , url = system.args[1]

console.log('lol phantomjs', url);

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('|||||||CONSOLE:'
   + msg 
   + ' (from line #' + lineNum 
   + ' in "' + sourceId + '")')
}

page.onError = function(msg, trace) {
  var msgStack = [msg]
  if (trace && trace.length) {
    msgStack.push('TRACE:')
    trace.forEach(function(t) {
      msgStack.push(' -> ' 
        + (t.file || t.sourceURL) 
        + ': ' 
        + t.line + (t.function ? ' (in function ' + t.function +')' : '')
      )
    })
  }
  console.log('|||||||ERROR: '+msgStack.join('\n'));
}

// window.console.log = function(msg) { alert(msg) }; 
page.open(url, function(status) {
  page.evaluate(function() {
    console.log(navigator.userAgent,document.title)
  }) 
  phantom.exit();
})


