"use strict";
//-----------injectable part of the module----------

exports.$define = {
  subscribe: function(subsObj, handler, event) {
    console.error('public subscribe method called')

    // this.$set({
    //   $subscriptions:{
    //     $change: handler
    //   }
    // }, event)

  }
}
exports.$flags = {
  $subscriptions: require('./class')
}



// exports.$define = {
// 	$subscriptions: {
// 		get: function() {
// 			return this._$subscriptions
// 		},
// 		set: function( val ) {
			
// 			console.log('hey set subscriptions', val)

// 			this._$subscriptions = val



// 			// this._subscribe()

// 		}
// 	}
// }
