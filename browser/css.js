/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

/*
  gets and caches values for css classes, also possible to change styles of classes
  return an array of multiple css objects corresponding to the class name
  when you pass field it searches the field trough all the classes selected, always takes first argument
  maybe have to make this for things such as div selectors / nested stuff --- will be cpu intensive!;
*/
var selector = 'cssRules',
  parseclass = function(slctr) {
    slctr = '.' + slctr.replace(/\./g, ' .').toLowerCase();
    for (var robj, select = document.styleSheets, length = select.length, i = 0, selectItem; i < length; i++) {
      selectItem = select[i][selector] || select[i][(selector = 'rules')]; //location of this polyfill can be improved
      if(selectItem) {
        for (var j = 0, l = selectItem.length, item; selectItem, j < l; item = selectItem[j++], item.selectorText === slctr && (robj = item.style));
      }
    }
    return robj;
  },
  c = function(cssClass, cache) {
    var t = exports;
    cache.push(t[cssClass] || (t[cssClass] = parseclass(cssClass)) || {});
    return cssClass;
  };

module.exports = function(slctr, field) {
  if (slctr) {
    var cache = this[slctr];
    if (!cache) {
      cache = [];
      for (var selectarray = slctr.split(' '), i = 0, l = selectarray.length, cssClass; i < l; i++) {
        if ((cssClass = c(selectarray[i], cache).split('.')) instanceof Array) {
          c(cssClass[cssClass.length - 1], cache);
        }
      }
      this[slctr] = cache;
    }
    if (field) {
      if(!(cache instanceof Array))
        return
      for (var ret, i = cache.length - 1; !ret && i >= 0; ret = cache[i--][field]);
      cache = ret;  
    }
    return cache;
  }
};