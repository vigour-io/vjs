'use strict'

module.exports = function (eventCategory, eventAction, eventLabel, eventValue) {
  ga('send', 'event', eventCategory, eventAction)
}
