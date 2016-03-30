#V.Value.flags
Flags are definable keywords that have custom setters.

---------------
##Overview
Flags | Description  | Require
------ | ----------- | ---------
[.listen]() | Adds listen properties. | value.flags.utils
[.parent]() | Adds parent inheritence. | value.flags.parent
[.ajax]() | Adds ajax functionality. | value.flags.ajax
[.data]() | Adds data population. | value.flags.data

##Listen
Adds listeners, see [`V.Object`](../core/object)
````javascript
var a = new V.Value(100);

var b = new V.Value({
  val:function() {
	alert('!');
  },
  listen:a //is the same as a.addListener(b);
});

var c = new V.Value({
    bla: {
     listen:[a,b] //adds a listener on a and b
    }
});

a.val = 200;
//will alert('!');
````

##Parent
Inherits a value from a parent [DOM-element](https://developer.mozilla.org/en/docs/Web/API/Element)
````javascript
var elem = new V.Element({
	w:200,
    text:'aaa',
    bla: {
    	html:{val:'THIS IS HTML! ', add:{parent:'text'}}, 
        //links html to its parent text field results in "THIS IS HTML! aaa"
    	w:{parent:'w'} //will link the width of bla on its parents width
    }
});
````
Parent is highly optimized for multiple instances of a single base class, faster then setting individual instances manualy

#Ajax
A value will fire an ajax request and feeds the resut back into the V.Value
See [network/ajax.js](https://github.com/vigour-io/V/tree/master/vigour/browser/network) for parameters
````javascript
var elem = new V.Element({
	text:{val:'http://www.justanothertext.com',ajax:true}
    //loads the content of justanothertext.com into the text field
});

var elem = new V.Element({
	text:{val:'http://www.justanothertext.com',ajax:{
    	type:'POST',
        complete:function(data) {
        	console.log('just another text is done!');
            return data; //if no return value will set data automaticly
        }
    }}
    //the same effect but with an extra complete handler that return the value
});

````

#Data
Data flags are used to easyly bind data to properties and automaticly sets the [model](https://github.com/vigour-io/V/tree/master/vigour/data) of an element. See [data](https://github.com/vigour-io/V/tree/master/vigour/data) for more information
````javascript
var elem = new V.Element({
	data:{title:'hello!'},
	text:{data:'title'}
    //binds title to text
});

var elem = new V.Element({
	data:'hello!',
	text:{data:true} //text is now hello
});
````




