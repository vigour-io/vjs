require('./style.less')

var Emitter = require('../../lib/emitter')

var Observable = require('../../lib/observable')

var On = require('../../lib/observable/onConstructor')

var DOMEVENTS = {}

var Event = require('../../lib/event')
Event.prototype.inject( require('../../lib/event/toString' ))

//--------events----------

//origin type!!!!super important

var DomEmitter = new Emitter({
  $define: {
    _$key: {
      set:function(val) {
        if( !DOMEVENTS[val ]) {
          document.body.addEventListener( val, function(e) {
            var event
            // var target = e.target.$base

            var path = []
            var child = e.target
            var origChild = child
            var context = child.$base

            while(!context) {
              path.push(child.className)
              child = child.parentNode
              context = child.$base
            }

            // console.error(context, child, path)

            var prop =  context

            // var 

            var firers = []

            for(var i = path.length-1 ; i>-1 ; i-- ) {
              //do i need to fire
              // firers.push()

              // path[i] = prop[path[i]]

              prop = prop[path[i]]
              // if()
            }

            // console.log(prop)

            var i = 0

            target = prop

            prop._$contextNode = origChild

            while( target ){
              if( target.$on[val] ){
                event = new Event( target )
                event.$domEvent = e
                target.$emit( val, event, e )
              }
              target = target._$parent
            }
          })
          DOMEVENTS[val] = true
        }
        this.__$key = val
      },
      get:function(val) {
        return this.__$key
      }
    }
  }
}).$Constructor

//------element---------

var Element

function getChildIndex(elem, key) {
  for(var i = 0 , l = elem.childNodes.length; i<l;i++) {
    if(elem.childNodes[i].className === key) {
      return elem.childNodes[i]
    }
  }
}

var element = new Observable({
  $define: {
    _$key: {
      set:function(val) {
        if(this._$node) {
          this._$node.className = val
        }
        this.__$key = val
      },
      get:function() {
        return this.__$key
      }
    },
    $node: {
      get:function() {

        if(this._$contextNode) {
          return this._$contextNode
        }

        if(!this._$node)  {
          this._$node = document.createElement( 'div' )
          this._$node.$base = this
          this._$node.className = this._$key

          //testing
          this._$node.innerHTML = this.$path
        }
        return this._$node
      }
    },
    $generateConstructor: function() {
      return (function DerivedElement( val, event, parent, key ) {
        if(this._$node ) {
          var node
          if(parent && parent._$node) {
            //dit is ook niet goed
            var orig = Object.getPrototypeOf(this)
            if( parent instanceof orig._$parent._$Constructor ) {
              node = getChildIndex( parent._$node, orig._$key)
              this._$node = node
            }
          } 
          if(!node) {
            this._$node = this._$node.cloneNode(true)
          }
          this._$node.$base = this
        }
        Observable.apply(this, arguments)
      })
    }
  },
  $flags: {
    $node:function( val ) {
      //check hier voor strings!!!
      // console.log('set node flag')
      this._$node = val
      this._$node.$base = this
    },
    $on: new On({
      $define: {
        $ChildConstructor: DomEmitter
      }
    })
  },
  $useVal:true,
  $on: {
    $addToParent: function( event, meta ) {
      // console.error('?xxxxx??', this.$path)

      if(this.$parent && this instanceof Element) {
        // console.log('hello')
        // console.log(this.$parent.$node)
        this.$parent.$node.appendChild( this.$node )
      }
    }
  }
})

Element = element.$Constructor

element.define({
  $ChildConstructor: Element
})

// Element = new Element().$Constructor

//--------properties----------
// var Border = new Observable({ 
//   $useVal:true,
//   $on: { 
//     $change: function( event ) {
//       console.error('\n\n\n\n\nblarf border', this.$val)
//       if(this._$parent && this.$parent) {
//         this.$parent.$node.style.border = this.$val
//         // this.$parent.x
//       } 
//     }
//   }
// }).$Constructor
// element.$flags = {
//   $border: function(val, event) {     
//     if(!this.$border) {
//       this.$setKeyInternal( '$border', new Border(), false)
//     }
//     //TODO: event moet hier
//     this.$border.$set(val)
//   } 
// }
//-------- example implementation----------

var app = new Element({
  $key:'app',
  $node: document.body
})

var YUZI = new Element({
  $key:'YUZI',
  a: {
    b: {
      c: {
        d: {
          $on: {
            click:function( event ) {
              // console.log(event.toString())
              this.$node.style.opacity = Math.random()
            }
          }
        }
      }
    }
  }
})

console.log('???', YUZI.$node)

app.$set({
  yus: new YUZI.$Constructor(),
  xyus: new YUZI.$Constructor(),
  xx:  new YUZI.$Constructor()
})

console.log( YUZI )

console.log( app.yus )

console.log( app.yus.a.$parent.$node )

console.log( app.yus.a === YUZI.a )

console.log( app.yus.a.b === YUZI.a.b )

/*
  check tot $base
  
  sla path op hoe je er bent gekomen ( in nodes )
  
  op $base kijk path naar benedend resolve instances
    zoek de fields bij het path

  a.b.c

  'a ( context )'
  'a.b.c
  
  zoeken tot base sla node path op

  dan enmaal bij base aangekomen
    loop path af door je props -- en resolve

  //x.x.x 

  //CONTEXT.path

*/


/*

  node resolven op maken nieuwe instance op een set van een ding wat al bestaat


  //new node moet zoeken of er al een parent node is en resolven
  a.b.c.d.$set({x:true})
  
  a is context (is real )
  //er word al van alles gedaan


*/

console.clear()

app.yus.a.b.c.$set({
  flups: {}
})

app.$node.style.border = '1px solid black'

var perf = require('../../dev/perf')
var holder 
perf({
  name:'50k divs',
  method:function() {
  holder = new Element({})
  for(var i = 0 ; i < 10000; i++) {
    var obj = {}
    obj[i] = new YUZI.$Constructor()
    holder.$set(obj)
  }
  app.$set({
    h: holder
  })
}})

// perf({
//   name:'50k divs',
//   method:function() {
//   holder = document.createElement('div')
//   for(var i = 0 ; i < 50000; i++) {
//     var top = document.createElement('div')
//     top.innerHTML = 'xxx'
//     holder.appendChild(top)
//   }
//   document.body.appendChild(holder)

// }})
