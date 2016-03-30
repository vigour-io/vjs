#V / browser / network
In this section we define the modules we use to interact between different sources over a network.

-------------------
#Overview

||Modules|Description|
|------ | ------- | ------- |
|**Network**|ajax.js|xhr wrapper
|: Cloud|connection.js|makes a connection to the V.Cloud
||data.js|Adds data listeners
||primus.js|Websocket communication
||rooms.js|Join and leave rooms

#Ajax
A [xhr](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) wrapper, adds some nice extras such as multiple requests to a single api call.

###V.ajax( *params* )


Argument | Option | Type | Default | Description
------ | ---- | ------- | ----------- | -----------
params |url | String, Array | | Url or urls to call
||api | String |  | Repeat this string for the url that needs to be called
||complete | Function |  | Specify a callback when an array is passed to url complete is called when all items are complete
||error | Function |  | On error callback
||change | Function |  | Function called on [xhr.onreadystatechange](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
||async | Boolean | true |  If set to false will call an syncronous request (not recommended!)
||user | String | |  User parameter
||pass | String | |  Password parameter
||parse | Boolean | true | If set to false will not try to parse response to JSON
||type | String | GET | POST or GET, can also use .method
||contentType | String | application/x-www-form-urlencoded | equest content type
||mime | String | | defines mime type
||progress | Function | | Progress callback
||header | Object | | Sets request headers
||data | * | | ass data to the request, adds ? on GET;

An example using API and multiple urls.
```javascript
 V.ajax({
    api:"http://www.omdbapi.com/?tomatoes=true&t=",
    url:[
      "Awkward",
      "Gravity",
      "Transformers",
      "Minority Report",
      "Pacific Rim",
      "Oblivion"
    ],
    complete:function(data) {
      console.log('done loading',data);
    }
  });
```

-------------------
**#todo** xhr wrapper will include jsonp in a later stage

