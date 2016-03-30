//page switcher
var PageSwitcher = new Element(
{ 

})

//usage
// var SecondScreenSwitcher = new PageSwitcher(
// { map:
// 	{ mtvData:
// 		{ shows:
// 			{ $page:awesomeShowPage
// 				$:
//         { $page:awesomeSeasonPage
//         , seasons:
//           { $:
//             { episodes:
//               { $:
//                 { $page:awesomeEpisodePage
//                 }
//               }
//             }
//           }
//         }
// 			}
// 		}
// 	}
// })

var SecondScreenSwitcher = new PageSwitcher(
{ actions://add processes here
  { shows:function(){
      return awesomeOverviewPage
    }
  , show:function(){
      this.add(new awesomeShowPage)
    }
  , seasons:awesomeShowPage
  , episodes:awesomeEpisodePage
  , discover:bla
  , channels:smurk
  }
, transition:function(action){//action === shows, season etc

  }
})

var SecondScreenSwitcher = new PageSwitcher(
{ actions://add processes here
  { shows:
    { val:awesomeShowPage
    , level:1
    }
  , show:
    { val:awesomeShowPage
    , level:2
    }
  , seasons:
    { val:awesomeShowPage
    , level:
      { val: 3
      , phone:2
    }
  , episodes:
    { awesomeEpisodePage
    , level:3
    }
  , discover:
    { val:bla
    , level:1
    }
  , channels:
    { val:smurk
    , level:1
    }
  , channel:
    { val:durf
    , level:2
    }
  }
, transition:function(action){//action === shows, season etc
    
  }
})

//---------------------------------------

var PageSwitcher = new Element()

PageSwitcher.extend(
{ map:function( map ){
    //loop through map add listeners to actions
    for(var field in map){
      var val = map[field].val
      if(val){

      }
    }
  }
, transition:function( val ){
    //add behavior based on map

  }
})

//---------------------------------------

var SecondScreenSwitcher = new PageSwitcher(
{ map:
  [
    { shows:
      { val:addShowOverview
      , params:
        { data:blrk
        }
      , show:
        { val:addShowPage
        , season:
          { val:addShowPage
          , episode:addEpisodePage
          }
        }
      }
    }
  , { channels:
      { val:addChannelOverview
      , channel:addChannelPage
      }
    }
  ]
, transition:
  { val:function(method,direction,params){//direction
      if(direction === 'up'){

      }else if(direction === 'down'){

      }else if(direction === 'left'){
        add(new method(params))//do stuff
        this.on('dataComplete',function(){
          this.current.remove()
        })
      }else if(direction === 'right'){

      }
    }
  }
})

//---------------------------------------

var SecondScreenSwitcher = new PageSwitcher(
{ actions:
, transition:
  { val:function(method,direction,params){//direction

    }
  }
})

//---------------------------------

app.set(
{ switcher:new SecondScreenSwitcher({
    map:
    [ 
      [ 
        { val:ShowOverview
        , listen:shows 
        }
      , { val:ShowPage
        , listen:
          [ show
          , season
          ]
        }
      , { val:EpisodePage
        , listen:shows 
        }
      ]
    , [ 
        { val:ChannelOverview
        , listen:channels 
        }
      , { val:ChannelPage
        , listen:channel
        }
      ]
    ]
  })
})


var Switcher = new Element().Class

Switcher.extend(
{ add:function(element){
    if(this.children[0]) {
      this.children[0].remove()
    }
    Element.base.add.call(this,arguments)
  }
})

app.set(
{ switcher:new Switcher
})

app.switcher.add(new ShowPage)

var UserPageSwitcher = new PageSwitcher(
{ 

})

var MainPageSwitcher = new PageSwitcher(
{

})





