'use strict'
/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var count

describe('ref: subscribing to any field, toplevel', function () {
  var ref = new Observable({
    one: {},
    two: {},
    three: {}
  })

  var obs = new Observable(ref)

  beforeEach(function () {
    count = 0
  })

  it('should fire once for all fields', function () {
    obs.subscribe({
      $any: true
    }, function (data) {
      count++
    }).run()

    expect(count).equals(3)
  })

  it('changing existing field fires subscription', function(){
    ref.set({
      one:1
    })
    expect(count).equals(1)
  })  

  it('adding a field fires subscription', function(){
    ref.set({
      randomField: {
        nested: true
      }
    })
    expect(count).equals(1)
  })

  it('adding field with a value fires subscription', function(){
    ref.set({
      randomField3: true
    })
    expect(count).equals(1)
  })
})

describe('ref: subscribing to any field, nested', function () {
  var ref = new Observable({
    nested: {
      one: {},
      two: {},
      three: {}
    }
  })

  var obs = new Observable(ref)

  beforeEach(function () {
    count = 0
  })

  it('should fire once for all fields', function () {
    obs.subscribe({
      nested: {
        $any: true
      }
    }, function (data) {
      count++
    }).run()

    expect(count).equals(3)
  })

  it('changing existing field fires subscription', function(){
    ref.nested.set({
      one: 1
    })
    expect(count).equals(1)
  })

  it('adding a field fires subscription', function () {
    console.log('------ add prop ref nested -------')
    ref.nested.set({
      randomField: {
        nested: true
      }
    })
    expect(count).equals(1)
  })

  it('adding field with a value fires subscription', function(){
    ref.nested.set({
      randomField3: true
    })
    expect(count).equals(1)
  })
})