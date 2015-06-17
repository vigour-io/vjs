'use strict';

var repl = require('repl').start({ prompt: '> ', useGlobal: true })
var args = process.argv
var filename = args[2]
var module = require( './' + filename )

module(repl, args.slice(2))

Object.defineProperty(repl.context, 'q', {
  get: function(){
    process.exit()
  }
})