try {
  require('./index.js')
} catch (e) {
  process.stdout.write('\033c')
  console.log('starting!')
}

var spawn = require('child_process').spawn
var gaston = spawn( //eslint-disable-line
  'gaston',
  ['test', '-r', 'node', '-s', process.cwd() + '/test/performance/observable/index.js'],
  { stdio: 'inherit' }
)
