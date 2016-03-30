/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */
var events = require('./')
  // , operators = require('../../value/operators')
  // , doc = events.document

module.exports = events

var app
  , cnt = 0
  , Value

events.visible =
{ create:function(){
    if(app && app._v) return
    
    app = require('../../ui/app')
    VObject = require('../../object')
    Value = require('../../value')
    APP = app
    // app._visible = true
    // exports._v = {}
    // cnt = 0
    // app._v = 
    // { visible:[]
    // , invisible:[]
    // }
    // window.addEventListener('resize', updateVisibility.bind(null,app))
  }
, add:function(){

    this.setSetting(
    { name:'visible'
    , render:function(){
        //if parent has no _v object create one and check up the parent tree 
        var visible
          , self = this
          , parent = this.parent
          , anchestors = parent.anchestorPath || (parent.anchestorPath = anchestorPath(this)) // create parent array
          , l = anchestors.length - 1 // skip toplevel === app === always visible
          , holder
          , _scrollLeft
          , _scrollTop

        while(l--){
          var anchestor = anchestors[l]
          if(anchestor.scrollbar){
            if(!anchestor._rect){

              var dir = anchestor.scrollbar.val

              anchestor.addEvent('scroll', 
                (dir === 'x' && function(){
                  console.log('x',this.node.scrollLeft)
                  this._scrollLeft.val = this.node.scrollLeft
                  // app.textholder.text = this._scrollLeft._val
                })
              ||(dir === 'y' && function(){
                  console.log('y',this.node.scrollTop)
                  this._scrollTop.val = this.node.scrollTop
                  // app.textholder.text = this._scrollTop._val
                })
              || function(){
                  this._scrollTop.val = this.node.scrollTop
                  this._scrollLeft.val = this.node.scrollLeft
                }
              )

              if(dir !== 'x'){
                anchestor._scrollTop = new Value(
                { val:0
                , add:holder && _scrollTop
                })
              }

              if(dir !== 'y'){
                anchestor._scrollLeft = new Value(
                { val:0
                , add:holder && _scrollLeft
                })
              }

              var rect = anchestor.node.getBoundingClientRect()

              anchestor._rect = new Value( // << not all elements need both horizontal and vertical values
              { left:
                { val:rect.left
                , sub:holder && _scrollLeft
                , min:holder && holder._rect.left
                }
              , top:
                { val:rect.top
                , sub:holder && _scrollTop
                , min:holder && holder._rect.top
                }
              , right:
                { val:rect.right
                , sub:holder && _scrollLeft
                , max:holder && holder._rect.right
                }
              , bottom:
                { val:rect.bottom
                , sub:holder && _scrollTop
                , max:holder && holder._rect.bottom
                }
              })
            }

            holder = anchestor
            if(holder._scrollLeft) _scrollLeft = holder._scrollLeft
            if(holder._scrollTop) _scrollTop = holder._scrollTop
          }
        }

        if(!holder._visible){

          holder._left = []
          holder._visible = []
          holder._right = []

          function updateVisible(val,notused,self){
            if(val >= (self._prev || 0)) {
              scrollRight(holder)
            }else {
              scrollLeft(holder)
            }
            self._prev = val
          }

          if(_scrollLeft){
            _scrollLeft.addListener(updateVisible)
          }
          
          if(_scrollTop){
            _scrollTop.addListener(updateVisible)
          }
        }

        window.requestAnimationFrame(function(){ // request animation frame because sometimes getBoundingRect doesnt return correct values

          var rect = self.node.getBoundingClientRect()
            , r = self._rect = new Value(
          { left:
            { val:rect.left
            , sub:holder && [ holder._rect.left, _scrollLeft ]
            }
          , top:
            { val:rect.bottom
            , sub:holder && [ holder._rect.top, _scrollTop ]
            }
          , right:holder && _scrollLeft
            ? { val:holder._rect.right
              , add:_scrollLeft
              , sub:rect.left
              }
            : rect.right
          , bottom:holder && _scrollTop
            ? { val:holder._rect.bottom
              , add:_scrollTop
              , sub:rect.top
              }
            : rect.bottom

          })

          // self._v = new Value(
          // { val:function(val){
          //     return (r.top.val < 0 || r.left.val < 0) ? -1 : ((r.bottom.val < 0 || r.right.val < 0) ? 1 : 0) // returns -1 for left, 1 for right and 0 for visible
          //   }
          // })

          var invisible
          if(holder._right.length){ // if there is already an invisible object on the right, this must also be invisible
            holder._right.push(self)
          }else{
            if(!(invisible = isInvisible(self))){
              holder._visible.push(self)
            }else{
              if(holder._visible.length) holder._right.push(self)
              else holder._left.unshift(self)
            }
          }

          self.events.visible._val.call(self,invisible === 0)
          self.parent.text = {val:'to ',add:[r.top,' bo ',r.bottom,' le ',r.left,' ri ',r.right]}

          self._INDEXFORTESTING = cnt++
        })
      }
    , remove:function(){
        //remove this from parent visibility object
            //or maybe dont and just do it when iterating the array
      }
    })
  }
}

function scrollRight(holder){
  var leftVisible = holder._visible[0]
    , rightInvisible = holder._right[0]
    , change
    , v

  console.log('watching the right invisible and left visible')

  if(rightInvisible){ // was 1
    v = isInvisible(rightInvisible)
    if(v === 0){ // its visible now!
      console.error('visible!')
      rightInvisible.events.visible._val.call(rightInvisible,true)
      holder._right.shift()
      holder._visible.push(rightInvisible)
      change = true
    }
  }else if(!leftVisible){
    scrollLeft(holder)
    return
  }

  if(v === -1){ // its on the left now! >> this means all prev visible items are also on the left now!!
    console.error('bigmove')
    holder._left = holder._visible.reverse().concat(holder._left)
    holder._visible = []

    holder._right.shift()
    holder._left.unshift(rightInvisible)
    change = true
  }else if(leftVisible){ // was 0
    v = isInvisible(leftVisible)
    if(v === -1){ // its on the left now
      console.error('!invisible!')
      leftVisible.events.visible._val.call(leftVisible,false)
      holder._visible.shift()
      holder._left.unshift(leftVisible)
      change = true
    }
  }

    var burp = ['_left','_visible','_right']
    , text = ''
  for (var i = 0; i < burp.length; i++) {
    var arr = holder[burp[i]]
    text += '\n'+burp[i]+': '
    for (var j = 0; j < arr.length; j++) {
      var index = arr[j]._INDEXFORTESTING
      text += index + ', '
    };
  };

  holder.parent.textholder.html = text
  console.log(text)

  if(change) scrollRight(holder)

  console.error('  change',change)
}

function scrollLeft(holder){
  var leftInvisible = holder._left[0]
    , rightVisible = holder._visible[holder._visible.length -1]
    , change
    , v

  console.log('checking the left invisible and right visible')

  if(leftInvisible){ // was -1
    v = isInvisible(leftInvisible)
    if(v === 0){ // its visible now
      leftInvisible.events.visible._val.call(leftInvisible,true)
      holder._left.shift()
      holder._visible.unshift(leftInvisible)
      change = true
    } 
  }else if(!rightVisible){
    scrollRight(holder)
    return 
  }


  if(v === 1){ // its on the right now >> this means all prev visible items are also on the right now!!

    holder._right = holder._visible.concat(holder._right)
    holder._visible = []

    holder._left.shift()
    holder._right.unshift(leftInvisible)
    change = true
  }else if(rightVisible){ //was 0
    v = isInvisible(rightVisible)
    if(v === 1){
      rightVisible.events.visible._val.call(rightVisible,false)
      holder._visible.pop()
      holder._right.unshift(rightVisible)
      change = true
    }
  }

    var burp = ['_left','_visible','_right']
      , text = ''
  for (var i = 0; i < burp.length; i++) {
    var arr = holder[burp[i]]
    text += '\n'+burp[i]+': '
    for (var j = 0; j < arr.length; j++) {
      var index = arr[j]._INDEXFORTESTING
      text += index + ', '
    };
  };

  holder.parent.textholder.html = text
  console.log(text)

  // console.log('--------------------')
  // console.log('left',holder._left)
  // console.log('visible',holder._visible)
  // console.log('right',holder._right)
  // console.log('. . . . . . . . . . ')

  if(change){ // if there is an update, check for more
    scrollLeft(holder)
  }
}

function anchestorPath(element){
  var arr = []
  while(element.parent){
    element = element.parent
    arr.push(element)
  }
  return arr
}

function isInvisible(element){
  var r = element._rect
  return (r.top.val < 0 || r.left.val < 0) ? -1 : ((r.bottom.val < 0 || r.right.val < 0) ? 1 : 0) // returns -1 for left, 1 for right and 0 for visible
}