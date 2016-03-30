#V / browser

In this section we define our modules which interact with the DOM.

-------------------------
#Overview

||Modules|Description|
|------ | ------- | ------- |
|**Browser**|ua.js|user agent parser
||css.js|read and alter external css files
|: Events|events.js|Create events, add events to [`V.Element`](browser/element)
|: Cases|cases.js|abstract cases
||base.js|cases in base class
||object.js|cases in V.Object
|: Element|element.js|Base wrapper for DOM elements
||set.js|extension on base set
|: : Properties|properties.js|some properties e.g. src, text, background
||data.js|integration of data in V.Elements
|: : Animation|animation.js|Animation of elements
|:Network|ajax.js|xhr wrapper
|: : Cloud|connection.js|makes a connection to the V.Cloud
||data.js|Adds data listeners
||primus.js|Websocket communication
||rooms.js|Join and leave rooms

#V.ua - user agent
Useragent sniffing is never used for feature detection, for a multi-screen app you do need information about the device<br> 
This sniffer is ~600bytes , but is quite limited in what it detects for , but you can easily add your own tests.

TODO: Need to add native device info and integrate it into UA.

___
Properties | Description
------ | -----------
.platform | ios, android, osx, windows, xbox, playstation, linux
.device | phone, tablet, desktop, tv, console, chromecast
.browser | chrome, safari, firefox, ie
.version | Browser version
___


### .test( *fn, args* )

Search for regexps in the userAgent<br>
check http://www.useragentstring.com/ to test for userAgents

Argument | Type | Default | Description
------ | ---- | ------- | -----------
fn | function(), String |  | Callback when a test is passed or field in V.ua to add passed test to
args | arguments |  | Arrays true or regExp or String , Label, Browsername

```javascript
this.test('platform', [true, _windows], ['iphone|ipod|ipad', 'ios'], ['mac os x', 'mac']);
//tests for platform and adds Label (ios, mac) to V.ua.platform, when nothing matches the default is windows
```
