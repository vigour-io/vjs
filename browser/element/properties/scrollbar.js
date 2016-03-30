/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var events = require('../../events')
  , cases = require('../../cases')
  , ua = require('../../ua')
  , global = false
  , NONE = 'none'
  , _ios = ua.platform==='ios'
  , _android = ua.platform==='android'
  , VISIBLE = 'visible'
  , extend = require('../../../util').extend
  , doc = events.document
  , timer
  , fn

// events.scroll = 
// { val: 
//   { down:function(e,method,val) {

//       var scrollStr
//         , dir

//       if(val.x){
//         dir = 'x'
//         scrollStr = 'scrollLeft'
//       }else{
//         dir = 'y'
//         scrollStr = 'scrollTop'
//       }

//       var t = this
//         , prev = e[dir]
//         , delta
//         , prevDelta
//         , scrollTop = t.node[scrollStr]
//         , scrolling
//         , prevScrollTop

//       doc.addEvent('move',function(e) {
//         var y = e[dir]
//         delta = prev - y
//         prevDelta = delta
//         prev = y
//         prevScrollTop = scrollTop

//         if(!scrolling && t.node[scrollStr] !== scrollTop){
//           scrolling = true
//           scrollTop = t.node[scrollStr]
//           if(val.start) val.start._val.call(t,e,method,val)
//         }

//         if(scrolling){
//           method.call(t,e,scrollTop)
//           scrollTop += delta
//         }
//       },'scroll')

//       doc.addEvent('up',function(e) {
//         if(cases.touch && scrolling){
          
//           if(scrollTop !== t.node[scrollStr]) scrollTop = t.node[scrollStr]

//           var check = scrollTop
//             , c = 0.55
//             , d
//             , h
//             , cnt = 120
//             , done

//           if(val.x){
//             d = t.node.scrollWidth - t.node.offsetWidth
//             h = t.node.offsetWidth
//           }else{
//             d = t.node.scrollHeight - t.node.offsetHeight
//             h = t.node.offsetHeight
//           }

//           delta = (prevDelta + delta)/2

//           if(Math.abs(delta) > 3 || scrollTop <= -1 || scrollTop > d){
//             var a = function () {
//               var nodeScrollTop = t.node[scrollStr]
//                 , x

//               if (check === nodeScrollTop || !(cnt--)){
//                 prevScrollTop = scrollTop
//                 if(scrollTop < 0){
//                   if(scrollTop <= -1) scrollTop = (1 - (1 / ((scrollTop * c / d) + 1))) * d
//                 }else if(scrollTop > d){
//                   x = scrollTop-d
//                   if(x >= 1) scrollTop = d + (1 - (1 / ((x * c / d) + 1))) * d
//                 }else{
//                   delta = delta * 0.965
//                   if(Math.abs(delta)>0.5) scrollTop += delta
//                 }
//                 window.requestAnimationFrame(a)
//               }else{
//                 scrollTop = nodeScrollTop
//                 done = true
//               }
//               scrollTop = Math.round(scrollTop)
//               if(Math.floor(Math.abs(scrollTop - prevScrollTop))) method.call(t,e,scrollTop,done)
//             } 
//             a()
//           }
//         }

//         doc.removeEvent(false,'scroll')

//       },'scroll')
//     }
//   }
// }

if(cases.touch){

  function blur (e){
    if(!document.activeElement){
      doc.removeEvent(false,'blur')
    }else if(e.target.tagName!=='INPUT' && e.target.tagName!=='FORM'){
      document.activeElement.blur()
      doc.removeEvent(false,'blur')
    }
  }

  events.preventDown = 
  { val:
    { down:function(e,method) {
        if(document.activeElement) doc.addEvent('up',blur,'blur')
        else if(e.target.tagName!=='INPUT' && e.target.tagName!=='FORM' && !events._maybescroll) e.preventDefault()
      }
    }
  }

  events.scrollbar = 
  { val: 
    { down:function(e,method,val) {

        var scrollStart
          , t = this
          , scrollStr
          , xAxis = (val._val === 'x')
          , axis
          , otheraxis
          , move
          , d
          , bottomPrevent
          
        if(xAxis) {
          axis = 'x'
          otheraxis = 'y'
          scrollStr = 'scrollLeft'
          d = t.node.scrollWidth - t.node.offsetWidth
        }else{
          axis = 'y'
          otheraxis = 'x'
          scrollStr = 'scrollTop'
          d = t.node.scrollHeight - t.node.offsetHeight
        }

        scrollStart = t.node[scrollStr] //<======== less efficient but more predictable for compensation

        if(d > 0){
          events[axis] = true
          events._maybescroll = true

          if(!xAxis){
            if (!scrollStart){
              scrollStart = t.node[scrollStr] =  1
            }else if(scrollStart===d) {
              scrollStart = t.node[scrollStr] = d - 1
            }else if(scrollStart > d){
              bottomPrevent = true
            }
          }

          var y = e.y
            , x = e.x
            , moveid = scrollStr + axis
          
          doc.addEvent('move',function(e){
            var dx = Math.abs(x-e.x)
              , dY = y-e.y
              , dy = Math.abs(dY)

            if(xAxis){
              if(dy > dx){
                events[axis] = false
                if(!events[otheraxis]) e.preventDefault()
              }
            }else{
              if(dx > dy){
                events[axis] = false
                if(!events[otheraxis]) e.preventDefault()
              }
              if(bottomPrevent && dY > 0){
                e.preventDefault()
              }
            }

            move = true
            blur(e)
            doc.removeEvent(false,moveid)
          },moveid)

          doc.addEvent('up',function(e) {
            var ms = events._maybescroll, msl, arr

            if(!move){
              var scrll = t.node[scrollStr]
              move = !(scrll === scrollStart) || scrll < 0 || scrll > d
            }
            if(!move && !events[otheraxis] && !events.click.block && ms && ms.length){
              msl = ms.length
              while(msl--) if(!e.prevent){
                arr = ms[msl]
                arr[0].call(arr[1],e)
              }
            }

            if(!events[otheraxis] || move) events._maybescroll = false

            events[axis] = false
            doc.removeEvent(false,scrollStr)

            window.requestAnimationFrame(function(){
              document.body.scrollTop = 0
            })
          },scrollStr)
        }
      }
    }
  }

  fn = function (val) {
      
    var style = this.node.style

    if (val.val === 'x') {
      style.msTouchAction = 'pan-x'
      style.overflowY = 'hidden'
      // style.overflowX = 'scroll'
    }else if (val.val === 'y') {
      style.msTouchAction = 'pan-y'
      style.overflowX = 'hidden'
      // style.overflowY = 'scroll'
    }

    style.overflow = 'scroll'

    style.webkitOverflowScrolling = 'touch'
    style.msTouchAction = 'auto'

    if(!cases.windows){
      this.events = { scrollbar:val.val }
      if(!global) {
        global = true
        doc.events = { preventDown:true }
      }
    }
  }

}else{
  fn = function (val) {
    var style = this.node.style;
    style.overflow = 'auto';
    style.overflowY = val.val !== 'x' ? 'scroll' : 'hidden';
    style.overflowX = val.val !== 'y' ? 'scroll' : 'hidden';
  }
}

exports.extend = extend(function(base) {
  base.extend({ scrollbar:fn })
})  