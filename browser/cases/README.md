#Cases
Cases are used to set one or more values when a specific case is true
there are 2 types of cases , static and dynamic.
Static cases are set at initialization of the application , usefull for things such as device type (phone, desktop, tv)
Dynamic cases can be changed dynamicly and [`V.Objects`](../../core/object) or [`V.Bases`](../../core/base) that use the case will be changed dynamicly as well. 

----------------
A static case in a [`V.Value`](../../value)
```javascript
V.cases.itIsNight = true;

var value = new V.Value({
	val:100,
    itIsNight:-100
});

console.log(value.val); //will return -100;

var value = new V.Value({
	val:100,
    add: {
    	val:100,
        itIsNight:200
    }
});

console.log(value.val); //will return 300;

V.cases[V.ua.device] = true //creates a case like desktop or phone see V.ua for more info

```
----------------
A dynamic case in a [`V.Value`](../../value)
```javascript
var start = new Date().getTime();

V.cases.tenSeconds = new V.Value(function() {
 return (new Date().getTime()-start)/1000>10;
}) //note that a dynamic case can be a V.Object, values have to be true or falsy

var value = new V.Value({
	val:100,
    tenSeconds:300
});

console.log(value.val); //after 10 seconds will return 300 else 100;

setInterval(function() {
	//clock, will update the case tenSeconds every second
    V.cases.tenSeconds.update();
},1000);

var elem = new V.Element({
	w:100,
    h:100,
    text:{
      val:'it has not been 10 seconds yet!',
      tenSeconds:'Wow it has been 10 seconds already!'
    }
}); //with the updates set in the interval the text in the element will update after 10 seconds

```
----------------
For an extensive example see [cases](https://github.com/vigour-io/V/tree/master/examples/cases)

----------------
**#TODO** Cases cannot be reset or changed for instances of base classes, cases are now only extended on [`V.Values`](../../value) and [`V.Element`](../element). 

**#BUG** Having nested cases with the same name as cases on the same level does not work
