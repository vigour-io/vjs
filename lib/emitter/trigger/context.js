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
module.exports = function emitContext (parent, bind, event, data, emitter, context, spath, doit) {
  let parentInstances
  let path
  while (parent) { // !parent._context FIX THIS!
    parentInstances = parent.getInstances()
    if (parentInstances) {
      let pathlength
      for (let i = 0, length = parentInstances.length; i < length; i++) {
        let instance = parentInstances[i]
        let target = instance
        if (
          !context ||
          instance === context
        ) {
          if (path) {
            if (!pathlength) {
              pathlength = path.length - 1
            }
            for (let j = pathlength; j >= 0; j--) {
              target = target[path[j]]
              if (!target) {
                break
              }
            }
          }
          if (target && target[bind.key] === bind && bind._lc !== bind._context.uid) {
            // if () {
            bind._lc = bind._context.uid
            emitter.execInternal(bind, event, data)
            // }
            // bind.clearContextUp()
            emitContext(instance, bind, event, data, emitter, false, path, true)
            if (context) {
              return
            }
          }
        }
      }
      // return
    }
    if (!path) {
      path = parent.spath ? spath.concat() : []
    }
    path.push(parent.key) // reuse!!! godamn must be easy
    parent = parent._parent
  }
}
