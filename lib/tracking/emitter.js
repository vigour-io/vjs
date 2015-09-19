"use strict";

var Emitter = require('../emitter')
var Datalayer = require('./datalayer')

module.exports = new Emitter({
  $flags: {
    $services:function( val ) {
      for(var i in val) {
        this.$services[i] = val[i]
      }
    }
  },
  $define: {
    $services: { value: {} },
    $emitterKeys: {
      value: {
        $error: function( data, event, bind, force, key, observable, meta, id ) {
          data.eventobject.metaMessage = meta.message
        }
      }
    },
    $parseInput: function( event, bind, force, key, observable, meta, id) {

      console.error(event)

      var data = new Datalayer({
        id: id,
        eventobject: {
          stamp: event.$stamp,
          eventType: event.$type,
          eventOriginator: event.$origin.$path
        }
      })

      if(this.$emitterKeys[key]) {
        this.$emitterKeys[key].call(this, data, event, bind, force, key, observable, meta, id )
      }

      console.log('here you do parsing of stuff that you want to send to your service')
      return data
    },
    emit: function() {
      console.log('--->', arguments)
      var parsed = this.$parseInput.apply( this, arguments )
      for( var service in this.$services )
      {
        this.$services[service]( parsed )
      }
    }
  }
})
