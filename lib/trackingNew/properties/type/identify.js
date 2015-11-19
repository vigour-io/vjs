function(id, traits, options, fn) {
  // Argument reshuffling.
  /* eslint-disable no-unused-expressions, no-sequences */
  if (is.fn(options)) fn = options, options = null
  if (is.fn(traits)) fn = traits, options = null, traits = null
  if (is.object(id)) options = traits, traits = id, id = user.id()
  /* eslint-enable no-unused-expressions, no-sequences */

  // clone traits before we manipulate so we don't do anything uncouth, and take
  // from `user` so that we carryover anonymous traits
  user.identify(id, traits)

  var msg = this.normalize({
    options: options,
    traits: user.traits(),
    userId: user.id()
  })

  this._invoke('identify', new Identify(msg))

  // emit
  this.emit('identify', id, traits, options)
  this._callback(fn)
  return this
}
