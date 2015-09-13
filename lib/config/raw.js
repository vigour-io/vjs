exports.$define = {
  $raw: {
    get: function getRaw(){
      return this.convert({
        exclude: excludeKeys
      })
    }
  }
}

function excludeKeys(key) {
  return key[0] === '$' || key[0] === '_'
}
