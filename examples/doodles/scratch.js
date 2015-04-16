

var b = new Obj({
  $text: {
    $settings: {
      get:function() {
        return 'flapflap'
      },
      set:function(val) {
        return val+'xxx'
      },
      $on_parent: {
        creating: function() {
          this.$text = 'hopsaflops'
        }
      }
    }
  }
})


var a = new b.$constructor({
  $settings: {
    $constructorToUseForNonSettingsFields:'self'
  },
  bla: 'heyman!'
})


var c = new a.$constructor({
  bla: 'xxxxxx'
})

