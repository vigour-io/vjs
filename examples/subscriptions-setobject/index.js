var define = Object.defineProperty

var Observable = require('../../lib/observable')

console.log('\n\n-------------- create those things!')

var subsPassonBase = new Observable()
subsPassonBase.$key = 'subsPassonBase'

var subsBase = new Observable()
subsBase.$key = 'subsBase'
subsBase.on(function(){
  console.error('subsBase change fired!')
})

var obs = new Observable({
  key1: 'value1',
  $subscriptions: {
    flapflap: {
      fafafa: function(event, meta){
        console.error('SUBSCRIPTION! fafafa handler function!')
      },
      bla: [
        function(event, meta, passon){
          console.error('SUBSCRIPTION! bla passon', passon.$path)
        },
        subsPassonBase
      ],
      kurkn: subsBase,
      $pattern: {
        $: true
      }
    }
  }
})

console.log('\n\n-------------- go fire dat boy')

obs.$set({
  ha: true
})
