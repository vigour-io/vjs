//on/define
var text = new Obj({
  $name:'$text', //maybelike this?
  $property: {
    get:function(){}
    // $name:'$text'
  },
  $constructor: {

  },
  //overwiting $new
  $new: {
    method: { 
      $flavour: function() {

      } 
    } //hard overwrite
  },
  $children: {
    constructor:'self' //can also pass a function to do custom stuff
    id:'timestamp' //can pass a function
  },
  $parent: { //ook level kunnen aangeven
    $on: {
      //can also flavour here
      remove:function() {

      }
    }
  },
  $on: {
    //this is the same as doing bla.$on = { }
    new:{
      $flavour:function(flavours) {}
    } //dit is hoe een on('xxx') werkt mischien niet flavour maar add push of zoiets
  }
  //val zo?
  $val:function() {
    $property: {
      set: {
        $flavour:function(flavours){}
      },
      get:{
        $flavour:function(flavours){}
      }
    }
  }
})

var speshMethod = new Obj({  
  //can also have property
  $method: {
    //set method handeling
    flavour: function(flavours) {
      //flavour kan ook props hebben op de fucntie handig voor bijvoorbeeld wat nu defer types zijn
      flavours.push( function flavouritTextMethod( returnval, args ) {

      }
    }
  },
  $on: {
    $method: { flavour: function() {
      //dit zou de method extenden op on (dit is wat nu defer is)
    }}
  }
})

//now speshMethod should be executable as a method ? it is possible
//new speshMethod() //then just returns a method
var bla = new speshMethod()

bla('xxxx') //just executes function /w fields

//$add just set $settings of property
bla.$set( ) //normal set no difference second argument is fields

bla.$set( bla, '$texting')

//add can be used for non named things as well
bla.$add( new text.$Constructor({ $name: '$texting' }) )
//add instead of push can choose a type


//use this?
// bla.$addProperty()

//is
//on



//once


