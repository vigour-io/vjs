/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Marcus Besjes, marcus@vigour.io
 */
var util = require('../../../util')

exports.extend = util.extend(extend)

function extend(Cloud) {
  util.define( Cloud
  , 'authenticate', function authenticate(req, cb, re){
      // console.log('authenticate!')
      var cloud = this

      if(typeof req === 'function')
        req = req()

      if(!req)
        return cloud.socket.removeListener('connect', reAuth)

      cloud.emit('authenticate', req, function(res){
        if(res.hop)
          cloud.hop(res.hop)
        else if(cb)
          cb(res)
      })
      // dev:
      // console.log('---->>>>> emitting authenticate!!', req)
      // cloud.emit('authenticate', req, function(res){
      //   console.log('authenticate respuns!', res)
      //   cb.apply(this, arguments)
      // })


      if(!re){
        cloud.on('connect', reAuth)
      }

      function reAuth(){
        cloud.authenticate(req, cb, true)
      }

    }
  )
}