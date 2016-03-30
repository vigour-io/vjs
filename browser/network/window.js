var Value = require('../../value')
module.exports = exports = new Value()

//maak fallback
exports.addListener(function(val, stamp) {
  if(stamp!=='localstorage') {
    localStorage.setItem('windowEvents',val)
    localStorage.setItem('windowEvents','')
  }
})

//interval fallback

//replace this
window.addEventListener('storage', function(e) {
  if(e.key==='windowEvents') {
    var val = localStorage.getItem(e.key)
    if(val) {
      exports._val = ''
      exports._lstamp = false
      exports._update(val,'localstorage')
    }
  }
},false);





