try {

var log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

var burk = new Base()

var a = new burk.$Constructor({
  $key:'a',
  bla:true,
  $on: {
    $change:function(event) {
      log('a hello change', this.$path)
    }
    //this has to put it in $val
  }
})

log('a:',a)

console.log(a.$on.$change)

a.$val = 'marcus'

//-------------------------------------------------------------

log('fire a -- with b (new instance) WRONG!')

var b = new a.$Constructor({
  $key:'b',
  $val:'marcus2'
})
//deze is nog helemaal wrong bitches!


log('make c dont fire!')

var c = new a.$Constructor({
  $key:'c',
  $on: {
    $change:function(event) {
      log('c hello change', this.$path)
    }
  },
  $val:'marcus3'
})

console.log(
  'a:',a.$on.$change, 
  'c:',c.$on.$change, 
  'c instanceof a:', c.$on.$change instanceof a.$on.$change.$Constructor
)

log('now fire c')

c.$val = 'marcus'

//-------------------------------------------------------------

log('----object notation---')
console.log('\n\n object')

var gurken = new Base({
  $key:'gurken',
  $on: {
    $change: {
      marcus: function() {
        log('marcus fires', this.$path)
      },
      jim: function() {
        log('jim fires', this.$path)
      }
    }
  }
})

gurken.$val = 'clubs'
console.log(gurken.$on.$change)

log('----new instance, only change jim--- should fire marcus since its not new...')

var blurken = new gurken.$Constructor({
  $key:'blurken',
  $on: {
    $change: {
      jim:function() {
        log('jim 2 fires (only for blurken', this.$path)
      }
    }
  },
  $val:'boeloe'
})

log('----fire both---')

blurken.$val = 'boeloe2'

log('----refs----')

var smurt = new Base({
  $key: 'smurt',
  $val: 'this is smurt!'
})

var glurps = new Base({
  $key:'glurps',
  $val: smurt,
  $on: {
    $change:function() {
      log('glurps update', this.$val, this.$path)
    }
  }
})

// //dit is niet ok als glups een instance is zonder verschil doet ie niks met de listener :/

// log('update gets done since it has a set here...')

// //not when setting change ....

var xx = new glurps.$Constructor({
  $key:'xx', 
  $on: {
    $change: {
      spesh:function() {
        log('im xx SPESH', this.$path)
      }
    }
  }
})

//eerste keer word ie gefired om dat de change vanuit xx komt...

// var xx = new glurps.$Constructor()

log('now fire both!')

console.log(xx.$on.$change === glurps.$on.$change)

smurt.$val = 'mups'

log('now fire both again -- this is where it goes wrong')

smurt.$val = 'mups2'


log('now fire eveything in xx!')

xx.$val = 'xxxx'


// // debugger
// // break;

console.log( 'glurps:', glurps.$on.$change.$onFn, 'xx:',xx.$on.$change.$onFn)
console.log('instanceof', xx.$on.$change instanceof glurps.$on.$change.$Constructor )
console.log('instanceof onFn', xx.$on.$change.$onFn instanceof glurps.$on.$change.$onFn.$Constructor )

console.log( glurps.$on._instances )

console.log('LISTENS?', glurps)

log('----bound----')

var blups = new Base({
  $key: 'blups',
  $val: 'this is blups!'
})

var blups2 = new Base({
  $key:'blups2',
  $on: {
    $change: {
      bindit: [ 
        function( event, meta, base, str, str2 ) {
          //this is blups
          //when blups gets removed will remove this listener
          // str = gurken
          // str2 = gurken
          log(
            'OK I CHANGE THE BINDIT!', 
            'bound2:', 
             this.$path, 
             base.$path,
             'event:', 
             event, 
             'args:', 
             str, 
             str2 
           )
        }, 
        blups, 
        'gurken', 
        'marcus' 
      ]
    }
  }
})

blups2.$val = 'xxxxx'

} catch(e) {
  console.error(e.stack)
}

