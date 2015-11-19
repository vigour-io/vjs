module.exports = function() {
  var opts = this.options

  // setup the tracker globals
  window.GoogleAnalyticsObject = 'ga'
  window.ga = window.ga || function() {
    window.ga.q = window.ga.q || []
    window.ga.q.push(arguments)
  }
  window.ga.l = new Date().getTime()

  if (window.location.hostname === 'localhost') opts.domain = 'none'

  window.ga('create', opts.trackingId, {
    // Fall back on default to protect against empty string
    cookieDomain: opts.domain || GA.prototype.defaults.domain,
    siteSpeedSampleRate: opts.siteSpeedSampleRate,
    allowLinker: true
  })

  // display advertising
  if (opts.doubleClick) {
    window.ga('require', 'displayfeatures')
  }

  // send global id
  if (opts.sendUserId && user.id()) {
    window.ga('set', 'userId', user.id())
  }

  // anonymize after initializing, otherwise a warning is shown
  // in google analytics debugger
  if (opts.anonymizeIp) window.ga('set', 'anonymizeIp', true)

  // custom dimensions & metrics
  var custom = metrics(user.traits(), opts)
  if (len(custom)) window.ga('set', custom)

  this.load('library', this.ready)
}
