var Element = require('../element')
  , util = require('../../browser/events/util') 
  , sprite = new Element({ 
    'w,h':50,
    x:{translate:true,val:0}
  })

sprite.extend({ name: 'params' //this has to come from ui (element)
  , type: false
  , set: function(val) {
    this._params = val
    this.Class.prototype._params = val //temp?
  }
})

sprite.setSetting({
  name:'spinner',
  render:function() {
    var t = this
      , params = this._params || {}
      , start = params.start || 0
      , speed = params.frames || 3
      , rows = params.rows || 1
      , cols = params.cols || 0 //ignore
      , once = params.once
      , cnt = start
      , steps = (params.steps || (rows*cols-start) || 19)
      , curRow = 0
      , curCol = 0

    if(!t.display || !t.display._base===t) {
      t.display = t.display && t.display.val || 'block'
    }
    t.display.addListener([displayListener,t],true)

    t.node.style.backgroundSize = this.w.val*cols+'px auto'
    //remeber where it was perhaps if re-rendered
    if(t.display.val==='none') return

    t._spinner = util.interval(function() { //test interval for leaks
      t.node.style.backgroundPosition = 
        (-t.w.val*curCol)+'px '+(rows ? (-t.h.val*curRow) : 0)+'px'
      cnt++
      if(cnt === steps) {
        cnt = start
        if(once) {
          // console.error('XXXXX')
          removeRaf.call(t)
          return
        }
      }
      curRow = rows ? ~~(cnt/cols) : 0
      curCol = cnt-(curRow)*cols
    },speed)
  },
  remove:removeRaf
})

function removeRaf() {
  if(this._spinner) {
    this._spinner()
    this._spinner = null
  }
}

function displayListener (val) {
  if(val.val==='none') {
    removeRaf.call(this)
  } else {
    if(!this._spinner) this.setting('render')
  }
}

module.exports = sprite.Class


