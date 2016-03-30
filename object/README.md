#V.Object
####V.Object is our implementation of [the observer pattern](http://en.wikipedia.org/wiki/Observer_pattern). Listeners are automatically added and removed when necessary and it has all the methods you'd love to have in every object.
---------------
___
Constructor | Description
------ | -----------
[*new* V.Object()](#new-vobject) | Object is used as a object constructor.
____
Methods | Description | Require
------ | ----------- |--------
[.set()](#set) | Adds a property to a V.object. | 
[.remove()](#remove) | Removes a V.object including all nested fields and values.
[.destroy()](#destroy) | Removes a V.object and also removes all linked containers.
[.each()](#each) | Performs passed function on each item in V.object.
[.checkParent()](#checkparent) | Get a field at first occurrence in the parent chain, including itself.
[.convert()](#convert) | Returns a regular object, keeps links to V.objects.
[.merge()](#merge) | Merges any object into a V.object.
[.clone()](#clone) | Copies an object and returns a new one.
[.path()](#path) | Returns object on the end of a defined path.
___
Attributes | Description
------ | -----------
.val | Setter and getter for every value in a `V.Object`.
.updatePath | Returns the update path.
.keys | Returns the keys of an object.
.raw | Returns a regular object.
.from | Gets/sets object origin.
.empty | Checks if V.object is empty.
._updateOrigin | Returns the V.Object from which the current update originated.
___
Properties | Description
------ | -----------
._val | Stores the value of a field in `V.object`.
.__t | Stores the type of a V.object using integers. <br>(1 = Array; 2 = Object; 3 = Number, String, Boolean, Function; 4 = linked V.object).
._listeners | Stores an array of objects listening to this object.
._listens | Stores an array of objects this object is listening to.

(Properties are only added when necessary.)

*Type 1*
```javascript
var myArray = new V.Object([1,2,3]);

myArray; // returns [V.Object, V.Object, V.Object, _val: null, __t: 1]
myArray.val; // returns null
```
*Type 2*
```javascript
var myObject = new V.Object({
  a:'foo',
  b:'bar'
});

myObject; // returns V.Object {a: V.Object, b: V.Object, __t: 2}
myObject.val; // returns undefined	
```
*Type 3*
```javascript
var myString = new V.Object('hello world');

myString; // returns V.Object {_val: "hello world", __t: 3}
myString.val; // returns 'hello world'
```
*Type 4*
```javascript
var myOriginalObject = new V.Object(20);
var myLinkedObject = new V.Object(myOriginalObject);

myOriginalObject; // returns V.Object V.Object {_val: 20, __t: 3, _listeners: Array[1]}
myOriginalObject.val; // returns 20
myLinkedObject; // returns V.Object {_val: V.Object, __t: 4, _listens: Array[1]}
myLinkedObject.val; // returns 20
```
### *new* V.Object( [*val*], [*parent*] )
V.objects are used instead of normal objects in Vigour. Listeners are automatically added and removed.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | any | |Start value for new `V.object`.
parent | Object | |Defines the *_parent* property for new `V.Object`.

```javascript
var myAge = new V.Object(20), 
  myTwinsAge = new V.Object(myAge);

myAge.val = 21; //sets myAge and updates myTwinsAge
myAge.val; //returns 21
myTwinsAge.val; //returns 21
```
### .set( *name*, *val*, [*vObj*], [*stamp*], [*noupdate*], [*from*] )
Adds a property to a `V.object`.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
name | String  | | Defines name of new property.
val | any  | | Defines value of new property.
vObj | Boolean  | | 
stamp | int  | new stamp | Adds specific stamp to `V.object`.
noupdate | Boolean  | false | When true, no updates.
from | Object or Boolean  | | When true, this is an add.

```javascript    
var myFriends = new V.Object();

myFriends.set('myBestFriend','Peter');
myFriends.myBestFriend.val; //returns 'Peter'
```
### .remove( [*nested*], [*blacklist*], [*not*], [*from*], [*stamp*], [*noupdate*] )
Removes a V.Object including all nested fields and values.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
nested | Boolean  | false | When true remove nested objects.
blacklist | Boolean  | | When true doesn't remove blacklisted items.
not | Boolean  | | Parameters to be passed.
from | Boolean or Object  | | Parameters to be passed.
stamp | int  | new stamp | Adds specific stamp to `V.object`.
noupdate | Boolean  | false | When true, no updates.

```javascript
var myObject = new V.Object({
  a:'foo',
  b:'bar'
});

myObject.remove(); //removes myObject all nested fields and values
myObject; //returns V.Object {}
```

### .destroy()

Removes a V.Object including all nested fields and values. Also removes all linked containers, uses slice on arrays and removes all _listeners.
```javascript
var myValue = new V.Object(20), 
myObject = new V.Object({
  a:'foo',
  b:'bar',
  c:myValue
});

myValue.destroy(); //removes myValue and all linked containers
myValue; //returns V.Object {}
myObject; //returns V.Object {a:'foo',b:'bar'}
```

### .each( *fn*, [*deep*], [*arg*] ) 

Performs passed function on each item in `V.object`, skips items in the blacklist. Always passes _fieldindex_ as first argument in passed function.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
fn | function() | - | Function to perform on each item in V.object.
deep | Boolean | false | If true, repeats _each_ method on nested fields.
arg | Arguments | - | Arguments to pass to the function.

```javascript
var myFunction = function(fieldindex, string){
  console.log(string + ' ' + fieldindex + ' ' +this.val);
};

var myObject = new V.Object({
  a:'foo',
  b:'bar'
});

myObject.each(myFunction,false,'hello'); //returns 'hello a foo' and 'hello b bar'
```
### .checkParent( *field*, [*get*] )

Get a field at first occurrence in the parent chain, including itself.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
field | String | - | Field to find in the parent chain.
get | Boolean | false | When true returns found instead of current.

```javascript    
var myParent = new V.Object({
  greatParent:true,
  happyChild:{
    firstName:'Peter'
  }
});

myParent.happyChild.checkParent('greatParent',false); //returns myParent
myParent.happyChild.checkParent('greatParent',true); //returns myParent.greatParent
myParent.happyChild.checkParent('greatParent',true).val; //returns true
```
### .convert()

Returns a regular object, keeps links to V.Objects.

```javascript
var myObject = new V.Object({
  a:'foo',
  b:'bar'
});

myObject.convert(); //returns Object {val: undefined, a: "foo", b: "bar"}
```
### .merge( *obj*, [*shallow*], [*stamp*], [*noupdate*] )

Merges any object into a V.object.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object | - | Object to merge into this one.
shallow | Boolean | false | When true, only performs _merge_ on top level.
stamp | int | new stamp | Adds specific stamp to `V.object`.
noupdate | Boolean | false | When true, no updates.

```javascript
var myBrothers = new V.Object(['Peter','James']),
    mySiblings = new V.Object(['Lisa','Monica']);

mySiblings.merge(myBrothers); 
mySiblings;//returns a V.Object containing ['Peter','James','Lisa','Monica']
```
### .clone( *obj*, [*shallow*], [*list*], [*parent*] )

Copies an object and returns a new one, can also pass a merge object.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object | - | Object to [merge](#merge) into the clone.
shallow | Boolean | false | When true, only performs _clone_ on top level.
list | Array or Object | | Defines the list of items that are in the [blacklist](), but have to added.
parent | Object | false | When true, no updates.	
	
```javascript
var myOriginal = new V.Object('wow');
var myClone = myOriginal.clone();

myOriginal; // returns V.Object {__t: 3, _val: "wow"}
myClone; // returns V.Object {__t: 3, _val: "wow"}
```
### .path( *path*, [*val*], [*overwrite*], [*writeHandler*], [*stamp*], [*noupdate*] )

Returns object on the end of a defined path.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
path | Array |  | Array of fields in path.
val | any |  | When defined, val will be set on endpoint of path if not already defined.
overwrite | Boolean |  | If true, val will overwrite existing value on endpoint of path when already defined.
writeHandler | function() |  | Callback on write.
stamp | int | new stamp | Adds specific stamp to `V.object`.
noupdate | Boolean | false | When true, no updates.
    
```javascript
var myBranches = new V.Object({
  first:{
    second:{
      third:'foo'
    }
  }
});

myBranches.path(['first','second','third']); // returns V.Object {_parent: V.Object, _name: "third", _val: "foo", __t: 3}
myBranches.path(['first','second','third']).val; // returns 'foo'
myBranches.path(['first','second','third'],'hello world').val; // returns 'foo'
myBranches.path(['first','second','third'],'hello world',true).val; // returns 'hello world'

myBranches.first.second.third; // returns 'hello world'
```    
### .get( *path* )

Gets object from specified path. When path is a string checks for [dot-notation]().

Argument | Type | Default | Description
------ | ---- | ------- | -----------
path | Array or String | - | Defines field (defined as String) or path (defined in [dot-notation]() or Array)
    
```javascript 
var myBranches = new V.Object({
  first:{
    second:{
      third:'foo'
    }
  }
});

myBranches.get('first.second.third'); // returns V.Object {_parent: V.Object, _name: "third", _val: "foo", __t: 3}
myBranches.get('first.second.third').val; // returns 'foo'
```

### .addListener( *val* )

Adds a listener to an object.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | function() or Array | - | Function to perform when listener fires. Can also be Array [function, bind, arguments].

```javascript
var myNumber = new V.Object(20);

myNumber.addListener(function(){
  console.log('I\'m listening!');
});

myNumber.val = 21; // returns I'm listening!

//a function with a more efficient bind (using array notation)
V.myNumber.addListener([function(arg) {
  console.log('hey!', this, arg);
},{name:'use this in the function'},'this is an argument!']); // binds {name:'use this in the function'} to this.
```
### .removeListener( [*val*], [*bind*] )

Removes listeners.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | function() | - | Function to remove from listeners. If not defined all listeners are removed.
bind | Object | - | Removes all listeners added with this mark. Needs val to be true.

```javascript
V.myNumber.addListener([function(arg) {
  console.log('hey!', this, arg);
},{name:'use this in the function'},'this is an argument!']);

V.myNumber.addListener(false,{name:'use this in the function'});
```
