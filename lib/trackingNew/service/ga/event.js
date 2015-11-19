'use strict'

// module.exports = function (eventCategory, eventAction, eventLabel, eventValue) {
//   ga('send', 'event', eventCategory, eventAction)
// }

module.exports = function(track, options) {
  var contextOpts = track.options(this.name)
  var interfaceOpts = this.options
  var opts = defaults(options || {}, contextOpts)
  opts = defaults(opts, interfaceOpts)
  var props = track.properties()
  var campaign = track.proxy('context.campaign') || {}

  // custom dimensions & metrics
  var custom = metrics(props, interfaceOpts)
  if (len(custom)) window.ga('set', custom)

  var payload = {
    eventAction: track.event(),
    eventCategory: props.category || this._category || 'All',
    eventLabel: props.label,
    eventValue: formatValue(props.value || track.revenue()),
    nonInteraction: !!(props.nonInteraction || opts.nonInteraction)
  }

  if (campaign.name) payload.campaignName = campaign.name
  if (campaign.source) payload.campaignSource = campaign.source
  if (campaign.medium) payload.campaignMedium = campaign.medium
  if (campaign.content) payload.campaignContent = campaign.content
  if (campaign.term) payload.campaignKeyword = campaign.term

  window.ga('send', 'event', payload)
}
