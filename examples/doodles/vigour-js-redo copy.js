var bla = new Obj({
  $type: {
     constructor: Obj //'self' 
  },  
  $shawn: {
     $type: {
      $get:{ flavourize: function(inherits) {
        inherits.unshift(function(val) {
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











