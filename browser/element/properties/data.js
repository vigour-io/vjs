/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var data = require('../../../data/base')
  , util = require('../../../util')
  , flags = require('../../../value/flags')

/**
  * extends updateData to take childNodes into account
  * may need to add extra argument for go deep
  * @method
*/
exports.extend = util.extend([data, {
  updateData: function ( instances, data, fmodel ) {

    // console.log('????----------->>>>>')
    if (this._d) {
      this._subscribed = false
      data = this._d
    }

    var ffmodel = false

    // console.log(fmodel, this.model)
    //dit is omdat er geen model property is op het ding waar data op wordt gebinded dan default ie naar models die er wel zijn
    //oplossing maak model aan altijd als data en niet dfrom

    if (!fmodel && !this.model && !this._fmodel) ffmodel = true
    //fmodel is first model
    for (var children = this.node.childNodes
      , i = children.length - 1
      , base; i >= 0; i--) {
      base = children[i].base
      if (base
      && (!(base.model && base.model.inherit && base.model.inherit.val===false))
      && (base._d === void 0 || base._dfrom)) {
        if (base.model && data) {
          if (ffmodel) base._fmodel = true

          // console.log('FMODEL! -- dSet', data)
          // console.log('------ XXXXXXXXXXXXXXXXX', ffmodel, base._name, '\n', base, data )
          base._dSet(data, true)
        }
        base.updateData(instances, data, base._fmodel || fmodel)
      }
    }
  }
}])
