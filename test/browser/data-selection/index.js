require('../style.less')

var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , Data = require('../../../data')
      .inject('../../../data/selection')

window.Data = Data
var kurk = new Data(
  [ 
    { data: {category: 'outgoing'} }
    // { burk: 5 }
  // ,  { data: {category: 'outgoing'} }
  // , { burk: 5 }
  , {
      "t": 0,
      "data": {
        "folder": "b",
        "file": "three",
        "client": "V_9fzzk1pukss",
        "category": "outgoing",
        "eventName": "connect",
        "data": true,
        "matched": true
      }
    }
  , {
      "t": 106,
      "data": {
        "folder": "b",
        "file": "three",
        "client": "V_9fzzk1pukss",
        "category": "outgoing",
        "eventName": "sub",
        "data": {
          "fields": {
            "mtvData": {
              "NL": {
                "en": {
                  "terms": {
                    "list": {
                      "0": {
                        "text": true
                      }
                    }
                  }
                }
              }
            }
          },
          "hash": "1sgxaaz"
        },
        "matched": true
      }
    }
  , {
      "t": 6014,
      "data": {
        "folder": "a",
        "file": "two",
        "client": "V_aoryt67fjg4",
        "category": "incoming",
        "eventName": "set",
        "data": {
          "s": {
            "mtvData": {
              "NL": {
                "en": {
                  "about": {
                    "list": {
                      "0": {
                        "img": "cfacc8a670729a173ab52367f6ea114f"
                      }
                    }
                  }
                }
              }
            }
          },
          "v": [
            "ryen71",
            {
              "ip-172-30-0-92-31847": 1417526241999
            }
          ]
        }
      }
    }
])

var turk = new Data({hey:true})
var bur = window.bur = new Data({
  laf:{hey:true},
  turk: turk,
  waf:{hey:false}
})

var sel2 = new Data(bur, {condition:{hey:true}})

console.log('<><<<<<<<<<<<<<<', sel2.raw)
window.sel2 = sel2

var selection = new Data(kurk, 
  { 
    condition: 
    { 
      data:{data:true}
    //   $or:
    //   [ { data:
    //       { data:{s:{$exists:true}}
    //       , eventName: 'set'
    //       }
    //     }
    //   , { t: {$lt:106}}
    //   ]
    // , $not:{data:{eventName:'connect'}}
    }
    
    // condition: {data:{data:{s:{$exists:true}}}}
  
  }
)

console.log('SEL',selection.length)

console.log('SELRAW', selection.raw)

window.s = selection