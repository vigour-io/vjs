exports.$define = {
  $params: {
    get: function getParams(){
      console.log('ha get params')
      return this.convert({
        exclude: excludeKeys
      })
    }
  }
}

function excludeKeys(key) {
  return key[0] === '$' || key[0] === '_' || key[0] === '#'
}
