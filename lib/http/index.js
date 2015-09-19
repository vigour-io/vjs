"use strict"

var http = require('http')
var Observable = require('../observable')
var Operator = require('../operator')
// function byteCount(s) {
//   return encodeURI(s).split(/%..|./).length - 1;
// }

var HttpProperty = new Observable({   
  $inject:require('../methods/raw'),
  $on: {
    $change:{
      http:function( event, meta ) {
        this._$parent.emit('$change', event)
      }
    }
  },
  $ChildConstructor:'$Constructor'
}).$Constructor

module.exports = new Observable({
  $inject:require('../operator/shared'),
  $on:{
    $change:{
      http:function(){
        console.log('we good!')
      },
      $defer:{
        $val:function( emit, event, defer ){

          console.log('jaja')

          var request = this
          var body = this.$body
          var headers = this.$headers
          var hostname = this.$hostname
          var method = this.$method
          var path = this.$urlpath

          var opts = {
            method: method ? method.$val : 'GET',
            headers: headers ? headers.raw() : void 0,
            hostname: hostname ? hostname.$val : void 0,
            path: path ? path.$val : void 0
          }

          var req = http.request( opts, function( res ){
            var data = ''
            var response

            res.on('data', function (chunk) {
              request.emit('$data', void 0, chunk )
              data += chunk
              // emit()
            })

            res.on('end', function() {
              response = data[0] === '{' ? JSON.parse(data) : data
              request.setKey('$response',response, false)
              request.emit('$end', void 0, response )
              console.log('END')
              emit()
            })

            res.removeAllListeners()
            res.header('Connection', 'close');

          })

          req.on('error',function(err){
            request.emit('$error', void 0, err)
          })

          if( body ){
            req.write( JSON.stringify( body.raw() ) )
          }

          req.end()
        }//,
        // cancel:function(){
        //   console.log('CANCEL',arguments)
        // }
      }
    }
  },
  $flags:{
    $headers:HttpProperty,
    $hostname:HttpProperty,
    $urlpath:HttpProperty,
    $payload:HttpProperty,
    $response:new Operator({
      $key:'$response',
      $operator:function( val, operator, origin ) {
        var parsed = operator.$parseValue( val, origin )
        return parsed
      }
    })
  }
}).$Constructor