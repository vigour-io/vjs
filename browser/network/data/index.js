/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var object = require('../../../object')
  , data = require('../../../data')
  , Value = require('../../../value')
  , util = require('../../../util')
  , vigour = require('../../../')
  , _networkdata = module.exports = exports = vigour.Networkdata = data.new({
      mixed: 4, //mischien niet mixed
      merge: true
    })
  , _sub = 'subscribe'
  , _unsub = 'un' + _sub
  , _listener = 'Listener'
  , _al = 'add' + _listener
  , _rl = 'remove' + _listener
  , _proto = object.prototype
  , _protoAddListener = _proto[_al]
  , _protoRemoveListener = _proto[_rl]
  , _checkSubscription = function( field, val ) {
      var a = this
      while (a && a.__t === 4) {
        if(a.__block) return
        a = a._val
      }
      // console.log(field, a)
      if((a instanceof _networkdata) && a[field]) a[field](val, this)
    }
  , V = require('../../../')

_networkdata.prototype._blacklist.push('_subs','_complete')
//'_' + _sub, '_' + _unsub, we dont use there now
// _subscribe(_sub);
// _subscribe(_unsub);


//TODO: fix mark!!!!!!!!!!! mark:true
util.define(_networkdata,
  'get', function( val, set, notself ) {
    // IM GETTING! ["users", "u_ba3215a1b1038a70", "mtvData", "NL", "nl", "shows"] undefined
    //obj, path, val, overwrite, writeHandler, vobj, stamp, noupdate, self, uid, i
    // var bla = (val instanceof Array) ? val : String(val).split('.')
    // console.log('IM GETTING!', bla, val, set, this, this.path)

    //TODO: Always give me the non-from is possible

    // console.warn('Get -- self is now on on defualt should become something different!')

    //obj, path, val, overwrite, writeHandler, vobj, stamp, noupdate, self,

    //conditional self

    return this.path
      ( (val instanceof Array) ? val : String(val).split('.')
      , set !== void 0 ? set : {}
      , false
      , false
      , false
      , false
      , true
      , !notself
      )


  },
  // '_changevobj', function(val,stamp) {
  //   console.error(val,stamp)
  //   return _changevobj.apply(this,arguments)
  // },
  // '_hook', function(val, param) {
  //   for (var i in param) {
  //     this['_' + i] = param[i];
  //   }
  // }, //dont use this now so lets add when used
  _al, function( val ) {
    // console.log('LETS GO!', _sub, val, !!this[_sub])
    if(this[_sub]) this[_sub](val)
    _protoAddListener.apply( this, arguments )
  },
  _rl, function( val, mark ) {
    if (this._listeners && this[_unsub]) {
      // console.log('REMOVE _L'.red.inverse, mark)
      this[_unsub]( mark )
    }
    _protoRemoveListener.apply( this, arguments )
  }
);

//-------DATA---------
util.define(data, 
  _al, function(val) {
    // console.log('0--------->',val)
    if(!this.__block) _checkSubscription.call(this, _sub, val);
    _protoAddListener.call(this, val);
  },
  _rl, function(val, mark) {
     // console.error('2.1 REMOVE _L', mark, val, _unsub)
    if(!this.__block) _checkSubscription.call(this, _unsub, mark);
    _protoRemoveListener.call(this, val, mark);
  }
);

//-------Value---------

// util.define(Value, //test is this impacts performance to much
//   _al, function(val) {
//     // console.log('0--------->',val)
//     if(!this.__block) _checkSubscription.call(this, _sub, val);
//     _protoAddListener.call(this, val);
//   },
//   _rl, function(val, mark) {
//      // console.error('2.1 REMOVE _L', mark, val, _unsub)
//     if(!this.__block) _checkSubscription.call(this, _unsub, mark);
//     _protoRemoveListener.call(this, val, mark);
//   }
// );




