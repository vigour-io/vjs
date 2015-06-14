//path moet instances meenemen is zn shit
var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

define( proto, '$createContextGetter', {
  value:function( key$ ) {
    this['_'+key$] = this[key$]

    for(var key$$ in this[key$]) {
      if(key$$[0]!=='_' && !this[key$]['_'+key$$]) {
        // console.log(key$)
        //dit is vrij heftig ofc
        this[key$].$createContextGetter( key$$ )
      }
    }

    define(this, key$, {
      get:function() {
        
        console.log(this._name, 'is getting: ', key$)

        if(!this.hasOwnProperty( '_'+key$ )) {

          console.log( 'hey what up?', key$ )

          this['_'+key$]._$context = this
        } else if( this._$context ) {

          console.log( 'this has some $context we have to resolve --', this._$context.path )

        }

        return this['_'+key$]
      },
      set:function(val) {
        this['_'+key$] = val
      }
    })
  }
})

define( proto, '$parent', {
  get:function() {
    return this._$parent 
  },
  set:function(val) {
    this._$parent = val
  }
})

define( proto, '$path', {
  get:function() {
    var path = []
    var parent = this
    while(parent && parent._name) {
      path.unshift(parent._name)
      parent = parent.$parent
    }
    return path
  }
})