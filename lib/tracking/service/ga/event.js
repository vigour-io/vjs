'use strict'

module.exports = function (eventCategory, eventAction, eventLabel, eventValue) {
  console.log('sending', eventCategory)
  ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue)
}
