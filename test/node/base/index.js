var Base = require('../../../lib/base')

describe('base', function() {
  var a;

  beforeEach(function() {
    a = new Base({
      $key: 'a',
      $val: 123,
      x: 1
    });
  });

  it('should have the internal key', function() {
    expect(a._$key).to.be.eql('a');
  });

  it('should have simple value', function() {
    expect(a.$val).to.be.eql(123);
  });

  it('should have properties values', function() {
    expect(a.x).to.be.defined;
    expect(a.x.$val).to.be.equal(1);
  });

  it('should be able to set property value', function() {
    a.set({
      x: 2
    });

    expect(a.x.$val).to.be.equal(2);
  });

  it('should have a $path in property value', function() {
    expect(a.x.$path).to.be.eql(['a', 'x']);
  })

  it('should expose a $Constructor', function() {
    expect(a.$Constructor).to.be.a('function');
  });

  describe('nested properties', function() {
    var a;

    beforeEach(function () {
      a = new Base({
        $key: 'a',
        x: {
          y: {
            z: true
          }
        }
      });
    });

    it('should have a value', function() {
      expect(a.x.y.z.$val).to.be.equal(true);
    });

    it('should be instances and prototype of Base', function() {
      expect(a.x).to.be.instanceOf(Base);
      expect(a.x.y).to.be.instanceOf(Base);
      expect(a.x.y.z).to.be.instanceOf(Base);

      expect(Object.getPrototypeOf(a.x)).to.be.equal(Base.prototype);
      expect(Object.getPrototypeOf(a.x.y)).to.be.equal(Base.prototype);
      expect(Object.getPrototypeOf(a.x.y.z)).to.be.equal(Base.prototype);
    });

    it('should call generate context getter when get $Constructor', function() {
      var spyX = sinon.spy(a.x, "$createContextGetter");
      var spyXY = sinon.spy(a.x.y, "$createContextGetter");

      expect(spyX).to.not.have.been.called;
      expect(spyXY).to.not.have.been.called;

      var constructor = a.$Constructor;

      expect(spyX).to.have.been.called;
      expect(spyXY).to.have.been.called;
    });

  });

  describe('derived types', function() {
    var a, b, AConstructor;

    beforeEach(function () {
      a = new Base({
        $key: 'a',
        x: {
          y: {
            z: true
          }
        }
      });

      AConstructor = a.$Constructor;

      b = new AConstructor({
        $key: 'b'
      });
    });

    it('should heir derived properties and their values', function() {
      expect(b.x.y.z).to.be.defined;
      expect(b.x.y.z.$val).to.be.equal(true);
    });

    it('should have the correct _$context and _$contextLevel for derived object', function() {
      expect(b.x._$context === b).to.equal(true);
      expect(b.x.y._$context === b).to.equal(true);
      expect(b.x.y.z._$context === b).to.equal(true);

      expect(b.x._$contextLevel).to.equal(0);
      expect(b.x.y._$contextLevel).to.equal(1);
      expect(b.x.y.z._$contextLevel).to.equal(2);
    });

    it('should not have _$context and _$contextLevel for parent object', function() {
      expect(a.x._$context).to.be.undefined;
      expect(a.x.y._$context).to.be.undefined;
      expect(a.x.y.z._$context).to.be.undefined;

      expect(a.x._$contextLevel).to.be.undefined;
      expect(a.x.y._$contextLevel).to.be.undefined;
      expect(a.x.y.z._$contextLevel).to.be.undefined;
    });

    it('should hae the correct $path', function() {
      expect(a.x.y.z.$path).to.eql(['a', 'x', 'y', 'z']);
      expect(b.x.y.z.$path).to.eql(['b', 'x', 'y', 'z']);
    });

    it('Resolve context set should be triggered', function() {
      var zResolveContextSetSpy = sinon.spy(b.x.y.z, "$resolveContextSet");

      expect(zResolveContextSetSpy).to.not.have.been.called;
      b.x.y.z.$val = 'rahh!';
      expect(zResolveContextSetSpy).to.have.been.calledWith('rahh!', undefined);
    });

    it('After resolve context it _$context and _$contextLevel should be cleared', function () {
      b.x.y.z.$val = 'rahh!';
      expect(b.x.y.z._$context).to.be.null;
      expect(b.x.y.z._$contextLevel).to.be.null;
    });

  });

});
