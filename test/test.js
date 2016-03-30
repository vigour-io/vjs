#!/usr/bin/env node
var path = require('path')
  , fs = require('fs')
  , os = require('os')
  , hash = require('../util/hash')
  , test = require('../util/test')
  , util = require('../util')
  , childProcess = require('child_process')
  , phantomjs = require('phantomjs')
  , log = require('./util/log')
  , binPath = phantomjs.path
  , parser = require('./util/parser')
  , testUtil = require('./util')
  , results = require('./util/results')
  , errors = 0
  , total = 0
  , cpu = {
      cores: os.cpus().length,
      speed: os.cpus()[0].speed
    }
  , newresults = {}
  , mem = os.totalmem()
  , resultsJSON = fs.readFileSync('test/results.json', 'utf8')
  , platform = os.platform()
  , id = hash(cpu.speed+platform+mem)
  , server = testUtil.server

if(resultsJSON) { 
  resultsJSON = JSON.parse(resultsJSON)
} 
else {
  resultsJSON = {}
}

function browserTest (folder, hash, callback) {
  childProcess.execFile(binPath, [
    path.join(__dirname, 'browser.js'),
    'http://localhost:8888/browser/'+folder+'/'
  ], function(err, stdout, stderr) {
    log.test(folder)
    console.log('phantomjs says--->',stdout)
    var tests = parser.phantomTests(stdout)
      , error = parser.phantomErrors(stdout)
    if(error) {
      log.fail(folder,error)
      errors++
    } else {
      total++
      log.pass(folder,tests)
      results.browser(newresults, resultsJSON, tests, hash, folder, id)
    }
    callback()
  })
}

function nodeTest (folder, hash, callback) {
  var err
  test({
    method:function () {
      log.test(folder)
      //try catch ? just write the ones that failed etc
      try {
        require('./node/'+folder)
        total++
      } catch(e) {
        err = true
        log.fail(folder,e)
        errors++
      }
      setTimeout(callback,0)
    },
    complete:function( time, mem) {
      if(!err) {
        log.pass(folder, String(time)+' sec')
        results.node(newresults, resultsJSON, time, mem, hash, folder, id)
      } 
    }
  })
}

childProcess.exec("git log --pretty=format:'%h' -n 1"
  , function (err, stdout, stderr) {
   start(err, stdout)
});

function start (err, hash) {  
    
  log.header('init')

  log.info('git-commit', err ? 'no info!' : hash)
  log.info('cpu',cpu)
  log.info('memory',mem)
  log.info('device hash',id)

  testUtil.test('browser', hash, browserTest, function () { 
    if(resultsJSON) {
      util.merge(resultsJSON,newresults)
    }
    else {
      resultsJSON = newresults
    }
    //for var i in things you want
    util.path(resultsJSON,['node',id,'commit'],hash,true)
    util.path(resultsJSON,['browser',id,'commit'],hash,true)
    fs.writeFile('test/results.json', JSON.stringify(resultsJSON), 
      function (err) {
        if(err) log.error('failed to write to results.json')
        if(errors) {
          FAIL() //force fail for travis
        }
    })
    log.header('finished')  
    if(!errors) {
      log.pass(total+' tests passed')
    } else {
      log.fail(errors+' of '+(errors+total)+' tests failed')
    }
    server.close() 
  })

  log.header('node.js')  

  testUtil.test('node', hash, nodeTest, function () {  
    log.header('browser')  
  })
}
//git commit results.json store results somewhere else ,send it to a server?