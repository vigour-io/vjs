'use strict'

describe('nested', function () {
  var Observable = require('../../../../../../lib/observable')
  it('correct data for nested fields', function () {
    var paths = []
    var datas = []
    var d = new Observable({
      trackInstances: true,
      key: 'd',
      field: {
        on: {
          data (data) {
            datas.push(data)
            paths.push(this.path.join('.'))
          }
        }
      }
    })
    var e = new d.Constructor({
      key: 'e'
    })
    var f = new e.Constructor({ //eslint-disable-line
      key: 'f'
    })
    expect(e).to.have.property('_field')
    e.set({ field: 'bla' })
    expect(paths).to.deep.equal([ 'f.field', 'e.field' ])
    expect(datas).to.deep.equal([ 'bla', 'bla' ])
  })
})
