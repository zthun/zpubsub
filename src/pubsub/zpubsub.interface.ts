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
     * @param {String} topic          The id of the event to subscribe to.
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
    subscribe(topic: string, owner: any, callback: () => any): ZPubSubEventObject;
    /**
     * Removes a subscription from the callback list.
     * 
     * @param {String} topic          The id of the message to remove.
     * @param {Object} owner        The object that owns the subscription.
     * @param {Function} callback   The callback that was registered in the subscribe method.
     * 
     * @returns {Boolean} True if the subscription list was modified, false otherwise.
     */
    unsubscribe(topic: string, owner: any, callback: () => any): boolean;
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
