/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Marcus Besjes, marcus@vigour.io
 */
var makeHash = require('../../../util/hash')
  , VObject = require('../../../object')

VObject.prototype._blacklist.push('_synced')

module.exports = Rooms

function Rooms(){
  this.on('join', onJoin)
}

Rooms.prototype.join = function(joinobj, rejoin){
  // console.log('join!')
  var cloud = this

  if(!rejoin){
    var hash = makeHash(JSON.stringify(joinobj))
    cloud._joins[hash] = joinobj
  }else if(cloud._status === 2){
    // console.log('block')
    return
  }

  var reqid = joinobj.reqid = makeHash(String(Math.random()))

  cloud.whenReady(function() {
    cloud.write({join:joinobj})
    // cloud.once(reqid, onJoin)
  })

}

Rooms.prototype.leave = function(roomname){
  var cloud = this
  if(roomname)
    cloud._leave(roomnmame)
  else if(cloud.data.rooms)
    cloud.data.rooms.each(function(roomnmame){
      cloud._leave(roomnmame)
    })
  

  // cloud.write({leave:roomname, logout:1})
}

Rooms.prototype._leave = function(roomname){
  var cloud = this
  // if(cloud.data.rooms && cloud.data.rooms[roomname]){
  //   // nested, bl, not, from, stamp, noupdate
  //   cloud.data.rooms[roomname].remove(void 0, void 0, void 0, void 0, cloud.stamp = 'leaving')
  // }
  cloud.unsubscribe(['rooms', roomname])
  cloud.write({leave:roomname})
}


var oldjoin = function(joinobj, callback, room) {
  var reqid = joinobj.reqid = Math.random()
  if (room) {
    exports.reqs[reqid] = room
  } else {
    room = exports.reqs[reqid] = new data({})
  }
  if (joinobj.location === true) {
    // get location > recur
  } else {
    this.whenReady(function() {
      // console.log('> V.cloud.join > joining!', joinobj)
      cloud.write({ join: joinobj })
      if (callback) {
        cloud.once(reqid, function(msg) {
          callback(room)
        })
      }
    })
  }
  return room
}

// Cloud.prototype.leave = function(room, kicked) {
//   if (room instanceof data) {
//     room.removeListener()
//   } else if (room) {

//   } else {
//     cloudData.rooms.each(function() {
//       this.removeListener()
//     })
//   }
// }

// if(!Cloud.listeners) Cloud.listeners = []

function onJoin(msg){
  // console.log('---------- room join:', msg)
  
  // var room = exports.reqs[msg.reqid] || new data({})
  // // room.merge(msg.room)
  // // console.log(msg.room)
  // // UNIFY    room  > < V.cloud.data.rooms[room.id]
  // room.merge(cloudData.rooms[msg.roomid])
  // cloudData.rooms.set(room.id.val, room, true)
  // cloud.room = room //not V.room but cloud.room
  // room.addListener(function(val, stamp, from, remove, added) {
  //   if (stamp !== cloud.stamp && val !== void 0) {
  //     val = util.raw(val)
  //     cloud.write({ update: { path: from._path
  //                           , val: val
  //                           }
  //                 })
  //   }
  // })
}