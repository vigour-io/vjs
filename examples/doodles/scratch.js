

//add that it extends both the object and the 'special property'

/*
$extend: {
      value: function( params ) {
        console.log('$extend')
      }
    },

*/

//fix


//$propertyDescriptor

//$property

//$type

//$settings

//$descriptor

//calls extend

//$extendSettings

//just $settings may be enough!

//storing the prototype
  //this is going to be a real challange!!!!


  // .$myPrototype  .$fromPrototype

  //.$myPrototype is the prototype refed to?


  //not everything can be a get set object unfortunately
  //this may fuck up the syntax

  //since 

  //   var obj = { x: 1  }

  /*

    //obj.$constructor

    /*
      function constr() {}
      constr.prototype = obj (if it can somehow follow this were golden)


      but now! how to make a distinction in here?

      var a = new Obj({
        b: {
          text:1,
          add:0,
          dub: {
            val:20,
            add:10
          }
        }
      })

      var $a = new a.$contructor

      $a.b.add = 10


      
      //im settings new filed on an instance
      $a.b.dub.add = 20
    
    
    //since we are reffing from a I want b to become an instance of b from a
    //same for add -- add will get its own value

    //$ means instance
    //* means from prototype directly
    //  nothing means its my own

    //make cache extendable for strings and other things (diff)
  
    -------------------------

    a 
    |--a:'value'
    |--f
    |  +-gurk:'gurky'
    +--b 
       |--text:1
       |--add:0
       +--dub
           |--add:10
           +--val:20

    ---> new a() and then --> $a.b.dub.add = 20 , $a.b.add = 10

    a.$constrcutor.prototype = a
    //so $a.__proto__ = a

    $a
    |--*a:'value'
    |--*f
    |   +--*gurk:'gurky'
    +--$b
      |--*text
      |--add   //also make sytax to detach from the proto
      +--$dub
        |--*val:20
        +--add:20 //part

    -------------------------
    
    var $$a = new $a
    $$a.f.gurk = 'flubber'

    $a.f.gurk.andre ='haha'
    

    //connection from $$a f.gurk is lost to $a.f

    -------------------------

    $$a
     +--$f (from a directly since f is $a *f)
        |
        +--gurk:'flubber'

    -------------------------

    $a.f = 'barf'
    An issue arises here when i change $a f (make it its own instance) will we try to keep $$a connected or not?

    
    






  values can also be streams!!!! (or other vobjects)
  values can be mixed (have a value and fields)
  /*


