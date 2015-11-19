module.exports = function(track) {
  var total = track.total() || track.revenue() || 0
  var orderId = track.orderId()
  var products = track.products()
  var props = track.properties()

  // orderId is required.
  if (!orderId) return

  // require ecommerce
  if (!this.ecommerce) {
    window.ga('require', 'ecommerce')
    this.ecommerce = true
  }

  // add transaction
  window.ga('ecommerce:addTransaction', {
    affiliation: props.affiliation,
    shipping: track.shipping(),
    revenue: total,
    tax: track.tax(),
    id: orderId,
    currency: track.currency()
  })

  // add products
  each(products, function(product) {
    var productTrack = createProductTrack(track, product)
    window.ga('ecommerce:addItem', {
      category: productTrack.category(),
      quantity: productTrack.quantity(),
      price: productTrack.price(),
      name: productTrack.name(),
      sku: productTrack.sku(),
      id: orderId,
      currency: productTrack.currency()
    })
  })

  // send
  window.ga('ecommerce:send')
}
