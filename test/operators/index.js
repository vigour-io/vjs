require('tester')

describe('Operators', function() {
  var Base
  it('require Base', function () {
    Base = require('../../lib/base')
  })

  /*  
  # Operators
  Operators are used to modify the calculated value of a Base instance, this allows us to create compound values (adding one value to another), and derived values (one value depends on another, but is different).
  ## Add
  Add combines extra values into the calculated result of a Base instance. This can take several forms:
  ### Adding numbers
  */
  it('use add on a number', function(){
    var base = new Base({
      $val: 3,
      $add: 5
    })
    expect(base.$val).to.equal(8)
  })
  /*
  ### Adding strings
  */
  it('use add on a string', function(){
    var base = new Base({
      $val: 'base value',
      $add: ' add this string'
    })
    expect(base.$val).to.equal('base value add this string')
  })
  /*
  ### Adding fields to an Object
  */
  var base
  it('use add on an object', function(){
    base = new Base({
      key1: 'val1',
      $add: {
        addkey1: 'addval1',
        addkey2: 'addval2',
        $add: {
          nestedaddkey: 'nestedaddval'
        }
      }
    })
    base._$key = 'base'

    // Only the calculated value (base.$val) has the added fields.
    var $val = base.$val

    // The added properties are Base instances.
    expect($val.key1.$val).to.equal('val1')
    expect($val.addkey1.$val).to.equal('addval1')
    expect($val.addkey2.$val).to.equal('addval2')
    expect($val.nestedaddkey.$val).to.equal('nestedaddval')

    // Because the result of adding properties is different from the original 
    // Base instance, base.$val returns base.$results, which represents the
    // final result of all operators. The added properties reference their 
    // origins in base.$add.
    expect($val.nestedaddkey.$path).to.deep.equal(
      ['base', '$results', 'nestedaddkey']
    )
    expect($val.nestedaddkey.$origin.$path).to.deep.equal(
      ['base', '$add', '$add', 'nestedaddkey']
    )
    expect($val.key1.$path).to.deep.equal(
      ['base', '$results', 'key1']
    )
    expect($val.key1.$origin.$path).to.deep.equal(
      ['base', 'key1']
    )

  })
  /*
  ## Prepend
  Prepend adds a value to the start of something, where add appends it to the end,
  prepend prepends it to the beginning.

  ### Prepending a string
  This use case is most often used when compounding a url to image or video assets
  from the app data. When all assets are stored at a certain domain (e.g. "http://assets.vigour.io/)", it makes sense to only store the end of the path (that which is unique for each piece of data), and prepend the same base domain everywhere to get the complete path.
  */
  it('use prepend on string', function(){

    var url = new Base({
      $val: 'path/to/file',
      $prepend: 'http://base.path.com/'
    })

    expect(url.$val).to.equal('http://base.path.com/path/to/file')

    var actor = new Base({
      name: 'Jhonny Dicaprio',
      img: 'img/actors/15'
    })

    url.$val = actor.img
    expect(url.$val).to.equal('http://base.path.com/img/actors/15')
    
  })
  /*
  ### Prepending on an Object
  */
  it('prepending properties to a Base instance', function(){
    var base = new Base({
      basekey: 'baseval',
      $prepend: {
        prepended: 'pepended'
      }
    })

    var $val = base.$val
    var cnt = 0
    var expected = ['prepended', 'basekey']

    $val.$each(function(value, key){
      console.log('beng key', key)
    })

  })
  /*
  ## Map
  Map works in quite the same way as [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). The function in $map is called for every property in the Base instance and the result is stored in base.$results under the same key.
  */
  it('use map', function(){
    var base = new Base({
      f1: 'val1',
      f2: 'val2',
      f3: 'val3',
      $map: function(property, key) {
        switch(key) {
          case 'f1':
            return 1
          break;
          case 'f2':
            return {$val: 2, $add: 4}
          break;
          case 'f3': 
            return function(val) {
              return 'fnresult'
            }
          break;
        }
      }
    })
    base._$key = 'base'

    // properties of base are untransformed:
    expect(base.f1.$val).to.equal('val1')

    // to get the mapped / transformed properties, get base.$val.
    var $val = base.$val
    expect($val.f1.$val).to.equal(1)
    expect($val.f2.$val).to.equal(6)
    expect($val.f3.$val).to.equal('fnresult')

    // again the properties resulting from operators live in base.$results
    expect($val.f3.$path).to.deep.equal(['base', '$results', 'f3'])

  })
  /*
  ## Updating operators
  When operators are updated we expect the $results to stay in sync with these changes.
  */
  it('changing operators updates $results', function(){

    base = new Base({
      key1: 'val1',
      $add: {
        addkey1: 'addval1',
        addkey2: 'addval2',
        $add: {
          nestedaddkey: 'nestedaddval'
        }
      }
    })
    base._$key = 'base'

    var $val = base.$val

    expect($val.nestedaddkey.$val).to.equal('nestedaddval')

    // here we update the base.$add operator
    base.$add.$set({
      $transform: function() {
        return { swank: 1 }
      }
    })

    // $val should now be updated accordingly
    expect($val).to.have.property('swank')
      .which.has.property('$val')
      .which.equals(1)

    // these will not fulfill until we have $remove
    expect($val).to.not.have.property('addkey1')
    expect($val).to.not.have.property('addkey2')
    expect($val).to.not.have.property('nestedaddkey')

  })
  /*
  ## Changing the type of base 
  How will operators behave when the type of their base instance changes?.
  */
  it('change type of base instance', function(){

    var base = new Base({
      key1: true,
      $add: {
        addkey: true
      }
    })

    base.$val = 'wext'

    console.log('what do we expect to happen here?', base.$val)
  })
})
 