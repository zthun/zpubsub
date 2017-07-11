/**
 * Represents an implementation of the IZPubSubEventObject.
 * 
 * @this {ZPubSubEventObject}
 */
export class ZPubSubEventObject {
    /**
     * Initializes a new instance of this object.
     * 
     * @param {Object} owner The owner of the event.
     * @param {Function} callback The callback for when the event is invoked.
     */
    constructor(public owner: any, public callback: () => any) {}
}
