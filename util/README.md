#V / util

In this section we define our utilities which we use internally throughout the framework.

-------------------------

#Overview
Methods | Description | Require
------ | ----------- | --------
[V.arg()](#varg) | Pass arguments (arguments) and return a new array, when index return a new array sliced from index. | 'util'
[V.util.checkArray()](#vutilcheckArray) | Finds items in an array. | 'util'
[V.util.add()](#vutiladd) | Add is similar to .push it returns the array instead of length. | 'util'
[V.util.empty()](#vutilempty) | Check if obj is empty exclude field names passed to list. | 'util'
[V.util.object.set()](#vutilobjectset) | Used to set a val to an field on a object, whether it is a [`V.Object`](../core/object) or a regular object. | 'util.object'
[V.util.object.path()](#vutilobjectpath) |Returns object on the end of a defined path. | 'util.object'
[V.util.object.dotField()](#vutilobjectdotField) | Adds path using 'dot-notation'. | 'util.object'
[V.util.object.compareArrays()](#vutilobjectcompareArrays) | Checks if two lists contain identical content. | 'util.object'
[V.util.object.get()](#vutilobjectget) | Gets object from specified path. | 'util.object'
[V.util.object.isObj()](#vutilobjectisObj) | Returns true if an object is an instance of an object and not a function, [`V.Object`](../core/object) or [`V.Base`](../core/base). | 'util.object'
[V.util.object.clone()](#vutilobjectclone) | Creates new object with the same value, takes custom objects into account ([new obj.constructor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)). | 'util.object'
[V.util.object.include()](#vutilobjectinclude) |Adds value to array if it is not contained in array, executes handler on encountering val in array. | 'util.object'
[V.util.object.raw()](#vutilobjectraw) |Ensures a value is not or contains no [`V.Objects`](../core/object), only their "raw" versions. | 'util.object'
[V.util.prop.setstore()](#vutilpropsetstore) |If no setstore, creates a setstore object. | 'util.prop'
[V.util.prop.add()](#vutilpropadd) |Add is used as a shortcut method for [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) and extends setstore functionality to normal prototypes. | 'util.prop'



___
||Modules|Description|
|------ | ------- | ------- |
|**Util**|util.js|Basic utilities such as .empty and .checkArray
||prop.js|Wrapper for [Object.defineproperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty), adds setstore objects
||test.js|Test performance, memory and generate test text
||object.js|Object utilties such as get by path
___
### V.arg( *args*, *index* )
Pass arguments (arguments) and return a new array, when index return a new array sliced from index.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
args | Arguments  | | Arguments.
index | int  | 0 | When index return a new array sliced from index.

### V.util.checkArray( *list*, *val*, [*index*], [*field*] )
Finds items in an array.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
list | Object or Array  |  | Defines the list where you want to search through, only uses .length field.
val | Object | | Defines the value you want to search for.
index*| Boolean, String or Number | | When index is true return the index instead of true or false, when index and index !== true index is used as a field in objects in the array.
field*| String | | When field return field instead of index or true.

### V.util.add( *obj*, *add* )
Add is similar to .push it returns the array instead of length.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Array  | | Target.
add | Object  | | Object to add.

### V.util.empty()
Check if obj is empty exclude field names passed to list. Returns true/false.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object  | | Object.
list | Object  | | Object to add.

### V.util.object.set( *obj*, *field*, *val* )
Used to set a val to an field on a object, whether it is a V.Object or a regular object.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object  | | Defines target Object.
field | String | | Target field.
val | any | | Value to set.

### V.util.object.path( *obj*, *path*, [*val*], [*overwrite*], [*writeHandler*], [*noupdate*], [*self*], [*i*] )
Returns object on the end of a defined path.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object  | |  Object to search.
path | Array | | Array of fields in path.
val | any | | Value to set.
overwrite | Boolean | | If true, val WILL overwrite existing value on endpoint of path when already defined.
writeHandler | function() | | Callback on write.
noupdate | Boolean | |  When true, updates will be skipped on write.
self | Boolean | | When true does not call .from in [`V.Objects`](../core/object)
i | int | 0 | Starting point for searching through path.

### V.util.object.dotField( *obj*, *field* )
Adds path using 'dot-notation'.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object  | |  Object where field will be added.
field | String | | String using 'dot-notation'.

````javascript
var myObject = {};

V.util.object.dotField(myObject,'d.a.s'); // returns myObject:{d:{a:{s:{}}}}
````
### V.util.object.compareArrays( *a*, *b* )
Checks if two lists contain identical content.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
a | Array or Object  | |  Takes any object with .length.
b | Array or Object | | Takes any object with .length.

### V.util.object.get( *obj* , *path*, [*self*] )
Gets object from specified path. When path is a string checks for 'dotnotation'.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object  | |  Defines object or V.Value.
path | String or Array | | When String, defines field. If Array or 'dot-notation' defines path.
self | Boolean | | When true does not call .from in [`V.Objects`](../core/object)

### V.util.object.isObj( *obj* )
Returns true if an object is an instance of an object and not a function , V.Object or V.Base.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object  | |  Defines object or V.Value.

### V.util.object.clone( *obj* )
Creates new object with the same value , takes custom objects into account ([new obj.constructor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)).

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object  | |  Object to clone.

### V.util.object.merge( *a*, *b* )
Merges object b into object a and returns object a.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
a | Object  | |  Object a.
b | Object  | |  Object b.

### V.util.object.include( *obj*, *val*, [*handler*] )
Adds value to array if it is not contained in array, executes handler on encountering val in array.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object and Array  | |  Takes any object with .length.
val | any  | |  Value to add.
handler* | function() | | Function to execute on encountering val in array.

### V.util.object.raw( *val*, *rparams* )
Ensures a value is not or contains no V.Objects, only their "raw" versions
! This needs to be unified with convert, or at least get a better name.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | any | |  The value to be processed.
rparams | Object | |  Params.

### V.util.prop.setstore()
If no setstore, creates a setstore object.

### V.util.prop.add( *obj*, *name*, *val*, [*set*], [*get*] )
Add is used as a shortcut method for Object.defineProperty and extends setstore functionality to normal prototypes.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object  | |  When obj is a constructor it selects obj.prototype, when obj is a normal object this is used instead.
name | String or Array  | |  When name is a string it adds the name for the object, when name is a array do the same setting for each name.
val | Object or function() | | When val is an object , use this object for Object.defineProperty with default for enummerable:false, when object is empty adds {value:{},ennumerable:false}, when val is a function it automatically wraps a property definition object with {value: val , enummerable:false}, when val is not a function and not an object (boolean, string, number) adds special setstore value.
set* | function() | |  Adds custom setters to a setstore object, when set is a string the add functions interprets the arguments as name : property definition pairs.
get* | function() | |  Adds custom getters to a setstore object.

### V.util.test( *params*, *fn* )
Used for testing performance.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
params | any | |  Parameters.
fn | function() | |  Function to pass.
