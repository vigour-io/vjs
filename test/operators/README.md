# Operators
Operators are used to modify the calculated value of a Base instance, this allows us to create compound values (adding one value to another), and derived values (one value depends on another, but is different).
## Add
Add combines extra values into the calculated result of a Base instance. This can take several forms:
### Adding numbers

```javascript
it('use add on a number', function(){
  var base = new Base({
    $val: 3,
    $add: 5
  })
  expect(base.$val).to.equal(8)
})
```

### Adding strings

```javascript
it('use add on a string', function(){
  var base = new Base({
    $val: 'base value',
    $add: ' add this string'
  })
  expect(base.$val).to.equal('base value add this string')
})
```

### Adding fields to an Object

```javascript
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

  // WIP
  // if we set 
  base.$add.$set({
    $transform: function() {
      return {lurfkey: 1}
    }
  })

  // get 
  $val = base.$val
  console.log('------------------- > ?', $val.$toString())

})
```

## Map
Map works in quite the same way as [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). The function in $map is called for every property in the Base instance and the result is stored in base.$results under the same key.

```javascript
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
            console.log('i now hold value', val, 'make me somethin?')
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



```

