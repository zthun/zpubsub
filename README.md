# **ZPubSub**

ZPubSub is a general purpose publish/subscribe module.  It is used to implement three different implementation patterns.  

### *Event Aggregation*

Event Aggregation is your typical events.  It is some component in your application telling every other component that something has happened.  Generally, the sender does not expect a response.

### *Command and Verify*

Command and Verify is telling other components what do do.  With this pattern, the sender expects a response from all components that verifies the command has been fulfilled.  

### *Request and Receive*

The Request and Receive pattern is when a component requests information from somewhere in your application.  It does not care where the information comes from/

## **Basic Usage**

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

Once you have the object, you can use *publish*, *subscribe*, and *unsubscribe* to pass messages around your application.

```sh
import {ZPubSub} from 'zpubsub';

let messenger = new ZPubSub();
let owner = {};
let cbA = (args) => args;
let cbB = () => 'OK';

// Registers some subscribers for a topic.
messenger.subscribe('MyMessage', owner, cbA);
messenger.subscribe('MyMessage', owner, cbB);

// Publish the topic and grab the responses.
let responses = messenger.publish('MyMessage', 'MyArgs');
let firstResponse = responses[0]; // 'MyArgs'
let secondResponse = responses[1]; // 'OK';

// No more listening for the topic.
messenger.unsubscribe('MyMessage', owner, callback);

responses = messenger.publish('MyMessage', 'MyArgs');

//logs an empty array
console.log(responses);
```

## **Cleanup**

All subscriptions have an owner; this is not optional.  This enables a subscription cleanup feature for a specified component without having to keep track of which methods the component is responsible for.  You can do this with the *unsubscribeAll* method. 

```sh
import {ZPubSub} from 'zpubsub';

let messenger = new ZPubSub();
let ownerA = {};
let ownerB = {};

messenger.subscribe('Foo', ownerA, ()=>console.log('Foo published. Owner A received.'));
messenger.subscribe('Bar', ownerA, ()=>console.log('Bar published. Owner A received.'));
messenger.subscribe('Foo', ownerB, ()=>console.log('Foo published. Owner B received.'));

messenger.unsubscribeAll(ownerA);

// Only one message gets logged here.  
messenger.publish('Foo');
messenger.publish('Bar');
```

This allows owners of subscriptions to just use inline functions rather than having to keep track of function pointers for the sole purpose of unsubscribing.  

## **Registration and Yelling**

The ZPubSub object comes with a few convenient methods that you can use to create additional functions for the topics that your application supports.  You can do this using the *register* function.  This is completely optional, but can create cleaner code depending on how your application is structured.  It also has the advantage that you won't mistype a message name.

```sh
import {ZPubSub} from 'zpubsub';

let messenger = new ZPubSub();
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

There is also a convenience function called *yell*.  Yelling is the idea that you shout a command, request, or event, and you simply run with the first defined value that is returned to you.

```sh
import {ZPubSub} from 'zpubsub';

let callback1 = ()=> undefined;
let callback2 = ()=>'A';
let callback3 = ()=>'B';
let messenger = new ZPubSub();
messenger.register('Foo');

messenger.subscribeFoo(owner, callback1);
messenger.subscribeFoo(owner2, callback2);
messenger.subscribeFoo(owner3, callback3);

var result = messenger.yellFoo('A', 'B', 'C');

// Will log 'A' to the console since callback1 returned an undefined value, 
// and callback2 is the first one to return something valid.
console.log(result);
```

## **Asynchronous Design**

All return values to the publish method are synchronous.  That means that when you call publish, it will return you values immediately from all subscribers.  

If you need to do an asynchronous operation, then it is best to have the subscribers return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object.

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
messenger.yellGetSupportedLettersCommand().then((result)=>console.log(result));
```

## **Contributions**

ZPubSub 3.0 is built with Typescript.  It uses npm as the build system to construct the library, so you will want to have the latest, stable [Node.js](https://nodejs.org/en/) installed.  

The source code is located on github.  You can clone the repository and hack away, or you can fork it to your own github account and do pull requests later on.  

```sh
git clone https://github.com/zthun/zpubsub.git
cd zpubsub
npm install
npm run make
npm run compress
```
