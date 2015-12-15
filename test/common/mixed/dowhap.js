'use strict'
var Observable = require('../../../lib/observable')
Observable.prototype.inject(require('../../../lib/methods/plain'))

describe('Dowhap usecase', function () {
  this.bail(true)
  var DObject, Routable, Branch, Repo, Dowhap, dowhap

  it('should create the classes', function () {
    // ---------------------------------------
    DObject = new Observable({
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

    // ---------------------------------------

    Routable = new DObject({
      services: {
        ChildConstructor: function ServiceRepoConstructor (val, event, parent, key) {
          var repoKey = val.repo || key
          var repo = parent.dowhap.repos[repoKey]
          var branchKey = val.branch || 'dist'
          val.branch = branchKey
          var branch = repo[branchKey]
          return new branch.Constructor(val, event, parent, key)
        }
      },
      region: {
        inject: require('../../../lib/operator/transform'),
        $transform (region) {
          if (typeof region !== 'string') {
            region = false
            let target = this.parent
            let parent

            while (!region && target) {
              region = target.region && target.region._input
              if (!region) {
                parent = target.parent
                if (parent && parent.key === 'regions') {
                  region = target.key
                } else {
                  target = parent
                }
              }
            }
          }
          return region || false
        }
      },
      balance: { }
    }).Constructor

    Routable.prototype.subscribe({
      val: true,
      region: true,
      services: {
        ready: true
      },
      $upward: {
        regions: {
          $any: true
        }
      }
    }, function (data, event) {
      var routable = this
      var route = routable.val

      if (typeof route === 'string') {
        let regional = routable
        while (regional) {
          if (regional.key === 'regional') {
            return
          }
          regional = regional.parent
        }

        let region = routable.region.val

        if (region) {
          if (routable.key === 'redis' || routable.repo === 'redis') {
            return
          }
          let setObj = {}
          let balance = routable.balance
          let number = routable.balance.val
          let upperbound = number + 1
          while (balance[upperbound]) {
            setObj[upperbound++] = null
          }
          while (number) {
            // balance.setKey(number,{instanceId: Math.random()})
            setObj[number] = {instanceId: Math.random()}
            number--
          }

          console.clear()
          let setresult = balance.set(setObj)

          for (let key in setObj) {
            // console.log(setresult[1])
            if (!setresult[key]) {
              // console.log('+++++++++++++++++++ did not work?!'.blue, key)
              // console.log('setresult', setresult && setresult.path, setresult)
              // console.log('setresult === balance', setresult === balance)
              // console.log('balance', balance)
              // throw new Error('set had no effect! ' + key)
            }
          }
        }
      }
    })

    // ---------------------------------------

    Branch = new Routable({
      properties: {
        regional: Routable
      },
      regions: {
        ChildConstructor: function RegionConstructor (val, event, parent, key) {
          var regional = parent.parent.regional
          val.region = key
          var Constructor = regional ? regional.Constructor : Routable
          return new Constructor(val, event, parent, key)
        }
      }
    }).Constructor

    // ---------------------------------------

    Repo = new DObject({
      ChildConstructor: Branch
    }).Constructor

    // ---------------------------------------

    Dowhap = new DObject({
      _isDowhap: true,
      repos: {
        ChildConstructor: Repo
      }
    }).Constructor
  })

  it('should create new Dowhap instance dowhap', function () {
    // lets make dat dowhap
    dowhap = new Dowhap({
      repos: {
        redis: {
          dist: {
            redissetting: 'yes redissetting!'
          }
        },
        hub: {
          dist: {
            setting1: 'yes hub default',
            setting2: 'yes hub default'
          }
        },
        mtvplay: {
          dist: {
            'services': {
              'hub': {
                'regional': {
                  'services': {
                    'appdata': {
                      'repo': 'hub',
                      'val': 'appdata-{region}.mtvplay.tv',
                      'balance': 6,
                      'files': [
                        './scraper'
                      ]
                    },
                    'userdata': {
                      'repo': 'hub',
                      'val': 'userdata-{region}.mtvplay.tv',
                      'balance': 5,
                      'services': {
                        'redis': {
                          'val': 'user-data-storage-{region}.mtvplay.tv',
                          'cluster': 3,
                          'redundancy': 1
                        }
                      }
                    }
                  }
                },
                'regions': {
                  'AMS': {
                    'val': 'hub-{region}.mtvplay.tv',
                    'special': 'damsco',
                    'balance': 30
                  },
                  'FRA': {
                    'val': 'hub-{region}.mtvplay.tv',
                    'special': 'franny fur',
                    'balance': 30
                  }
                }
              }
            }
          }
        },
        secondthing: {
          dist: {
            services: {
              redis: {
                settang: true
              }
            }
          }
        }
      }
    })
  })

  // =======================================

  xit('should have created balanced appdata instances for AMS', function () {
    expect(dowhap).to.have.deep.property('repos.mtvplay.dist.services.regions.AMS.services.appdata.balance')
    var appdataBalance = dowhap.repos.mtvplay.dist.services.regions.AMS.services.appdata.balance
    expect(appdataBalance).to.have.property('1')
    expect(appdataBalance).to.have.property('5')
  })
})
