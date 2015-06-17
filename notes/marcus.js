// =====================================================
// 1: set first time

A.$set({x: 1})

// ------------------------ $set

A.$setKey('x', 1)

// ------------------------ $setKey

var priveteField = '_x'
var field = undefined

// if (field) else >

A.$setKeyInternal( 'x', 1, undefined )

// ------------------------ $setKeyInternal

var key = 'x'
var value = 1
var field = undefined

// if(field) else >

A.x = new A.$children.$Constructor( 1, A )
A.x._$key = 'x'

// if(A.hasOwnProperty('_$Constructor')) >

A.$createContextGetter.call(A, 'x')



// ------------------------ $createContextGetter

// make dat A.x and A._x


// =====================================================
// 2: set second time

A.$set({x: 3})

A.$setKey('x', 1)

// ------------------------ $setKey

var priveteField = '_x'
var field = A._x

// if (field) >

A.$setKeyInternal( '_x', 1, A._x )

// ------------------------ $setKeyInternal

var key = 'x'
var value = 1
var field = A._x

// if(field) >

// if(field._$parent !== A) else >

field.$set( 1 )

