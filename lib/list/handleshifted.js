module.exports = function $handleShifted(list, i, check) {
  var item = list[i]
  if(item._$parent === list) {
    item._$key = i
  } else {
    list.$createListContextGetter(i)
  }
}
