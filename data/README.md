#V / Data
Using V.Data enables smart data population, by introducing a *data* flag for [`V.Values`](../value), collection attribute for V.Elements and the addition of the [`model`](#model) attribute. 
___
**Examples**
[basic](../../examples/data-basic), 
[high load](../../examples/data), 
[model and switch](../../examples/data-switch)
___

````javascript
    V.app = new V.Element({node:document.body});

    V.testdata = new V.Data({
	  field:'this is clearly a field'
	});
    
    V.app.add(new V.Element({
      data:V.testdata,
      text:{data:'field'},
      w:100,
      h:100,
      css:'thing'
    }));
    
    V.testdata.val = {'field':'hello world'};
````
#Model
Model is an attribute added to [`V.Base`](../core/base) by using V.data.base.extend
It is a decriptor for data bindings, it can also be used to add [`V.Elements`](../browser/element) on certain types of data

Attribute | Description
------- | ---------
.parse | Define your function to perform on the moment data is attached to a base class.
.ref | Select a specific field from the datamodel.
````javascript
var data = new V.Data({
 photo:{
  title:'hello',
  url:'1.jpg'
 }
});

var elem = new V.Element({
 model: {
    //when the field photo is there add a photo element
 	photo: new V.Element({
	   node:'img',
	   'src.data':'img'
	})
 }
});

````
For more info see [model and switch](../../examples/data-switch)

#Data in V.Value
The data flag allows you to bind data to specific properties in [`V.Objects`](../core/object). Find more information about the data flag in [Flags](../value/flags).
````javascript
var infoData = new V.Data({
  description:'hello world',
  rating:8,
  author:'Peter'
});

var infoBlock = new V.Element({
  h:100,
  w:100,
  data:'infoData',
  description:{
    text:{
	  data:'description'
	}
  },
  rating:{
    text:{
	  data:'rating'
	}
  },
  author:{
    text:{
	  data:'author'
	}
  }
});
````
Using 'dot.notation' we can also rewrite `infoBlock` as follows:
````javascript
var infoBlock = new V.Element({
  h:100,
  w:100,
  data:'infoData',
  'description.text.data:'description',
  'rating.text.data:'rating',
  'author.text.data:'author'
});
````

#Collection
Collection allows you to populate multiple elements with data.
````javascript
var data = {
	array:['one','two','three','four']
};
//note that you can also use non V.Objects , this will not propogate updates however!

var countList = new V.Element({
  node:'ul',
  h:500,
  w:200,
  data:data, //attaches the data variable to countlist
  collection: {
    data:'array', //same as a normal data flag will use data.array
	element:new V.Element({ //this element will be repeated
		node:'li', 
		text.data:true 
	})
  }
});
````
for more information see the [getting started guide](http://vigour.io/#getting+started) or check the [high load example](../../examples/data) (10k nodes with binded data) 

#V.Data
V.Data is an extended [`V.Object`](../core/object) and pretty similair in use, it does add an update guard
####Using the V.Data object.
Constructor | Description
------ | -----------
[*new* V.Data()](#new-vdata) | Data is used as a data object constructor.

