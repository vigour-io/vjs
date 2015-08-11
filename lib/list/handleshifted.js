module.exports = function $handleShifted(list, i) {
  var item = list[i]
  if(item._$parent === list) {
    item.$key = i
  } else if(item._$contextKey !== i){
    list.$createListContextGetter(i)
  }
}
