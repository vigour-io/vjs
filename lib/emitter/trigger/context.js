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
  let instance
  let path
  while (parent && !parent._context) {
    parentInstances = parent.getInstances()
    if (parentInstances) {
      for (let i = 0, length = parentInstances.length; i < length; i++) {
        instance = parentInstances[i]
        if (!context || instance === context) {
          if (path) {
            for (let j = path.length - 1; j >= 0 && instance; j--) {
              instance = instance[path[j]]
            }
          }
          if (instance && instance[bind.key] === bind) {
            emitter.execInternal(bind, event, data)
          }
          emitContext(instance, bind, event, data, emitter, false, path) // not a lot of sanitazion going on like this..
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
      path = spath ? spath.concat() : []
    }
    path.push(parent.key) // reuse!!! godamn must be easy
    parent = parent._parent
  }
}
