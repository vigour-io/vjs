/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var base = require('../../base')
  , valueBase = require('../../value/base')
  , vigour = require('../../')
  , util = require('../../util')
  , elementBase = new base()

elementBase.defaultType = valueBase.type

module.exports = exports = vigour.Element = elementBase.Class
exports.base = elementBase

var _doc = typeof document !== 'undefined' ? document : 'no document', //reference to document is faster than using window.document;
  /**
   * Removes children from parent node
   * @method _removeChildren
   */
  _removeChildren = function() {
    for (var c = this._node.childNodes, i = 0, l = c.length; i < l; i++) {
      if (c[i].base) {
        // console.log
        c[i].base.remove(false, false, true);
      }
    }
  };

/**
 * node
 * adds and clones html nodes;
 * @attribute
 */
exports.base.extend({
    name: 'node',
    type: false ,
    /**
     * Defines what happens when node is set
     * @method set
     * @param  {*} val Defines the value of this._node
     */
    set: function(val) {
      //changing node bugs /w conversions
      //iframe selectors dont evaluate to a string
      if (val instanceof Object || !val.length) {
        this._node = val;
      } else {
        this._node = _doc.createElement(val);
      }
      this._node.base = this;
    },
    /**
     * Defines what happens when you get node
     * @method get
     */
    get: function() {
      if (!this._node) {
        this.node = _doc.createElement('div');
      }
      return this._node;
    },
    /**
     * Defines what happens when you create a new node
     * @method new
     * @param  {Object} from    Target
     * @param  {[type]} newnode [description]
     */
    "new": function(from, newnode) {
      if (!newnode) {
        var node = from._node;
        if (node) {
          this._node = node.cloneNode(true); //especialy good to do for memory (also saves 20% on cpu)
          this._node.base = this;
        }
      } else {
        this._node = newnode;
      }
      if (from._node && from._node.hasChildNodes()) {
        var i, c = this._node.childNodes,
          cf = from._node.childNodes,
          l = c.length,
          ci, cfb;
        for (i = 0; i < l; i++) {
          cfb = cf[i].base;
          if (cfb) {
            c[i].base = new cfb.Class(false, false, c[i]);
            //maybe call children new stuff with a custom setting as well?
            if (cfb._name) {
              c[i].base._name = cfb._name;
              this[cfb._name] = c[i].base;
            }
            c[i].base.setting('parent', [this]);
          }
        }
      }
    },
    /**
     * Defines what happens when you remove a node
     * @method remove
     * @param  {*}  [param] If param doesn't remove node from parent
     */
    remove: function(param) {
      _removeChildren.call(this);
      if(this._node) this._node.base = null //little slow optimize later
      if (!param) {
        var _p = this._node.parentNode;
        if (_p) {
          _p.removeChild(this._node);
          if (this._name && _p.base) {
            _p.base[this._name] = null;
          }
        }
      }
    }
  },
  /**
   * Set css class of a div
   * Use addClass or removeClass to add/remove a class
   * @attribute css
   * @param  {Object} val [description]
   * warning: the add operator in css is currently used by .name,
   * and will be replaced when you try to build a string
   * using {val: .... add: ....}
   */
  {
    css: function(val) {
      var _val = val.val || '';
      val._skip = true; //_skip is an ugly name
      if (val.addClass && !~_val.indexOf(val.addClass.val)) {

        val._val = ((_val.length > 0 ? _val + ' ' : '') + val.addClass.val);

        if(val.add) val._val = val._val.replace(val.add.val,'')

        val._lval = false;
        val.__lval = false;
        val.addClass.remove();
        _val = val.val;
        // console.error('???? RESULT CLASS!', val._val )
      }
      if (_val && val.removeClass && val._val) {
        val._val = val._val.replace(new RegExp(' ?' + val.removeClass.val), '');
        val._lval = false;
        val.__lval = false;
        val.removeClass.remove();
        _val = val.val;
      }
      this.node.className = _val;
    }
  },
  /**
   * Makes it possible to reference a child by name
   * Setting on a class does not update names of instances
   * Element[NAME]
   * @attribute name
   */
  {
    name: 'name',
    type: false,
    set: function(val) {
      var _p = this.parent;
      if (this._name) {
        if (_p) {
          _p[this._name] = null;
        }
      }
      this._name = val;
      if (!this._node || val !== this.node.nodeName.toLowerCase()) {
        //name does not inherit, beware!
        // console.log('WHATS THIS?',val);
        // this.css = {addClass:val};
        // this.className = this._name;
        if(!this.css || this.css._val!==val)this.css = { add: ' ' + val }
        //special name field?
      }
      if (_p) {
        _p[val] = this;
      }
    },
    get: function() {
      return this._name;
    }
  },
  /**
   * Returns parent base element
   * @attribute parent
   */
  {
    name: 'parent',
    type: false,
    get: function() {
      if (this._node) {
        var _p = this._node.parentNode || this._p;
        return _p ? _p.base || _p._p : false;
      }
    }
  },
  /**
   * Returns childNodes /w base classes array slow, cache if possible
   * @attribute children
   */
  {
    name: 'children',
    type: false,
    get: function() {
      if(!this._node) return []
      var c = this._node.childNodes,
        l = c.length,
        _c = new Array(l),
        i;
      for (i = 0; i < l; i++) {
        _c[i] = c[i].base || c[i];
      }
      return _c;
    }
  });

var recurRender = function(parent) {

  if (!this.lastindex) this.setting('render', [parent]) //execute render settings

  if (this.renders) {

    // console.error('RENDER ---', this.name, this.renders)

    for (var p
      , c = this.node.childNodes
      , cl
      , arr = this.renders
      , obj
      , i = this.lastindex || 0, l = arr.length; i < l; i++) {
      obj = arr[i]

     if(obj) {
        p = util.checkArray(c, obj, 'base')
        if (p !== false) {
          recurRender.call(obj, this)
        } else if(obj._from) {

          // console.log('CLASS!',obj, obj.name && this[obj.name] && this[obj.name] === cl)

          cl = obj.Class

          if(obj.name && this[obj.name] && this[obj.name] === cl) {
            recurRender.call(this[obj.name], this)
          } else {
           for (var j in c) {
             if (c[j].base && c[j].base instanceof cl) {
               recurRender.call(c[j].base, this)
               break;
             }
            }
          }
        }
      }
      // arr.splice(i,1)
    }
  }

  this.lastindex = l
},

setRender = function() {
  var p, pp;
  if (this.parent) {
    p = this.parent;
    if (p.renders) {
      p.renders.push(this);
    } else {
      p.renders = [this];
      pp = p.parent;
      if (pp && !(pp._settings && pp._settings.render !== true)) {
        setRender.call(p);
      }
    }
  }
},

valRender = function(val) {
  var _settings = (val.__ && val.__._settings || val._._settings)
  if (val._.renders || val.__ && val.__.renders || _settings.render !== true) {
    if (!this.renders) this.renders = []
    if (!(this.__ && this.__.renders)) this.renders = util.clone(this.renders)
    // console.log(this.renders===this.__.renders, this.__.renders, this._.renders)

    // console.log(util.checkArray(this.renders,val._from))
    // console.log('XXXXXX',val)
    // if(util.checkArray(this.renders,val._from._from,'_from._from')===false&&util.checkArray(this.renders,val._from,'_from')===false) {
      this.renders.push(val)
    // }
    // console.log('renders push --- creates leaks!')
  }
}

//define vanuit base (korter!)
util.define(exports,
   'append', function(arr) {

    // alert('APPEND')
    // console.log('APPEND'.inverse,arr)

      var args = arguments

      if(arguments.length>1) {
        arr = util.arg(arguments)
      } //else if(arr )

      var insertbefore
      if(!arr.length && !(arr instanceof exports) && arr.val) {
        insertbefore = arr.before
        arr = arr.val
      }
      var Class = arr[0]
      , i = 0
      , l = arr.length
      if(!arr.length) {
        this.add(arr, insertbefore)
      } else if(typeof Class === 'function') {
        for(var i=1, l = arr.length;i<l;i++) {
          this.add(new Class(arr[i]), insertbefore)
        }
      } else {
        for(;i<l;i++) {
          this.add(arr[i], insertbefore)
        }
      }
  },


  'checkRender', function(val, notRendered) {
    if (val) valRender.call(this, val)
    if (!notRendered) {
      var _renders = (this.__ && this.__.renders || this._.renders)
      if ( ( (_renders  || ((this.__ && this.__._settings)  || this._._settings).render !== true)
          && (!this.lastindex || (_renders && this.lastindex < _renders.length))
        ) && this.rendered) {
        recurRender.call(this, this)
      } else {
        if(this.parent) valRender.call(this.parent, this)
      }
    }
  },
  'checkParent', util.checkParentFactory('parent'),
  'get',function(path, self) { //get does not need an array as path
    return util.get(this, path, self);
  },
  'find', function(get, match, level) {
    if(level === void 0) level = true
    var children = this.node.childNodes
      , i = 0
      , found
      , child
      , len = children.length
      , passOn = level===true ? true : level-1
    for(;i<len;i++) {
      child = children[i].base
      if(child) {
        if(child.get(get, true)===match) {
          return child
        } else if(level) {
          found = child.find(get, match, passOn)
          if(found) return found
        }
      }
    }
  },
  'setRender', function(name, val) {
    this.setSetting({
      name: name,
      render: val
    });
    setRender.call(this);
    this.eachInstance(function() { //look for current caller instance perhaps?
      setRender.call(this)
    }, name);
  },
  'renders', false,
  /**
   * Add element as child
   * @method
   * @param  {Object}  val  Object to be added
   * @return {Object}       Returns the V.element
   */
  'add', function(val, insertbefore) {
    
    if(insertbefore) {
      if(typeof insertbefore === 'string') insertbefore = this[insertbefore]
      if(insertbefore) {
        this.node.insertBefore(val.node, insertbefore.node || insertbefore)
      } else {
        console.error('cannot find insertbefore')
      }
    } else {
              // console.error(val)

      this.node.appendChild(val.node)
    }

    val.setting('parent', [this]) //execute parent settings
    if (val.name) this[val.name] = val
    //--------------------
    //needs cleaning costs 3% now...
    this.checkRender(val)
    //--------------------
    return this
  },
  /**
   * Removes all children
   * @method empty
   * @param  {Boolean} instances True will remove all instances of children removed
   */
  'empty',
  function(instances) {
    var c = this.node.childNodes
      , i
    this.node.innerHtml = ''
    for (i = c.length - 1; i >= 0; i--) {
      if (c[i].base) c[i].base.remove(instances)
    }
  });

exports.base.addSetting('parent')
exports.base.addSetting('render')
require('./set')