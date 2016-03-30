/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Marcus Besjes, marcus@vigour.io
 */
var util = require( '../../../util' )
  , NetworkData = require( '../data' )
    .inject( require( '../../../object/hashpath' ) )
    //TODO: add localstorage --> , !util.isNode && require('../../../object/localstorage')
  , networkDataElement = require( '../data/element' )
  , Data = require( '../../../data' )
  , preventUpdate
  , vObject = require( '../../../object' )
  , timestamp = require( 'monotonic-timestamp' )
  , CloudData = NetworkData.new
    ( false //put some settings!
    , function CloudData( val, hook, parent, cloud ) {
        var _this = this

        if( cloud )
        {
          _this.cloud = cloud
          _this.addListener(cdListener)

          if(!util.isNode && window.cordova) 
          {

            document.addEventListener('pause', function() {
              //TODO: this does not work yet -- make prevent update a usable thing in app logic ( e.g. in device lists or clients )
              _this.preventUpdate = true
            }, false)

            document.addEventListener('resume', function() {
              
              cloud.kickPing()

              if( _this.timeout )
              {
                clearTimeout( _this.timeout )
              }

              _this.timeout = setTimeout( function() {
                if( _this.defered ) 
                {
                  _this.merge( _this.defered.data, false, _this.defered.stamp )
                }
                _this.preventUpdate = null
                _this.defered = null
                _this.timeout = null
              }, 100 )
              // _this.preventUpdate = true //wait for another update and timeout
            }, false)
          }

          cloud.on
          ( 'set'
          , function( data ) {
 

            // console.clear()
            // console.log('\n-----------INCOMING CLOUD-------\n'.blue, JSON.stringify(data, false, 2) ) // .slice(0,150)
              // console.log('INCOMING!\n', JSON.stringify(data))
              var set = data.s
                , vclock = data.v
                , stamps = vclock[1]
                , subs = cloud.state.subs.map
                , stamp

              if( vclock[0] instanceof Array )
              {

                for( var i = vclock[0].length; hash = vclock[0][--i]; )
                {
                  updateSub( subs[hash], data.v[1] )
                }

              }
              else
              {
                updateSub( subs[data.v[0]], data.v[1] )
              }

              stamp = 0

              for( var s in stamps )
              {
                if( stamps[s] > stamp ) stamp = stamps[s]
              }

              cloud.stamp = stamp

              // _this._time

              if( !_this.preventUpdate ) 
              {
                // console.log( stamp, '---------------- GET UPDATE FROM CLOUD! 2222'.inverse )
                _this.merge( data.s, false, stamp )
              } 
              else
              {
                if(!_this.defered)
                {
                  //pause geen timeout alleen maar uitstellen
                  _this.defered = 
                  { data: data.s
                  , stamp: stamp
                  }
                }
                else 
                {
                  _this.defered.stamp = stamp
                  _this.defered.data = util.merge( _this.defered.data, data.s)
                  // console.log('---------------- GET UPDATE FROM CLOUD!'.inverse)
                  // _this.defered.data._update( data.s )

                }
              }

            }
          )

        }
        else if( parent )
        {
          _this.cloud = parent.cloud
        }

      }
    )
  , __update

module.exports = CloudData

function updateSub( cached, vclock ) {
  if( !cached ) return
  var sub = cached.subsobj
  if( !sub._v ) sub.set( '_v', {} )

  for( var f in vclock )
  {
    sub._v.set( f, vclock[f] )
  }

}

function createSub( path, sub, partialSub ) {

  if( path.length )
  {
    util.path( sub, path, partialSub, true )
    return sub
  }
  else
  {
    return partialSub
  }

}

function t4walker( val ) {
//TODO: remove $t:4
  for( var i in val )
  {

    if(val[i] instanceof Object)
    {

      if(val[i] instanceof vObject)
      {
        val[i] = { $path: val[i]._path, $t: 4 }
      }
      else
      {
        t4walker( val[i] )
      }

    }

  }

}

function cdListener( val, stamp, from, remove, added, old ){
  var cloud = this.cloud

  if( stamp === 'localStorage' || stamp===false )
  {
    // console.log('I WILL NOT UPDATE')
    // console.log('Cloud from localstorage'.inverse.red)
    return
  }

  if( stamp !== cloud.stamp && val !== void 0 )
  {

    if( remove && from )
    {
      if( from._removed )
      {
        cloud.set(from._hashpath, [from._path, null, cloud.timeStamp()])
      }

    }
    else if ( from && !this._cloudignore )
    {

      if( from._updateOrigin === from )
      {
        if( from.__t === 2 && val instanceof Object ) t4walker(val)

        cloud.set
        ( from._hashpath
        , [ from._path
          , from.__t === 4 ? { $t: 4, $path: val._path } : val
          , cloud.timeStamp()
          ]
        )

      }

    }

  }

}

CloudData.prototype._blacklist.push('cloud', 'datacloud', '_batchUnsub','_cloudignore', '_lstamp', '$t')

__update = CloudData.prototype.__update

util.define
( CloudData
, 'updateQueue'
, function() {

  }
, 'stamp'
, function(){
    if( !this.cloud ) console.error( 'WAT NO CLOUD?! in this:\n', this )
    return this.cloud.timeStamp()
  }
, '__update'
, function( val, stamp, from, remove, added, oldval ) {
    //most nested update hier addition maken voor process
    this._lstamp = stamp
    // console.log(val, stamp, from)
    return __update.call( this, val, stamp, from, remove, added, oldval )
  }
, '_set'
, function (val, stamp) {
    if( !stamp ) return

    if( this._lstamp > stamp )
    {
      // console.log('3'.inverse, this._path)
      // console.log('not overwriting this is old!', this._path)
      return
    }

    if(this._name === '$path') {

      // console.log('GOT FROM', this._name , 'PATH PATH PATH PATH PATH'.yellow.bold.inverse, util.changeType(val))
      var path = util.changeType(val)

       vObject.set.call(this._parent,this.cloud.data.path(
        path, {} , false, false, false,  stamp, true
      ),false,false,true)

       // console.log('DONDONDONE'.yellow.bold.inverse)

      this.remove(false,false,false,false,false,true)

    } else {
      // console.log('C DATA ---->SET!')
      NetworkData.prototype._set.apply( this,arguments )
    }
  }
, 'subscribe'
, function( val, from, parentFixer ) {

    if( from && from.cloud  && from._val === this ) {

        //BUG: dit kan heel veel broken maken!!!!!!!
        console.log('\n\nHURK!!!!!! DIT IS TEMP MOET NIET EEN EXTRA SUB GEMAAKT WORDEN!'.warn )

        // from = void 0

        //TODO: dit is helemaal wrong GET RID OF IT!!!!
        // return
    }

    // console.log( 'lets do it sub sub'.cyan.inverse, this, val, from, parentFixer )
    // if(from) {
      // console.log('GOT FROM', from , 'SUBSCRIBE')
    // }
     if (!val || typeof val === 'function') { return; }
     // if(val instanceof vObject) {
     //    val = val.from
     // }
     // console.log('lets try to sub'.magenta.inverse, val, from, this._path)
     var path = this._path
       , elem = val[1]
       , sub
       , partialSub
       , stringified
       , subsArray
       , exists
       , listeners

    // if(elem) {
    //   console.error(elem, elem._col, elem._dfrom, elem._fmodel)
    // }

    // console.log('SUBSCRIBE', elem._dfrom, elem._fmodel, 'DFROM, FMODEL!')

    if (elem && !elem._col && (!elem._dfrom || elem._fmodel)) {

      // console.error('XXX!')
      //hier dingen vinden voor
      // console.log('!DFROM!')

    //isElem

    //val, from, parentFixer
    // console.log( '!!!!!!'.blue.inverse, arguments, from, parentFixer )

    //TODO: has to become val[2]!!!

      partialSub = elem.getModel( this, from || val[3] )

      // console.log('LETS DO IT ITI IT'.green.inverse, partialSub)

      // partialSub.DEBUG$log('partial')

    } else if (val instanceof Data && val.__sub) {
    //isData+Subscription
      //dit moet ook gefixed!!!!!!!!!
      partialSub = networkDataElement.parseData(val)
    } else if (val instanceof vObject ) {
    //vObject
      listeners = val._listeners

      // console.log('!!!!!!!!!!!', val._name, val, from)

      if(listeners) {
        for( var listener$=0, len$=listeners.length; listener$<len$; listener$++ ) {
          this.subscribe( listeners[listener$], val )
        }
      }

      // if(val._parent && !val._parent.cloud) {
      //   console.log('parent',val._parent, val._parent._listeners)
      //   listeners = val._parent._listeners

      //   // val._pa
      //   if(listeners) {
      //     for (var listener$=0, len$=listeners.length; listener$<len$; listener$++) {
      //       this.subscribe(listeners[listener$], false, true)
      //     }
      //   }
      // }

      return;
    } else if (val && util.isObj(val) && !(val instanceof Array)) {
      //isNormalSubscription
      // console.log('IS OBJ'.cyan)
      partialSub = val
      val = JSON.stringify(val)
    }

    if (partialSub) {

     //if! empty
     // console.log('2 LETS DO IT ITI IT 2'.red.inverse,this , path, 'sub:', networkDataElement.parseData(from, partialSub) )
     if(from) partialSub = networkDataElement.parseData(from, partialSub)
     sub = createSub(path, {}, partialSub)
     stringified = JSON.stringify(sub)
     if(!this._subs) this._subs = []
     if(elem) elem._subscribed = true
     // console.log('3LETS DO IT ITI IT 3'.red.inverse, networkDataElement.parseData(from, partialSub) )
      subsArray = [ partialSub, elem || val , stringified ]
      exists = util.checkArray(this._subs, stringified, 2)
      //maybe check if val already exists

      // console.log(' TEST TRUE ----- SUBSCRIBE', from, exists, this._subs, stringified, partialSub, sub )

      this._subs.push(subsArray)

      //just dont subscribe ---

      if (exists===false) {
        // if(!this._subsRAF) {
        //   this._subsRAF = []
        //   window.requestAnimationFrame(function() {
        //     for(var i in this._subsRAF) {
        //       this.cloud.subscribe(this._subsRAF[i][0], this._subsRAF[i][1])
        //     }
        //   })
        // }

        // this._subsRAF.push([sub, stringified])
                    // console.log('SUBSUBSUB!?!?'.green.inverse, arguments)


        // console.log(' TRUE ----- SUBSCRIBE', exists )

        this.cloud.subscribe(sub, stringified)
      }
    }

  }
, 'unsubscribe'
, function( val, from ) {
    if 
    ( !val
      || val._col
      || (val._filter && val._filter._col)
      || !(!val._dfrom || val._fmodel)
    ) 
    { 
      return 
    }

     var path = this._path
       , stringified
       , subsArray
       , sub
       , exists
       , partialSub
       , index
       , field
       , listeners = val._listeners

    if (util.isObj(val) && !(val instanceof Array)) val = JSON.stringify(val)

    index = this._subs && util.checkArray(this._subs, val, 1)

    if (index!==false && index !== void 0) {

      if(val.model && val.model.parsing) {
        //block unsubs on model parsing
        if(val.model && val.model.field) {
          //reapply if field
          field = this.get(val.model.field.val)
          if(!field._subs) field._subs = []

          this._subs[index][0] = util
            .get(this._subs[index][0], val.model.field.val)

          field._subs.push(this._subs[index])
          this._subs.splice(index, 1)
        }
        return
      }

      subsArray = this._subs[index]
      stringified = subsArray[2]
      partialSub = subsArray[0]
      // if(from) partialSub = networkDataElement.parseData(from, partialSub)
      sub = createSub(path, {}, partialSub)

      this._subs.splice(index, 1)
      exists = util.checkArray(this._subs, stringified, 2)

      if (exists === false ) this.cloud.unsubscribe(sub, stringified)
        // this._subsRAF.push([sub, stringified])
        // this._subsRAF = [] search & remove use different identifiers e.g. subs array

    } else if( val._removed ) {
      // console.error('is this really nessecary? _removed , froce all listeners remove tagets etc')
    } else if(listeners) {
      // console.log('----> this is also pretty different! _listeners')
      for (var listener$=0, len$=listeners.length; listener$<len$; listener$++) {
        if (listeners[listener$] instanceof Array) {
          this.unsubscribe(listeners[listener$][1], val)
        } else if (listeners[listener$].__t) {
          this.unsubscribe(listeners[listener$], val)
        }
      }
      return
    }

  }
)
