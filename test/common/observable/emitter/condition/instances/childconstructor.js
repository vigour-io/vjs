'use strict'
describe('ChildConstructor', function () {
  var Observable = require('../../../../../../lib/observable')
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
            // why does this not fire ? add test for without condition
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
        nestedField: 'start' // should fire for start as well!!!
      }
    })
    d.field.nestedField.val = 'fire'
    expect(results).to.deep
      .equal(['d.field', 'd.field.nestedField', 'd.field.nestedField'])
  })
})
