var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

define( proto, '$update', {
  value:function( type, event ) {
    //im going to execute an update

    // console.log(type, this._$on)

    //dispactchers handle if updates have ot be done again -- the dispacther checks if an update is allready executed

    //important --- updates have to be send at the end that is by far the best

    //also now stuff wil allways fire also on new not always nessecary


    // batch updates better

    // so first set all keys then handle the updates

    //e,g $update postponed
    //added to event
    //events gets executed when update in $set get executed

    //thi way you always know all values have been handeled


    //perhaps a good idea?

    //so it will get an array or something 

    //slow? -- o hell yeah

    //but very nice to work with

    //this way originators of change will be leading in handeling of the update

    //veyr good to know that eveything is done


    //e.g

    /*
      bla = {
        x:10,
        y:10
      }

      x = {
        val:x, add:y
      }

      get update on x y is not processed yet

      fucked!

      what we can do is just add an array of things that have to fire (allready corrected for stamps)

      dispacther has a stamp itself so handled centraly


      dispatcher sends update to event.$pendingDispatchers

      also check if dispatcher is there allready (reduc reduce reduce)
  

    */

    // this.$on
    // //context op on moet ff resolved worden..
    // console.error(this)
    // if(this._$on) { 
    //   //context getter is kapot hiervoor...
    //   this._$on._$context = this
    //   this._$on._$contextLevel = 0
    // }

    // console.warn(event.$val, this.$path, event.$origin.$path)

    // console.log('$update!', this.$path)

    if( this.$on && this.$on[ type ] ) {

      this.$on[type].$update( event )
      // console.log('hey update on eventtype', type)
    }

    return event

  },
  configurable:true
})