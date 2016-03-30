/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var  data = require('./')
  , base = require('../base')
  , util = require('../util')
  , flags = require('../value/flags/data')
  , vObject = require('../object')

exports.extend = util.extend( function(base, extensions, modelblacklist) {

  // var _blacklist = util.add(['flags', 'ref', 'parse', 'parsing'], modelblacklist),
    var _compare = util.compareArrays,
    methods = {
      _dUpdate: function(obj, val, stamp, from, remove, added, oldval, instances, argx1, argx2 ) {
        // if(window.here) console.log('X',stamp)
        if (this.model) {

          //$ndata

          //TODO: very dirty fix get rid of this!
          if( obj === '$ndata' ){
            val = from
            stamp = remove
            from = added
            remove = oldval
            added = instances
            oldval = argx1
            instances = argx2
            // console.log('!@#!@#!@#!@#@!#!@#!@#!@#'.red.inverse)
          }

          // var non = 0
          //   , cnt = 0
          // for( var i in arguments ) 
          // {
          //   cnt++
          //   if(!arguments[i]) {
          //     non++
          //   }
          //   console.log( arguments[i] )
          // }
          // if(non === cnt) {
          //   alert('no args')
          //   return true
          // }

          if (!this._d && this.parent) {
            var p = this.parent;
            while (!this._d && p) {
              if (p._d) {
                // console.error('SET DATA')
                this._dSet(p._d, true);
              } else {
                p = p.parent;
              }
            }
          }
          var t = this,
            model = t.model,
            f = model.flags,

            // f = model ? model.flags : false be carefull with updates in values that have data

            path = t._d && t._d._path || [],
            name = (from || (from = (t._d && t._d._updateOrigin)) && !(from === t._d && (from = false))) && from.updatePath,
            fromPath = from && from._path,
            method = function(i, field) {

              var select, pass, fr, lfield;
              // if( field._flag[2].__t) {
              //multiple flags!
                // console.log('FLAG'.inverse, name, field._flag)
              // }

              if(!field._flag.data) {
                console.error('NO DATA FLAG', name, field._flag, val, obj, remove, added, oldval)
                return
              }
              field = field._flag.data[2];

               // console.log('DATA UPDATE'.magenta.inverse,
               //      'obj:', obj
               //    , 'val:', val
               //    , 'stamp:', stamp
               //    , 'from:', from
               //    , 'remove:', remove
               //    , 'added:', added
               //    , 'field:', field
               //  )
              // var test = (i==='text' && field === 'real.duration')
              // if(test) console.log(field,i)
              // if(test) pass = true

              if (i === 'collection' && t._colFilter) return
              //if not own colfilter --> handle yourself!;
              // if data has changed change colfilter adn send update
              //be carefull /w changes!; too crude

              if (field === true) {
                // console.log('PASS'.inverse,name)
                pass = true;
              } else if (field.pop) {
                // console.log(name,'???')

                // console.log('--->',field, field.pop)

                field = field.concat();

                for (var j = field.length - 1; j >= 0; j--) {
                  if (!lfield !== void 0) {
                    select = util.get(t._d, field[j]);
                    if (select !== void 0) {
                      lfield = true;
                      // break;
                    }
                  }
                  field[j] = field[j].split('.');
                }
              } else {

                // console.log('DO DO!'.inverse,name, t._d && t._d._updateOrigin)

                // console.log(name, path, select, obj, val, stamp, from, remove, added, oldval, instances)

                field = field.split('.')

                select = util.get(t._d, field)

                if(!select && t._d && t._d.from && field ) {
                  // console.log('NO SELECT'.red.inverse, t._d )
                  select = util.get(t._d.from, field)
                  // if(select) {
                  //   // console.log('FOUND SELECT'.green.inverse, select)
                  // }
                } 

                if(select && from && from.__t === 4) lfield = true //test dit of het alles slow maakt

                // if(test&&select) console.log(select._val)
              }

              if (!pass && from) {

                // console.log('testing....?', name, from, select, lfield)
                // if(test) console.log(name, select, lfield, from);

                fr = true;
                var fromFrom

                if ( from === select || ( fromFrom = from.from ) === select ) {
                  pass = true;
                } else {
                  if (t._d._filter && select && select._ancestor(from)) {
                    pass = true;
                    //field ook voor arrays!;
                  } else if (lfield) {

                    // console.log('got lfield!!!!')

                    for (var n = 0; n < field.length; n++) {
                      if (name && _compare(name, field[n]) || field[n][0] === name[0] && util.get(val, field[n].concat().shift())) 
                      {
                        fr = false;
                        break;
                      } 
                      else if ((_compare(path.concat(field[n]), fromPath) || _compare(field[n], fromPath))) 
                      {
                        fr = false;
                        break;
                      } 
                      else {

                        // console.log('HERE?'.cyan.inverse, '\n\n\n', select.from.raw, 'val:'
                        //   , val, 'field:', field, 'fn', field[n], 'n:', n, 'check field:', val && val[field[n]], 'ref:', val.from)
                        // console.log('coming trugh', select && from._val !== null && val, field[n]
                        //   , select && from._val !== null && val && ( val[field[n]] || val.__t === 4 && val.from[field[n]] ) )
                        //TODO: need to add more gaurding for val.$path check if this is cloud and ref

                        if(select && from._val !== null && val && (val[field[n]] || val.$path || val.__t === 4) && (select._ancestor(from) || select.from._ancestor( fromFrom )  ))  //
                        {
                          // console.log(val, field);
                          pass = true;
                          break;
                        }
                      }
                    }
                  } else {

                    // console.log( '---', select, val, field, from, 'fromPath:' , fromPath )

                    if(val===null) {
                      // if(DEBUG$) t._d.DEBUG$log('data/base ---> ERROR val is null  --->'+t._d._removed )
                    } else if(val === void 0) {
                      console.log('\n\n\n undefined what to do now?'.red.inverse)
                      // pass = true
                      // pass = true
                    } else if (name && _compare(name, field) || field[0] === name && name[0] && util.get(val, field.concat().shift())) {
                      fr = false;
                    } else if (path && (_compare(path.concat(field), fromPath) || _compare(field, fromPath))) {
                      fr = false;
                    } else if (select && (val[field[0]]) && select._ancestor(from)) {
                      // console.log(val, field);
                      pass = true
                    } else if( t.__checkKeys__ ) {
                      // console.log('lets checkj the keys!')
                      // console.log( field, name, val, path, select, val[field[0]], from, this )
                      for( var key$ in t.__checkKeys__ ) {
                        if( field === t.__checkKeys__[key$] || field[0] === t.__checkKeys__[key$] ) {
                          // console.log('maybe??!!@#!@', i, t.__checkKeys__[key$])
                          pass = true
                        }
                      }

                    }
                    // console.log(val, field[0], from);
                  }
                }
              }
              // pass = true;
              // console.log('PASS>>>>>>>>>?'.magenta.inverse, pass ? 'OK!'.green.inverse : 'NO!'.red.inverse  
              //   , 'val:'.blue, val
              //   , 'obj._path:'.blue, obj && obj._path
              //   , 'field:'.blue, field
              //   , 'fromPath:'.blue, fromPath
              //   , 'from:'.blue, from
              //   , 'select'.blue, select
              //   )

              // if(! pass && )

              // pass = true

              if (pass || (instances || remove || select !== void 0) && ( !fr || remove === 1)) {

                // console.log('updating!'.cyan.inverse, i, val, instances, remove, select, fr, from)
                // debugger
                //stamp meegeven????
                // console.log( 'FROM!!!!!'.green.inverse, from )
                // console.l
                t[i]._update(val, false, from, remove, added, oldval, !instances, t);
                return true;
              }
            };
          //----------------------------------------------------
            //add advanced models (like on website)
            //not tested and still pretty broken
           var parser = function() {
            if (this._d) {
              var t = this, a
              //if added or first run
              t.model.val //set _caller
              // if (model.field) console.log('????', this.field, model.field)

              if (model.field) a = util.get(t._d, model.field.val)
              if (model._val) a = model._val.call(t, a || t._d) || a
              if (a && t._d !== a) {
                model.parsing = true
                if(model.field) model.parsed = model.field.val
                this._dSet(a)
                model.parsing = false
              }
            }
          }
          parser.call(t)
          if (instances) t.eachInstance(parser, 'model')
          //----------------------------------------------------

          //----------------------------------------------------
          if (f && (instances || t._d)) {
            for (var i in f) {
              if (!f[i].__t) {
                for (var j = 0, l = f[i].length; j < l; j++) {
                  if (method(i, f[i][j])) {
                    break;
                  }
                }
              } else {
                method(i, f[i]);
              }
            }
          }
          //----------------------------------------------------

         if(this.model.complete) this.model.complete._val.call(this,data)

        }
      },
      _dSet: function(val, dfrom) {


        // if(val) {
        //   console.log('_Dset'.cyan.inverse, val._path, dfrom)
        // }
        // if(this.model._flag && this.model._flag.process && !this.__processing) {
        //   console.log('oo2')
        //   this.model._update()
        //   return
        // }

        if(this.model._flag && this.model._flag.defer  && !this.__processing) {
          this.__pFlag = [ val, dfrom ]
          return
        }

        //dfrom moet niet nog een subscribe doen! -- als het goed is is zn parent al subscribed

        if (this._d && this._d.__t) this._d.removeListener(true, this)
        this._d = val
        if (dfrom) this._dfrom = true
        this._dListen()



        return val;
      },
      _dListen: function() {

          // console.log('HEEEEEE', this.model)

        // if(this.model._flag && this.model._flag.process && !this.__processing) {
        //   console.log('oo2')
        //   this.model._update()
        //   return
        // }

        //hier gaan we s fftjes werken met each

        // this._dfrom = true;
        var _this

        if (this.model && this._d && this._d instanceof vObject) 
        { //this model maybe not nessecary?

          // console.log('----->'.cyan.inverse, this._d )

          this._d.addListener([this._dUpdate, this])

          _this = this
          
          //hier filteren op cloudData --- ook werken vanuit remove!!!
            //never do for cloud data
         
          if( !this._d.cloud )
          {
            this._d.each(
              function() { 
                _this.__checkKeys__ = true

                if(this.__t === 4 ) this.addListener([ _this._dUpdate, _this, '$ndata', this ]) 
              }
            )
          }
          //eventueel .val gebruiken voor Values *awesjume!
          //eventueel hier dingen adden aan model

        } 
        else if( this.model && this._d ) 
        {
          for( var key in this._d ) 
          {
            if(!this.__checkKeys__) this.__checkKeys__ = []
            if( this._d[key] instanceof vObject )
            {
              this.__checkKeys__.push( key )
              this._d[key].addListener([ this._dUpdate, this, '$ndata', key ])
            }
          }

        }
      },
      updateData: function(instances) {

        if(this.model._flag && this.model._flag.defer && !this.__processing) {
          // console.log('oo2')
          this.__pFlagU = [ instances ]
          this.model._update()
          return
        }
        // console.log('!DOIT updateData'.cyan.inverse)

        this._dUpdate(this._d, void 0, false, false, false, false, false, instances)
      }
    },
    extend = function(i) {
      base.extend({
        name: i,
        type: false,
        value: (extensions && extensions[i]) ? function() {
          methods[i].apply(this, arguments);
          extensions[i].apply(this, arguments);
        } : methods[i]
      });
    };
  for (var i in methods) {
    extend(i)
  }
  base.extend({
    name: 'model',
    set: function(val) {

      if(this.__pFlag || this.__pFlagU) {
        /*
        TODO: test defer better!!!
        this.__pFlag = [ val ]
        this.__pFlagU = [ true ]
        */
        this.__processing = true
        this.model.parsing = false
        if(this.__pFlag) {
          this._dSet.apply(this,this.__pFlag)
        }
        //subscribe helemaal fucked met field erbij
        if(this.__pFlagU) {
          this.updateData.apply(this,this.__pFlagU)
        }
        this.__pFlagU = null
        this.__pFlag = null
        this.__processing = null
      }

      if(val.field && val.field.val !== val.parsed) {
        var a = val.parsed && val.parsed.split('.')
          , parent
        val.parsed = null
        if(this._d) {
          parent = this._d
          if(a) {
            for(var i = a.length-1; i >=0 ; i--) {
              parent = parent._parent
            }
            if(parent) {
              this._dSet(parent)
              this.updateData(true)
            }
          } else {
            this.updateData(true)
          }
        }
        val.parsed = null
      }
    },
    remove: function() {
      if( this._d )
      {
        if ( this._d.__t )  
        {
          this._d.removeListener( void 0, this )

          if( !this._d.cloud )
          {
            var _this = this
            this._d.each(
              function() { 
                // _this.__checkKeys__ = true
                if(this.__t === 4 ) this.removeListener( void 0, _this ) 
              }
            )
          }

        }
        else if( this.__checkKeys__) 
        {
          for( var key$ in this.__checkKeys__ ) 
          {
            if( this._d[this.__checkKeys__[key$]] instanceof vObject )
            {
              this._d[this.__checkKeys__[key$]].removeListener( void 0, this )
            }
          }
        }
      }
    }
    // parent: function(parent) {
    //   if( parent.data && (!parent.parent || parent.parent.data!==parent.data) ) {

    //     console.error('WTF?')

    //     this.data = parent.data
    //   }
    // }
  }, {
    name: 'data',
    type: false,
    set: function(val) {
        // console.log('?',val)
      if( this._d === val ) return

      // if(!this.model) this.model = {} //dit met het nooit setten van fmodel scheel op show al 3/9 subscriptions
      //nu nog shared subs maken -- 'shows' (ook meteen process) en dan word thet als het goed is nog een stuk minder
    
      // this.model = {} //pas op met deze
      // console.log('?2')

      if( this.model._flag && this.model._flag.defer ) {
        this.__pFlag = [ val ]
        this.__pFlagU = [ true ]
        // console.log('!@#!@#!@# OOOO'.red)
        return
      }

      // console.error('!!!!!MODEL -- dit moet zoveel mogelijk gereduced', this.model)

      this.model.parsing = false
      this._dSet(val)

      //subscribe helemaal fucked met field erbij
      this.updateData(true)

    },
    get: function() {
      return this._d
    }
  })
})