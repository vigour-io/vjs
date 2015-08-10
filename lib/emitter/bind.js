"use strict";
exports.$define = {
  $pushBind: function( bind, event ) {
    var stamp = event.$stamp
    var uid = this.$uid
    var binds

    if(
      !bind.hasOwnProperty( '$emitterStamps' ) ||
      !bind.$emitterStamps ||
      !bind.$emitterStamps[uid] ||
      !bind.$emitterStamps[uid][stamp]
    ) {

      binds = this.__$bind__

      if( !this.hasOwnProperty( '__$bind__') ) {
        this.__$bind__ = binds = {}
      }

      if( !binds[stamp] ) {
        binds[stamp] = []
      }

      binds[stamp].push( bind )

      if(
        !bind.hasOwnProperty( '$emitterStamps' ) ||
        !bind.$emitterStamps
      ) {
        bind.$emitterStamps = {}
        bind.$emitterStamps[uid] = {}
      } else if(!bind.$emitterStamps[uid]) {
        bind.$emitterStamps[uid] = {}
      }

      //this rly has te be cleaned now!
      bind.$emitterStamps[uid][stamp] = true

      return true
    }
    return
  },
  $postpone: function( bind, event ) {
    if( !event ) {
      throw new Error( '$postpone does not have event! (emitter)' )
      return
    }
    if(
      this.$pushBind( bind, event )
    ) {
      if(
        //instances zijn special ofcourse
        !this.hasOwnProperty( '$isPostponed' ) ||
        !this.$isPostponed
      ) {
        event.$postpone( this )
        this.$isPostponed = true
      }
    }
  }
}
