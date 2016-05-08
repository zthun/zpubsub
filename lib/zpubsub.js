(function () {
    var zw = znamespace('zw');

    /**
     * Represents a publish/subscribe module.
     * 
     * This object is an object that encapsulates 3 different possible 
     * patterns:
     *  1.  Request/Receive 
     *  2.  Event Aggregation 
     *  3.  Command
     * 
     * Unlike other publish/subscribe implementations, this one returns
     * an array of responses from its publish method.  This allows 
     * subscribers to give information about the event or command 
     * that was received.  
     * 
     * @this {ZPubSub}
     */
    zw.ZPubSub = function () {
        'use strict';
    
        var subMapProto = Object.create(Object.prototype);
        subMapProto.__zwcoveragetrick__ = true;
        var subMap = Object.create(subMapProto);
        var pubsub = this;
        
        pubsub.publish = publish;
        pubsub.yell = yell;
        pubsub.subscribe = subscribe;
        pubsub.unsubscribe = unsubscribe;
        pubsub.unsubscribeAll = unsubscribeAll;
        pubsub.register = register;
        pubsub.deregister = deregister;
        
    
        /**
         * Gets the subscription callback list for a message.
         * 
         * If no such message exists, then an empty array is associated for the message and that
         * will be returned.
         * 
         * @param {String} topic The message to retrieve the callback list for.
         * 
         * @returns {Array} An array of callbacks for the event.
         */
        function _getSubscription (topic) {
            if (!subMap.hasOwnProperty(topic)) {
                subMap[topic] = [];
            }
    
            return subMap[topic];
        }
    
        /**
         * Publishes an event.
         * 
         * The argument list beyond the message is passed through.
         * 
         * @param {String} topic   This is the string message that
         *                          represents the event id.
         *                       
         * @returns {Array} The list of return values.  This list can contain undefined and
         *                  null values.  If there are no callbacks, then you will receive an 
         *                  empty array.  The array will be annotated to contain a firstDefined() method
         *                  that will return the first object defined or null if no such object is defined.
         */
        function publish (topic) {
            if(!topic) {
                throw new Error('The topic to publish was not supplied.');
            }
            
            var callbacks = _getSubscription(topic);
            var results = [];
            var args = Array.apply(null, arguments).slice(1);
                
            for (var i = 0, len = callbacks.length; i < len; i += 1) {
                var store = callbacks[i];
                results.push(store.callback.apply(pubsub, args));
            }
    
            results.firstDefined = function () {
                for(var index = 0; index < this.length; index = index + 1) {
                    var current = this[index];
                    
                    if(current !== null && current !== undefined) { 
                        return current;
                    }
                }
                return null;
            };
            
            return results;
        }
        
        /**
         * Publishes the message and arguments and returns the first 
         * defined response, if any. 
         * 
         * This method is equivalent to pubSub.publish(topic, {arg1}, {arg2}).firstDefined();
         * 
         * @param {String} topic The message to publish. 
         * 
         * @return {Object} The first defined response to the publish message.  
         *                  Returns null if nobody responds. 
         */
        function yell(topic) {
            if(!topic) {
                throw new Error('The topic to yell was not supplied.');
            }
            
            return publish.apply(pubsub, arguments).firstDefined();
        }
    
        /**
         * Subscribes to an event.
         * 
         * @param {String} topic          The id of the event to subscribe to.
         * @param {Object} owner        The object that owns the subscription.
         * @param {Function} callback   The callback to invoke when the event is raised.  This callback 
         *                              will be invoked with 3 arguments.  The first is the data that 
         *                              gets passed to the publish method, and the 2nd is the owner of the  
         *                              message callback, and the 3rd argument is the message itself..  
         * 
         * @return {Object} This method returns an object that contains two properties:  
         *                  1.  owner:  The passed owner object. 
         *                  2.  callback: The callback that will be invoked when msg is published. 
         */
        function subscribe(topic, owner, callback) {
            if(!topic) {
                throw new Error('The topic to subscribe to was not supplied.');
            }
            
            if(!owner) {
                throw new Error('The owner for the subscription was not supplied.');
            }
            
            if(typeof callback !== 'function') {
                throw new Error('The callback function for the topic was not defined or not a function.  Did you forget to pass the owner?');
            }
            
            var store = _getSubscription(topic);
            var event = {owner: owner, callback: callback};
            store.push(event);
            return event;
        }
    
        /**
         * Removes a subscription from the callback list.
         * 
         * @param {String} topic          The id of the message to remove.
         * @param {Object} owner        The object that owns the subscription.
         * @param {Function} callback   The callback that was registered in the subscribe method.
         * 
         * @returns {Boolean} True if the subscription list was modified, false otherwise.
         */
        function unsubscribe(topic, owner, callback) {
            if(!topic) {
                throw new Error('The topic to unsubscribe from was not supplied.');
            }
            if(!owner) {
                throw new Error('The owner that owns the topic to unsubscribe from was not supplied.');
            }
            if(typeof callback !== 'function') {
                throw new Error('The specific callback for the topic and owner pair to unsubscribe from was not supplied.');
            }
            var callbacks = _getSubscription(topic);
            var modified = false;
    
            for (var i = callbacks.length - 1; i >= 0; i -= 1) {
                var current = callbacks[i];
    
                if (current.owner === owner && current.callback === callback) {
                    callbacks.splice(i, 1);
                    modified = true;
                }
            }
    
            return modified;
        }
    
        /**
         * Removes all subscriptions from an owner.
         * 
         * @param {type} owner The object to remove all subscriptions for.
         * 
         * @returns {boolean} True if the subscription list was modified, false otherwise.
         */
        function unsubscribeAll(owner) {
            if(!owner) {
                throw new Error('The owner to remove all subscriptions for was not supplied.');
            }
            var modified = false;
            
            for(var property in subMap) {
                if(subMap.hasOwnProperty(property)) {
                    var value = subMap[property];
                    
                    for (var index = value.length - 1; index >= 0; index = index - 1) {
                        var currentCallback = value[index];
        
                        if (currentCallback.owner === owner) {
                            value.splice(index, 1);
                            modified = true;
                        }
                    }
                }
            }
    
            return modified;
        }
        
        /**
         * Registers a series of method objects on the service 
         * for the given topic.
         * 
         * This method creates convinence methods for a given topic
         * name.  
         * 
         * You will get the following methods on this service by calling 
         * this function:  
         * 1.  publish{topic}(args) => shortcut to publish(topic, args);
         * 2.  subscribe{topic}(owner, callback) => shortcut to subscribe(topic, owner, callback);
         * 3.  unsubscribe{topic}(owner, callback) => shortcut to unsubscribe(topic, owner, callback);
         * 
         * It's good practice to make sure that the topic name is javascript 
         * friendly. 
         * 
         * @param {String} topic The sur name of the convinence function. 
         */
        function register(topic) {
            if(!topic) {
                throw new Error('The topic to register was not supplied.');
            }
            
            var publishName =  'publish' + topic;
            var yellName = 'yell' + topic;
            var subscribeName = 'subscribe' + topic;
            var unsubscribeName = 'unsubscribe' + topic;
           
            pubsub[publishName] = publish.bind(pubsub, topic); 
            pubsub[yellName] = yell.bind(pubsub, topic);
            pubsub[subscribeName] = subscribe.bind(pubsub, topic);
            pubsub[unsubscribeName] = unsubscribe.bind(pubsub, topic);
        }
        
        /**
         * Removes the convinence methods created by register. 
         * 
         * @param {String} topic The topic to deregister. 
         */
        function deregister(topic) {
            if(!topic) {
                throw new Error('The topic to deregister was not supplied.');
            }
            
            var publishName =  'publish' + topic;
            var yellName = 'yell' + topic;
            var subscribeName = 'subscribe' + topic;
            var unsubscribeName = 'unsubscribe' + topic;
           
            if(pubsub.hasOwnProperty(publishName)) {
                delete pubsub[publishName];
            }
            
            if(pubsub.hasOwnProperty(yellName)) {
                delete pubsub[yellName];
            }
           
            if(pubsub.hasOwnProperty(subscribeName)) {
                delete pubsub[subscribeName];   
            }
            
            if(pubsub.hasOwnProperty(unsubscribeName)) {
                delete pubsub[unsubscribeName];   
            }
        }
    };
})();