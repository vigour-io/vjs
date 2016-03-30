var util = require('../util')
  , hash = require('../util/hash')

exports.extend = util.extend(function(base) {
  base.prototype._blacklist.push('__hp')
  util.define( base
  , '_hashpath', {
      get: function() {
        console.log('hp!')
        return this.__hp || (this.__hp = hash(this._path.toString()))
      }
    }
  )
})