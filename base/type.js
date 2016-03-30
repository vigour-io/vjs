var util = require('../util')

module.exports = {
  /**
   * Defines what this type will do on creation.
   * @method create
   * @param  {*} val              Value
   * @param  {[type]}  [prop]     [description] //WORDT NIET GEBRUIKT
   * @param  {Object}  [settings] Settingobject
   * @param  {Boolean} [noupdate] When true, doesn't update the V.Value
   * @return {Object}             Returns the V.Value
   */
  create: function(val, prop, settings, noupdate) {
    var obj = val
    obj.base = this
    return obj
  },
  /**
   * Defines what this type will do on set.
   * @method set
   * @param  {*}      val      Value
   * @param  {Object} prop     Properties
   * @param  {Object} settings Settingsobject
   * @return {*}               Returns value
   */
  set: function(val, prop, settings) {
    if(this!==prop.base) {
      util.setstore.call(this)
      this.__[settings.name] = util.merge( util.clone(prop, false, {base:true})
        , val)
    } else {
      util.merge(prop,val)
    }
    return null
  }
}