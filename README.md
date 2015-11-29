# ZPubSub

ZPubSub is a general purpose publish/subscribe implementation that focuses on three things:

*  Event Aggregation
*  Command/Response
*  Request/Receive

Event Aggregation is your typical events.  It's some component in your application telling every other component that something has happened.  Command/Response is when a component tells other components to do something.  The response can be a simple OK to a type of failure.  The Request/Receive pattern is when a component requests information from somewhere in your application and receives said information.  It does not care where the information came from.  Only that it got what it wanted.  

#### Change Log
1.0.0 - Start Version

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
<script src="node_modules/zpubsub/bin/zpubsub.js" />
```

```sh
<!--Minified Version.  Good for Production-->
<script src="node_modules/zpubsub/bin/zpubsub.min.js" />
```

You can create a Publish/Subscribe service by using the new operator:

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
// Publishes the topic message.  The result variable will be the first defined value; in this case
// it will be 'OK'
var result = pubSub.publish('MyMessage', 'MyArgs').firstDefined();
// Removes the subscription so no more alert boxes will display.
pubSub.unsubscribe('MyMessage', owner, callback);
```

# License

### ISC License (ISC)
Copyright (c) 2015, Anthony Bonta

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.