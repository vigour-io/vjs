var MetaEmitter = require('../on/metaemitter')
var subscribe = require('./subscribe')

module.exports = new MetaEmitter({
	$on: {
		$newParent: {$useVal: function(parent, event) {
			console.error( '!!!!!!!!!!!! a subscription was added!' )

			var target = parent.$parent

			var pattern = this.$pattern

			subscribe(target, this.$pattern)



		}}
	},
	$define:{
		_$key: {
			set: function(val) {
				console.log('>>>>>> set key of MetaEmitter!', val)
				this.__$key = val

				console.log('my parent is now', this.$parent)

				var target = this._$parent._$parent

				console.log('subscribe to', target)
				var pattern = this.$pattern

				subscribe(target, pattern, this)


			},
			get: function() {
				return this.__$key
			}
		}
	}
}).$Constructor
