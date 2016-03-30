/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

var flags = module.exports = require('./')
/**
 * listen
 * adds listeners to a V.Value
 * @property
 **/
flags.listen = {
  reset:true,
  set: function(val, stamp, reset) {
    if(!val)
    {
      console.error('no val in flags listen!')
      debugger
      return
    }
    if(!this._flag) this._flag = {}
    //eventueel mergen!
      
    // console.log('listen'.cyan.inverse, reset, val)
    //if reset make sure its resetted correctly!
    this._flag.listen = ['listen', false, val, this ] 
    if (val instanceof Array) {
      for (var i = val.length - 1; i >= 0; val[i--].addListener(this));
    } else {
      //ok
      var _this = this
      // val.addListener(function() {
      //   console.log('TROUGH LISTEN!!!!'.magenta.inverse, val._path)
      //   // _this._update.apply(_this, arguments)
      // }) 
      val.addListener(this) //dit moet beter (remove listener if possible)
    }
  },
  remove:function() {
    if(this._flag&&this._flag.listen) {
      var val = this._flag.listen[2]
      if (val instanceof Array) {
        for (var i = val.length - 1; i >= 0; val[i--].removeListener(this));
      } else {
        val.removeListener(this) //dit moet beter (remove listener if possible)
      }
    }
  }
}
