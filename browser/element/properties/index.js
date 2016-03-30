/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

  /*
    here some basic html properties are added to V.Element.Nessecary
    for values that you want to be able to bind to V.Objects
    Uses base.extend -- see core.base for more information
  */

var ua = require('../../ua')
  , css = require('../../css')
  , Value = require('../../../value')
  , util = require('../../../util')
  , hash = require('../../../util/hash')
  , raf = require('../../animation/raf')
  , _load = require('../').images = {}
  , _transform = ua.prefix + 'Transform'
  , _cssTransform = ua.prefix + '-transform'
  , body = document.body.style
    //think about doc ready event or fallback if no body
  , _translate = body.perspectiveProperty != void 0
                 || body.WebkitPerspective != void 0
                    ? ['translate3d(', ',0px)']
                    : ['translate(', ')']
  , _coordinate = function(style) {
      var margin = 'margin' + (style[0].toUpperCase() + style.slice(1));
      return function(val) {
        if(val.clean) {
          _cleanCoordinate.call(this,style,margin)
          val.clean = null
        }
        if (val.translate) {
          this.translate(val)
        } else {
          this.node.style[this.relative ? margin : style] = val.val + 'px'
        }
      }
    }
  , _clearTransform = new RegExp(_cssTransform+'(.*?);')
  , _clear =
    { x: /(margin-left(.*?);)|(left(.*?);)/g
    , y: /(margin-top(.*?);)|(top(.*?);)/g
    }
  , _cleanCoordinate = function( check ) {
      var t = this._t
      , keep = false
      , val = this[check]
      , cssText = this.node.style.cssText.replace( _clear[check], '' )

    if( val && val.translate && val.translate.val===false) val.translate = null

    if(this.node.style[_transform] && !val.translate) {
      if(t) {
        if(!this[check].translate) {
          for(var i = 2 ; i < 6 ; i++) {
            if(t[i])keep=true
          }
        } else {
          keep=true
        }
      }
      if(!keep) cssText = cssText.replace(_clearTransform,'')
    }
    this.node.style.cssText = cssText
  }

exports.extend = util.extend(function(base) {
  util.define(base.Class,
    'cleanCoordinates', function(coord) {
       if(this._node) {
        if(!coord) {
          _cleanCoordinate.call(this,'x')
          _cleanCoordinate.call(this,'y')
        } else {
          _cleanCoordinate.call(this,coord)
        }
      }
    },
    'translate', function(val) {
    var _x
      , _y
      , _val =  val.val
      , _scale
      , _rotate
      , _rotateY
      , _rotateX
      , _str = ''
      , _name = val && val._prop.name
      , _t = this._t = this._t || []
      , nope = false

    //cirtical performance point hence use of | 0
    if (_name === 'x') {
      _x = _val | 0
      if (_x === _t[0]) nope = true
    } else if (_name === 'y') {
      _y = _val | 0
      if (_y === _t[1]) nope = true
    } else if (_name === 'rotate') {
      _rotate = _val
      if (_rotate === _t[2]) nope = true
    } else if (_name === 'scale') {
      _scale = _val
      if (_scale === _t[3]) nope = true
    } else if (_name === 'rotateY') {
      _rotateY = _val
      if (_rotateY === _t[4]) nope = true
    } else if (_name === 'rotateX') {
      _rotateX = _val
      if (_rotateX === _t[4]) nope = true
    }

    if (!nope) {
      _t[0] =  _x || (this.x.translate && this.x.val | 0) || 0
      _t[1] =  _y || (this.y.translate && this.y.val | 0) || 0
      _t[2] = _rotate || this.rotate.val
      _t[3] = _scale || this.scale.val
      _t[4] = _rotateY || this.rotateY.val
      _t[5] = _rotateX || this.rotateX.val
      if (_t[0] || _t[1]) {
        _str = _str
          .concat(
            _translate[0]
          + _t[0] + 'px,'
          + _t[1] + 'px'
          + _translate[1]
          )
      }
      if (_t[2]) { _str = _str.concat(' rotate(' + _t[2] + 'deg)') }
      if (_t[3]) { _str = _str.concat(' scale(' + _t[3] + ')') }
      if (_t[4]) { _str = _str.concat(' rotateY(' + _t[4] + 'deg)') }
      if (_t[5]) { _str = _str.concat(' rotateX(' + _t[5] + 'deg)') }
      this.node.style[_transform] = _str
    }
    return this
  }, 'update', function() {
    for (var i = 0, _args = util.arg(arguments), l = _args.length, p; i < l; i++ ) {
      if (_args[i] instanceof Array) {
        this.update.apply(this, _args[i]);
      } else {
        p = util.get(this, _args[i]);
        if (p) {
          p.update(this);
        }
      }
    }
    return this;
  });

  function createScroll(dir){
    var s = 'scroll'
      , sdir = s + dir //scrollLeft or scrollTop

    return {
      name:sdir,
      set:function(val) {
        var v = val.val
          , self = this
        if(v !== void 0) self.node[sdir] = v
        if(!self.__sT){
          self.__sT = true
          self.addEvent(s,function(){
            if(val._listeners !== void 0) val.val = self.node[sdir]
            else self[sdir].__lval = void 0
          })
        }

      },
      get:function(val){
        if(val.__lval === void 0) val.val = this.node[sdir]
        return val
      },
      render:function() {
        var self = this
          , val = self[sdir].__lval
        if(val){
          raf(function(){
            self.node[sdir] = val
          })
        }
      }
    }

  }

  base.extend({
    name: 'relative',
    type: false,
    get: function() {
      var s = this.position !== false ? this.position.val : (this.position = {
        css: true,
        val: css(this.css.val, 'position')
      })
      return s !== 'absolute'
    }
  },
  {
    type: false,
    name: 'rendered',
    get: function() {
      var ret = this._rendered || (this.node === document.body),
        parent;
      if (!ret) {
        parent = this.node.parentNode;
        while (!ret && parent) {
          if (parent.base && parent._rendered) {
            ret = true;
          }
          if (parent == document.body) {
            ret = true;
          }
          parent = parent.parentNode;
        }
        if (ret) {
          this._rendered = true;
        }
      }
      return ret;
    }
  },
  createScroll('Left'),
  createScroll('Top'),
  {
    position: function(val) {
      // console.log('?????',val.css.val)
      // if (!val.css) { //check when ignoring this becomes a problem
        this.node.style.position = val.val;
      // }
    },
    // scrollTop:function(val) {
    //   console.error(val.val)
    //   this.node.scrollTop = val.val
    // },
    rotate: function(val) {
      this.translate(val);
    },
    rotateY: function(val) {
      this.translate(val);
    },
    rotateX: function(val) {
      this.translate(val);
    },
    scale: function(val) {
      this.translate(val);
    },
    src: function(val) {
      var v = val.val;
      if (v && v[v.length - 1] !== '/') {
        this.node.src = v;
      }
    },
    attr:function(val) {
      var t = this
      val.each(function(i) {
        t.node.setAttribute(i,this.val)
      })
    },
    backgroundPos: function(val) {
      this.node.style.backgroundPosition = val.val
    },
    backgroundBatch: function(val) {


    },
    background: function(val) { //optional maybe in a seperate module
      var v = val.val
        , t = this
        , style = this.node.style
        , url
        , hashed
        , parentBatch
        , batch

      if(val.gone && val.gone.val) {
        val._skip = true
        style.backgroundImage = ''
      } else if (v && v[v.length - 1] !== '/') {
        url = 'url(' + v + ')'
        if(style.backgroundImage===url) return

        //Value
        if (val.size) style.backgroundSize = val.size.val

        if (val.load) {

          hashed = hash(v)
          parentBatch = this.checkParent('backgroundBatch')
          if(parentBatch) batch = parentBatch.backgroundBatch

          if(!_load[hashed]) {
            this._loaded = null
            //also remove setting

            if(batch) {
              window.cancelAnimationFrame(batch._raf)
              if(!batch.batch) batch.batch = []
              batch.batch.push(hash)
            }

            _load[hashed]=new Value(false)
            var img = document.createElement('img')
            img.onload = function() {

             if(batch) {
               batch.batch.splice(util.checkArray(batch.batch,hashed),1)
               if(batch.batch.length===0) {
                batch.batch = null
                batch._raf = raf(function() {
                  if(parentBatch._node) batch._val.call(parentBatch)
                })
               }
             }

              _load[hashed].val = true
              img.onload = null
              img = null
              _load[hashed].remove(false,false,false,false,false,true)
              _load[hashed] = true
            }
            img.src = v
          }

          if(_load[hashed]!==true) {
             this._loaded = null

            _load[hashed].addListener([function() {
              if(val.load && val.load.val!==true) val.load._val.call(this, t);
            },val._base], true)
          } else {

            this._loaded = true

            if(batch) {
              if((!batch.batch) || batch.batch.length===0) {
                batch.batch = null
                window.cancelAnimationFrame(batch._raf)
                batch._raf = raf(function() {
                   if(parentBatch._node) batch._val.call(parentBatch)
                })
              }
            }

            if(val.load.val!==true) val.load._val.call(this, t);

          }
        }

        style.backgroundImage = url

      }
    },
    padding: function(val) {
      this.node.style.padding = val.val + 'px';
    },
    y: _coordinate('top'),
    x: _coordinate('left'),
    display: function(val) {
      this.node.style.display = val.val;
    },
    w: function(val) {
      // console.log('w');
      this.node.style.width = (val.val | 0) + 'px';
    },
    h: function(val) {
      this.node.style.height = (val.val | 0) + 'px';
    },
    opacity: function(val) {
      var v = val.val;
      this.node.style.opacity = v > -1 ? v : 1;
    },
    html: function(val) {
      var v = val.val || ''
      if( v.replace )
      {
        //add some injection prevention as option? (no script etc)
        v = v.replace(/\t/g, '    ')
             .replace(/\r\n|\n|\r/g, '<br/>')
             .replace(/  /g, '&nbsp; ')
             .replace(/  /g, ' &nbsp;') // second pass
                                        // handles odd number of spaces, where we
                                        // end up with "&nbsp;" + " " + " "
        this.node.innerHTML = v
      }

    },
    href: function(val) {
      this.node.href = val.val;
    },
    text: function(val) {

      // console.log('SETTING TEXT'.green.inverse. val.val, val)

      var node = this.node
        , nodes = node.childNodes
        , v = val.val || ''

      if(v instanceof Object) v = ''

      if (/text/.test(node.type)) {
        node.value = v;
        return;
      }

      if (nodes) {
        for (var i = 0, l = nodes.length; i < l; i++) {
          if (nodes[i].nodeType === 3) {
            // console.log('BLABLA'.inverse,v)
            nodes[i].nodeValue = v;
            return;
          }
        }
      }
      node.appendChild(document.createTextNode(v));
    }
  });
});