# ZPubSub

ZPubSub is a general purpose publish/subscribe implementation that focuses on three similar patterns:

*  Event Aggregation
*  Command
*  Request/Receive

Event Aggregation is your typical events.  It's some component in your application telling every other component that something has happened.  Command is when a component tells other components to do something.  The response to a command can be a simple verification or an object that describes information about what happened as a result.  The Request/Receive pattern is when a component requests information from somewhere in your application.  It does not care where the information comes from, only that it receives the information it needs.

#### Dependencies
In order to build the module, you will need to install the following apps:

* [Node.js](https://nodejs.org/en/)

Once node is installed, you will need to add the grunt-cli to your global node repository:

```sh
$ npm install grunt-cli -g
```

#### Installation

ZPubSub is installed using npm: 

```sh
$ npm install zpubsub --save
```

When you install zpubsub, you will also install [znamespace](https://www.npmjs.com/package/znamespace).  You do NOT have to use znamespace in your project if you use
the node_modules/zpubsub/dist/zpubsub.all.js.  The all.js file includes znamespace for you already. 

If you want to check out and build the source code, you can do so from the bitbucket repository:

```sh
$ git clone https://bitbucket.org/zthun/zpubsub
$ cd zpubsub
$ npm install
$ grunt
```

#### Usage

You can include one of the following in your html file:

```sh
<!--Full Version.  Good for Debugging-->
<script src="node_modules/zpubsub/dist/zpubsub.all.js" />
```

```sh
<!--Minified Version.  Good for Production-->
<script src="node_modules/zpubsub/dist/zpubsub.all.min.js" />
```

The ZPubSub object is located in the zw namespace.  To create a new service, just use the new operator.

```sh
var pubSub = new zw.ZPubSub();
```

Once you have the object, you can use the publish/subscribe/unsubscribe to pass messages around in your application.  

```sh
var owner = window;
var callback = function (args) {
    window.alert('MyMessage has been published with args {0}.'.replace('{0}', args); 
    return 'OK';
};

// Subscribes to a message/topic
pubSub.subscribe('MyMessage', owner, callback);
// Publishes the topic message.  The result variable will be the first defined 
// value; in this case it will be 'OK'
var result = pubSub.publish('MyMessage', 'MyArgs').firstDefined();
// Removes the subscription so no more alert boxes will display.
pubSub.unsubscribe('MyMessage', owner, callback);
```

#### Cleanup

All subscriptions have an owner; this is not optional.  This has the advantage of allowing us to clean up our subscriptions for a specified component without having to keep track of which methods the component is responsible for.  You can do with the unsubscribeAll method.

```sh
var ownerA = {};
var ownerB = {};
var pubSub = new zw.ZPubSub();
pubSub.subscribe('Foo', ownerA, function () { alert('Foo published. Owner A received.'); });
pubSub.subscribe('Bar', ownerA, function () { alert('Bar published. Owner A received.'); });
pubSub.subscribe('Foo', ownerB, function () { alert('Foo published. Owner B received.'); });
// Remove all the subscriptions where ownerA is responsible for.  In this case, this would be the same as doing
// pubSub.unsubscribe('Foo', ownerA, callbackFooFn);
// pubSub.unsubscribe('Bar', ownerA, callbackBarFn); 
pubSub.unsubscribeAll(ownerA);
// Only one alert box would be shown with this publish call.
pubSub.publish('Foo');
// This will do nothing.
pubSub.publish('Bar');
```

This allows owners of subscriptions to just use inline functions rather than using external function objects.

#### Registration and Yelling

The ZPubSub object comes with a few convinent methods that you can use to create additional functions for the topics that your application supports.  You can do this using the register function.  This is completely optional, but can create cleaner code depending on how your application is structured.  It also has the advantage that you won't mistype a message name.

```sh
pubSub.register('Foo');

// Same as subscribe('Foo', owner, callback);
pubSub.subscribeFoo(owner, callback);
// Same as publish('Foo', 'MyArgs');
pubSub.publishFoo('MyArgs');
// Same as unsubscribeFoo(owner, callback);

// Removes the subscribeFoo, publishFoo, and unsubscribeFoo from the object.
pubSub.deregister('Foo');
```

There is also a convinence function called yell.  Yelling is the idea that you shout a command, request, or event, and you simply run with the first defined value that is returned to you.  

```sh
// Assume for a second that callback1 will return undefined, callback2 will return 'A' and callback3 will return 'B'
pubSub.register('Foo');
pubSub.subscribeFoo(owner, callback1);
pubSub.subscribeFoo(owner2, callback2);
pubSub.subscribeFoo(owner3, callback3);

// Same as pubSub.publishFoo('A', 'B', 'C').firstDefined();
var result = pubSub.yellFoo('A', 'B', 'C');

// Will log 'A' to the console since callback1 returned an undefined value.
console.log(result);
```

#### Asynchronous Design

All return values to the publish method are synchronous.  That means that when you call publish, it will return you values immediately from all subscribers.  

What happens if your app heavily uses asynchronous paradigms?  Simple!  Have the subscribers return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object.

If you need a promise polyfill, [this](https://github.com/taylorhakes/promise-polyfill) library is a great way to fill that gap.

```sh
var owner = window;
var pubSub = new zw.ZPubSub();

pubSub.register('GetSupportedLettersCommand');

pubSub.subscribeGetSupportedLettersCommand(owner, function () {
        return new Promise(function(resolve, reject) {
            setTimeout(function () { 
                resolve(['a', 'b', 'c']);
            }, 4000);
        });
});

pubSub.publishGetSupportedLettersCommand().firstDefined().then(function (result) {
    // The asynchronous operation is completed.
    // The result object here should be ['a', 'b', 'c']
    window.alert(result);
});
```