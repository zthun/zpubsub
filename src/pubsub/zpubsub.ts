import {ZPubSubEventObject} from './zpubsub-event';

/**
 * Represents an object that implements a messaging platform.
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
 */
export interface IZPubSub {
    /**
     * Publishes an event.
     * 
     * The argument list beyond the message is passed through.
     * 
     * @param {String} topic    This is the string message that
     *                          represents the event id.
     * @param {Array} args      The optional arguments to the callback.
     *                       
     * @returns {Array} The list of return values.  This list can contain undefined and
     *                  null values.  If there are no callbacks, then you will receive an 
     *                  empty array.  If you need just the first value of the array, use
     *                  yell instead.
     */
    publish(topic: string, ...args: any[]): any[]; 
    
    /**
     * Publishes the message and arguments and returns the first 
     * defined response, if any. 
     * 
     * @param {String} topic The message to publish. 
     * 
     * @return {Object} The first defined response to the publish message.  
     *                  Returns null if nobody responds. 
     */
    yell(topic: string, ...args: any[]): any;
    
    /**
     * Subscribes to an event.
     * 
     * @param {String} topic        The id of the event to subscribe to.
     * @param {Object} owner        The object that owns the subscription.
     * @param {Function} callback   The callback to invoke when the event is raised.  This callback 
     *                              will be invoked with 3 arguments.  The first is the data that 
     *                              gets passed to the publish method, and the 2nd is the owner of the  
     *                              message callback, and the 3rd argument is the message itself..  
     * 
     * @return {ZPubSubEventObject} This method returns an object that contains two properties:  
     *                  1.  owner:  The passed owner object. 
     *                  2.  callback: The callback that will be invoked when msg is published. 
     */
    subscribe(topic: string, owner: any, callback: (...args: any[]) => any): ZPubSubEventObject;
    
    /**
     * Removes a subscription from the callback list.
     * 
     * @param {String} topic        The id of the message to remove.
     * @param {Object} owner        The object that owns the subscription.
     * @param {Function} callback   The callback that was registered in the subscribe method.
     * 
     * @returns {Boolean} True if the subscription list was modified, false otherwise.
     */
    unsubscribe(topic: string, owner: any, callback: (...args: any[]) => any): boolean;
    
    /**
     * Removes all subscriptions from an owner.
     * 
     * @param {type} owner The object to remove all subscriptions for.
     * 
     * @returns {boolean} True if the subscription list was modified, false otherwise.
     */
    unsubscribeAll(owner: any): boolean;
    
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
    register(topic: string): void;
    
    /**
     * Removes the convinence methods created by register. 
     * 
     * @param {String} topic The topic to deregister. 
     */
    deregister(topic: string): void;
}

/**
 * Represents an implementation of the IZPubSub contract.
 * 
 * @this {ZPubSub}
 */
export class ZPubSub implements IZPubSub {
    private subMap: any;
    
    /**
     * Initializes a new instance of this object.
     */
    constructor() {
        this.subMap = {};
    }
    
    /**
     * Publishes an event.
     * 
     * The argument list beyond the message is passed through.
     * 
     * @param {String} topic    This is the string message that
     *                          represents the event id.
     * @param {Array} args      The optional arguments to the callback.
     *                       
     * @returns {Array} The list of return values.  This list can contain undefined and
     *                  null values.  If there are no callbacks, then you will receive an 
     *                  empty array.  If you need just the first value of the array, use
     *                  yell instead.
     */
    public publish(topic: string, ...args: any[]): any[] {
        if (!topic) {
            throw new Error('The topic to publish was not supplied.');
        }
        
        const callbacks: ZPubSubEventObject[] = this._getSubscription(topic);
        const results: any[] = [];

        for (let store of callbacks) {
            results.push(store.callback.apply(this, args));
        }
        
        return results;
    }
    
    /**
     * Publishes the message and arguments and returns the first 
     * defined response, if any. 
     * 
     * @param {String} topic The message to publish. 
     * 
     * @return {Object} The first defined response to the publish message.  
     *                  Returns null if nobody responds. 
     */
    public yell(topic: string, ...args: any[]): any {
        if (!topic) {
            throw new Error('The topic to yell was not supplied.');
        }
        
        const argsToApply = [topic].concat(args);
        const results = this.publish.apply(this, argsToApply);
        const definedElements = results.filter((x: any) => x !== null && x !== undefined);
        return definedElements.length === 0 ? null : definedElements[0];
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
    public subscribe(topic: string, owner: any, callback: (...args: any[]) => any): ZPubSubEventObject {
        if (!topic) {
            throw new Error('The topic to subscribe to was not supplied.');
        }
        
        if (!owner) {
            throw new Error('The owner for the subscription was not supplied.');
        }
        
        if (typeof callback !== 'function') {
            let msg = [
                'The callback function for the topic was not defined or not a function.',
                'Did you forget to pass the owner?'
            ].join(' ');
            throw new Error(msg);
        }
        
        let store = this._getSubscription(topic);
        let event: ZPubSubEventObject = new ZPubSubEventObject(owner, callback);
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
    public unsubscribe(topic: string, owner: any, callback: (...args: any[]) => any) {
        if (!topic) {
            throw new Error('The topic to unsubscribe from was not supplied.');
        }
        if (!owner) {
            throw new Error('The owner that owns the topic to unsubscribe from was not supplied.');
        }
        if (typeof callback !== 'function') {
            throw new Error('The specific callback for the topic and owner pair to unsubscribe from was not supplied.');
        }
        
        let callbacks = this._getSubscription(topic);
        let modified = false;

        for (let i = callbacks.length - 1; i >= 0; i -= 1) {
            let current = callbacks[i];

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
    public unsubscribeAll(owner: any): boolean {
        if (!owner) {
            throw new Error('The owner to remove all subscriptions for was not supplied.');
        }
        let modified = false;
        
        for (let property in this.subMap) {
            let value = this.subMap[property];
            
            for (let index = value.length - 1; index >= 0; index = index - 1) {
                let currentCallback = value[index];

                if (currentCallback.owner === owner) {
                    value.splice(index, 1);
                    modified = true;
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
    public register(topic: string): void {
        if (!topic) {
            throw new Error('The topic to register was not supplied.');
        }
        
        let publishName =  'publish' + topic;
        let yellName = 'yell' + topic;
        let subscribeName = 'subscribe' + topic;
        let unsubscribeName = 'unsubscribe' + topic;
       
        this[publishName] = this.publish.bind(this, topic); 
        this[yellName] = this.yell.bind(this, topic);
        this[subscribeName] = this.subscribe.bind(this, topic);
        this[unsubscribeName] = this.unsubscribe.bind(this, topic);
    }
    
    /**
     * Removes the convinence methods created by register. 
     * 
     * @param {String} topic The topic to deregister. 
     */
    public deregister(topic: string): void {
        if (!topic) {
            throw new Error('The topic to deregister was not supplied.');
        }
        
        let publishName =  'publish' + topic;
        let yellName = 'yell' + topic;
        let subscribeName = 'subscribe' + topic;
        let unsubscribeName = 'unsubscribe' + topic;
       
        if (this.hasOwnProperty(publishName)) {
            delete this[publishName];
        }
        
        if (this.hasOwnProperty(yellName)) {
            delete this[yellName];
        }
       
        if (this.hasOwnProperty(subscribeName)) {
            delete this[subscribeName];   
        }
        
        if (this.hasOwnProperty(unsubscribeName)) {
            delete this[unsubscribeName];   
        }
    }
    
    /**
     * Gets the subscription list for the specified topic.
     * 
     * @param {String} topic The topic to retrieve the list for.
     * 
     * @return {Array<ZPubSubEventObject>} The list of events for the topic.
     */
    private _getSubscription(topic: string): ZPubSubEventObject[] {
        if (!this.subMap.hasOwnProperty(topic)) {
            this.subMap[topic] = [];
        }

        return this.subMap[topic];
    }
}
