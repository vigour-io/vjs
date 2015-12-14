var parseUrl = require('../../../lib/util/url')

describe('parse url', function () {
  var url = 'https://user:pass@host.com:8080/p/a/t/h?query=string#hash'
  var parsed = parseUrl(url)

  it('should parse url path', function () {
    expect(parsed.path).to.equal('/p/a/t/h?query=string')
  })
  it('should parse url hash', function () {
    expect(parsed.hash).to.equal('#hash')
  })
  it('should parse url auth info', function () {
    expect(parsed.auth).to.equal('user:pass')
  })
  it('should parse url pathname', function () {
    expect(parsed.pathname).to.equal('/p/a/t/h')
  })
  it('should parse url port', function () {
    expect(parsed.port).to.equal('8080')
  })
  it('should parse url protocol', function () {
    expect(parsed.protocol).to.equal('https:')
  })
  it('should parse url querystring', function () {
    expect(parsed.query).to.equal('query=string')
  })
  it('should parse url return query parameter including the leading questin mark', function () {
    expect(parsed.search).to.equal('?query=string')
  })
  it('should return true if slashes in url', function () {
    expect(parsed.slashes).to.be.ok
  })
})
