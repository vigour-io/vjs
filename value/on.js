/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

  /*
    Extension for Base classes to create an inheritable on - value
  */

var Value = require('./')
  , util = require('../util')
  , Base = require('../base')

exports.extend = util.extend
( function(base)
  {
    if( base instanceof Base )
    {

      base.extend
      (
        {
          name:'on',
          set:function(val) {
            
          },
          remove:function(val) {
            //remove
            console.log('im being removed!')
             if(this.on.$remove) {
              this.on.$remove.update()
            }
          },
          new:function(val) {
            //init
            console.log('INIT!----', this, val, arguments)
            if(this.on.$new) {
              this.on.$new.update()
            }
          },
          parent:function(val) {
            //init
            console.log('PARENT!----', this, val, arguments)
            if(this.on.$parent) {
              this.on.$parent.update()
            }
          },
          render:function(val) {
            //init
            console.log('RENDER!----', this, val, arguments)
            if(this.on.$render) {
              this.on.$render.update()
            }
          }
        }
      )

    }
    else
    {
      console.error( 'extend on base' )
    }
  }
)
