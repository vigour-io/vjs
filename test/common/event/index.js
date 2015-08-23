var Event = require('../../../lib/event/');

describe( 'event', function() {
  var currentStamp
  var theOrigin = {}

  beforeEach(function() {
    var myEvent = new Event( theOrigin )
    currentStamp = myEvent.$stamp;
  });

  it( 'should have $stamp', function() {
    var rahhEvent = new Event( theOrigin )
    currentStamp++
    expect(rahhEvent.$stamp).to.be.equal( currentStamp )
  });

  it( 'should increase $stamp when there is a new event', function() {
    var justAnotherEvent = new Event( theOrigin )
    currentStamp++
    expect(justAnotherEvent.$stamp).to.be.equal( currentStamp )
  });

  it( 'should not be able to create an event without $origin', function() {
    expect(function() {
      var eventWithOrigin = new Event()
    }).to.throw;
  });

  it( 'should be able to create an event with $type', function() {
    var myType = {};
    var eventWithOrigin = new Event( theOrigin, myType );

    expect(eventWithOrigin.$type).to.be.defined;
  });

  describe( '$postpone method', function() {
    var myEvent = new Event( theOrigin );

    it('should has the method', function() {
      expect(myEvent.$postpone).to.be.defined;
      expect(myEvent.$postpone).to.be.a.function;
    });

    it('should add an emmiter to $postponed array', function() {
      myEvent.$postpone('Rahh');

      expect(myEvent.$postponed).to.be.defined;
      expect(myEvent.$postponed).to.be.an.array;
      expect(myEvent.$postponed).to.have.length(1);
    });

  });

});
