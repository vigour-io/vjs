var Cloud = require('../../browser/network/cloud')
    .inject(require('../../browser/network/cloud/datacloud'))
  , Data = require('../../data')
  , cloud = new Cloud('ws://localhost:10001')
  , bla = new Data(cloud.data.get('bla',null),{
      target:{yuzi:true}
    })
  
cloud.data.addListener(function(val) {
  console.log('basic listener',val)
})

bla.addListener(function(val) {
  console.log('listener on data',val)
})
