####coding style
We're currently using the coding style of [npm](https://www.npmjs.org/doc/misc/npm-coding-style.html).
We use a few best pratices derived from [airbnb](https://github.com/airbnb/javascript)

**Few exceptions on npm**
We do not indent up until de end of a var/field name, but rather start our object on a new line. Also, you are allowed to write an object on a single line, if this is more clear for the reader.

For example, we write:

#####objects
```javascript
var object =
{ a: 'a'
, b: 
  { c: 'c'
  , d: 'd'
  }
}
```

```javascript
//you may write an object on one line for convienience

app.set
(
  { carousel:new carousel(
    { w: 100
    , h: 300
    , data: 
      [ { css: 'blue', text: 1 } 
      , { css: 'red', text: 2 }
      , { css: 'yellow', text: 3 }
      , { css: 'green', text: 4 }
      , { css: 'orange', text: 5 }
      ]
    })
  }
)
```
Instead of in npm:
```javascript
app.set({
  carousel: new carousel({ w: 100
                        , h: 300
                        , data: [ { css: 'blue' 
                                   , text: 1 
                                   }
                                 , { css: 'red' 
                                   , text: 2 
                                   }
                                 , { css: 'yellow' 
                                   , text: 3 
                                   }
                                 , { css: 'green' 
                                   , text: 4 
                                   }
                                 , { css: 'orange' 
                                   , text: 5 
                                   }
                                 ]
                        })
})
```

#####_this
```javascript
//these cases use the word _this ( no that, no t )
function( val ) {
  var _this = this
  setTimeout( function() { 
    _this.hooray( val ) 
  } )
}
```

#####for loops
```javascript
for( var key in object )
{
  //use key for this variable name
}
```

#####if statement
```javascript
if( something === true )
{
  //camelcase
  doSomething() 
}
else
{
  doSomethingElse()
}
```

#####modules
```javascript
var module = require( './mymodule' )

//this is allowed (overwrites the module /w a function)
module.exports = exports = function() {}
```
common js modules
• try to keep length of modules as short as possible (200-300) lines
• try to keep modules independent of upstream modules

####[docs](docs)

There is not a lot here yet but try to create or update docs whenever you can!
Docs are written in [Markdown Files](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

####comments
Try to write comments as much as possible in the [JSDocs](http://usejsdoc.org/about-getting-started.html) style.

Any thing that has to be done can be written lie
```
//TODO: have to add listener
```

####tests

[tests folder](test)
• node tests for folders in the test/node folder
• browser test using phantomjs for the folders in test/browser 
```
npm test
```

[mocha](https://ci.testling.com/guide/mocha) tets

Use [Travis](https://travis-ci.org/recent) for continious integration

.travis.yml file
```
language: node_js
install: 
  - npm install
node_js:
  - 0.10
```

Can later be replace with [testling](https://ci.testling.com/)  

*note test scripts for the front end have to show the difference in processing time between the last commit*

####dev-tools
We are currently building a tool called [gaston](https://github.com/vigour-io/gaston) makes it easy to build for different devices and adds a pretty solid watch system to browserify projects.

[tools docs section](docs/tools)

###js-hint
use this [.jshintrc file](http://jshint.com/docs/) for linting 
```
{
  "asi": true,
  "bitwise": true,
  "boss": true,
  "debug": true,
  "expr": true,
  "laxbreak": true,
  "laxcomma": true,
  "node": true,
  "maxlen":80
}
```