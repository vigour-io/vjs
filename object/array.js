/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = require('../util'),
  object = require('./');

util.define(object,
  /**
   * V.Object's equivalent to Array.push()
   * @method push
   * @param  {Arguments}  The item(s) to add to the array
   * @return {Number}     The new length of the array
   */
  'push', function() {
    if (this.__t === 1) {
      if (this.length === void 0) {
        this.length = 0;
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        this._push(arguments[i]);
      }
      return this.length;
    }
  },
  '_push', function(val, vobj, stamp, noupdate, from) {
    //ame, val, vobj, stamp, noupdate, from
    this.length++;
    this.set((this.length - 1), val, vobj, stamp, noupdate, from);
    return this[this.length - 1];
  },
  /**
   * V.Object's equivalent to Array.pop()
   * @method pop
   * @return {*}  The removed array item
   */
  'pop', function() {
    if (this.__t === 1) {
      var l = this.length
      if(l !== 0){
        t = this[l - 1];
        this.length--;
        t.remove();
      }
      // return t; //pretty weird since this object always has value null;
    }
  },
  /**
   * V.Object's equivalent to Array.splice()
   * @method splice
   * @param  {Number}    index   An integer that specifies at what position to add/remove items, Use negative values to specify the position from the end of the array
   * @param  {Number}    howmany The number of items to be removed. If set to 0, no items will be removed
   * @param  {Arguments}         The new item(s) to be added to the array
   * @return {Array}             A new array containing the removed items, if any
   */
  'splice', function(index, howmany) { //can become shorter;
    if (index > -1 && this.__t === 1) { //how many and -i are ignored
      for (var i = 0, l = this.length, shift; i < l; i++) {
        if (shift) {
          if (i === l - 1) {
            // this.length--;
            this[i] = null;
          } else {
            this[i] = this[i + 1];
            this[i]._name = i;
          }
        } else {
          if (i === index) {
            if (i === l - 1) {
              this.pop();
            } else {
              shift = true;
              this.length--;
              this[i].remove();
              this[i] = this[i + 1];
              this[i]._name = i;
            }
          }
        }
      }
    }
  },
  /**
   * Adds value to array if it is not contained in array, executes handler on encountering val in array
   * @method include
   * @param  {*}         val       Value to add
   * @param  {Function}  [handler] Function to execute on encountering val in array
   * @return {Boolean}             True/false
   */
  'include', function(val, handler, arr) {
    return util.include(this, val, handler, arr);
  },
  'concat', function(val) { 

    // if(!val) {
    //   return
    // }
    
    var arr = this
    var ll = arr.length;
    for (var i = 0, l = val.length; i < l; i++) {
      arr._push(val[i], false, false, true);
    }
    arr._update(val);
    return arr;
  },
  'moveItem', function(from, to) { var arr = this
    if(to === void 0) to = arr.length - 1
    if(from === to) return
    var mover = arr[from]
    if(!mover) return
    var step = from < to ? 1 : -1
    do {
      arr[from] = null
      arr.set(from, arr[from + step], true)
      from += step
    } while(from !== to)
    arr[to] = null
    arr.set(to, mover, true)
  }
)
