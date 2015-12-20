var Observable = require('vigour-js/lib/observable')

module.exports = new Observable({
  inject: require('vigour-js/lib/operator/type'),
  define: {
    match: {
      get() {
        if (!this._match) {
          let separator = this.separator
          if (separator === '/') { separator = '\\/' }
          let indicator = this.indicator
          let border = this.border.val
          this._match = new RegExp('\[' + indicator + separator + ']' + this.key + '=(([a-zA-Z/$\\d])[^' + separator + border + ']*)')
        }
        return this._match
      }
    },
    push(parsed) {
      let len = parsed.length - 1
      if (parsed[len] === this.indicator) {
        parsed = parsed.slice(0, len)
      }
      if (parsed[len] === this.separator) {
        parsed = parsed.slice(0, len)
      }
      global.history.pushState(null, null, parsed)
    }
  },
  properties: {
    separator: true,
    indicator: true
  },
  separator: '&',
  indicator: '?',
  border: function() {
    if (this.parent.indicator === '?') { return '#' }
    else { return '?' }
  },
  $type: 'string',
  on: {
    data: {
      condition(val, next, event, data) {
        if (this.key) {
          let url = this.parent.href.val
          let match = url && url.match(this.match)
          let result

          if (match) { result = match[1] }
          if ((val || val === '' || val === null) && event.inherits && event.inherits.type !== 'popstate') {
            let newval
            let piv
            let clearit
            let remover

            if (result) {
              piv = match[0]

              if (piv) {
                if (piv[0] == this.indicator) {
                  clearit = true
                  piv = piv.slice(1)
                }
              }
              if (val) { newval = piv.replace(result, val) }
              else {
                remover = true
                newval = ''
              }
            }
            if (newval === void 0) {
              if (val) {
                let index = url.indexOf(this.indicator)
                if (index > 0) {
                  newval = url.slice(0, index + 1) + this.key + '=' + val + this.separator + url.slice(index + 1)
                } else {
                  newval = url + this.indicator + this.key + '=' + val
                }
                if (newval !== url) { this.push(newval) }
              }
            } else {
              let parsed
              if (url.indexOf(piv + this.separator) > -1 && clearit && remover) {
                parsed = url.replace(piv + this.separator, newval)
              } else {
                parsed = url.replace(piv, newval)
              }
              if (parsed !== url) { this.push(parsed) }
            }
            result = val
          }

          if (result) {
            if (result === this.output) { return }
            val = result
          }
          else if (this.output) { val = '' }
          else { return }
          // ouput or changing the actual origin lets think about it!
          this.output = val
          this.parent.emit('url', val, event)
          next()
        }
        return
      }
    }
  }
})
