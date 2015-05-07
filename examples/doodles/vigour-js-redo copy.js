
Obj = vigour-object

var Bla = new Obj({
  $define: {
    constructorThatIUseForMyChildren: Obj
  },
  $hello: {
    $define: {
      get:function() {
        return 'world'
      },
      set:function(val) {
        alert('cannot do set!')
      }
    }
  },
  $set: {
    $define: {
      method: {
        flavour: function(flavours, stop){
          flavours.push( function(val, args){
            console.log('lol you want to set!')
            stop(this)
          })
        }
      }
    }
  }
}).$Constructor






//null

var x = new Bla({
  $hello: {
    $define: {
      get:{
        flavourBreaker:'stop',
        flavour:function(flavours) {
          flavours.push(function(val) {
            if(val==='world') {
              return val + ' my bitch!'
            }
            return 'stop'
          })
        }
      }
    }
  }
})



/*
Bla.$define({

})
*/



.extend()













var bla = new Obj({
  $define: {
     constructor: Obj //'self' 
  },  
  $shawn: {
     $define: {
       // update:
       get:{ flavourize: function(flavours) {
        flavours.unshift(function(val) {
          return val+ ' blurf'
        })
      } 
      }
    }
  },
  jim: {
    title: 2,
    $type: {
      $on: {
        yuzi  
      }
    }
  },
  blurf: {
    gurk:2  
  },
  $is_active: { //is-active

  }
  xx: {
     $text: {
       $val:234234234,
       $type: {
        set:function() {

        },
        $on: { //just hook into on and adds a 'shared' listener (this will force the current instance to set the requirement for the listener)
          //unify like in events (shared shared shared)
          render:function() {

          }
        }
       }
     }  
  },
  $on: {
    click: function() {

    }
  }
})

var x = new bla.$constructor({
 clurk: 123123
})

$is

var elem = new Element(
{ $on:
  { state:
    { defer:function(){

       }
    }
  },
  jim: {
     $type: {
        onListen: // blurf blurf blurf  
    }
  }
, $text:
  { $val:'normal'
  , is_receiver:'receiver!'
  , $is_receiver:'receiver!'
  , $isReceiver:'receiver!'
  }
})











