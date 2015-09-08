module.exports = typeof window === 'undefined' ||
  this !== window ||
  window.toString() === '[object global]'
