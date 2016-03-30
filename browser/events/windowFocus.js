var events = module.exports = require( './index.js' )
  , util = require('../../util')

events.appVisible =
{ create: function() {

    this.m = true

    util.define( events , '_appVisible', { value: [] } )

    //first test // vigourNative.applicationWillEnterForeground && vigourNative.applicationDidBecomeActive (for ios)

    if( window.cordova )
    {
      document.addEventListener( 'resume', onchange )
    }
    else
    {
      var tests =
        { hidden: 'visibilitychange'
        , mozHidden: 'mozvisibilitychange'
        , webkitHidden: 'webkitvisibilitychange'
        , msHidden: 'msvisibilitychange'
        }
        , hidden
        , isSet

      for( hidden in tests )
      {
        if( hidden in document )
        {
          isSet = true
          document.addEventListener( tests[hidden], onchange )
          break
        }
      }

      if( !isSet )
      {
        hidden = 'hidden'

        if( 'onfocusin' in document )
        {
          document.onfocusin = document.onfocusout = onchange
        }
        else
        {
          window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange
        }

      }

    }

    // set the initial state (but only if browser supports the Page Visibility API)
    // if( document.hidden !== void 0 )
    // {
    //   onchange( { type: document[hidden] ? 'blur' : 'focus' } )
    // }

    function exec( e, val ) {

      if( this.rendered )
      {
        this.events.appVisible._val.call( this, e, val )
      }
      else if( this === events.document )
      {
        this.exec( 'appVisible', e, val )
      }

    }

    function onchange( e ) {
      var v = 'visible'
        , h = 'hidden'
        , eventMap =
          { focus: v
          , focusin: v
          , pageshow: v
          , blur: h
          , focusout: h
          , pagehide: h
          }
        , val

      e = e || window.event

      if( e.type in eventMap )
      {
        val = eventMap[e.type]
      }
      else
      {
        val = this[hidden] ? h : v
      }

      if( val )
      {
        for( var arr = events._appVisible, i = arr.length - 1; i >= 0; i-- )
        {
          exec.call( arr[i], e, val )
          if( arr[i] ) arr[i].eachInstance( exec, 'events', e, window.cordova ? 'visible' : val )
        }
      }

    }

  }
, add: function() {

    this.setSetting
    ( { name: '_appVisible'
      , remove: events.appVisible.remove
      }
    )

    if( !util.checkArray( events.appVisible, this ) )
    {
      events._appVisible.push( this )
    }

  }
, remove: function() {
    var index = util.checkArray( events._appVisible, this, true )

    if( ~index )
    {
      events._appVisible.splice( index, 1 )
      this.removeSetting( '_appVisible' )
    }

  }
}