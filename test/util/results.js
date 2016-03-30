var util = require('../../util')
  , log = require('./log')
  , difftime = function(oldtime, time, old, str) {
      var dtime = time-oldtime
      if(dtime<-0.1) {
        log.pass( (str || '') + ' '+dtime )
      } 
      else if(dtime>0.1) {
        log.fail( (str || '')+ ' +'+dtime )
      }
    }

exports.node = function(results, resultsJSON, time, mem, hash, folder, id) {
  var path = ['node', id]
  , old = util.path(resultsJSON, path)
  , oldCommit

  util.path(results, path.concat([hash, folder]), {
    time:time,
    memory:mem
  })

  if(old && old.commit && (oldCommit=util.path(old, [old.commit, folder]))) {
   difftime(oldCommit.time, time, old)
  }  
}

exports.browser = function(results, resultsJSON, tests, hash, folder, id) {
  var path = ['browser', id]
  , old = util.path(resultsJSON, path)
  , oldCommit

  util.path(results, path.concat([hash, folder]), tests)

  if(old && old.commit && (oldCommit=util.path(old, [old.commit, folder]))) {
    for(var i in oldCommit) {
      difftime(oldCommit[i], tests[i], old, i)
    }
  }  
}
