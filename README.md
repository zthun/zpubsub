# **ZPubSub**

ZPubSub is a general purpose publish/subscribe implementation that can be used with three different patterns.  

####Event Aggregation

Event Aggregation is your typical events.  It's some component in your application telling every other component that something has happened.  Generally, the sender does not expect a response when raising an event in this manner.  

####Command and Verify

Command and Verify is telling some other component what do do.  With this pattern, the sender expects a response from something that verifies the command has been fulfilled.  

####Request/Receive

The Request/Receive pattern is when a component requests information from somewhere in your application.  It does not care where the information comes from, only that it receives the information it needs.

### **Usage**

This module is installed with NPM.  

```
$ npm install zpubsub --save
```

You can then use it in one of two ways.  If you are including zpubsub as a web component, then you can just include the build script in your html file:

```
<script src="node_modules/zpubsub/dist/zpubsub.min.js" />
```

Note that if you are using ZPubSub in this manner, then the namespace has changed from 2.0 to 3.0 from zw to zpubsub.  So to create a new object in 3.0, you need to run the constructor function.

```
var umdZPubSub = new zpubsub.ZPubSub();
```

The unminified version is also included in the same directory as well and is the main entry point if you're using Typescript.   

```
import {ZPubSub} from 'zpubsub';
let messenger = new ZPubSub();
```

Non ES2017 syntax is also supported, but you'll get the entire namespace similar to how it is used in the web format.

```
var zpubsub = require('zpubsub');
var messenger = new zpubsub.ZPubSub();
```

Once you have the object, you can use the publish/subscribe/unsubscribe to pass messages around in your application.  The following sample subscribes to the 'MyMessage' topic, publishes the 'MyMessage' topic, stores the first response to the topic into a variable, and then unsubscribes from the topic.

```sh
let owner = window;
let cb = (args) => {
	let msgFmt = 'MyMessage: args {0}.';
	let msg = msgFmt.replace('{0}', args);
    window.alert(msg); 
    return 'OK';
};

messenger.subscribe('MyMessage', owner, callback);
let result = messenger.publish('MyMessage', 'MyArgs')[0];
pubSub.unsubscribe('MyMessage', owner, callback);
```

#### Cleanup

All subscriptions have an owner; this is not optional.  This has the advantage of allowing us to clean up our subscriptions for a specified component without having to keep track of which methods the component is responsible for.  You can do with the unsubscribeAll method.  The following sample demonstrates this.  Only one alert box would be shown.  

```sh
import {ZPubSub} from 'zpubsub';
let messenger = new ZPubSub();
let ownerA = {};
let ownerB = {};
messenger.subscribe('Foo', ownerA, ()=>alert('Foo published. Owner A received.'));
messenger.subscribe('Bar', ownerA, ()=>alert('Bar published. Owner A received.'));
messenger.subscribe('Foo', ownerB, ()=>alert('Foo published. Owner B received.'));
messenger.unsubscribeAll(ownerA);
messenger.publish('Foo');
messenger.publish('Bar');
```

This allows owners of subscriptions to just use inline functions rather than using external function objects.

#### Registration and Yelling

The ZPubSub object comes with a few convenient methods that you can use to create additional functions for the topics that your application supports.  You can do this using the register function.  This is completely optional, but can create cleaner code depending on how your application is structured.  It also has the advantage that you won't mistype a message name.

However, if you are using TypeScript, then this functionality is not supported as TS would generate an error.  The only way around this is to use an **any** object, or to define the exact interface that you need with all methods.  

```sh
messenger.register('Foo');

// Same as subscribe('Foo', owner, callback);
messenger.subscribeFoo(owner, callback);
// Same as publish('Foo', 'MyArgs');
messenger.publishFoo('MyArgs');
// Same as unsubscribeFoo(owner, callback);
messenger.unsubscribeFoo(callback);
// Removes the subscribeFoo, publishFoo, and unsubscribeFoo from the object.
messenger.deregister('Foo');
```

There is also a convenience function called yell.  Yelling is the idea that you shout a command, request, or event, and you simply run with the first defined value that is returned to you.  Assume that callback1 in the following sample returns undefined, callback2 returns 'A', and callback3 returns 'B'.

```sh
messenger.register('Foo');
messenger.subscribeFoo(owner, callback1);
messenger.subscribeFoo(owner2, callback2);
messenger.subscribeFoo(owner3, callback3);
var result = messenger.yellFoo('A', 'B', 'C');

// Will log 'A' to the console since callback1 returned an undefined value.
console.log(result);
```

#### Asynchronous Design

All return values to the publish method are synchronous.  That means that when you call publish, it will return you values immediately from all subscribers.  

What happens if your app heavily uses asynchronous paradigms?  Simple!  Have the subscribers return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object.

If you need a promise polyfill, [this](https://github.com/taylorhakes/promise-polyfill) library is a great way to fill that gap.

```sh
import {ZPubSub} from 'zpubsub';

let owner = window;
let messenger = new ZPubSub();

function supportedLetters(resolve) {
	setTimeout(()=>resolve(['a', 'b', 'c'), 4000);
}

messenger.register('GetSupportedLettersCommand');
messenger.subscribeGetSupportedLettersCommand(owner, ()=>new Promise(supportedLetters));
// result will be ['a', 'b', 'c'] once the promise resolves.
pubSub.yellGetSupportedLettersCommand().then((result)=>window.alert(result));
```





```sh
$ git clone https://bitbucket.org/zthun/zpubsub
$ cd zpubsub
$ npm install
$ grunt
```

###**Contributions**

ZPubSub 3.0 is built with Typescript.  It uses npm as the build system to construct the library, so you will want to have the latest, stable [Node.js](https://nodejs.org/en/) installed.  

The source code is located on github.  You can clone the repository and hack away, or you can fork it to your own github account and do pull requests to the official.  

```
git clone https://github.com/zthun/zpubsub.git
cd zpubsub
npm install
npm run make
npm run compress
```

