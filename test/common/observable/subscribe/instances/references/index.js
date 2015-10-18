/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../../lib/observable')
var count
var origins
var targets

beforeEach(() => {
  count = 0
  origins = []
  targets = []
})

describe('multiple instances with different references', function () {
  var content = new Observable({
    a: {
      title: 'aTitle'
    },
    b: {
      title: 'bTitle'
    },
    c: {
      title: 'cTitle'
    }
  })

  var obs = new Observable({
    // trackInstances: true
  })

  it('subcribes to field', function () {
    obs.subscribe({
      title: true
    }, function (data) {
      targets.push(this.key)
      origins.push(data.origin.val)
      count++
      console.info(count, this.path, '<-', data.origin.path, data.origin.val)
    })
  })

  it('create instances with different refs, fires correct for each instance', function () {
    new obs.Constructor({
      key: 'one',
      val: content.a
    })
    new obs.Constructor({
      key: 'two',
      val: content.b
    })
    new obs.Constructor({
      key: 'three',
      val: content.c
    })
    expect(count).equals(3)
    expect(origins).contains('aTitle')
    expect(origins).contains('bTitle')
    expect(origins).contains('cTitle')
    expect(targets).contains('one')
    expect(targets).contains('two')
    expect(targets).contains('three')
  })

  it('update one reference, fires correct for each instance', function () {
    console.log('------------------')
    content.b.title.val = 'bUpdatedTitle'
    expect(count).equals(1)
    expect(origins).contains('bUpdatedTitle')
    expect(targets).contains('two')
  })

  it('update another reference, fires correct for each instance', function () {
    console.log('------------------')
    content.c.title.val = 'cUpdatedTitle'
    expect(count).equals(1)
    expect(origins).contains('cUpdatedTitle')
    expect(targets).contains('three')
  })
})

describe('multiple instances with different references, with nested subscriptions', function () {
  var content = new Observable({
    a: {
      title: 'aTitle'
    },
    b: {
      title: 'bTitle'
    },
    c: {
      title: 'cTitle'
    }
  })

  var obs = new Observable({
    // nested:{

    // }
  })

  it('subcribes to field', function () {
    console.clear()
    obs.subscribe({
      nested:{
        title: true
      }
    }, function (data) {
      targets.push(this.key)
      origins.push(data.origin.val)
      count++
      console.info(count, this.path, '<-', data.origin.path, data.origin.val)
    })
  })

  it('create instances with different refs, fires correct for each instance', function () {
    console.log('------------------1')
    console.info('--one--')
    new obs.Constructor({
      key: 'one',
      nested: content.a
    })
    console.info('--two--')
    new obs.Constructor({
      key: 'two',
      nested: content.b
    })
    console.info('--three--')
    new obs.Constructor({
      key: 'three',
      nested: content.c
    })
    expect(count).equals(3)
    expect(origins).contains('aTitle')
    expect(origins).contains('bTitle')
    expect(origins).contains('cTitle')
    expect(targets).contains('one')
    expect(targets).contains('two')
    expect(targets).contains('three')
  })

  it('update one reference, fires correct for each instance', function () {
    console.log('------------------2')
    content.b.title.val = 'bUpdatedTitle'
    expect(count).equals(1)
    expect(origins).contains('bUpdatedTitle')
    expect(targets).contains('two')
  })

  it('update another reference, fires correct for each instance', function () {
    console.log('------------------3')
    content.c.title.val = 'cUpdatedTitle'
    expect(count).equals(1)
    expect(origins).contains('cUpdatedTitle')
    expect(targets).contains('three')
  })
})