/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var object = require('../object')
  , util = require('../util')
  , vigour = require('../')

/**
 * vigour.Value
 * v values are optimized for use in combination /w instances of vigourBase, have operators and support method values
 * @Class
 */
module.exports = exports = vigour.Value = object.new({
  mixed: true,
  merge: true
});

//parent problems

var _getOperator = function(val, force, i, t, bind, operators) {
  var f = t[i]._get(bind, force, val);
  if (f !== void 0 && f !== null) {
    val = operators[i](val || ((typeof f === 'string') ? '' : 0), f);
  }
  return val;
};

exports.prototype._blacklist.push('_lstamp', '_lval', '__lval','___lval', '_base', '_caller', '_bind', '_prop', '_instances', '_skip', '_overwrite');
//_caller stamp for get for lvals (last values)
util.define(exports,
  'clearCache', function() {
    this.___lval = null
    this.__lval = null
  },
  /**
   * Used to get .val which calculates a constructed value
   * _bind is very important binds listeners to specific instances
   * @method _get
   * @param  {[type]} bind  [description]
   * @param  {[type]} force [description]
   * @return {[type]}       [description]
   */
  '_get', function(bind, force, currentVal) {
    // console.log('_get',this._name, this._val,this);
    if (this._overwrite) {
      return this._overwrite;
    }
    if (!this._lval && this._lval !== 0 || force) {
      var val = this._val,
        nolval,
        operators = this.operators;

      if (val instanceof object) {
        val = val._get(this._bind || bind, force, currentVal);
      } else if (typeof val === 'function') {

        // console.log('RIGHT HERE', currentVal)
        var a = this;
        if (!bind) {
          while (a._parent && !a._caller) {
            a = a._parent;
          }
        }
        val = val.call(bind || a._caller || a._base || this, this, currentVal); //if currentval else something else;
        nolval = true;
        //for functions you need to clear _lval since you never know if there is something in the function updated
      }
      if (operators) {
        if (this.__t === 1 && operators[this._name]) { 
          //operator is an array
          val = 0; //string
          for (var j = 0, l = this.length; j < l; j++) {
            if (this[j]) {
              vj = this[j]._get(bind, false, (currentVal || 0) + val);
              if (!vj) {
                vj = 0; //string
              }
              if (typeof vj === 'string' && val === 0) {
                val = '';
              }
              val += vj; //only add no operator stuff
              if (!this[j]._lval) {
                nolval = true;
              }
            }
          }
        } else {
          //also add before
          var ordered;
          for (var i in this) {
            if (operators[i]) {
              if (!operators[i].order) {
                if (!force && this[i]._lstamp !== this._lstamp && this[i].__t === 1) {
                  force = true;
                }
                val = _getOperator(val, force, i, this, bind, operators);
                if (!nolval && !this[i]._lval) {
                  nolval = true;
                }
              } else {
                if (ordered) {
                  if (!ordered.pop) {
                    ordered = [ordered];
                  }
                  var o = operators[i].order,
                    ol = ordered.length - 1;
                  for (var h = 0; h !== true && h <= ol; h++) {
                    if (h === ol) {
                      if (o < operators[ordered[h]].order) {
                        var a = ordered[h];
                        ordered[ol] = i;
                        ordered.push(a);
                      } else {
                        ordered.push(i);
                      }
                      h = true;
                    } else if (h === ol && o > operators[ordered[h]].order) {
                      ordered.push(i);
                      h = true;
                    }
                  }
                } else {
                  ordered = i;
                }
              }
            }
          }
          //shorter
          if (ordered) {
            // console.log(ordered);
            var x;
            i = ordered.pop ? (x = 1) && ordered[0] : ordered;
            while (i && this[i]) {
              if (!force && this[i]._lstamp !== this._lstamp && this[i].__t === 1) force = true
              val = _getOperator(val, force, i, this, bind, operators);
              if (!nolval && !this[i]._lval) nolval = true
              i = ordered[x++];
            }
          }
        }
      }
      if (!nolval && !force) {
        this._lval = val;
        this.__lval = val;
      } else if (!(this._base && this._base.instances)) {
        this.__lval = val;
      }
      return val;
    } else {
      return this.__lval;
    }
  },
  /**
   * Fires all listeners
   * @method update
   * @param  {[type]} instance    [description]
   * @param  {[type]} noinstances [description]
   * @param  {[type]} stamp       [description]
   * @param  {[type]} from        [description]
   * @param  {[type]} remove      [description]
   * @param  {[type]} added       [description]
   * @return {[type]}             [description]
   */
  'update',
  function(instance, noinstances, instancesUpdates, stamp, from, remove, added) {
    //is this really nessecary?
    this._update.call( this, void 0, stamp || this.stamp(), from, remove, false, false, noinstances, instance, instancesUpdates  ); //this.val
    return this;
  },
  /**
   * Extends vigourObject._update
   * Adds loads of stuff to optimize updates for calculations
   * @method _update
   * @param  {[type]} val         [description]
   * @param  {[type]} stamp       [description]
   * @param  {[type]} from        [description]
   * @param  {[type]} remove      [description]
   * @param  {[type]} added       [description]
   * @param  {[type]} noinstances [description]
   * @param  {[type]} instance    [description]
   * @return {[type]}             [description]
   */
  '_update',
  function( val, stamp, from, remove, added, oldval, noinstances, instance, instancesUpdates ) {

    var t = this,
      base = t._base;

    if (val instanceof exports && !t._bind) {
      // console.log('lets bind'.bold.inverse, val._name)
      if (val._caller) {
        t._bind = val._caller;
      }
    }

    if ( (!t._lstamp) || t._lstamp !== stamp) {
      t._lval = false;

      //_skip property makes sure that the .val is never cached in lval
      if (base && base.instances || t._skip || t.__lval === void 0 || t.___lval !== t.val) { //pass this calculation to vset else its too heavy;

        var operators = t.operators,
          prop = t._prop,
          parent = t._parent,
          vset = prop && prop._vset;

        if (!(from && remove) && operators && (operators[t._name] || (parent && parent.__t === 1 && operators[parent._name] && (!from || t._name == parent.length - 1)))) {
          //works for arrays since arrays are always replaced on update , updating an individual item using .set will not result in an update at this pont which has to be resolved
          _op = this._parent;
          while (operators[_op._name]) {
            _op._lval = false; //if no change to lval can go wrong...
            _op = _op._parent;
          }
          if (_op) {
            _op._update(val, stamp, this, remove, added, oldval, noinstances, instance, instancesUpdates);
          }
        }

        if (instancesUpdates) {
          instancesUpdates.call(t, val, stamp, from, remove, added, oldval, noinstances, instance, instancesUpdates);
        } else {
          if (instance) {
            base = instance;
          }

          if (vset) {
            t._caller = base;
            vset.call(t, stamp, from, remove, val);
          }
          if (base && vset && base.instances && !noinstances && prop.updateinstances !== false) {
            base.eachInstance(function() { //look for current caller instance perhaps?
              t._caller = this;
              vset.call(t, stamp, from, remove, val);
            }, prop.name, t);
            t._caller = base;
          }

          //form gone lets see!
          //from self doorgeven in chain ==-- if ! not from from ---> , extra arg

          object.prototype._update.call(t, val, stamp, from || t, remove, added, oldval)

        }

        //pas op met deze!
        t.___lval = t.__lval
        t._lstamp = stamp;

      }

    }
  });

//requiring operators does not automaticly require vigourValue, may be handy?
util.define(exports, 'operators', {
  value: exports.operators = require('./operators')
})




