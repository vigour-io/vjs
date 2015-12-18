'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')

describe('DOWHAP', function () {
  var count = 0
  var paths = {

  }
  var DObject = new Observable({
    define: {
      dowhap: {
        get: function () {
          return this._isDowhap
            ? this
            : this.parent.dowhap
        }
      }
    },
    ChildConstructor: 'Constructor'
  }).Constructor

  var Routable = new DObject({
    key: 'routable',
    services: {
      ChildConstructor: function ServiceConstructor (val, event, parent, key) {
        var repoKey = val.repo || key
        var repo = parent.dowhap.repos[repoKey]
        var branchKey = val.branch || 'dist'
        var branch = repo[branchKey]
        val.branch = branchKey
        return new branch.Constructor(val, event, parent, key)
      }
    }
  }).Constructor

  Routable.prototype.subscribe({
    $upward: {
      regions: {
        // val:true,
        // AMS: true,
        FRA: true
      }
    }
  }, function (data, event) {
    count++
    paths[this.path.join('-')] = true
  })

  var Branch = new Routable({
    properties: {
      regional: Routable
    },
    regions: {
      ChildConstructor: function RegionConstructor (val, event, parent, key) {
        var regional = parent.parent.regional
        var Constructor = regional ? regional.Constructor : Routable
        return new Constructor(val, event, parent, key)
      }
    }
  }).Constructor

  var Repo = new DObject({
    ChildConstructor: Branch
  }).Constructor

  var Dowhap = new DObject({
    _isDowhap: true,
    repos: {
      ChildConstructor: Repo
    }
  }).Constructor

  var dowhap = new Dowhap({
    key: 'dowhap',
    repos: {
      hub: {
        dist: {
          setting1: 'yes hub default',
          setting2: 'yes hub default'
        }
      },
      mtvplay: {
        dist: {
          services: {
            hub: {
              regional: {
                services: {
                  appData: {
                    repo: 'hub',
                    val: 'app-data.domain.com'
                  },
                  userData: {
                    repo: 'hub',
                    val: 'user-data.domain.com'
                  }
                }
              },
              regions: {
                AMS: {
                  val: 'main-hub.domain.com'
                },
                FRA: {
                  val: 'viva-hub.domain.com'
                }
              }
            }
          }
        }
      }
    }
  })
})