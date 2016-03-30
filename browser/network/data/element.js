/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = require('../../../util')
  , element = require('../../element')
  , utilHash = require('../../../util/hash')
  , vObject = require('../../../object')

/*this file has nothing to do with the networkdata Class
  it only reads out models for elements so you can make a subscription
*/

// alert('???')

function sortField(filter,obj) {
  if( filter.sort && filter.sort.field ) {
    var sort = { $:{} }
    sort.$[filter.sort.field] = true
    util.merge(obj, sort)
  }
  return obj
}

exports.parseData = function(val, fromtargets) {

  // console.log('LETS PARSE DATA!'.cyan.inverse , val, JSON.stringify(fromtargets))

  if(!val) return

  var subsobj = {}
    , f = val._filter
    , targets = fromtargets || val.__sub

  if (targets) {
    if (f) {
      if(!subsobj['*']) subsobj['*']=[]
      subsobj['*'].push([
        util.clone(f, {subsObj:true, fn:true, type:true})
        , sortField(f, fromtargets || { $: targets })
      ])
    } else {
      subsobj = targets
    }
  } else {
    // console.warn( 'cat\'t find target' )
    //no tragets dont do anything?
  }

  // console.log('RESULT!', JSON.stringify(subsobj))

  return subsobj
}

function setFlag( obj, string, flag, field, val, from, elem ) {

  // console.log( 'SET FLAG', arguments )

  var nonCloudDataBindings
    , fromKey

  if( from ) {
    fromKey = from._name !== void 0 ? from._name : from

    if( from instanceof vObject) {
      fromKey = from._path[0]
    }

  }

  var dd = elem && from && ( elem._d || elem.checkParent('data', true) )


  if (field === 'collection') {
    var obj2

    if (flag.filter && flag.filter.val!==true) 
    {
      //dit nog handelen op refs
      obj2 = {}
      if (string === true) {
        string = '*'
      } else {
        string = string + '.*'
      }
      var f = flag.filter.raw

      var arr = util.path(obj, string.split('.'), [])

      arr.push( 
        [f, {
          $: sortField(f,obj2)
        }]
      )

    } else {

      var f = string === true ? '$' : string + '.$'
        , p =  f.split('.')

      if( dd && dd[ fromKey ] ) 
      {

        // console.log('---------- deze meot gefixed!!!!!!!!!!'.red.inverse
        //   , obj, string, flag, field
        //   , '\nval:'.blue , val && val._path
        //   , '\nfrom:'.blue , from && from._path 

        //   , '\nelem data:'.blue, JSON.stringify( elem._d.raw, false, 2 )
        // )

        nonCloudDataBindings = true

        // console.log( f, f.split('.'), p )

        if( p[0] === fromKey ) 
        {
          p.shift()
          console.log('-----------------\n\n\n\n\n\n\n\n\n\n\n\n\n', 'HERE!!!'.red.inverse, obj, obj2, p, '\n\n\n\n\n\n\n\n\n\n\n\n\n' )
          nonCloudDataBindings = false
        }

      }

      if( nonCloudDataBindings ) 
      {
        // console.error( '------NOW I HAVE TO NOT DO THIS WHOLE SUBSCRIBTION!!!!---', from && from._path, obj, obj2 )
      } 
      else 
      {
        obj2 = util.path(obj, p , {})
        readModel(flag.element._val instanceof element ? flag.element._val : flag.element._val.base, obj2 )
      }

    }

  } else {

    // console.log('----------------->'.bold.blue, obj, elem && elem._d, 'from:'.blue,from, fromKey, val )
      

    if( dd && dd[ fromKey ] ) 
    {
      // console.log( '!!!!!!!!'.yellow.inverse, from._path, obj, string )
      nonCloudDataBindings = true
    }

    // hier rekening houden met function + listen
    // console.log(string);

    if ( string instanceof Array ) 
    {
      for (var i in string) 
      {
        if( nonCloudDataBindings )
        {
          //TODO: this is a tempfix
          // console.log('NON cloud bindings'.yellow.inverse, string, string[i])

          if( string[i] instanceof Array ) {
            // console.log('!@!@!@')
            string[i] = string[i][0]
          }

          string[i] = string[i].split('.')
          if( string[i][0] === fromKey ) 
          {
            string[i].shift()
            util.path( obj, string[i], true )
          }
        }
        else
        {
          //TODO: this is a tempfix
          // console.log('OBJ:'.green.inverse , obj, 'STRING[i]:', string[i], 'STRING:', string, fromKey)
           if( string[i] instanceof Array ) {
            // console.log('2!@!@!@')
            string[i] = string[i][0]
          }
          util.path(obj, string[i].split('.'), true)
        }
      }
    } 
    else if ( string !== true && typeof string === 'string' ) 
    {
      if( nonCloudDataBindings )
      {

        // console.log( nonCloudDataBindings , 'NONCLOUD'.inverse)

          string = string.split('.')
          if( string[0] === fromKey ) 
          {
            string.shift()
            util.path( obj, string, true )
          }

          // console.log( nonCloudDataBindings , 'NONCLOUD'.inverse, string, obj )

      }
      else
      {

                  // console.log( nonCloudDataBindings , 'xxxxx'.inverse, string, obj ) //, fromKey, elem._d, elem.data, elem.checkParent('data', true) )

        util.path( obj, string.split('.'), true )
      }
    } 
    else 
    {
      // console.log('----> 2'.inverse, string, obj, flag, field)
      // console.error('xxxxxx')
      // obj['__#__'] = true
      // obj = true;
      // console.log('!!!',obj, parent);
      // obj['#'] = true;
    }
    

  }
}

function store( obj, flag, field, val, from, elem ) {

  // console.log('STORE', arguments )

  if (flag instanceof Array) {
    for (var i = 0, l = flag.length; i < l; i++) {
      setFlag(obj, flag[i]._flag.data[2], flag, field, val, from, elem )
    }
  } else {
        // console.log('------>'.red,flag)

    setFlag(obj, flag._flag.data[2], flag, field, val, from, elem )
  }
}

function readModel( elem, obj, val, from ) {

  // console.log( 'lets read model'.yellow.inverse, val && val._path || 'no valPath', from && from._path || 'no fromPath' , val, elem, obj, val, from )
    //hier moet het gecombineerd worden met een value waar het aan gebind is!

  if (elem.model && (elem.model.flags||elem.model.subscription||elem.model.field)) {
    
    // if(obj) console.log('XXX121212XXX COLLECTION',  elem.model.field && elem.model.field.val )
    // console.log('SET SORTFIELD! 2.12', JSON.stringify(obj,false,2))

    var a = obj
      , field

      //["users", "U_ba3215a1b1038a70", "navigation", "episode"] 
      // console.log( '\n\n\n\n\n-------->', elem.model.field && elem.model.field.val  )

    if(elem.model.field && elem.model.field.val && !elem.model.parsing && !elem.model.parsed) {
      field = elem.model.field.val.split('.')
      a = util.path(obj,field,{},true)
            // console.log('DO IT FIELD'.red.inverse, 1, elem.model.field, elem.model.field.val)
    } 

    // console.log('SET SORTFIELD! 2.13', JSON.stringify(obj,false,2))

    if(elem.model && elem.model.subscription ) {

      //ook hier ofcourse!!!!

      var subs = elem.model.subscription.raw
      if(subs === true) {
        if(field) {
          // console.log('SET SORTFIELD! 2.13.1',field, JSON.stringify(obj,false,2))
                // console.log('---->', field, obj,field.slice(0,-1))
          if(field.length>1) {
          a = util.path(obj,field,true,true)
          } else {
            obj[field[0]] = true
            a = true
          }
        }
        // console.log('???'.green.bold.inverse,elem.model.subscription.raw, a, obj)
      } else {
        // console.log('SET SORTFIELD! 2.13.2',a, elem.model.subscription, elem.model.subscription.raw, JSON.stringify(obj,false,2))
        var sub = elem.model.subscription.raw
        if( typeof sub === 'string' ) {
          var old = sub
          sub = {}
          sub[old] = true
        }
        util.merge(a,sub)
      }

      // console.log('SET SORTFIELD! 2.14', JSON.stringify(obj,false,2))
    }

    for (var i in elem.model.flags) {
        // console.log('STORE --- go', elem.model.flags[i], elem.model.flags )

      store(a, elem.model.flags[i], i, val, from, elem )
      // console.log('SET SORTFIELD! 2.15', i, JSON.stringify(obj,false,2))
    }

  }

  if( !elem.model || !elem.model.block || !elem.model.block.val ) {

    for (
      var children = elem.children
      , child
      , child$ = 0
      , children$len = children && children.length
      ; child$ < children$len
      ; child = child$++
    ) {
      child = children[child$]
      if ((!child.model || (!child.model.inherit || child.model.inherit.val!==false))
        && !child._col && !child.data || child._dfrom) { //dit kan beter!
        readModel(child, obj, val, from )
      }
    }
  }

  if(obj['__#__']) {
    // obj.$ = true
    // util.merge(obj, obj['__#__'])
    delete obj['__#__']
  }

  return elem.model && elem.model.block && elem.model.block.val==='all' ? void 0 : obj
}

util.define(element, 'getModel', function( val, from ) {

  // console.log( 'lets get that model!'.green.inverse , val, from && from._path, this )
  var subscription = readModel( this, {}, val, from )
  // console.log( 'subscribs!!!!'.blue, subscription )
  return !util.empty( subscription ) ? subscription : null
})