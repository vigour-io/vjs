/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

var util = require('../../util')
  , element = require('./')
  , object = require('../../object')

/**
 * flags
 * add keywords to set objects which are checked using a function in flags
 * simply add fields to the set module
 */
var flags = exports
  /**
   * _flag
   * function that calls flag functions on element.set.flags
   */
  , _flag = function(name, val, copy, top) {
      var f;
      for (var i in flags) {
        f = flags[i].call(this, name, val, copy, top);
        if (f) {
          return f;
        }
      }
    }

util.define(element,
  /**
   * set
   * adds children for non existing attributes
   * _original are original values changed by cases and events
   * instances - add or remove children from instances;
   */
  '_set', function(val, i, instances) {

    if (!_flag.call(this, i, val[i], instances, val)) {
      if ( !this.isProperty( i, val ) ) {
        if (val[i] instanceof element) {
          var before
          if (this[i]) {
            for(var c=this.node.childNodes,node$=0,len=c.length;node$<len;node$++) {
              if(c[node$]===this[i].node) {
                before = c[(node$+1)]
                break;
              }
            }
            this[i].remove && this[i].remove();
          }
          //replace element if its already there
          // console.error(add, instances, val[i])
          var add = instances ? new val[i].Class : val[i];
          add.name = i;
          this.add(add, before);
          if (instances) {
            this.eachInstance(function() {
              var a = new add.Class();
              a._name = i;
              this.add(a);
            });
          }
        } else {
          if( this[i] instanceof object ) 
          {
            //TODO: torough testing
            this[i].val = val[i]
          } 
          else if( val[i] instanceof object ) 
          {
            console.warn('are you sure you want to set using a vObject? maybe require some stuff (e.g. data)')
            this[i] = val[i]
          } 
          else if( this[i] instanceof element ) 
          {
            this[i].set(val[i], instances)
          } 
          else 
          {
            var add = new element().set(val[i], instances)
            add.name = i;
            this.add(add)
            if (instances) 
            {
              this.eachInstance( function() {
                var a = new add.Class()
                a._name = i
                this.add(a)
              })
            }
          }
        }
      } else {
        if (val[i] === false && (this[i] instanceof element)) {
          if (instances) {
            this.eachInstance(function() {
              if (this[i]) this[i].remove()
            })
          }
          this[i].remove()
          this[i] = null
        } else {
          //hier ff checkken voor functie
          if(typeof this[i] === 'function') {

            // alert('CALL FUNCTION')

            if(val[i] instanceof Array) {
              this[i].apply(this,val[i])
            } else {
              this[i](val[i])
            }
          } else {
            this[i] = val[i]
          }
        }
      }
      //dynamic changes to the _original set object pool
      //if (!copy && this._original) {
      //this._original[i] = val[i]; //check if stuff /w classes is nessecary;
      //}
    }
  },
  /**
   * convert
   * for each fields in val convert back to a setObject;
   */
  'convert', function(val) {
    var setObj = {},
      isObj;
    for (var i in val) {
      isObj = util.isObj(val[i])
      if (this[i] instanceof element) {
        setObj[i] = isObj ? this[i].convert(val[i]) : this[i]
      } else if (this[i] instanceof object) {
        setObj[i] = this[i].convert(isObj && val[i])
      } else if (this[i] === void 0 || (util.lookup.call(this, i) && this[i] === false)) {
        setObj[i] = false
      } else {
        setObj[i] = this[i]
      }
    }
    return setObj
  })