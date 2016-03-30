/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */

var Base = require('../../base')
  , Element = require('../element')
  , Value = require('vigour-js/value')
  , switcher = new Element()

function extendFactory( field ){
  return { name:field
  , type:false
  , set:function( fn ){
      if(fn instanceof Function)
      {
        var set = {}
        set['_'+field] = fn
        this.define(set)
      }
      else
      {
        console.error('property ' + field + ' needs to be a function')
      }
    }
  }
}

Value.flags.$params = {
  set:function( val ) {
    this.params = val
  }
}

Value.flags.$options = {
  set:function( val ) {
    this.options = val
  }
}

switcher.extend
( extendFactory( 'onTransition' )
, extendFactory( 'backFallback' )
, { transition:function( val ){
      var element = val.element && val.element._val
        , params = val.params
        , children = this.children
        , last = this._swElem || children[0]
        , base = element && element.base
        , current
        , child
        , direction

      // if there are still old pages, remove these
      if(children.length > 1)
      {
        for (i = children.length - 1; i >= 0; i--) 
        {
          child = children[i]
          if(child !== last) child.remove()
        }
      }

      console.log('trans!'.green.inverse,params)
      //is it the same , is it not the same whatup!
      if(base && base instanceof Element || element === Element)
      {
        if(this._swElem && this._swElem instanceof element)
        {
          this._swElem.set(params)
        }
        else
        {
          current = this._swElem = new element(params)
          direction = this._direction = val.direction && val.direction._val
          this._onTransition.call( this, current, last , direction, val.options )
        }
      }
      else if(params)
      {
        console.error('only params defined!')
      }
      else if(params)
      {
        console.error('no params and no element defined!')
      }

      // if(val)

      //val.element
      //val.params
      

      /*
        
        child.set(val.params.convert())

        val.params.each(function(i) {
        
          make ---> 


        })

      */
    }
  }
)

switcher.define
(
	{ back:function(){
      var backStore = this._backStore
      //   , previous = backStore[1]

      // console.error('backstore',backStore)

      // if(previous)
      // {
      //   this._direction = -1
      //   var same = previous === backStore[0]
      //     , i = (previous._historyIndex | 0) + (same ? 1 : 0)
      //     , value = previous._history[i][0]

      //   console.error('previous',previous)
      //   console.error('same',same)
      //   console.error('value',value)

      //   previous.from.val = value
      //   previous._historyIndex = i
      // }
      // else
      // {
        this._backFallback.call(this,backStore)
      // }
		}
	}
)

switcher.extend
(
  { name:'on'
  , set:function( val ) {
      // set history variable for all
      // val.each(function(){
      //   var from = this.userFrom.val
      //   if(!from) return
      //   if(!from._history) from.set('history',true)
      //   if(!this.__checked)
      //   {
      //     this.on(function(){
      //       var caller = this._parent._caller
            
      //       if(!caller._backStore)
      //       { 
      //         caller._backStore = [ this ]
      //       }
      //       else if(caller._direction === -1)
      //       {
      //         if(caller._backStore[1] !== void 0) caller._backStore.shift()
      //         else caller._backStore = [ this ]
      //       }
      //       else if(caller._direction === 1)
      //       {
      //         caller._backStore.unshift( this )
      //       }
            
      //     })
      //     this.__checked = true
      //   }
      // })
    }
  , remove:function(){ // create refs to original
      if(this.on.$remove) {
        this.on.$remove.update()
      }
    }
  , new:function(){
      if(this.on.$new) {
         this.on.$new.update()
      }
    }
  }
)

module.exports = new switcher.Class().Class