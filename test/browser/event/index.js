var Event = require('../../../lib/event/');

describe('events', function() {
  var currentStamp;

  beforeEach(function() {
    var myEvent = new Event();
    currentStamp = myEvent.$stamp;
  });

  it('should have $stamp', function() {
    var rahhEvent = new Event();
    currentStamp++;
    expect(rahhEvent.$stamp).to.be.equal(currentStamp);
  });

  it('should increase $stamp when there is a new event', function() {
    var justAnotherEvent = new Event();
    currentStamp++;
    expect(justAnotherEvent.$stamp).to.be.equal(currentStamp);
  });

  it('should be able to create an event with $origin', function() {
    var somewhere = {};
    var eventWithOrigin = new Event(somewhere);

    expect(eventWithOrigin.$origin).to.be.defined;
  });

  it('should be able to create an event with $type', function() {
    var myType = {};
    var eventWithOrigin = new Event(null, myType);

    expect(eventWithOrigin.$type).to.be.defined;
  });

  describe('$postpone method', function() {
    var myEvent = new Event();

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
