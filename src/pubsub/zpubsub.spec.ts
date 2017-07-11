import {ZPubSub} from './zpubsub';

describe("ZPubSub", () => {
    let owner: any = null;
    const EVENT: string = "EventId";
    const ARGS: string = "Args";

    beforeEach(() => owner = {});
    
    function createTarget(): ZPubSub {
        return new ZPubSub();
    }
    
    describe('Publish', () => {
        it("should invoke all callbacks when a message published.", () => {
            // Arrange 
            let a: boolean = false;
            let b: boolean = false;
            let target: ZPubSub = createTarget();
            
            target.subscribe(EVENT, owner, () => a = true);
            target.subscribe(EVENT, owner, () => b = true);
            // Act
            target.publish(EVENT, ARGS);
            // Assert
            expect(a).toBeTruthy();
            expect(b).toBeTruthy();
        });
        
        /*
        it('should pass all arguments past the topic.', function () {
            // Arrange 
            var target = createTarget();
            var foo = {fnSpy: function(a, b, c, d){ return [a, b, c, d]; } };
            spyOn(foo, 'fnSpy').and.callThrough();
            target.subscribe(EVENT, owner, foo.fnSpy);
            // Act 
            target.publish(EVENT, 1, 2, 3, 4);
            // Assert 
            expect(foo.fnSpy).toHaveBeenCalledWith(1, 2, 3, 4);
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
        
        it('should throw an error if the topic is falsy.', function () {
            // Arrange 
            var target = createTarget();
            // Act 
            var fn = target.publish.bind(target, false);
            // Assert
            expect(fn).toThrow();
        });
        */
    });
    
    /*
    describe('Yelling', function () {
        it('should return the first defined value from the subscriptions.', function () {
            // Arrange 
            var target = createTarget();
            var valA = null;
            var valB = null;
            var valC = 'A';
            var valD = 'B';
            target.subscribe(EVENT, owner, function () { return valA; });
            target.subscribe(EVENT, owner, function () { return valB; });
            target.subscribe(EVENT, owner, function () { return valC; });
            target.subscribe(EVENT, owner, function () { return valD; });
            // Act 
            var result = target.yell(EVENT);
            // Assert 
            expect(result).toEqual(valC);
        });
        it('should return null if nobody responds.', function () {
            // Arrange 
            var target = createTarget();
            // Act 
            var result = target.yell(EVENT);
            // Assert 
            expect(result).toBeNull();
        });
        it('should pass all arguments past the topic.', function () {
            // Arrange 
            var target = createTarget();
            var foo = {fnSpy: function (a, b, c, d) { return [a, b, c, d]; } };
            spyOn(foo, 'fnSpy').and.callThrough();
            target.subscribe(EVENT, owner, foo.fnSpy);
            // Act
            target.yell(EVENT, 1, 2, 3, 4);
            // Assert 
            expect(foo.fnSpy).toHaveBeenCalledWith(1, 2, 3, 4);
        });
        it('should return null if nobody returns a defined value.', function () {
            // Arrange 
            var target = createTarget();
            target.subscribe(EVENT, owner, function () { return null; });
            target.subscribe(EVENT, owner, function () { return undefined; });
            target.subscribe(EVENT, owner, function () { return undefined; });
            target.subscribe(EVENT, owner, function () { return null; });
            // Act 
            var result = target.yell(EVENT);
            // Assert 
            expect(result).toBeNull();
        });
        it('should throw an error if the topic is falsy.', function () {
            // Arrange 
            var target = createTarget();
            // Act 
            var fn = target.yell.bind(target, false);
            // Assert 
            expect(fn).toThrow();
        });
    });
    
    describe('Subscribe', function () {
        it('should throw an error when the topic is falsy.', function () {
            // Arrange 
            var target = createTarget();
            var call = function () { return undefined; };
            // Act 
            var fn = target.subscribe.bind(target, false, owner, call);
            // Assert
            expect(fn).toThrow();
        });
        
        it('should throw an error when the owner is falsy.', function () {
            // Arrange 
            var target = createTarget();
            var call = function () { return undefined; };
            // Act 
            var fn = target.subscribe.bind(target, EVENT, false, call);
            // Assert 
            expect(fn).toThrow();
        });
        
        it('should throw an error when the callback is not a function.', function () {
            // Arrange 
            var target = createTarget();
            // Act 
            var fn = target.subscribe.bind(target, EVENT, owner, 3);
            // Assert 
            expect(fn).toThrow();
        });
    });
    
    describe('Unsubscribe', function () {
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
        
        it('should throw an error when the topic is falsy.', function () {
            // Arrange 
            var target = createTarget();
            var call = function () { return undefined; };
            // Act 
            var fn = target.unsubscribe.bind(target, false, owner, call);
            // Assert
            expect(fn).toThrow();
        });
        
        it('should throw an error when the owner is falsy.', function () {
            // Arrange 
            var target = createTarget();
            var call = function () { return undefined; };
            // Act 
            var fn = target.unsubscribe.bind(target, EVENT, false, call);
            // Assert 
            expect(fn).toThrow();
        });
        
        it('should throw an error when the callback is not a function.', function () {
            // Arrange 
            var target = createTarget();
            // Act 
            var fn = target.unsubscribe.bind(target, EVENT, owner, 3);
            // Assert 
            expect(fn).toThrow();
        });
    });

    describe('Mass Unsubscribe', function () {
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
        it('should throw an error if the owner is falsy.', function () {
            // Arrange 
            var target = createTarget();
            // Act 
            var fn = target.unsubscribeAll.bind(target, false);
            // Assert 
            expect(fn).toThrow();
        });
    });
    
    describe('Register', function () {
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
        
        it('should register a yell topic.', function () {
            assertFunctionWasCreated('Foo', 'yellFoo');
        });
        
        it('should register a subscribe topic.', function () {
            assertFunctionWasCreated('Foo', 'subscribeFoo');
        });
        
        it('should register an unsubscribe topic.', function () {
            assertFunctionWasCreated('Foo', 'unsubscribeFoo');
        });
        
        it('should throw an error when the topic is falsy.', function () {
            // Arrange 
            var target = createTarget();
            // Act 
            var fn = target.register.bind(target, false);
            // Assert 
            expect(fn).toThrow();
        });
    });

    describe('DeRegister', function () {
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
        
        it('should deregister the yell topic.', function () {
            assertFunctionWasDestroyed('Foo', 'yellFoo'); 
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
        
        it('should yell the correct topic.', function () {
            // Arrange 
            var valA = null;
            var valB = 'B';
            var target = createTarget();
            target.register('Foo');
            target.register('Bar');
            target.subscribeFoo(owner, function (){ return valA; });
            target.subscribeFoo(owner, function (){ return valB; });
            // Act 
            var result = target.yellFoo();
            // Assert 
            expect(result).toBe(valB);
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
        
        it('should ignore the topic if it was not registered.', function () {
            // Arrange
            var target = createTarget();
            // Act 
            target.deregister('WasNotCreated');
            // Assert 
            expect(target.publishWasNotCreated).not.toBeDefined();
        });
        
        it('should throw an error when the topic is falsy.', function () {
            // Arrange 
            var target = createTarget();
            // Act 
            var fn = target.deregister.bind(target, false);
            // Assert 
            expect(fn).toThrow();
        });
    });
    */
});
