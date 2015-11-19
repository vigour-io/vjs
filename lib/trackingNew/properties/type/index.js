function types (data, callback) {
  if (data.type === 'pageview') {
    require('./pageview')(data)
  } else if (data.type === 'event') {
    require('./event')(data)
  } else if (type === 'identify') {
    require('./pageview')()
  }
}


// this.pageview = new DataLayer

module.exports = types
