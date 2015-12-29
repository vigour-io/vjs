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
  //&& (!parent._context)
  while (parent) { //!parent._context FIX THIS!
    // console.log('here?')
    parentInstances = parent.getInstances()
    if (parentInstances) {
      // console.log('yes!')
      let pathlength
      for (let i = 0, length = parentInstances.length; i < length; i++) {
        let instance = parentInstances[i]
        // instance._context = null
        let target = instance
        if (!context || instance === context) {
          if (path) {
            if (!pathlength) {
              pathlength = path.length - 1
            }
            for (let j = pathlength; j >= 0; j--) {
              target = target[path[j]]
              if (!target) {
                break
              }
              target._context = instance
            }
          }
          if (target && target[bind.key] === bind) {
            bind._context = instance
            // console.log(1)
            // for element dont emit on the boys only end point then
            emitter.execInternal(bind, event, data)
            // bind._context = null
          }
          // not a lot of sanitazion going on like this...
          // instance.clearContextUp() //= null
          emitContext(instance, bind, event, data, emitter, false, path, true)
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
