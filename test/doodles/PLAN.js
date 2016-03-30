bla.x = {
    data:'blurf',
    setting:
    { remo...
    , events:

    },
    update: {
      condition: {
        '_caller._rendered':true
      },
      val:function() {

      },
      update:function() {

      },
      process: {
        idle: {

        }
      }
    }
}


bla = {
  events: {
    render: {
      val: function() {
          this.process = 'raf'
          this.collection = {data:true}
      }
    }
  }
}


bla = {
  x:{click:{data:'fun'}}
}

bla.events = {
  click: {
    decay:500,
    up:{
      data: 'title',
      transform: [ toUpperCase, ]
      once: function(v) {
        this.rotate = 180
        //v.remove()
      },
      decay:500
    }
  }
}

 events: {
      render: {
        inherit
        transform: upperCase,
        add: {
          data:'blarg',
          once:{
            condition: {$gt:5 },
            val:function() {

            }
          }
        }
      }
    },