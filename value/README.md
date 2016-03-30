#V.Value
V.Value is a specific type of [`V.Object`](../core/object), used to populate objects with values. It adds the possibility to use operators and functions.

---------------
##Overview
Constructor | Description | Require
------ | ----------- | --------
[*new* V.Value()](#new-vvalue) | Value is used as a value constructor. | 'value'
___
Methods | Description | Require
------ | ----------- | --------
[._get()]() | Used to get .val which calculates a constructed value. | 'value'
[.update()]() | Fires all listeners. | 'value'
[._update()]() | Extends V.core.object.listen._update to . | 'value'

___
Operators | Description  | Require
------ | ----------- | ---------
[.add]() | Adds a value to another value. | 'value.operators'
[.sub]() | Substracts given value from another value.| 'value.operators'
[.multiply]() | Multiplies value by given value.| 'value.operators'
[.max]() | Limits a value up to given value.| 'value.operators'
[.min]() | Limits a value down to given value.| 'value.operators'
[.transform]() | Transforms value to given value.| 'value.operators'

___
Flags | Description  | Require
------ | ----------- | ---------
[.listen]() | Adds listen properties. | 'value.flags.utils'
[.parent]() | Adds parent inheritence. | 'value.flags.parent'
[.ajax]() | Adds ajax functionality. | 'value.flags.ajax'
[.data]() | Adds data population. | 'value.flags.data'

[Click here for more information on Flags](/vigour/value/flags)

##Using V.Value

Creating a V.Value is easy:
````javascript
var myValue = new V.Value(20);
````
````javascript
//a basic V.Object 
var basicObject = new V.Object('this is basicObject '); 

//an empty V.Value;
var value = new V.Value();

//use the .val getter/setter to set a V.Object, now we link value to the basicObject
value.val = basicObject;

//use set to add an extra field
value.set('add',{
  val:V.app.w,
  multiply:0.1
});

//lets see what we get now, the .val getter calculates the value;
console.log('value:',value.val);

//another value
var halfwidth = new V.Value({
  val:V.app.w,
  multiply:0.5
});
````
