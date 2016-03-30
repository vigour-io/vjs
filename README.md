[![Bird](https://magnum.travis-ci.com/vigour-io/vigour-js.svg?token=qw5Jm5vzFGEcygY783sE)](https://magnum.travis-ci.com/vigour-io/vigour-js)
####vigour-js, a javascript framework created and used by Vigour
--------------

##What is vigour-js?

vigour-js is a libary used to create front-ends or backends that are reactive using observable objects. It also adds some neat optimization tricks to deliver close to native perfomance for front end js applications

• It's small , about 15kb gzipped (with no dependencies) for most of the functionality in the browser

• It's fast eveything has been profiled and we got some pretty amazing results for annoying tasks like rendering thousands of elements or handeling 100 updates per second per client on a server

• Sync objects and bind data with minimal effort.

• Make working with different devices a breeze, using ‘cases’ a similar system to media queries but fully implemented in Javascript. Possible to test most of your code in a browser.

• vigour-js is build from the ground up as contained modules using **[browserify](http://browserify.org/)** , large parts of the functionality can be used separately. Use in node with no effort at all

* Web site: http://vigour.io
* Getting Started: http://vigour.io/#getting+started

##What are the building blocks?

**[base](/base)**
Our base object, from which we create all our Class oriented objects, such as [element](/browser/element). Use [.extend](/base#extend) to add special properties to base classes.

**[element](/browser/element)**
Used to create visual objects. element is an extension of [base](/base). This means it inherits all attributes of [base](/base), but we've added some functionalities taht are nice to have in the browser.

**[object](/object)**
Used instead of normal objects in vigour-js. Listeners are automatically added and removed.
We tried to make it as easy as possible with just plain js to have [observable objects](http://en.wikipedia.org/wiki/Observer_pattern)

**[value](/value)**
A specific type of object that can use functions to return values, also has some neat  things like custom [operators](/value/#operators). 

**[data](/data)**
Used to populate objects with data. Used for data that has to be synced from and to a server and has to be queried, selected, etc.

### Examples
-------------------------
-------------------------
[Objects](/object)

```javascript
var object = require('vigour-js/object')
  , a = new object(20)
  , b = new object(a)

b.addListener(function() {
  console.log('update b!')
})

a.val = 300 //this will update b
```

-------------------------
[Base](vigour/core/base)

```javascript
var base = require('vigour-js/base')
  , a = new base()

a.extend({
  name:'thingy',
  set:function(val) {
    console.log('set my thingy with',val)
  }
})

var b = new a.Class({
  thingy:'boing'
})

var c = new b.Class();
console.log(c.thingy.val)
//this will log boing since c inherited the thingy of b
```
