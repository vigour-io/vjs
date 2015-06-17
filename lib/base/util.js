"use strict";

var Base = require('./index.js')
var proto = Base.prototype
var define = Object.defineProperty

define(proto, '$convert', {
  value:function( options ) {
    var fnToString = options && options.fnToString
    var obj = {}
    for(var key$ in this) {
      if(key$[0]!=='_') {
        obj[key$] = this[key$].$convert 
          && this[key$].$convert( options ) 
          || this[key$] 
      }
    }
    if(this._$val) {
      if( fnToString && typeof this._$val === 'function' ) {
        obj.$val = String(this._$val)
      } else {
        obj.$val = this._$val
      }
    }
    return obj
  }
})

define(proto, '$toString', {
  value:function() {
    return JSON.stringify( this.$convert({
      fnToString: true
    }), false, 2 )
  }
})

define(proto, '$keys', {
  get:function() {
    var keys = []
    //this can be extra fast by caching and updating (speed)
    for( var key$ in this ) {
      if( key$[0]!=='_' ) {
        keys.push(key$)
      }
    }
    return keys
  }
})

define(proto, '$lookUp', {
  value:function( path, value ) {
    var parent = this.$parent
    if( parent ){
      if(typeof path === 'string'){
        path = path.split('.')
      }
      return lookUpUsingArray( parent, path, path.length )
    }
  }
})

function lookUpUsingArray( parent, path, length ) {
  return checkPath( parent, path, length )
    || ( parent = parent.$parent )
      && lookUpUsingArray( parent, path, length )
}

function checkPath( obj, path, length ){
  var i = 0
  var result = obj[path[i]]
  while(result){
    if(++i === (length || (length = path.length))){
      return result
    }
    result = result[path[i]]
  }
}

define(proto, '$lookDown', { //2.36 seconds
  value:function( path, value ) {
    if(typeof path === 'string'){
      path = path.split('.')
    }

    var index
    var siblings
    var child
    var key
    var result
    var length = path.length
    var children

    for( key in this){
      if(key[0] !== '_'){
        child = this[key]
        if( result = checkPath(child,path,length) ){
          return result
        }
        if(!siblings){
          index = 0
          siblings = [child]
        }else{
          siblings[++index] = child
        }
      }
    }

    while(siblings){
      for (var i = index; i >= 0; i--) {
        var sibling = siblings[i]
        for( key in sibling){
          if( key[0] !== '_' ){
            child = sibling[key]
            if( result = checkPath(child,path,length) ){
              return result
            }
            if(!children){
              index = 0
              children = [child]
            }else{
              children[++index] = child
            }
          }
        }
      }
      siblings = children
      children = false
    }
  }
})

//path util --- context ect ect all needs to be taken into account must be able to use it in sets etc
//get by path

//notation in path for until found somwhere up , maybe also until found down

//BACKUP




// define(proto, '$lookDown', { //2.66 seconds
//   value:function( field ) {
//     for( var key in this){ 
//       if(key[0] !== '_'){
//         var child = this[key]
//         if( child ){
//           var result = child[field] || child.$lookDown( field )
//           if( result ) return result
//         }
//       }
//     }
//   }
// })

// define(proto, '$lookDown', { //2.44 seconds
//   value:function( field ) {
//     var siblings = [this]
//     var index
//     while(siblings){
//       var children
//       var i = index || 0
//       for (; i >= 0; i--) {
//         var sibling = siblings[i]
//         for( var key in sibling){
//           if(key[0] !== '_'){
//             var child = sibling[key]
//             var result = child[field]
//             if( result ){
//               return result
//             }else{
//               if(index === void 0){
//                 index = 0
//                 children = [child]
//               }else{
//                 children[++index] = child
//               }
//             }
//           }
//         }
//       }
//       siblings = children
//     }
//   }
// })

// define(proto, '$lookDown', { //2.36 seconds
//   value:function( field ) {
//     var index
//     var siblings
//     var child
//     var key
//     var result

//     for( key in this){
//       if(key[0] !== '_'){
//         child = this[key]
//         result = child[field]
//         if( result ){
//           return result
//         }else{
//           if(!siblings){
//             index = 0
//             siblings = [child]
//           }else{
//             siblings[++index] = child
//           }
//         }
//       }
//     }

//     while(siblings){
//       var children
//       var i = index || 0
//       for (; i >= 0; i--) {
//         var sibling = siblings[i]
//         for( key in sibling){
//           if( key[0] !== '_' ){
//             child = sibling[key]
//             result = child[field]
//             if( result ){
//               return result
//             }else{
//               if(!children){
//                 index = 0
//                 children = [child]
//               }else{
//                 children[++index] = child
//               }
//             }
//           }
//         }
//       }
//       siblings = children
//     }
//   }
// })

//find

//get 
  //argument

//merge

//remove

//clear

// bla.pathFinder('findInParent.yuzi.findInChild.jim')
// bla.

