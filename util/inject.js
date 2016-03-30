
var V = require('../')
  , util = require('./')

module.exports = exports = function(extend) {
  var args = arguments
  if( (typeof this === 'function') || (V.Base && (this instanceof V.Base))) {
    if((V.Base 
        && (this===V.Base 
        || (this.prototype instanceof V.Base)
        || (this instanceof V.Base))
      )) { 
      args = util.arg(args)
      args.unshift(this)
      extend = this
    } else {
      return inject.apply(this,args)
    }
  }
  for(var i = 1; i < args.length; i++) {
   makeExtend(extend, args[i])
  }
  return extend
}

function makeExtend(extend, module) {
  if(module.extend) {
     module.extend(extend)
  } else if(module instanceof Array) {
    var arr = module.concat()
      , mod = arr[0]
    arr[0] = extend
    mod.extend.apply(mod,arr)
  } 
} 

function inject() {
  //do special stuff voor blacklist
  // Custom.prototype = new this() //lighter
  var Custom
    , extendResidue = []
    , Aspects = [this]

  for (var i = 0, Aspect, args = arguments, len = args.length; i < len; i++) {
    
    Aspect = args[i]

    if(typeof Aspect === 'function') {
      if(!Custom) {
        Custom = function() {
          for (var j = 0, len = Aspects.length; j < len;  j++) {
            Aspects[j].apply(this, arguments)
          }
        }
        inherits( Custom, this )
      }
      Aspects.push(Aspect)
      for (var method$ in Aspect.prototype) if ({}.hasOwnProperty.call(Aspect.prototype, method$)) {
        if (method$ === 'constructor') continue
        Custom.prototype[method$] = Aspect.prototype[method$]
      }
    } else {
      if(Custom) {
       makeExtend(Custom , Aspect)
      } else {
        extendResidue.push(Aspect)
      }
    }
  }

  if(!Custom) Custom = this
  
  for(var j in extendResidue) {
    makeExtend(Custom,extendResidue[j])
  }

  return Custom
}

function inherits(ctor, superCtor) {
  ctor.super_ = superCtor
  ctor.prototype = Object.create
    ( superCtor.prototype
    , { constructor: 
        { value: ctor
        , enumerable: false
        , writable: true
        , configurable: true
        }
      }
    )
}

/*
 Dit moet worden geadd voor V.Objects
/*
  object.new = function(params, constructor) {
  var vObj = function(val, hook, parent) {
      if (parent) this._parent = parent
      if (hook && this._hook) this._hook(val, hook)
      if (this._onConstruct) this._onConstruct(val, hook)
      if (val !== void 0) this.val = val
      // console.log(constructor)
      if(constructor) constructor.apply(this,arguments)  
    },
    proto = vObj.prototype = new this()
  vObj.new = object.new
  util.define(vObj, '_blacklist', proto._blacklist.concat())
  _params.call(vObj, params, ['mixed', 'merge'])
  util.define(vObj, '_class', vObj)
  return vObj
}

veel dingen werken als extension niet als losse class -- 

*/

