var Http = require('../../../lib/http')

describe('http get', function () {
  this.timeout(5000)

  it('gets data', function (done) {
    var vigourIo = new Http({
      // $hostname:'vigour.io',
      $urlpath: '/',
      $on: {
        $data: function ( event, chunk ) {},
        $end: function ( event, response ) {
          expect(this.$val).ok
          done()
        },
        $error: function ( event, err ) {
          // console.error(err)
        }
      }
    })

    for (var i = 10; i >= 0; i--) {
      vigourIo.$urlpath.$val = i
    }

    done()
  })

})

// describe( 'http request', function() {

// 	var flurps = new Observable(20)

// 	var translations = new Http({
// 		$val: {
// 			$val: language,
// 			$add: '.json'
// 		},
// 		$host: packerDomain,
// 		$headers: {
// 			flurps: blurf
// 		},
// 		$validate: function() {
// 			return typeof this.$val === 'string'
// 		}
// 	})

// 	var dictionary = new Observable( translations.$response )

// 	var flurps = new Observable(20)

// 	var verifyEmail = new Http({
// 		$val: {
// 			$prepend: 'checkEmail/',
// 			$val: emailInput,
// 			$add: '.json'
// 		},
// 		$host: { $config: 'mtvDomain' },
// 		$headers: {
// 			flurps: blurf
// 		},
// 		$response: {
// 			$is: true,
// 			$transform: emailInput
// 		}
// 	})

// 	var email = new Observable( verifyEmail.$response )

// 	var searchQuery = new Observable('hello')

// 	var userToken = new http({
// 		$body: {
// 			$val: user,
// 			$add: {
// 				autmethod: 1
// 			}
// 		},
// 		$headers: {
// 			query: searchQuery
// 		},
// 		$host: { $config: 'mtv-api' },
// 		$path: 'login.json',
// 		$method: 'POST',
// 		$sort: 'a-z',
// 		// $filter: {
// 		// 	name: searchQuery
// 		// }
// 	})

// 	/*
// 		var shows = new Observalbe({
// 			$range: [ 0, range ],
// 			$sort: 'a-z',
// 			$filter: search
// 		})

// 		shows.$val --> is het de parsed result

// 	*/

// 	hub.user.$val = userToken

// // 	this.timeout(5000)

// // 	it('gets data',function(done){

// // 	  var vigourIo = new http.Request({
// // 	  	$params:{
// // 	  		hostname:'vigour.io'
// // 	  	}
// // 	  })

// // 	  vigourIo.$response.on(function(){
// // 	  	expect(this.$val).ok
// // 	  	done()
// // 	  })
// // 	})

// // })

// describe( 'mtv login', function() {

// 	this.timeout(5000)

// 	it('gets token',function(done){

// 	  var auth = new http.Request({
// 	  	$hostname:'http://utt-staging.mtvnn.com',
// 	  	$path:'api/v1/sessions.json',

// 	    $on:{
// 	    	$end:function( event, response ){
// 			  	var token = response.authentication_token
//
// 			  	done()
// 			  	// if(token) this.token.set( token )
// 			  	// else this.emit('$error', event, 'auth: no token')
// 	    	},
// 	    	$data:function( event, chunk ){
// 	    		console.info('data:',chunk.toString())
// 	    	},
// 	    	$error:function( event, err ){
// 	    		console.error(err)
// 	    	}
// 	    },
// 	    // $hostname:'',

// 	  	$params:{
// 		  	path:'http://utt-staging.mtvnn.com/api/v1/sessions.json',
// 		    headers: {
// 			    'Content-Type': 'application/json'
// 		    },
// 		    method: 'POST'
// 	  	},

// 	    $payload:{
// 		    auth_method: 1,
// 		    user: {
// 		      email: 'youri@vigour.io',
// 		      password: 'testtest',
// 		      app_version: 'test'
// 		    }
// 	    }

// 	  })

// 	  auth.token.on(function(){
// 	  	console.info('token:',this.$val)
// 	  	done()
// 	  })
// 	})

// })
