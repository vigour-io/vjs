#V.Base
V.Base is a constructor object, from which we create classes such as [V.Element](../browser/element). V.Base has everything you need to create your own base classes using [.extend()](#extend).

---------------
Constructor | Description
------ | -----------
[_new_ V.Base()](#new-vbase) | Base is used as a class constructor.
[_new_ .Class()](#new-class) | Creates instance of class.
___
Methods | Description
------ | -----------
[.set()](#set) | Sets properties defined in an object.
[.remove()](#remove) | Removes this _base_. Also removes all listeners added to extensions.
[.extend()](#extend) | Extend is used to add properties and methods to base.
[.eachInstance()](#eachInstance) | Extend is used to add properties and methods to base.
[.addSetting()](#addSetting) | Add setting to instances of _base_.
[.setSetting()](#setSetting) | Sets a setting on _base_.
[.removeSetting()](#removeSetting) | Removes setting from _base_.
[.setting()](#setting) | Checks if object has settings and executes them.
___
Properties | Description
------ | -----------
defaultType | When a _base_ is extended without defining the type this is the default type.

### _new_ V.Base( [*val*] )

Base is used as a class constructor.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | any | - |Start value for new V.Base.

```javascript
var mammal = new V.Base({
  warmblooded:true
});
```

### _new_ .Class( [*val*] )

Creates instance of class. If target is not a class, it creates a class.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | any | - | Value to add or modify on instance

```javascript
var human = new mammal.Class({
  legs:2,
  arms:2
});

var Peter = new human.Class({
  likes: 'food'
});
```

### .set( *val*, [*params*], [*noset*] )

Sets properties defined in an object. Returns itself for chaining.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | any  | - | Value to set on _base_
params | any  | - | Parameters to be passed.
noset | Boolean  | false  | When true returns a parsed val object but doesn't perform _set()_ on object

```javascript
Peter.set({
  sleepy:true
});
```
### .remove( [*instances*], [*fromremove*], [*params*] )

Removes this _base_. Also removes all listeners added to extensions.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
instances | Boolean  | false | Instances true will remove all instances as well.
fromremove | Boolean  | - | Description to be added.
params | any  | - | Parameters to be passed.

```javascript
Peter.remove()
```
### .extend( *settings*, *set*, [*type*], [*new*], [*remove*] )

Extend is used to add properties and methods to base.

Argument | Option | Type | Default | Description
------ | ---- | ------- | ----------- | -----------
settings |name | Object | - | Define the name of the property
||set| function()  | - | Defines function to be called when setting property on instances of _base_.
||type| String | false | Define the type of object, e.g. _V.Value_, set type to false if you want to use standard [defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).
||new| function()  | - | Define a function on creation of property.
||remove| function()  | - | Define a function on remove.

```javascript
var mammal = new V.Base();

mammal.extend({
  name:'sayThis',
  set:function(val){
    console.log('I\'m saying ',val);
  }
});

var human = new mammal.Class({
  sayThis:'hello world'
}); // returns 'I'm saying hello world'

var Peter = new human.Class({
  sayThis:'Hi, I\'m Peter'
}); // returns 'I'm saying Hi, I'm Peter'
```
      
### .eachInstance( *fn*, [*field*], [*val*], [*p*]  )

Perform certain function on each field.

Argument | Type | Default | Description
------ | ------- | ----------- | -----------
fn | function() | - | Function to be performed on each instance.
field | String | - | Define _instance_ field to match _base_ field.
val | any | - | 
p | any | - | 

```javascript
var myClass = new V.Base();
var myFunction = function(){
  console.log('I\'m an instance! ',this);
};

var firstInstance = new myClass.Class({
  a:'foo'
});

var secondInstanceTwo = new myClass.Class({
  b:'bar'
});

myClass.eachInstance(myFunction);
//returns I'm an instance!  _class {a: "foo", _from: function, __: null, _: Object}
//returns I'm an instance!  _class {b: "bar", _from: function, __: null, _: Object}
```  
### .addSetting( *name* )

Add setting to instances of _base_, settings only work for instances of the added _basesettings_.

Argument | Type | Default | Description
------ | ------- | ----------- | -----------
name | String | - | Name of the new setting.

```javascript
this.myBase.addSetting('mySetting');
```
### .setSetting( *setObject* )

Sets a setting on _base_.

Argument | Option | Type | Default | Description
------ | ------ | ------- | ----------- | -----------
setObject | name | String | | Name of the setting.
| | [method name] | function() | - | Function to be performed on each instance.

```javascript
this.myBase.setSetting({
  name:'mySetting',
  remove:function(val){
    console.log('hello ', val);
  }
});
```
### .removeSetting( *name*, [*settings*] )

Removes setting from _base_.

Argument  | Type | Default | Description
------ | ------- | ----------- | -----------
name | String | - | Name of the _base property_ to remove the setting from.
settings | String or Array | - | Name of the setting or Array of names.

```javascript
this.myBase.removeSetting('myProperty',['firstSetting','secondSetting']);
```
### .setting( *name*, [*arg*] )

Checks if object has settings and executes them. Arguments are passed to settings.

Argument  | Type | Default | Description
------ | ------- | ----------- | -----------
name | String | - | Name of the setting.
[arg] | arguments | - | Arguments to pass to settings.

```javascript
this.myBase.setting('mySetting',arguments);
```
