var Config = require('../../../lib/config')
var service_package_json = require('./service_package.json')
var project_package_json = require('./project_package.json')
var ISNODE = require('../../../lib/util/isnode')

var config

describe('Config', function(){

  describe('Merge', function(){
    it('should not crash', function(){
      config = new Config(service_package_json)
        .merge(project_package_json)
    })

    it('should still have settings of base package', function(){
      expect(config.name.$val).to.equal('super-service')
      expect(config.category.$val).to.equal('services')
      expect(config.userdecay.$val).to.equal(5)
      expect(config.special.$val).to.equal(false)
    })

    it('should have settings of merged package', function(){
      expect(config.somesetting.$val).to.equal(true)
    })

    it(
      'should have applied settings from newpackage[category][name] to root' +
      ' of base package',
      function(){
        expect(config._$val).to.equal("{service}.{app}.{domain}")
        expect(config).to.have.property('#develop')
        expect(config).to.have.property('#master')
        expect(config).to.have.property('#demo')
      }
    )

    it('should have skipped merging newpackage[category]', function(){
      expect(config).to.not.have.property('services')
    })

  })


  describe('Resolve', function(){

    describe('Resolve Branch', function(){
      it('should not crash', function(){
        config.resolve('#develop')
      })
      it('should have applied root level settings from #develop', function(){
        expect(config._$val).to.equal('{branch}-{service}.{app}.{domain}')
        expect(config.special.$val).to.equal(true)
        expect(config.somesetting.$val).to.equal(false)
      })
      it('should have applied nested settings from #develop', function(){
        expect(config.somesetting.nested.$val).to.equal(false)
      })
    })

    describe('Resolve Region', function(){
      it('should not crash', function(){
        config = new Config(service_package_json)
          .merge(project_package_json)
          .resolve('#master')
      })
      it('should have regions because #master resolved', function(){
        expect(config).to.have.property('regions')
      })

      it('should resolve region settings', function(){
        config.resolve('regions').resolve('AT', {
          skipVal: true
        })
        expect(config).to.have.property('specialAT')
          .which.has.property('$val', true)
      })
      it('should not have resolved AT region $val', function(){
        expect(config._$val).to.equal('{region}-{service}.{app}.{domain}')
      })

    })

  })

  describe('Template language', function(){
    it('should parse template values from config into values with {field}',
      function(){
        config.set({
          region: 'AT'
        })
        expect(config.$val).to.equal('AT-super-service.best-app.vigour.io')
      }
    )
  })

  if(!ISNODE){
    describe('crack', function(){
      it.skip('put c in window', function(){
        window.c = config
      })
    })
  }

})
