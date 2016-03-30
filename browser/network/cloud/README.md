#V.cloud
---------------
Methods | Description
------ | -----------
[.write()](#write) | Writes a specified message to the cloud service.
[.on()](#on) | Adds a listener for a cloud event.
[.once()](#once) | Adds a one time listener for the event. This listener is invoked only the next time the event is fired, after which it is removed.
[.removeListener()](#removeListener) | Removes a listener from the listener array for the specified event.
[.emit()](#emit) | Executes each of the listeners for a specified event with the supplied argument.
[.whenReady()](#whenReady) | Executes passed function if or once the client is connected.
[.join()](#join) | Sends a join request to the cloud service with specified parameter Object.
[.leave()](#leave) | Disconnects a specific or all room Object(s) from the cloud service.

### .write( *data* )
Writes a specified message to the cloud service. The cloud service will iterate through the passed Object and treat each field as an event with it's field name as the event name and it's value as the event parameter.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
data | Object | - | The information to be sent to the server. Each field in the Object represents an event.

````javascript
V.cloud.write({
	myevent:{
        foo: 'bar'
    }
});
````

### .on( *event*, *callback* )
Adds a listener for a cloud event.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
event | String | - | Event to listen for.
callback | function( *data* )  | - | Function to call when the event is fired.

````javascript
V.cloud.on('update', function onUpdate(msg){
	console.log('update event fired:', msg);
});
````

### .once( *event*, *callback* )
Adds a one time listener for the event. This listener is invoked only the next time the event is fired, after which it is removed.

````javascript
V.cloud.once('update', function onUpdate(msg){
	console.log('update event fired:', msg, 'bye!');
});
````

### .removeListener( *event*, *callback* )
Removes a listener from the listener array for the specified event.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
event | String | - | Event that the listener is attached to.
callback | function()  | - | Callback of the listener to be removed.

````javascript
V.cloud.removeListener('update', onUpdate);
````

### .emit( *event*, *data* )
Executes each of the listeners for a specified event with the supplied argument. Is used by sub-modules to fire cloud eventListeners on the client (it does not communicate to the cloud service).

Argument | Type | Default | Description
------ | ---- | ------- | -----------
event | String | - | Event to be fired.
data | any | - | Parameter to be passed to the listeners.

````javascript
V.cloud.emit('update', onUpdate);
````

### .whenReady( *callback* )
Executes passed function if the client is connected, otherwise it adds a listener to call the function as soon as the connection is established.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
callback | function | - | Function to be called.
````javascript
V.cloud.whenReady(function(){
	console.log('connected V cloud service!');
});
````
### .join( *joinobj*, [*callback*], [*room*] )
Sends a join request to the cloud service with the specified parameter Object.
Calls the callback on when the server replies, either passing an Object containing a single error field (implying joining failed), or a `V.Object` representing and synced with the Room Object.
The user can pass an existing `V.Object` that will be merged with and synced to the data from the Room Object.

Returns the synced `V.Object`.

Argument | Type | Default | Description
------ | ---- | ------- | -----------
joinobj | Object | - | Parameters Object containing the information determining what kind of room to join.
callback | function(*room*)  | - | Function to be called once the room is joined. room is a `V.Object` representing the room or an error Object.
room | V.Object | - |Will be used as the Room Object. Useful for "enriching" existing data with Room data.

````javascript
var prep = new V.Data({
	foo:'bar'
});

var returnedroom = V.cloud.join({type:'roomtype', name:'roomname'}, function(room){
	if(room.error) console.error('join failed!', room.error);
	console.log('joined the room', room);
    // prep === returnedroom && returnedroom === room
}, prep);
````
[check out the getting started guide](http://vigour.io/#getting started) to see a working example.

### .leave([*room*], [*kicked*])
Disconnects a specific or all room Object(s) from the cloud service.
Argument | Type | Default | Description
------ | ---- | ------- | -----------
room | V.Object | - | Room to leave, if not defined, all rooms will be left.
kicked | Boolean  | false | Will be true if the leave was instigated by the cloud service.
