
var collection = require('./util')
  , util = require('../../../../util')

/**
 * collection
 * links arrays or object to elements
 * use filter if you want to convert
 * @attribute
 */

exports.extend = util.extend(
  require('../data'),
  function(base){

    base.extend({
      name:'collection',
      // render:function() {
      //   this.update('collection') 
      // },
      remove:function() {
        if(this._colElem) this._colElem.remove()
      },
      set: function(val, stamp, from, remove, change, added) {

        val._skip = true

        var hasFilter = collection.filter(val, this)
          , data = this.filter || val.val
          , options = this._colOptions || val.options 
              && (this._colOptions = val.options.convert())
          , orig =  val.element
          , el = this._colElem 
              || (orig && orig._val) && (this._colElem = new (orig._val.Class || orig._val)())
          , firstRun = !this._colInit
          , slStamp
          , elVal
          , colElem = this._colElem

        //dirty block! clean it FAST

        // || !this.rendered 

        if(!(data && el)) return //||!this.rendered
        
        slStamp = orig._slStamp
        elVal = orig._val

        if(slStamp) {
          orig._slStamp = stamp
        } else if(colElem && orig._slStamp !== stamp) {
          if(!(elVal.Class && (colElem instanceof elVal.Class)) 
            && !(!elVal.Class && (colElem instanceof elVal))) {
            el = this._colElem = new (elVal.Class || elVal)()
            orig._slStamp = stamp
          }
        }



        // console.log('ook leuk ff update', val, stamp, from, remove, change, added)
          // console.log('pass!')
          
        if(firstRun) {

          options && options.prepare && options.prepare(el)

          this._colInit = true
          this.node.appendChild(collection.fragment( data, el, this, false, options
            , hasFilter ))

        } else {

          if(from && from._parent === data.from) {
            if(remove) {
              var r = util.checkArray(collection.children(this),from,'_d',true)
              if(r) {
                if(!(options && options.rem && options.rem(r, this, hasFilter))) {
                  r.remove()
                }
              }
            } else if(util.checkArray(collection.children(this),from,'_d')===false) {

              collection.element( from, el, this, true, this.node, options, hasFilter, true )
            } else if(hasFilter && options && options.indexChange) {

                options.indexChange(
                  util.checkArray(collection.children(this),from,'_d',true)
                  , this, hasFilter )
            }
            
          } else {
            
            if(!from) {

              if(remove) {
                collection.clear(this, options)
              } else {

                var c = collection.children(this)
                  , exclude = {}
                  , name
                  , fField
                  , keys
                  , child

                // console.log('XXXXX',hasFilter) try to fix order by name better
                if(hasFilter===true) {
                  keys = data.keys
                }

                for(var j in c) {
                  child = c[j]
                  name = c[j]._d._name
                  if(hasFilter && !keys ? util.checkArray(data,child._d) === false : !data[name] || data[name]!==child._d ) {
                    if(!(options && options.rem && options.rem(child, this, hasFilter, hasFilter))) {
                      child.remove()
                    }
                  } else {
                    //this is more efficient
                    // if(data[name]!==c[j]._d) c[j].data = data[name] 
                    exclude[name]=true
                    if(hasFilter) {
                      if(options && options.indexChange) {
                        if(child._d._indexCache[hasFilter][0]!==child.i) {
                          options.indexChange(child, this, hasFilter, true)
                        }
                      } else if(hasFilter===true) {
                        if(j!=util.checkArray(keys,name,true)) {
                          delete exclude[name]
                          if(!(options && options.rem && options.rem(c[j], this, hasFilter, hasFilter))) {
                            child.remove()
                          }
                        } 
                      }
                    }
                  }
                }

                this.node.appendChild(
                  collection.fragment(data, el, this, exclude, options, hasFilter)
                )
              }

            }
          }
        }
      }
    })
})