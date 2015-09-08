module.exports = function findPackage() {
  var cwd = process.cwd()
  var folders = cwd.split('/')
  var package

  while(folders.length){
    var path = folders.join('/') + '/package.json'
    console.log('look for', path)
    try{
      package = require(path)
      break;
    }catch(err){
      // console.log('no package found at', path)
    }
    folders.pop()
  }

  return package
}
