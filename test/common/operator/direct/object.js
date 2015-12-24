'use strict'
describe('object', function () {
  var Observable = require('../../../../lib/observable')

  describe('add', function () {
    var a
    describe('function', function () {
      it('create a new observable, should return a cache object', function () {
        a = new Observable({
          inject: require('../../../../lib/operator/all'),
          key: 'a',
          b: 'its b',
          $add () {
            return {
              c: 'its c'
            }
          }
        })
        expect(a.val).equals(a._cache)
      })

      it('should have field a.b', function () {
        expect(a.val.b._input).equals(a.b)
      })

      it('should have field a.b.c', function () {
        expect(a.val).has.property('c')
          .which.has.property('_input')
          .which.equals('its c')
      })
    })

    describe('nested', function () {
      it('create a new observable, should return a cache object', function () {
        a = new Observable({
          inject: require('../../../../lib/operator/all'),
          key: 'a',
          b: 'its b',
          // merge er ook bij
          $add: {
            c: 'its c'
          }
        })
        expect(a.val).equals(a._cache)
      })

      it('should have field a.b', function () {
        expect(a.val.b._input).equals(a.b)
      })

      it('should have field a.b.c', function () {
        expect(a.val).has.property('c')
          .which.has.property('_input')
          .which.has.property('_input')
          .which.equals('its c')
      })
    })


    describe('nested, useVal', function () {
      it('create a new observable, should return a cache object', function () {
        var UseValObservable = new Observable({
          useVal: true,
          ChildConstructor: 'Constructor'
        }).Constructor

        a = new UseValObservable({
          inject: require('../../../../lib/operator/all'),
          key: 'a',
          b: 'its b',
          $add:{
            c:new UseValObservable('nerdje')
          }
        })
        expect(a.val).equals(a._cache)
      })

      // it('should have field x.b', function () {
      //   expect(s.val.b._input).equals(a.b)
      // })

      // it('should have field a.b.c', function () {
      //   expect(a.val).has.property('c')
      //     .which.has.property('_input')
      //     .which.has.property('_input')
      //     .which.equals('its c')
      // })
    })
  })

    describe('transform', function () {
      var a
      describe('function', function () {
        it('create a new observable, should return a cache object', function () {
          a = new Observable({
            inject: [
              require('../../../../lib/operator/all'),
              require('../../../../lib/methods/map')
            ],
            key: 'a',
            b: 'its b',
            c: 'its c',
            $transform () {
              return this.map((property, key) => { return { wow: property } })
            }
          })
          expect(a.val).equals(a._cache)
        })

        it('should have all fields', function () {
          var arr = []
          a.val.each((property, key) => { arr.push(property.wow._input) })
          expect(arr).to.deep.equal([a.b, a.c])
        })
      })

      describe('object', function () {
        it('create a new observable, should return a cache object', function () {
          a = new Observable({
            inject: [
              require('../../../../lib/operator/all'),
              require('../../../../lib/methods/map')
            ],
            key: 'a',
            b: 'its b',
            c: 'its c',
            $transform: {
              d: 'haha'
            }
          })
          expect(a.val).equals(a._cache)
        })

        it('should have d field', function () {
          expect(a.val.each((property) => property._input)).equals(a.$transform.d)
        })
      })
    })
})
