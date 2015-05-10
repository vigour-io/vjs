
first few things

----------------

$method
//methods zijn nu ook overal supported

$property
	$name ( dit wordt alleen geused voor props of toch niet... )

$parent  ( dit is de accessor property --- waar stel je zelf dingen in voor, kan ook  ) op default probeerd fields te vinden oneindig ver naar boven?
//methods zijn ofc different

//_parent of ander woord voor parent e.g. $ (ook handig in paths)

$children
$new ( method will be called on new constructor )
$add ( same as current set except you dont need to add a field (you can use id generators as well e.g. for arrays))
$remove

$on ( dit is het moeilijkst moet nadenken over custom event listener etc ) //zit alles hieraan ook de updatre functie voor het ding zelf?
//e.g. on(change) dit is waar updates voor values gehandled zouden worden
//werkt niet met instances
//maybe met defers? of een nested property in on -- waar dit ok voor kunnen gebruiken?
//of nog een update maken die voor on wordt gecalled?
//omdat on een method is waar je in pricnipe iets aan mee kan geven

$Constructor - creates a constructor

$set ( set function different then now! )
$val ( extension op val? kan gewoon hier )
$type ( array, obj, val, reference )

$data //extension voor vobj (different op element? ) --- nee!
//mischien data helemaal weg? maar gewoon fields: 'xxx' supporten dan is het meteen een stuk duidelijker
//weg met data? alles is data in principe vervangen met $parent
 
----------------

//$parent is het de parent descriptor in object

//$realParent think about this name mischien korter? e.g. '_.data.post'

$field:  //zo bind je iets wat er nog niet is (erg handig voor dingen als data)

//path notitatie support ook $parent

elem --

CASES en flags

	//elke property die je set met parent word voor added gelistened zo is het lekker centraal
	
	//parent is eigenlijk de vervanging voor data -- subscriptions werken met add listeners zoals eerst
	//model word uitgelzen met parent
	//maak toch niet 


	cases -- grote verschil word dat ze vannuit de origin komen
		flavour op set -- gebruikt global maar global word overwritten door local cases (somehwere in the obj, zelfde als data wat nu dus meer 'field' word op parent)

	flags gaan weg 

on op nested fields werkt zoals zoals on -- als je geintereseerd bent in een field wat er nog niet is ?

on op een field wat er niet is altijd de get way?
minder listeners -- niet voor elk field -- hoe doe je dit efficient is het ene listener in parent?

DATA ( what to do? )

PROPS ( vervanging van on )

DEFER ? een update of on handler

	todo today

new require, everything movable

extenden maar niet adden? zou mogelijk moeten zijn -- opgelost door gewoon te knallen met het proto ? (e.g. heb gene text nodig dus niet erop)
//sowieso worden alle props veel meer injectable


on uitbreiden --

mischien $field in $

what about replacing flavour with somwthing else? and make it the default for certain props and types to flavour it
e.g. event listeners


$on(method) <--- 

$on('success', val) //merges the obj? is success a vobj? may make things heavy!

$on('error', val )

//all things have a then interface

then:function() {
	//do something
}


var elem = new Element({
	$on: {
		render:{
			$text.$link.$find: 'textData'
		},
		parent: {
			$rotate:180
		}
	}
})

	//parent is zoals checkparent true (maar dan met listeners)

	//kan ook $origin (doet hetzelfde als fields niet bestaat)

  '$text.$parent.textDatas.$is.$loaded.$parent.$text.$add': ' it is def loaded!' ,
} 

//refers to the first this in the listener chain here that is text
//could also think of a word for this e.g. $requestMaker (here that is $text) this can also be adjustable

//onNextTick ( no raf time)
//nextTick (raf time)
//after
//this kind of stuff to make it go smoother

$on()

//though choice but on is and once should return an event field value

bla.$link.parent.is.rendered.$link.dataX.is.loaded(function() {

})

bla.$link.parent.is.rendered.$link.dataX.is.loaded.then(function() {
	
})

//what todo with flavours and inheritance e.g. like this
var a = new obj({
	set: {
		flavour:{
			function(flavi) {
				//for now flavour is just handled as an object -- push etc
				//if you want to bawler 
				flavi.unshift(fn)
			}
		}
	}
})

obj.set({
	$set: {
		//upgrade:false -- does not upgrade inherited props on extra flavours
		method: {
			flavour:{
				//applied to all instances of current flavours that have set
				function(flavi) {
					var index
					for(var i in this.flavours) {
						if(this.flavours[i] === obj.set.flavours[0]) {
							index = i
							break
						}
					}
					//for now flavour is just handled as an object -- push etc
					//if you want to bawler 
					//if overwritten does not do anything with the inherited flavour , then its disconnected
					_.insertBefore( flavi, index, function() {
						//flavour is now fixed that it will go before obj flavours but after any extended flavour on set
					})
					// flavi.unshift(fn)
				}
			}
		}
	}
})


//flavourized arrays zijn losse arrays met refs naar origins zodat order bwaard blijft e.g. je hebt een before gedaan in de a extension?

// obj.set({
// 	set: {
// 		flavour: {
// 			on:{ val:function() {

// 			},order:2} //overwrites on? / id? fucked up....
// 		}
// })

//

bla
	.$link.parent.is.rendered
		.$link.dataX.is.loaded //link to $parent (dataX.parent)
			.parent.$set({ jeeIamLoaded: 20 })
			//.caller werkt hier heel chill als je bla wil changen

// ---------

bla
	.link.parent.is.rendered //link just ads listeners for the field
		.link.dataX.is.loaded //link to $parent (dataX.parent)
			.caller.set({ opacity: 1 })


{
	video: {
		parent:{
			is:{
				rendered: function() {

				}
			},
			on: {
				removed: function() {

				}
			}
		},
		src: {
			on: {
				change: function() {

				}
			}
		}
	}
}

bla.on('click', function(){

})

//is the same as

bla.set({
	on:{
		click:function() {

		}
	},
	blarf: { //only stores it once in the proto so no prob!
		on: {
			change: function() {

			}
		}
	}
})

//mischien toch alleen predefine in on (anders is het een field listener)
bla.on.click.$val = function() {

}

//all methods (or as many as possible accept paths e.g. remove)
//----------this is pretty weird--------------

//clear functionality
//event  new Event({

vObj.$extend({
	$add:{
		$call:'parent',
		method: { //override
			function(method) {
				
			}
		}
	},
	remove: {
		method:function() {
			//do we create remove info -- events
		}
	}
})

//dit is on
var Dispatcher = new vObj({
	$update: {
		$call:'parent',
		method: function(e) {

			//hier kunnen allemaal guards in etc
			//all fields non-enum
			//keys is going to be managed smartly
			for(var key$ in this) {
				//check for different types of listeners
				if(!this[key$]._call) {
					this[key$]._call = this
					this[key$](this[key$])
					this[key$]._call = null
				}
				//if .$update call that
				//?if promise start executing and remove?
			}
		}
	},
	$add:{
		method: { //override
			function(method) {
				//when doing add an instance has to be created
				//if method
				//else make a key?
				this[this.length]=method
			}
		}
	},
	$remove:{
		method:{
			flavour:function(flavours) {
				flavours.unshift(function(args) {
					if(args[0]) {
						//tirnkle down remove info as an event?
						//if args[0] == method remove a method from the array etc
					}
					//if special method remove listener
				})
			}
		}
	}
}).$Constructor
//deze moet wel basis blijven



//event will take care of updating on on anythign its listening on? perhaps not...
//on extension (is een module)
vObj.$extend({
	on: {
		children:{
			//by default Event listens to values
			constructor: Dispatcher,
			//upgrade:true -- this creates new and upgrades choldren when  constructor is changed
			//add when construcor gets changed change all things that are now using the default -- is this nessecary?
			$call:'parent.parent' //child.parent = on child.parent.parent = 'vobj'
		},
		$val: {
			property: {
				get:null, //clear getter
				value:'change'
			}
		},
		method:function(set, method) {

			//if not myself instance has to be created

			//if set method listen on all?

			/*
			if(this.$fromClass!==this.$call) {
				//do funky stuff! find unification for this
				//since when add gets called it needs to make its own mofo from the event
			}
			*/

			if(typeof set === 'string') {
				// if( !this[set] ) { //this is optimized what abotu using .get?
				// 	this.$set(set,true) //true makes it a defualt
				// }
				//this.set is an obj
				//make my own
				this.$get(set,[]).add( method )
				return null //break it
			} else if(typeof set === 'function') {
				this.$get(this.$val,[]).add( set ) //maybe rename change to set ? and then add a change event later?

				return null //break it
			}
			//if set is object do obj if method do .on('string', method)
		},
		property: {
			//a set is whats called on a .set (also for methods by default)
			set:function(obj) {
				//this is a good distinction for obj or method calls
				if(!obj) return null
				//can also do error messaging that can get parsed for production
				for(var key$ in obj) {
					this.on.method(key$, obj)
				}
			}
		}
	},
	$update: {
		$call:'parent',
		method:function() {
			if(this.on.length) {
				for(var key$ in this.on) {
					if(this[key$].method) {
						this[key$].$update()
					}
				}
			}
		}
	}
})

// this is a remove extension on on

var Event = function(){}
//this is a very basic construction only used for things as stamp info etc
//dont want to make a vobj for overhead

//prob define a bunch or properties e.g. stamp get made when used first time
//is that possible? for most things it should be e.g. $origin

// on change
vObj.$extend({
	on: {
		change:{
			//hier kunnen allemaal guards in etc
		},
		remove:{}
	},
	remove:{
		method:{
			$flavour:function() {
				if(this.on.remove) {
					this.on.remove.$update()
				}				
			}
		}
	},
	$set:{
		method:{
			$flavour:function(val, field, event) {
				if(this.on.change) {
					//hier info object erbij als dit is een orignator
					if(!event) {
						event = new Event()
						event.$origin = this
					}
					//ignore update super important!
					this.on.change.$update(event)
				}				
			}
		}
	}
})

//zometeen de listener handler binnen een event en het verschil tussen rendered en niet rendered

/*
	var Element = new vObj({
		

	})
*/


/*{
	on: {
		drag: new DomEvent()
	}


/*}


//elem.on.set(new Event(), 'drag')

// })

//$val should just be 

//will do the same as
bla.on.drag(function() {

})

bla.on.drag.$val = function(e) {
	//e has the caller , origin etc
	//events, the default children of on have special behaviour
	//setting will add somehting to an array
	//array are the listeners
	//
	//caller would be bla in this case (special setting in on and nested events)
}

//which is the same as
bla.on.drag.set(function())

//which is the same as

bla.on.drag.add(function(){

})
//----------this is pretty weird--------------


//is this hier de parent of bla?
bla.on.parent.$val = {
	$parent: {
		opacity:0.5
	},
	x:20,
	rotate:{ val:180, animate:true }
}

new bla.$Constructor({
	'on.parent.$parent.opacity':null //remove opacity from parent and revert to default
})

//granular changes in listeners


//predefined events all have getters (shared anyway) so you can rly o stuff like
// typing

bla.is.removed.$val(function() {
	this.clearTimeout
}) //all setters can be made avaible as methods as well

//dit zou heel sick zijn -- time erin
//if clearTimeout is a method this works

bla.is.removed.$val = { clearTimeout : true }

//ofc also possible todo
bla.is('removed', function() {

}).then(function() {

})


//uitwerken conditions!












//from now on sets are always done /w $val reason is to make no differences for a non contrcutor added field and inherited fields

bla.on.dom.$val = { click: fn(){} }

// bla.addDomEvent()





//vobj can regognice , promise, thenable, streams

