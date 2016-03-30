var debug = require('../util/debug')
  , util = require('../util')
  , V = require('../')

debug.level.object = 3

exports.listener = function(msg,args,s) {
  if(debug.level.object>2) {
    if(msg instanceof String) {
      msg = msg
    } else {
      msg = false
    }
    var h = (msg||this._path?JSON.stringify(this._path):'')+' listener'
    var amount = msg ? 2 : 1
    console.group()
    debug.log.header(h)
    console.log( 
        'this:', this
      , '\nval:', args[0]
      ,'\nstamp:', args[1]
      ,'\nfrom:', args[2]
      ,'\nremove:', args[3]
      ,'\nadded:', args[4]
      ,'\noldval:', args[5]
      ,'\npath',this._path      
      ,'\norigin:',this._origin===this ? 'this' : this._origin
    )
    if(args[2]) {
      console.log('\nfromPath:',args[2]._path)
      console.log('\nupdateOriginIsFrom:',(args[2]._updateOrigin===args[2]))
    }
    if(s) {
      console.log('\n')
      exports.log.fn.apply(this,util.arg(arguments,amount)) 
    }
    debug.log.end(h)
    console.groupEnd()
  } else if(debug.level.object>1) {
    console.group()
    var h = (msg||this._path?JSON.stringify(this._path):'')+' listener'
    var amount = msg ? 2 : 1
    debug.log.header(h)
    console.groupEnd()
  }
}

exports.extend = util.extend((function(obj) {
  util.define(obj
    ,'DEBUG$_set',function(msg,args) {

      if(typeof msg==='string') {
        msg = msg
      } else {
        args = msg
        msg = false
      }

      if(debug.level.object>1) {
        console.group()
            console.log(('_set vobj' + (msg||'')).magenta.bold)
             console.log( 
            'this:', this
            ,'\noupdate:', args[4]
          , '\nval:', args[0]
          ,'\nstamp:', args[1]
          ,'\nfrom:', args[2]
          ,'\nremove:', args[3]
          ,'\nadded:', args[5]
          ,'\noldval:', args[6]
          ,'\npath',this._path      
          ,'\norigin:',this._origin===this ? 'this' : this._origin
        )
        console.groupEnd()
       } 
      // function(val, stamp, from, remove, noupdate, added, oldval) {
    }
    ,'DEBUG$set',function(msg,args) {

      if(typeof msg==='string') {
        msg = msg
      } else {
        args = msg
        msg = false
      }

      //name, val, vobj, stamp, noupdate, from

      if(debug.level.object>1) {
        console.group()
            console.log(('set vobj' +name+' '+ (msg||'')).magenta.bold)
             console.log( 
          '\nthis:', this
          ,'\nname:', args[0]
          ,'\nval:', args[1]
          ,'\nvobj:', args[2]
          ,'\nstamp:', args[3]
          ,'\nnoupdate:', args[4]
          ,'\nfrom:', args[5]
        )
        console.groupEnd()
       } 
    }
    ,'DEBUG$log',function(msg,s) {
    if(debug.level.object>1) console.group()
    if(typeof msg === 'string') {
      msg = msg
    } else {
      msg = false
    }
    var h = 'vObj '+(msg||(this._path?JSON.stringify(this._path):''))
    if(msg!=='') debug.log.header(h)
    if(debug.level.object>1) {

        var t = ('type: '+this.__t)
          , p = ('parent: '+ (this._parent && JSON.stringify(this._parent._path)))
          , path = ('path: '+JSON.stringify(this._path))
          , listeners = ('listeners: '+(this._listeners && this._listeners.length))
          , listens = ('listens: '+(this._listens && this._listens.length))

        console.log( this.__t ? t : 'no type'.grey )      
        console.log( this._path.length ? path : 'no path'.grey )

        if(debug.level.object>2) {
          console.log( this._listeners ? listeners : 'no listeners'.grey )
          console.log( this._listens ? listens : 'does not listen'.grey )
          console.log('raw:'+JSON.stringify(this.raw,false,2))

          console.log( this._parent ? p : 'no parent'.grey )      
          if(debug.level.object>3 && this._parent) {
            this._parent.DEBUG$log('')
          }

        }
      }
    if(s) {
      debug.log.fn.apply(this,util.arg(arguments,1)) 
    }
    // debug.log.end(h)
    if(debug.level.object>1) console.groupEnd()
    return JSON.stringify(this.raw,false,2)
  },'DEBUG$listener',exports.listener)
}).bind(this))