#Events
The event system in V makes it easy to create generelized events accros different devices and input types. There are two types of events, complex and basic. Events are tightly integrated with [static cases](../cases).

Events extend [`V.Elements`](../)

See the [events example](../../../examples/events)
___
Methods | Description
------ | -----------| -----
[.addEvent()](#set) | Adds events
[.removeEvent()](#remove) | Removes events
___
Properties | Description
------ | ----------- | -----
.events | Define events in an object 
___

Using events in elements
```javascript
var a = new V.Element({
	events: {
    	click:function() {
        	this.rotate = 200;
        },
        mouseover: function() {
        	this.opacity = 0.5;
        }
    }
});
```

#Creating events
Uses touchstart when the case touch is true , else reverts to mousedown
```javascript
V.events.down = {
  touch: {
    touchstart: function(e, method) {
      method.call(this);
    }
  },
  val: {
    mousedown: function(e, method, val) {
      console.log('DOWN!');
      method.call(this, e, val);
    }
  }
};
```

After creating an event it is possible to use it in other event definitions
```javascript
V.events.moredown = {
  commandLineInterface: {
    keyup: function(e, method) {
      method.call(this);
    }
  },
  val: {
    down: function(e, method, val) {
      console.log(' MORE DOWN!', val);
      method.call(this, e, val);
    }
  },
  remove: function(id) {
  	//remove is called when the event is removed , handy for things as clickout
  }
};
//uses down as a default if the case is commandLineInterface it will use keyup
```
Integrating modernizr in Cases
```javascript
for(var i in window.Modernizr) { V.cases[i] = true; }
Now all properties in Modernizr can be used in Event definitions
```

#.addEvent( *field*, *fn*, [*id*] )
Add an event to an element.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
field | String |  | Event type e.g. click, down, drag
fn | Function |  | Function is called when the event fires , this refers to the base class connected to the event
id | String, Integer |  | Optional, can be used to group events by id, usefull for creating complex events



#.removeEvent( [*field*], [*id*], [*fn*] )
Removes one or multiple events. When no arguments are passed removes all events.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
field | String |  | Remove all events of this type, can also be combined with other fields
id | String, Interger |  | Removes all events matching this id, can be combined with other fields
fn | Function |  | Mathes a function does need an id or field

