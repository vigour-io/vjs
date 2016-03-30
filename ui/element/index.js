/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */

var Element = require('../../browser/element')

require('../../value/flags/parent')
require('../../value/flags/self')
require('../../value/flags/process')
require('../../value/flags/util')
require('../../browser/events')

module.exports =
  Element
  .inject
  ( require('../../browser/element/properties/collection')
  , require('../../browser/element/properties')
  , require('../../browser/element/properties/scrollbar')
  , require('../../browser/element/properties/process')
  , require('../../value/on')
  )

