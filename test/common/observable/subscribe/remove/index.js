'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(() => {
  countOne = 0
  countTwo = 0
})

describe('removing before the subscription is found: adding prop listeners', function () {
  var sub
  var a = new Observable({
    nested: {}
  })

  it('subscribes to field', function () {
    a.subscribe({
      nested: {
        title: true
      }
    }, function () {
      countOne++
    })
    expect(countOne).equals(0)
  })

  it('doesnt fire when removing', function () {
    a.nested.remove()
    expect(countOne).equals(0)
  })

  it('fires when adding nested title', function () {
    a.set({
      nested: {
        title: 'foo'
      }
    })
    expect(countOne).equals(1)
  })
})

describe('removing before the subscription is found: adding prop listeners, reference', function () {
  var sub
  var a = new Observable(new Observable({
    nested:{}
  }))

  it('subscribes to field', function () {
    a.subscribe({
      nested: {
        title: true
      }
    }, function () {
      countOne++
    })
    expect(countOne).equals(0)
  })

  it('doesnt fire when removing', function () {
    a.val.nested.remove()
    expect(countOne).equals(0)
  })

  it('fires when adding nested title', function () {
    a.set({
      nested: new Observable({
        title: 'foo'
      })
    })
    expect(countOne).equals(1)
  })
})

describe('adding prop listeners, no reference, multiple', function () {
  var count = {
    a: 0,
    b: 0
  }
  var item = new Observable()
  var sub = item.subscribe({
    parent: {
      title: true
    }
  }, function () {
    count[this.key]++
  })
  var Item = item.Constructor
  var parent = new Observable({
    title: 'momma'
  })

  it('fires for 2 instances, when added to parent',function(){
    parent.set({
      a: {
        useVal: new Item()
      },
      b: {
        useVal: new Item()
      }
    })
    expect(count.a).equals(1)
    expect(count.b).equals(1)
  })

  it('fires when title is removed', function () {
    parent.title.remove()
    expect(count.a).equals(2)
    expect(count.b).equals(2)
  })

  it('fires when adding title', function () {
    console.log('------doing it-----')
    parent.set({
      title: 'flups'
    })
    expect(count.a).equals(3)
    // expect(count.b).equals(3)
  })
})

describe('adding prop listeners, reference, multiple', function () {
  console.clear()
  var count = {
    a: 0,
    b: 0
  }
  var item = new Observable()
  var sub = item.subscribe({
    parent: {
      title: true
    }
  }, function () {
    count[this.key]++
  })
  var Item = item.Constructor
  var parent = new Observable(
    new Observable({
      title: 'momma'
    })
  )

  it('fires for 2 instances, when added to parent', function(){
    parent.set({
      a: {
        useVal: new Item()
      },
      b: {
        useVal: new Item()
      }
    })
    expect(count.a).equals(1)
    expect(count.b).equals(1)
  })

  it('fires when title is removed', function () {
    parent.val.title.remove()
    expect(count.a).equals(2)
    expect(count.b).equals(2)
  })

  it('fires when adding title', function () {
    console.log('setting title:', parent.val.title)
    parent.val.set({
      title: 'flups'
    })
    expect(count.a).equals(3)
    expect(count.b).equals(3)
  })

})

describe('reference, simple', function () {
  var d = new Observable({
    title:'snur'
  })
  var obs = new Observable(d)
  var cnt = 0
  obs.subscribe({
    title:true
  }, function(){
    cnt++
  })
  it('fires when removed',function(){
    d.title.remove()
    expect(cnt).equals(1)
  })
  it('fires when added',function(){
    d.set({
      title:'bur'
    })
    expect(cnt).equals(2)
  })
})

describe('reference, simple, nested', function () {
  var d = new Observable({
    title:'snur'
  })
  var obs = new Observable({
    val:d,
    nested:{}
  })
  var cnt = 0
  obs.nested.subscribe({
    $upward:{
      title:true
    }
  }, function(){
    cnt++
  })
  it('fires when removed',function(){
    d.title.remove()
    expect(cnt).equals(1)
  })
  it('fires when added',function(){
    d.set({
      title:'bur'
    })
    expect(cnt).equals(2)
  })
})