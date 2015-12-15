var parseUrl = require('../../../lib/util/url')

describe('Create Base object with parsed url properties', function () {
  var url = 'https://user:pass@host.com:8080/p/a/t/h?query=string#hash'
  var parsed = parseUrl(url)
  console.log(parsed)
  it('should parse url path', function () {
    expect(parsed.urlpath.val).to.equal('/p/a/t/h?query=string')
  })
  it('should parse url hash', function () {
    expect(parsed.hash.val).to.equal('#hash')
  })
  it('should parse url auth info', function () {
    expect(parsed.auth.val).to.equal('user:pass')
  })
  it('should parse url pathname', function () {
    expect(parsed.pathname.val).to.equal('/p/a/t/h')
  })
  it('should parse url port', function () {
    expect(parsed.port.val).to.equal('8080')
  })
  it('should parse url protocol', function () {
    expect(parsed.protocol.val).to.equal('https:')
  })
  it('should parse url querystring', function () {
    expect(parsed.query.val).to.equal('query=string')
  })
  it('should parse url return query parameter including the leading questin mark', function () {
    expect(parsed.search.val).to.equal('?query=string')
  })
  it('should return true if slashes in url', function () {
    expect(parsed.slashes.val).to.be.ok
  })
})
