var Data = require('../../../data')
      .inject(require('../../../data/selection'))
  , testset = require('./datas')
  , data = new Data(testset)
  , sel = new Data(data, 
  { 
    condition: {data:{data:{s:{users:{$:{search:{$exists:true}}}}}}}
    // condition: {data:{category:'outgoing'}}
  // , condition: {hey:1, wat:3}
  }
)

console.log('SEL', sel.length)

// console.log('SELRAW', selection.raw)
