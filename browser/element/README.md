#V.Element
####V.Elements are used to create visual objects. V.Element is an extension of [V.Base](../../core/base). This means it inherits all attributes of Base, but we've added specific functionalities we want to see in our visual elements.
---------------
Constructor | Description| Require
------ | -----------| -----
[_new_ V.Element()](#new-velement) | Element is used as a _element_ class constructor.| 'element'
[_new_ .Class()](#new-class) | Creates instance of class. | 'element'
___
Methods | Description| Require
------ | -----------| -----
[.set()](#set) | Sets properties defined in the element. | 'element'
[.remove()](#remove) | Removes this element.| 'element'
[.add()](#add) | Add element as child.| 'element'
[.empty()](#empty) | Removes all children.| 'element'
[._set()](#_set) | Adds children for non existing attributes.| 'element.set'
[.convert()](#empty) | For each field in val convert back to a setObject.| 'element.set'
___
Attributes | Description | Require
------ | ----------- | -----
[.node]() | Defines type of *node object* for element. | 'element'
[.name]() | Makes it possible to reference a child by name. | 'element'
[.parent]() | Returns parent base element. | 'element'
[.children]() | Returns childNodes /w base classes. | 'element'
[.css]() | Sets I class of an element.| 'element'
[.events]() | Sets I class of an element.| 'element.events'
___
Properties | Description | Require
------ | ----------- | -----
[.x]() | Defines *x* position, relative from parent [0,0].| 'element.properties'
[.y]() | Defines *y* position, relative from parent [0,0].| 'element.properties'
[.w]() | Defines *width* of element.| 'element.properties'
[.h]() | Defines *height* of element.| 'element.properties'
[.position]() | Defines *position* property of element.| 'element.properties'
[.relative]() | Checks if element is postitioned relative. Returns true of false.| 'element.properties'
[.rotate]() | Rotates element. Uses 360 degrees.| 'element.properties'
[.scale]() | Scales element.| 'element.properties'
[.src]() | Define *src* of element node.| 'element.properties'
[.background]() | Defines *background* of element.| 'element.properties'
[.padding]() | Defines *padding* of element.| 'element.properties'
[.display]() | Defines *display* of element.| 'element.properties'
[.opacity]() | Defines *opacity* of element.| 'element.properties'
[.html]() | Defines if element uses *innerHTML*.| 'element.properties'
[.href]() | Defines *href* of element.| 'element.properties'
[.text]() | Defines *text* of element.| 'element.properties'
[.rendered]() | Checks if the object is rendered.| 'element.properties'

### *new* V.Element( [*obj*] )

Base is used as a class constructor.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
obj | Object | |Start value for new V.Element.

```javascript
var littleBox = new V.Element({
  w:100, // sets width 100px
  h:100, // sets height 100px
  css:'box-with-borders' // sets css class 'box-with-borders'
});
```
### .set( *val* )

Sets properties defined in the element.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | Object or String | | Object defining properties and childnodes, or string that specifies the type of element to be created.
```javascript
var littleBox = new V.Element();

littleBox.set({
  w:100, // sets width 100px
  h:100, // sets height 100px
  css:'box-with-borders' // sets css class 'box-with-borders'
});
```

### .remove( [*param*] )

Removes this element.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
param | Boolean | - | If param, doesn't remove node from parent

```javascript
var littleBox = new V.Element();

littleBox.remove();
```

### .add( *val* )

Add element as child.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
val | Object | - | Object to be added

```javascript
var myLittleFinger = new V.Element(),
myHand = new V.Element();

myHand.add(myLittleFinger);
```

### .empty( [*instances*] )

Removes all children.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
instances | Boolean | false | Instances true will remove all instances of children removed.

```javascript
var myObject = new V.Element({
	myChildren:true
});

myObject.empty()
```
