"use strict";

var VPATH = '../../'

var Base = require( VPATH + 'lib/base' )
var perf = require( VPATH + 'lib/dev/perf')

var helpers = require(VPATH + 'lib/base/util/helpers')

module.exports = function(repl, args){
  
  var ding1 = new Base({
    path: {
      naar: {
        iets: 1
      }
    }
  })
  var results = new Base()
  
  var got = helpers.getPath(ding1, ['path', 'naar', 'iets'])

  var got = ding1.$find(['path', 'naar', 'iets'], 1)

  
  

  // var got = ding1.$find(['path', 'naar', 'iets'], function(result){
  //   if(result === 1) return true
  // })
  // var got = ding1.$find(['path', 'naar', 'iets'], [1,2,3])
  // var got = ding1.$find(['path', 'naar', 'iets'], {conditions:{$equals:1}})
  // var got = ding1.$find(['path', 'naar', 'iets'], new Regex())
  // var got = ding1.$find(['path', 'naar', 'iets'], {
  //   conditions:{$equals:1},filter:function(){}})
  // var got = ding1.$find(['path', 'naar', 'iets'], {results:results})

  // ding1.$.find()
  // ding1.$find = 'flups'

  // var hurk = ding1.$find = 'flups'


  console.log('==========================')
  console.log('got dat', got)
  console.log('==========================')
  
}
