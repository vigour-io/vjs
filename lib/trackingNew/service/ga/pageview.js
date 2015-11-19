'use strict'

module.exports = function (page) {
  var category = page.category()
  var props = page.properties()
  var name = page.fullName()
  var opts = this.options
  var campaign = page.proxy('context.campaign') || {}
  var pageview = {}
  var pagePath = path(props, this.options)
  var pageTitle = name || props.title
  var track

  // store for later
  // TODO: Why? Document this better
  this._category = category

  pageview.page = pagePath
  pageview.title = pageTitle
  pageview.location = props.url

  if (campaign.name) pageview.campaignName = campaign.name
  if (campaign.source) pageview.campaignSource = campaign.source
  if (campaign.medium) pageview.campaignMedium = campaign.medium
  if (campaign.content) pageview.campaignContent = campaign.content
  if (campaign.term) pageview.campaignKeyword = campaign.term

  // custom dimensions and metrics
  var custom = metrics(props, opts)
  if (len(custom)) window.ga('set', custom)

  // set
  window.ga('set', { page: pagePath, title: pageTitle })

  // send
  window.ga('send', 'pageview', pageview)

  // categorized pages
  if (category && this.options.trackCategorizedPages) {
    track = page.track(category);
    this.track(track, { nonInteraction: 1 })
  }

  // named pages
  if (name && this.options.trackNamedPages) {
    track = page.track(name)
    this.track(track, { nonInteraction: 1 })
  }
}
