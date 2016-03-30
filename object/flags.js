/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = require('../util')

/**
 * Flags are special properties where a function is called
 * different from operators since flags may have nothing to do with value calculation
 * extends default set from V.Object
 * @property
 */
/**
 * Adds new flags to V.Object
 * @method extend
 * @param  {Object}   object V.Object to extend flags to
 * @param  {Function} [set]  [description]
 * @return {[type]}          [description]
 */
exports.extend = util.extend(function(object, set) {
  
  //multiple flags 
  
  // abstract flags array away!
  // 
  // flags object --> field
  // 
  // check /w cases
  // check /w parent
  // flag4 is dynamic has stack as option
  
  var _proto = object.prototype
    , _convert = _proto.convert
    , _set = _proto._set
    , _remove = _proto._remove
    , _check = function(name) {
      var f;
      for (var i in object.flags.dynamic) {
        f = object.flags.dynamic[i](name)
        if(f) break
      }
      return f
    }
    , checkIfFlagOverwrite = function(val) {
      for(var i in val) {
        if(object.flags[i] || _check(i)) return true
      }
    }

  if (!set) set = _proto.set

  _proto._blacklist.push('_flag');
  util.define(object,
    /**
     * [description]
     * @method convert
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    'convert', function(val) {

      //hier ook weer for
      var obj = _convert.call(this, val);

      // console.log('I SHOULD BE CONVERTING!', val, obj, this._flag)





      if (this._flag && (!val || !util.isObj(val) || val.val || checkIfFlagOverwrite(val) )) {

        // console.log('I SHOULD BE CONVERTING! step 2')

        //ff useVal gebruiken

        for(var i in this._flag) {
          var flag = this._flag[i]
          if (!flag[4] || !flag[4].stack) {

            // console.log('CONVERT NEEDS FIX'.red.bold.inverse)

            if (obj === flag[1]) {
              // console.log('2 CONVERT NEEDS FIX'.red.bold.inverse)
              obj = {};
            }
            if (obj.val === flag[1]) {
              // console.log('3 CONVERT NEEDS FIX'.red.bold.inverse)
              delete obj.val;
            }


            obj[flag[0]] = flag[2]
          }
          else {
            //still have to take care of this situation
            // console.error('trying convert a stack-dynamic flag', flag);
          }
        }

        // console.log('CONVERTED ---->',obj)

      }
      return obj;
    },
    /**
      @property __flags__
    */
    '__flags__', {},
    /**
     * [description]
     * @method remove
     * @param  {[type]} from   [description]
     * @param  {[type]} update [description]
     * @param  {[type]} stamp  [description]
     * @return {[type]}        [description]
     */
    '_remove', function(from, update, stamp) {

      if(this._flag) {
        for(var i in this._flag) {
          // console.log(i, this._flag)
          var flag = this._flag[i]
          //for 
          // console.log('_remove')
          if (flag) {
            //dit moet wel ff lukken
            if (object.flags[flag[0]]) {
              object.flags[flag[0]].remove && object.flags[flag[0]].remove.call(this, flag);
            } else {
              flag[4].remove.call(this, flag);
            }
          }
        }
        this._flag = null
      }

      _remove.call(this, from, update, stamp);
    },
    /**
     * [description]
     * @method _set
     * @param  {[type]} val      [description]
     * @param  {[type]} stamp    [description]
     * @param  {[type]} from     [description]
     * @param  {[type]} remove   [description]
     * @param  {[type]} noupdate [description]
     * @return {[type]}          [description]
     */
    '_set', function(val, stamp, from, remove, noupdate) {
      // console.log('make _set',this._name,val);
      _set.call(this, val, stamp, from, remove, noupdate)

      //flag moet dus ook meer een copied value worden

      // console.log('_set', this._flag, val)


      if(this._flag) {

        // console.log('overwrite>?----', this._flag, val)

        for(var i in this._flag) {
          var flag = this._flag[i]
          if (flag) {
            var setFl = object.flags[flag[0]] || flag[4]
            //what to do with reset?
            //change fixen bij cases?
            
            // console.log('2 overwrite>?----', flag, this._val, this._val !== flag[1])
            
            if (this._val !== flag[1] && setFl.useVal) {

              // nu ff hier ook nog!

              if (object.flags[flag[0]]) {

                // console.log('remove flag normal',flag, flag[4], i, this)

                object.flags[flag[0]].remove && object.flags[flag[0]].remove.call(this, flag)
                //if this empty
                // delete this._flag;
                delete this._flag[i]
                if(util.empty(this._flag)) {
                  delete this._flag
                }
                // this._update()
              } else if (!flag[5]) {
                // console.log('remove flag /w flag[4] and not flag[5]',flag, flag[4], i)
                flag[4].remove.call(this, flag);
                // if(this.)
                //delete this._flag;
                delete this._flag[i]
                if(util.empty(this._flag)) {
                  delete this._flag
                }
              }
            } else if (object.flags[flag[0]] && object.flags[flag[0]].reset && flag[3] !== this) {
              // console.error('RESETTING -- ingnore /w a clear!',flag[0]) 
              object.flags[flag[0]].set.call(this, flag[2], stamp, true, this._name)
            }
          }
        }
      }

    },
    /**
     * [description]
     * @method set
     * @param  {[type]} name     [description]
     * @param  {[type]} val      [description]
     * @param  {[type]} vobj     [description]
     * @param  {[type]} stamp    [description]
     * @param  {[type]} noupdate [description]
     * @return {[type]}          [description]
     */
    'set', function(name, val, vobj, stamp, noupdate) {
      var fl = object.flags[name] || _check(name)
        , r
        , same

        // console.log(name, val, vobj)

      if (fl) {

        // console.log('set>?----', name, val, this._flag)
       
      if(val===false) {
          //stack -- alle flags name providen!
          var i = fl.stack||name 
            , flag = this._flag && this._flag[i]
          if(flag && fl.remove) {
            var d = fl.remove.call(this, flag, name)
            // console.log('REMOVE FLAG FROM FALSE'.inverse, fl, name, val, stamp, this)
            if(!d) {
              delete this._flag[i]
              if(util.empty(this._flag)) {
                // console.log('flag is empty, delete')
                delete this._flag
              }
            }
          } 
          r = true
          // if(this._flag)
      } else {
       if(this._flag) {
          //check if need to remove! -- only in case
          for(var i in this._flag) {
            var flag = this._flag[i]
            if (flag && fl.remove) {

              if(!fl.stack && name === flag[0]) {
                // console.log('--->',flag[0])
                if(val!==flag[2]) {
                  // console.log('remove flag! ---> overwrite bymyself --->', flag[0],  setFl, 'by:' ,name, fl, val, flag[2])
                  fl.remove.call(this, flag);
                } else {
                  same = true
                }

              } else if (!fl.stack || fl.stack !== flag[0]) {

                //this._flag

                //if val:true 
                //go check if you need to remove mofos

                var setFl = object.flags[flag[0]] || flag[4]

                if(setFl.useVal && fl.useVal) {

                  // console.log('remove flag! -- clearly has some useVal', flag[0],  setFl, 'by:' ,name, fl)

                  setFl.remove.call(this, flag);
                  delete this._flag[i]
                  if(util.empty(this._flag)) {
                    // console.log('flag is empty, delete')
                    delete this._flag
                  }
                }


                // console.log('remove flag!', flag, flag[0], flag[4],  object.flags[flag[0]]  , fl, name) //check if it needs to be removed
                // var fl 
                
                //fl = object.flags[name] || _check(name)
                //
                //hier iets mee doen weer zoeken naar flag set


                //do the special check if value is tight to flag check (for both! fl.value)

                // fl.remove.call(this, flag);
              }
            }
          }
        }

      if(!same) {
          // console.log('SET FLAG'.inverse, name, val, stamp, this)
          fl.set.call(this, val, stamp, false, name);
          r = true //niet altijd waar ofcourse!
          // console.log('---------')
        } else {
          // console.log('FLAG IS SAME'.red.inverse, name, val, stamp, this)
        }
      }
        this[name] && this[name].remove(false, false, false, false, false, true);
      } else {
        r = set.call(this, name, val, vobj, stamp, noupdate);
      }
      return r;
    });
  object.flags = _proto.__flags__;
  util.define(object.flags, 'dynamic', {});
})