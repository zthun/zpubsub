/*jslint bitwise : true, nomen : true*/
/*global zw*/

describe("ZPubSub", function () {
    'use strict';

    var owner;
    var EVENT = "EventId";
    var ARGS = "Args";

    beforeEach(function () {
        owner = {};
    });
    
    function createTarget() {
        var target = new zw.ZPubSub();
        return target;
    }

    it("should invoke all callbacks when a message published.", function () {
        // Arrange 
        var a = false;
        var b = false;
        var target = createTarget();
        target.subscribe(EVENT, owner, function () { a = true; });
        target.subscribe(EVENT, owner, function () { b = true; });
        // Act
        target.publish(EVENT, ARGS);
        // Assert
        expect(a).toBeTruthy();
        expect(b).toBeTruthy();
    });

    it("should return the values from the subscriptions.", function () {
        // Arrange
        var target = createTarget();
        var valA = 'A';
        var valB = 'B';
        var results;
        target.subscribe(EVENT, owner, function () { return valA; });
        target.subscribe(EVENT, owner, function () { return valB; });
        // Act 
        results = target.publish(EVENT);
        // Assert
        expect(results.length).toBe(2);
        expect(results.filter(function (val) { return val === valA; }).length).toEqual(1);
        expect(results.filter(function (val) { return val === valB; }).length).toEqual(1);
    });

    it("should unsubscribe all matching events.", function () {
        // Arrange 
        var target = createTarget();
        var a = false;
        var b = false;
        var callA = function () { a = true; };
        target.subscribe(EVENT, owner, callA);
        target.subscribe(EVENT, owner, function () { b = true; });
        target.subscribe(EVENT, owner, callA);
        // Act
        target.unsubscribe(EVENT, owner, callA);
        target.publish(EVENT);
        // Assert
        expect(a).toBeFalsy();
        expect(b).toBeTruthy();
    });

    it("should return true when unsubscribe modifies the subscription list.", function () {
        // Arrange 
        var target = createTarget();
        var call = function () { return undefined; };
        // Act
        target.subscribe(EVENT, owner, call);
        var result = target.unsubscribe(EVENT, owner, call);
        // Assert
        expect(result).toBeTruthy();
    });

    it("should return false when unsubscribe does not modify the subscription list.", function () {
        // Arrange 
        var target = createTarget();
        var callA = function () { return undefined; };
        var callB = function () { return 'Not Here'; };
        target.subscribe(EVENT, owner, callA);
        // Act 
        var result = target.unsubscribe(EVENT, owner, callB);
        // Assert
        expect(result).toBeFalsy();
    });

    it("should annotate the returned array to contain a firstDefined method.", function () {
        // Arrange 
        var target = createTarget();
        var a = {};
        var result = null;
        target.subscribe(EVENT, owner, function () { return undefined; });
        target.subscribe(EVENT, owner, function () { return a; });
        // Act 
        result = target.publish(EVENT, ARGS);
        // Assert 
        expect(result.firstDefined()).toBe(a);
    });

    it("should unsubscribe from all matching owners.", function () {
        // Arrange 
        var target = createTarget();
        var a = false;
        var b = false;
        var c = false;
        var ownerB = {};
        target.subscribe(EVENT, owner, function () { a = true; });
        target.subscribe(EVENT, ownerB, function () { b = true; });
        target.subscribe(EVENT, owner, function () { c = true; });
        // Act
        target.unsubscribeAll(owner);
        target.publish(EVENT, ARGS);
        // Assert
        expect(a).toBeFalsy();
        expect(b).toBeTruthy();
        expect(c).toBeFalsy();
    });
    
    function assertFunctionWasCreated(topic, expected) {
        // Arrange 
        var target = createTarget();
        // Act 
        target.register(topic);
        // Assert 
        expect(target[expected]).toBeDefined();
    }
    
    it('should register a publish topic.', function () {
        assertFunctionWasCreated('Foo', 'publishFoo');
    });
    
    it('should register a subscribe topic.', function () {
        assertFunctionWasCreated('Foo', 'subscribeFoo');
    });
    
    it('should register an unsubscribe topic.', function () {
        assertFunctionWasCreated('Foo', 'unsubscribeFoo');
    });
    
    function assertFunctionWasDestroyed(topic, expected) {
        // Arrange 
        var target = createTarget();
        target.register(topic);
        // Act 
        target.deregister(topic);
        // Assert 
        expect(target[expected]).not.toBeDefined();
    }
    
    it('should deregister the publish topic.', function () {
        assertFunctionWasDestroyed('Foo', 'publishFoo');
    });
    
    it('should deregister the subscribe topic.', function () {
        assertFunctionWasDestroyed('Foo', 'subscribeFoo');
    });
    
    it('should deregister the unsubscribe topic.', function () {
        assertFunctionWasDestroyed('Foo', 'unsubscribeFoo');
    });
    
    it('should publish the correct topic.', function () {
        // Arrange 
        var shouldBeFoo = null;
        var shouldBeBar = null;
        var target = createTarget();
        target.register('Foo');
        target.register('Bar');
        target.subscribeFoo(owner, function (a) { shouldBeFoo = a; });
        target.subscribeBar(owner, function (a) { shouldBeBar = a; });
        // Act
        target.publishFoo('Foo');
        target.publishBar('Bar');
        // Assert 
        expect(shouldBeFoo).toEqual('Foo');
        expect(shouldBeBar).toEqual('Bar');
    });
    
    it('should unsubscribe from the correct topic.', function () {
        // Arrange 
        var shouldBeNull = null;
        var shouldBeBar = null;
        var target = createTarget();
        var fooFn = function (a) { shouldBeNull = a; };
        target.register('Foo');
        target.register('Bar');
        target.subscribeFoo(owner, fooFn);
        target.subscribeBar(owner, function (a) { shouldBeBar = a; });
        // Act 
        target.unsubscribeFoo(owner, fooFn);
        target.publishFoo('Foo');
        target.publishBar('Bar');
        // Assert 
        expect(shouldBeNull).toBeNull();
        expect(shouldBeBar).toBe('Bar');
    });
});