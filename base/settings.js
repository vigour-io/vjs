/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var base = require('./'),
  util = require('../util');

/**
 * Settings are used for special cases e.g. onRemove or onNew instance
 * @property
 */
util.define(base, '_settings');

base.prototype._._settings = {};

/**
 * Set settings on Base
 * @function _set
 * @param  {Object}  set      Object to set
 * @param  {Boolean} [remove]
 * @param  {Boolean} [force]  True/false
 */
var _set = function(set, remove, force) {
  var _s = set._settings //e.g. node , remove and parent
    , t = this
    , __t = t._._settings
    , setting
    , i
    , _t

  util.setstore.call(t)

  if (!t.__._settings) {
    // console.log('create my own settings')
    t.__._settings = {}
    for (var j in __t) {
      t._settings[j] = __t[j]
    }
  }

  _t = t.__._settings

  // console.log('SETTINGS?'.inverse, set, __t)

  for (i in _s) {
    setting = _s[i]
    //efficient memory management only make own if absolutely nessecary
    if ((remove && _t[setting][set.name]) || (!remove && !_t[setting][set.name]) || force) {
      
      if (_t[setting] === __t[setting]) {
        _t[setting] = {}
        for (var n in __t[setting]) {
          _t[setting][n] = __t[setting][n]
        }
      }

      if (remove) {
        this.eachInstance(function() {
          if (this[set.name] !== t[set.name]) {
            if (this._setting !== _t && this._settings[setting] === _t[setting]) {
              // console.log('found that the settings are the same and not the same property make my own');
              // console.log('------ SETTING')
              _set.call(this, _t[setting][set.name], false, true);
            }
          } else {
            if (this._setting !== _t && this._settings[setting] !== _t[setting]) {
              // console.log('------ REMOVE SETTING')

              // console.log(this.name,set.name,'found that the property is the same but settings are not!');
              this.removeSetting(set.name, setting);
            }
          }
        });
        _t[setting][set.name] = null;
        delete _t[setting][set.name]; //delete is kut!;
        if (util.empty(_t[setting])) {
          // console.log('lets put this to true!')
          _t[setting] = true;
        }
      } else {
        // console.log('------ DO SETTING', set, _t, setting, set.name)
        if(_t[setting]===true) {
          _t[setting]={}
        }
        _t[setting][set.name] = set;
        // console.log('RESULT?', setting, _t[setting])
      }
    }
  }

  // console.log('SETTINGS? -- result'.inverse, _t, this._settings===_t, this.BLUXEN)

};

/**
 * Creates a setting
 * @method create
 * @param  {[type]} set [description]
 * @return {[type]}     [description]
 */
exports.create = function(set) {
  set._set = set.set;
  set.set = function(val, prop) {
    _set.call(this, set)
    set._set.apply(this, arguments)
  }
}

/**
 * Extracts settings from settingsobject and stores them in an array.
 * @method parse
 * @param  {Object} settings Settingobject
 * @param  {Object} object   Settingsobject
 */
exports.parse = function(settings, object) {
  if (!object) {
    object = this._settings
  }
  for (var i in object) {
    if (settings[i]) {
      if (!settings._settings) {
        settings._settings = [];
      }
      settings._settings.push(i);
    }
  }
};

/**
 * Adds setting(s) to Base prototype
 * @method add
 * @param  {String[]}    name  Array of settingnames
 * @param  {Prototype}   proto Prototype eg. myBase class
 */
exports.add = function(name, proto) { //start using this sometimes!;
  if (name instanceof Array) {
    for (var i in name) {
      if (proto) {
        this.add(name[i], proto);
      } else {
        this.addSetting(name[i], false);
      }
    }
  } else {
    if (!proto) {
      util.setstore.call(this);
      if (!this.__._settings) {
        this.__._settings = {};
      }
      for (var j in this._._settings) {
        this._settings[j] = this._._settings[j];
      }
      this._settings[name] = true;
    } else {
      proto.prototype._settings[name] = true;
    }
  }
};

/**
 * Add settings to instances of Base
 * settings only work for instances of the added Basesettings
 * @method
 */
util.define(base,
  'addSetting', function(name) {
    exports.add.call(this, name);
    if (this._class) {
      this._class.prototype._._settings = this._settings;
    }
  },
  /**
   * Simple implementation of setting.create
   * @method setSetting
   * @param  {Object} set Settingobject
   */
  'setSetting', function(set) {
    //eerst checken of ie al bestaat anders kan het voorkomen dat het teveel is
    exports.parse.call(this, set);

    // console.log('SET SETTING'.yellow.inverse, set, this._settings )

    //get gebruiken --- object is een check op meerdere fields returns true of false // bij get ook mogelijk om field mee te geven
    _set.call(this, set);

    // console.log('SET SETTING -- result'.yellow.inverse, this._settings )

  },
  /**
   * [description]
   * @method removeSetting
   * @param  {String}       name     Name of the setting to remove
   * @param  {Array|Object} settings Settingobject
   */
  'removeSetting', function(name, settings) {

    // if(!settings) {
    //   //this may all be not nessecary!
    //   for(var i in this._settings) {
    //     for(var j in this._settings[i]) {
    //       if(this._settings[i][j].name===name) {
    //         settings=this._settings[i][j]
    //         break;
    //       }
    //     }
    //   }
    // }

    if (!(settings instanceof Array)) {
      //this may all be not nessecary!
      // if(settings instanceof Object) {
      //   settings = settings._settings
      // } else {
        settings = [settings];
      // }
    }

    for (var i = settings.length - 1, found, _settings = this._settings; i >= 0; i--) {
      if (_settings && _settings[settings[i]] && _settings[settings[i]][name]) {
        found = true;
        break;
      }
    }
    if (found) {
      _set.call(this, {
        name: name,
        _settings: settings
      }, true);
    }
  },

  /**
   * Checks if object has settings and executes them. Arguments are passed to settings.
   * @method setting
   * @param  {String}    name Name of the setting
   * @param  {Arguments} arg  Arguments to pass to settings
   */
  'setting', function(name, arg) { //misschien arg
    var _s = this._settings;
    if (_s && _s[name] && _s[name] !== true) {
      for (var i in _s[name]) {
        _s[name][i][name].apply(this, arg);
      }
    }
  });

/**
 * Base has two default settings
 * new is invoked on construction , remove on removal;
 * @settings
 */
exports.add(['new', 'remove'], base)
