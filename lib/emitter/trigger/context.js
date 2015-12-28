'use strict'
/*
**** WARNING ****
* cannot use double inheritance paths
* var Thing = new Elem({ text: })
* var Page = new Elem({ gurk: { thing: new Thing }})
* when you start making instances of page.gurk -- gurk will be used as top level -- if this become a problem we have to think of something
* can be much unified with element and subs i supose -- its just storing common ancestor paths exactly what we want for subs
* how to do how to do
* prob just storing them
* has to be greedy and smarter in doing things
*
* **** WARNING 2 ****
* for condition when using defered events context will be pretty much lost (dont want to store on defaut event)
* the condition event will handle this itself
*
* **** WARNING 3 ****
* context does not get restored -- dont want to store context chains
*/
module.exports = function emitContext (parent, bind, event, data, emitter, context, spath) {
  let parentInstances
  let path
  while (parent && !parent._context) {
    parentInstances = parent.getInstances()
    if (parentInstances) {
      let pathlength
      // think about path in here -- which case happens most?
      for (let i = 0, length = parentInstances.length; i < length; i++) {
        let instance = parentInstances[i]
        let target = instance
        // instance.clearContext()
        if (!context || instance === context) {
          if (path) {
            if (!pathlength) {
              pathlength = path.length - 1
            }
            for (let j = pathlength; j >= 0; j--) {
              // console.log('    ', target._path, instance._path)
              target = target[path[j]]
              if (!target) {
                break
              }
              target._context = instance
            }
          }
          // console.log('this is it!'.bold, bind.key.red)
          // so lets remove the context getter on _fn its bullcrap since that does not have context!
          if (target && target[bind.key] === bind) {
            // console.log(bind.key)
            bind._context = instance
            // console.log(bind._path, target._context === instance)
            emitter.execInternal(bind, event, data)
          }
          // not a lot of sanitazion going on like this...
          emitContext(instance, bind, event, data, emitter, false, path)
          if (context) {
            return
          }
        }
      }
      return
    }
    if (!path) {
      // THIS IS WAY TOO MUCH CREATION THATS GOING HERE
      // make it a lot faster -- maybe just reusing segments? multi array?
      // looping -- setting one var -- current array 00 yes this is best
      // good
      path = parent.spath ? spath.concat() : []
    }
    path.push('_' + parent.key) // reuse!!! godamn must be easy
    parent = parent._parent
  }
}
