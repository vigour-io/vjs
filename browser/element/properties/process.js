/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = require('../../../util')

exports.extend = util.extend(function(base) {
  var proto = base.Class.prototype
    , add = proto.add

  util.define
  ( proto
  , 'add'
  ,  function(val) {
       if( !val.process )
       {
          add.apply( this, arguments )
       } else
       {
          val.__tempAdd = util.arg( arguments )
          val.__tempAdd.unshift(this)
       }
     }
  )

  base.extend({
    process: function(val) {
      console.log('xxxx___xxxx')
      if(this.__tempAdd && !this.parent) {
        add.apply(this.__tempAdd[0], this.__tempAdd.slice(1))
        this.__tempAdd = null
      }
    }
  })

})

//process wordt mischien meer een operator?
//soort field eigenlijk