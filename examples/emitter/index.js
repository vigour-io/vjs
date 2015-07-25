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
            var target = e.target.$base
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

var element = new Observable({
  $define: {
    $node: {
      get:function() {
        if(!this._$node)  {
          this._$node = document.createElement( 'div' )
          this._$node.$base = this
        }
        return this._$node
      }
    },
    $generateConstructor: function() {
      return (function DerivedElement() {
        if(this._$node ) {
          this._$node = this._$node.cloneNode(true)
          this._$node.$base = this
        }
        Observable.apply(this, arguments)
      })
    }
  },
  $flags: {
    $node:function( val ) {
      console.log('set node flag')
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
      if(this.$parent && this instanceof Element) {
        console.log(this.$parent.$node)
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

var Border = new Observable({ 
  $useVal:true,
  $on: { 
    $change: function( event ) {
      console.error('\n\n\n\n\nblarf border', this.$val)
      if(this._$parent && this.$parent) {
        this.$parent.$node.style.border = this.$val
        // this.$parent.x
      } 
    }
  }
}).$Constructor

element.$flags = {
  $border: function(val, event) {     
    if(!this.$border) {
      this.$setKeyInternal( '$border', new Border(), false)
    }
    //TODO: event moet hier
    this.$border.$set(val)
  } 
}

//-------- example implementation----------

var app = new Element({
  $key:'app',
  $node: document.body
})

// var aa = new Element()

// aa.define({
//   $node: {
//     get:function() {
//      if(!this._$node)  {
//         this._$node = document.createElement( 'div' )
//         this._$node.$base = this
//         this._$node.style.border = '4px solid purple'
//         this._$node.style.background = 'pink'
//         this._$node.style.padding = '4px'
//         this._$node.style.borderRadius = '50%'
//       }
//       return this._$node
//     }
//   },
//   $ChildConstructor: aa.$Constructor
// })

// // aa.$node.style.borderRadius = '50%'
// // aa.$node.style.padding = '10px'

// var extraSpesh = new aa.$Constructor({
//   a: {
//     b: {
//       c: {
//         d:{}
//       }
//     }
//   }
// })


/*
var a = {
  b:{},
  c:{}
}

b.$val = {
  $val: a.b, $add:a.c
}

/ a.b <update en a.c niet

a.$set({
  b:{x:true},
  c:true
})
*/




app.$set({
  yuzi: {
    $on: {
      click:function( event ) {
        console.log(this.$path, this.$node)
        console.log( this._$node === Object.getPrototypeOf(this)._$node )

        console.log(this.$parent.$node)

        this.$parent.$set({
          c:{}
        }, event )
        console.log(event.toString())

        this.$node.style.opacity = Math.random()
      }
    },
    blurf:{
      // $border:'10px solid blue',
      blaps:{
        bloeps: {
          blurf:{
            // $border:'10px solid orange'
          },
          // smuts: new extraSpesh.$Constructor()
        }
      }
    }
  },
  james: true,
  // xx: new extraSpesh.$Constructor(),
  // yy: new extraSpesh.$Constructor()
})

// console.log(app.xx.a.b.c.d.$node)
// console.log(app.xx.a.$node.$base._$parent.$node === app.xx.$node)

app.$node.style.border = '1px solid black'

// var X = new Element({
//   $border:'20px solid blue',
//   $on: {
//     click:function() {
//       console.log(this.$path)
//       console.log(this._$parent)
//     }
//   }
// }).$Constructor

// app.$set({
//   y: {
//     // $border:'10px solid blue',
//     $on: {
//       mousemove:function() {
//         this.$node.style.opacity = Math.random()
//       }
//     }
//   },
//   xxxxxx:new X(),
//   yyy:new X(),
//   zzz:new X(),
//   xy:{
//     // $border:'10px solid red',
//     $on: {
//       click: function() {
//         this.$node.style.opacity = Math.random()
//       }
//     },
//     blurf: {
//       // $border:'200px solid red',
//       $on: {
//         click: function() {
//           this.$node.style.marginTop = Math.random()*99+'px'
//         }
//       }
//     }
//   }
// })

// app.$set({
//   x:{
//     // $border:'100px solid pruple',
//     $on: {
//       click: function() {
//         this.$node.style.opacity = Math.random()
//       }
//     }
//   }
// })

// console.log( '?', app.xxxxxx._$parent )

// console.log( app.xxx)

// app.hhh.$border.$val = '10px solid blue'

/*
this._node = node.cloneNode(true); //especialy good to do for memory (also saves 20% on cpu)
*/