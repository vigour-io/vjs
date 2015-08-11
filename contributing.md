#Contributing

##Documentation Guide. (WIP)

####How to document functions?


```
/**
* A function in List (List.$handleShifted).
* @function $handleShifted (short description)
* @memberof List
* @param {string} [i] [description]
* @return {*} [description]
*/
$handleShifted: function(i) {
  var item = this[i]
  if(item._$parent === this) {
    item.$key = i
  } else if(item._$contextKey !== i){
     this.$createListContextGetter(i)
  }
 }
```


Depending on the function that you're writing, there are some informations that may not be necessary. e.g = `@param` , `@return`.

There is just one information that cannot be avoid.

- `@function` - The function name and a short description

######There are also some 'special' information that we use to document a function, these are:

- `@deprecated` - Use this tag to indicate that the function is being deprecated.

```
/**
@deprecated since vjs version 2.0
...
*/
function oldFunction(){
....
}
```

- `@version` - Use this tag to indicate in wich version the function is available.

```
/**
@version 2.0
...
*/
function newElement (){
...
}
```

- `@link` - If for some reason, you may use another function to explain or show a behavior
 that will help on 


####How to document Namespaces/Class

Use `@namespace` tag to document (modules, classes files ?????)

```
/**
 * List - Write some nice description abou the (file,module,class???)
 * @namespace List
 */

"use strict";

var Observable = require('../observable')
var Event = require('../event')

module.exports = new Observable({
  $define: {
    length: {
      value: 0,
      writable: true
      .....
      
```

####How to generate the documentation file?

All the markdown files are hosted on the VJS github wiki, and configured as a submodule of the VJS repo. Submodules are basically a repo inside another repo, it means that when you pull VJS, vjs.wiki will be pulled as well. 

When working with submodules you need to initialize the submodule and updated it, you have two ways to do that:

- Specify the `--recursive` option when clone the VJS repo - `git clone --recursive git@github.com:vigour-io/vjs.git`

- Initialize the vjs.wiki repo yourself.

   (After you clone the VJS repo), go to vjs.wiki folder and type:
   `git submodule init` (this will initialize the submodule) and then type `git submodule update`  (this will pull all the vjs.wiki content -markdown files )


Notice that the first time that you do one of the both options above, the vjs.wiki repo will be pulled on a 'crazy' repo. Just remeber to run `git checkout master`.



Once you've completed with the coding using the style mentioned above, you don't need to touch any markdown file. Go to terminal and run `npm run doc`, this command will update the vjs.wiki repo with all the new comments that you've added. 

####Pushing the documentation content

The VJS.wiki repo works like a normal repo, so you can commit it and push. Pushing the VJS.wiki repo will not update VJS repo. If you'd like to push the Vjs repo, go to VJS root and push it.

The main ideia of using submodules is that we have the two decoupled repo but in the same hand we have all the content centralized. If you for some reason don't need to update/create documentation, just push VJS repo.

