describe('instances', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var a = new Observable({
      on: {
        data: {
          condition: function (data, done, event) {
            setTimeout(done, 10)
          },
          val: function () {
            cnt++
            if (cnt === 2) {
              done()
            }
          }
        }
      }
    })
    var b = new a.Constructor()
    a.val = 'a change!'
  })
})

describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var dataCnt = 0
    var fired = []
    var a = new Observable({
      key: 'a',
      time: 10,
      on: {
        data: {
          condition: function (data, done, event) {
            setTimeout(() => done(), this.time.val)
          },
          val: function (data) {
            fired.push(this.path[0])
            cnt++
            if(data === 'a change!') {
              dataCnt++
            }
            if (cnt === 5 && dataCnt === 3) {

              // expect(fired).to.deep.eql(['b', 'c', 'a', 'b', 'c'])
              done()
            }
          }
        }
      }
    })
    // behaviour now is fire for each -- im fix operator first
    // then we have batch
    // think about the inputs what to do with them -- context will become a nightmare -- context condition is only from the original
    // -- last things are fired with wrong time i geuss (the a time)
    var b = new a.Constructor({time: 200, key: 'b'})
    var c = new b.Constructor({time: 30, key: 'c'})
    a.val = 'a change!'
  })

  describe('references', function () {

    it('should fire conditions over references over instances', function (done) {
      var b = new Observable({
        val: a
      })
      var a = new Observable({
        key: 'a',
        val: b,
        on: {
          data: {
            condition: function (val) {
              expect(val).equals(200)
              done()
            }
          }
        }
      })
      var c = new a.Constructor()
      b.val = 200
    })
  })

  describe('ChildConstructor', function () {
    it('should fire condition over ChildConstructors', function (done) {
      var b = new Observable({
        on: {
          data: {
            condition (val) {
              expect(val).equals('fires')
              expect(this.path[0]).equals('d')
              done()
            }
          }
        }
      })
      var c = new Observable({
        ChildConstructor: b.Constructor
      })
      var d = new c.Constructor({
        key: 'd',
        field: 'fires'
      })
    })

    it('should fire condition over ChildConstructors over nested fields', function (done) {
      var results = []
      var b = new Observable({
        on: {
          data: {
            condition (val, next) {
              results.push(this.path.join('.'))
            }
          }
        },
        ChildConstructor: 'Constructor'
      })
      var c = new Observable({
        ChildConstructor: b.Constructor
      })
      var d = new c.Constructor({
        key: 'd',
        field: {
          nestedField: 'start' //should fire for start as well!!!
        }
      })
      d.field.nestedField.val = 'fire'
      expect(results).to.deep
        .equal(['d.field', 'd.field.nestedField', 'd.field.nestedField'])
    })
  })
})
