var util = require('../util')
  , vObject = require('./')

/*
  _update calls listeners on a given Object (listeners include linking fields in other V.Objects)
  V.Object._update can be modified to change update behavior:
    - standard: update Object and it's parents / ancestors recursively.
    - parentOnly: update Object and only its direct parent.
    - just _update: update only the Object.
*/
var _update = exports._update = function(val, stamp, from, remove, added, oldval, test) {

  // if(window.here) console.log('UPDATE!',this._path)

  var _l = this._listeners
    , i
    , listener

  if (_l) {
    for (i = _l.length; listener = _l[--i];) { //order is irrelevant
      if (listener instanceof vObject) {
        if (from) listener._lfrom = from
        listener._update(val, stamp, false, remove, added, oldval)
        if (listener) listener._lfrom = null
      } else if (listener[0]) {
        if(!test || !test(listener)) {
          if (listener.length > 2) {
            for (var l = listener.length - 2
              , l2 = arguments.length
              , a = [], j = -1
              , la = l + l2
              ; j < la
              ; a[++j] = j < l
                ? listener[j + 2]
                : j === l ? this : arguments[j - l - 1]
              );

            listener[0].apply(listener[1], a)
          } else {
            listener[0].call(listener[1], this, val, stamp, from, remove, added, oldval)
          }
        }
      } else {
        listener.call(this, val, stamp, from, remove, added, oldval)
      }
    }
  }
}

vObject.prototype._blacklist.push('_listeners', '_listens', '_lfrom');

util.define(vObject,
  /**
   * _set
   * is called when a value is set
   * @method
   */
  '_set', function(val, stamp, from, remove, noupdate, added, oldval) {
    if (!noupdate) {
      this._update(val, stamp, from, remove, added, oldval);
    }
  },
  /**
   * __update
   * calls listeners attached to the Object
   * types -- function or V.Object
   * @method
   */
  '__update', _update,
  /**
   * _update
   * escalates an update up it's structure and calls __update to call listeners
   * types -- function or V.Object
   * @method
   */
  '_update', function(val, stamp, from, remove, added, oldval, test) { //here you can see if its an update from another object (from)
    // console.log('V.Object OG _update', val, stamp, from, remove, added, oldval)
    var curr = this,
      s = true
    while (curr) {
      var p = curr._path
      curr.__update(val, stamp, from || ((!s && this) ? this : void 0), remove, added, oldval, test)
      curr = from ? false : curr._parent
      s = false
      if (remove) remove = 1
    }
  },
  /**
   * _remove
   * called on remove
   * @method
   */
  '_remove', function(from, update, stamp, oldval) {
    if (update !== false) {
      this._update(null, stamp, from, true, false, oldval);
    }
    this.removeListener();
    var _l = this._listens,
      i, listener;
    if (_l) {
      //optimize later
      //this,this is weird to always use this...
      for (i = _l.length - 1; i >= 0; _l[i--].removeListener(this, void 0, false, true));
    }
  },
  /**
   * _setvobj
   * if a value is set to a V.Object
   * @method
   */
  '_setvobj', function(val) {
    val.addListener(this);
  },
  /**
   * _changevobj
   * if a value is changed from a V.Object
   * @method
   */
  '_changevobj', function(val) {
    if (this.__t === 4) {
      var _l = this._listens,
        _val = this._val,
        i;
      if (_l) {
        for (i = _l.length; i >= 0; _l[--i] && _l[i].removeListener(this, this));
      }
      if (_val instanceof vObject && _val._contained) {
        _val.remove();
      }
    }
  },
  /**
   * addListener
   * adds a listener to an object can be a function or V.Object
   * @method
   */
  'addListener', function(val, mark, skipcheck, ignoreval) {
    var _l = this._listeners || (this._listeners = []),
      target, g;

    //more speed voor checkarray
    if (mark) {
      g = util.checkArray(_l, val[1], 1);
      if (g === false
        || !ignoreval && util.checkArray(_l, val[0], 0) === false
        || (mark !== true && mark.call(this, _l[g], _l, g, val) === true)) {
        _l.push(val);
      } else  {
         return _l[g];
      }
    } else if (!val.__t || !util.checkArray(_l, val)) {
      _l.push(val);
    }
    if (mark || val instanceof vObject) {
      target = mark ? val[1] : val;
      if (target instanceof vObject) {
        _li = target._listens || (target._listens = []);
        if (skipcheck || !util.checkArray(_li, this)) {
          _li.push(this);
        }
      }
    }
  },
   'once', function(val, mark, skipcheck, ignoreval) {
    this.addListener(function listener() {
      val.apply(this, arguments)
      this.removeListener(listener, mark)
    }, mark, skipcheck, ignoreval)
  },
  /**
   * removeListener
   * if no val removes all listeners
   * mark checks in array on position 1 for uniqueness
   * remove is used in combination with mark
   * @method
   */
  'removeListener', function(val, mark, remove, nobreak) {
    // console.log('removeListener!', this._path, this._listeners && this._listeners.length
    //   , '\nmark:\n', mark && mark.raw
    //   , '\nval:\n', val && val.name
    // )
    var _l = this._listeners,
      i;
    if (_l) {
      for (i = _l.length - 1; i >= 0; i--) {
        //maybe checking mark all the time is too slow?
        var listener = _l[i]
        if (
          (!mark && !val)
          || (val && listener === val) //false voor mark
          || (mark!==false && ((listener instanceof Array) && ((mark && listener[1] === mark && (!val||listener[0]===val)) || val && listener[1] === val))
            && (!remove
              || (remove === true  //dit moet later weg is dan alleen een functie is nu overbodig (check boven)
                ? listener[0] === val
                : remove.call(this, listener, mark))))
        ) {
          // console.log('mark._listens?', !!(mark && mark._listens)
          //     , '\nis vObject?', listener instanceof vObject
          //     , '\nis marked?', listener instanceof Array
          //   )
          var focus = mark
            ? mark
            : listener instanceof vObject
              ? listener
              : listener instanceof Array
                ? listener[1]
                : false
          var listens = focus && focus._listens
          if(listens){
            for(var j = listens.length-1 ; j >= 0 ; j--){
              if(listens[j] === this){
                listens.splice(j, 1)
                if(listens.length === 0)
                  focus._listens = null
                if(focus.__t === 4 && listener._val === this)
                  listener._val = void 0
                break
              }
            }
          }
          _l.splice(i, 1)
          if (_l.length === 0) this._listeners = null;
          if (val && !nobreak) break
        }
      }
    }
  });