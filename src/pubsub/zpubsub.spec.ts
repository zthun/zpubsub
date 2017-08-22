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
            const target: ZPubSub = createTarget();
            
            target.subscribe(EVENT, owner, () => a = true);
            target.subscribe(EVENT, owner, () => b = true);
            // Act
            target.publish(EVENT, ARGS);
            // Assert
            expect(a).toBeTruthy();
            expect(b).toBeTruthy();
        });
        
        it('should pass all arguments past the topic.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            const foo: () => void = jasmine.createSpy('foo');
            target.subscribe(EVENT, owner, foo);
            // Act 
            target.publish(EVENT, 1, 2, 3, 4);
            // Assert 
            expect(foo).toHaveBeenCalledWith(1, 2, 3, 4);
        });
    
        it('should return the values from the subscriptions.', () => {
            // Arrange
            const target: ZPubSub = createTarget();
            let valA: string = 'A';
            let valB: string = 'B';
            target.subscribe(EVENT, owner, () => valA);
            target.subscribe(EVENT, owner, () => valB);
            // Act 
            const results: any[] = target.publish(EVENT);
            // Assert
            expect(results.length).toBe(2);
            expect(results.filter((x) => x === valA).length).toEqual(1);
            expect(results.filter((x) => x === valB).length).toEqual(1);
        });

        it('should throw an error if the topic is falsy.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            // Act 
            let fn: () => void = target.publish.bind(target, false);
            // Assert
            expect(fn).toThrow();
        });
    });
    
    describe('Yelling', () => {
        it('should return the first defined value from the subscriptions.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            let valA: any = null;
            let valB: any = null;
            let valC: any = 'A';
            let valD: any = 'B';
            target.subscribe(EVENT, owner, () => valC);
            target.subscribe(EVENT, owner, () => valB);
            target.subscribe(EVENT, owner, () => valD);
            target.subscribe(EVENT, owner, () => valA);
            // Act 
            const result: any = target.yell(EVENT);
            // Assert 
            expect(result).toEqual(valC);
        });
        
        it('should return null if nobody responds.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            // Act 
            const result: any = target.yell(EVENT);
            // Assert 
            expect(result).toBeNull();
        });
        
        it('should pass all arguments past the topic.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            const foo: () => void = jasmine.createSpy('foo');
            target.subscribe(EVENT, owner, foo);
            // Act
            target.yell(EVENT, 1, 2, 3, 4);
            // Assert 
            expect(foo).toHaveBeenCalledWith(1, 2, 3, 4);
        });
        
        it('should return null if nobody returns a defined value.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            target.subscribe(EVENT, owner, () => null);
            target.subscribe(EVENT, owner, () => undefined);
            target.subscribe(EVENT, owner, () => undefined);
            target.subscribe(EVENT, owner, () => null);
            // Act 
            const result = target.yell(EVENT);
            // Assert 
            expect(result).toBeNull();
        });
        
        it('should throw an error if the topic is falsy.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            // Act 
            const fn = target.yell.bind(target, false);
            // Assert 
            expect(fn).toThrow();
        });
    });
    
    describe('Subscribe', () => {
        it('should throw an error when the topic is falsy.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            const call: () => void = jasmine.createSpy('call');
            // Act 
            const fn: () => void = target.subscribe.bind(target, false, owner, call);
            // Assert
            expect(fn).toThrow();
        });
        
        it('should throw an error when the owner is falsy.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            const call: () => void = jasmine.createSpy('call');
            // Act 
            const fn: () => void = target.subscribe.bind(target, EVENT, false, call);
            // Assert 
            expect(fn).toThrow();
        });
        
        it('should throw an error when the callback is not a function.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            // Act 
            const fn: () => void = target.subscribe.bind(target, EVENT, owner, 3);
            // Assert 
            expect(fn).toThrow();
        });
    });
    
    describe('Unsubscribe', () => {
        it("should unsubscribe all matching events.", () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            let a: boolean = false;
            let b: boolean = false;
            const callA: () => void = () => a = true;
            target.subscribe(EVENT, owner, callA);
            target.subscribe(EVENT, owner, () => b = true);
            target.subscribe(EVENT, owner, callA);
            // Act
            target.unsubscribe(EVENT, owner, callA);
            target.publish(EVENT);
            // Assert
            expect(a).toBeFalsy();
            expect(b).toBeTruthy();
        });
    
        it("should return true when unsubscribe modifies the subscription list.", () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            const call: () => void = () => undefined;
            target.subscribe(EVENT, owner, call);
            // Act
            const result: boolean = target.unsubscribe(EVENT, owner, call);
            // Assert
            expect(result).toBeTruthy();
        });
    
        it("should return false when unsubscribe does not modify the subscription list.", () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            const callA: () => void = () => undefined;
            const callB: () => void = () => 'Not Here';
            target.subscribe(EVENT, owner, callA);
            // Act 
            const result: boolean = target.unsubscribe(EVENT, owner, callB);
            // Assert
            expect(result).toBeFalsy();
        });
        
        it('should throw an error when the topic is falsy.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            const call: () => void = () => undefined;
            // Act 
            const fn: () => void = target.unsubscribe.bind(target, false, owner, call);
            // Assert
            expect(fn).toThrow();
        });
        
        it('should throw an error when the owner is falsy.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            const call: () => void  = () => undefined;
            // Act 
            const fn: () => void = target.unsubscribe.bind(target, EVENT, false, call);
            // Assert 
            expect(fn).toThrow();
        });
        
        it('should throw an error when the callback is not a function.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            // Act 
            const fn: () => void = target.unsubscribe.bind(target, EVENT, owner, 3);
            // Assert 
            expect(fn).toThrow();
        });
    });

    describe('Mass Unsubscribe', () => {
        it("should unsubscribe from all matching owners.", () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            let a: boolean = false;
            let b: boolean = false;
            let c: boolean = false;
            const ownerB: any = {};
            target.subscribe(EVENT, owner, () => a = true);
            target.subscribe(EVENT, ownerB, () => b = true);
            target.subscribe(EVENT, owner, () => c = true);
            // Act
            target.unsubscribeAll(owner);
            target.publish(EVENT, ARGS);
            // Assert
            expect(a).toBeFalsy();
            expect(b).toBeTruthy();
            expect(c).toBeFalsy();
        });
        
        it('should throw an error if the owner is falsy.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            // Act 
            const fn: () => void = target.unsubscribeAll.bind(target, false);
            // Assert 
            expect(fn).toThrow();
        });
    });
    
    describe('Register', () => {
        function assertFunctionWasCreated(topic: string, expected: string) {
            // Arrange 
            const target: ZPubSub = createTarget();
            // Act 
            target.register(topic);
            // Assert 
            expect(target[expected]).toBeDefined();
        }
        
        it('should register a publish topic.', () => {
            assertFunctionWasCreated('Foo', 'publishFoo');
        });
        
        it('should register a yell topic.', () => {
            assertFunctionWasCreated('Foo', 'yellFoo');
        });
        
        it('should register a subscribe topic.', () => {
            assertFunctionWasCreated('Foo', 'subscribeFoo');
        });
        
        it('should register an unsubscribe topic.', () => {
            assertFunctionWasCreated('Foo', 'unsubscribeFoo');
        });
        
        it('should throw an error when the topic is falsy.', () => {
            // Arrange 
            const target: any = createTarget();
            // Act 
            const fn: () => void = target.register.bind(target, false);
            // Assert 
            expect(fn).toThrow();
        });
        
        it('should publish the correct topic.', () => {
            // Arrange 
            let shouldBeFoo = null;
            let shouldBeBar = null;
            const target: any = createTarget();
            target.register('Foo');
            target.register('Bar');
            target.subscribeFoo(owner, (a: any) => shouldBeFoo = a);
            target.subscribeBar(owner, (a: any) => shouldBeBar = a);
            // Act
            target.publishFoo('Foo');
            target.publishBar('Bar');
            // Assert 
            expect(shouldBeFoo).toEqual('Foo');
            expect(shouldBeBar).toEqual('Bar');
        });
        
        it('should yell the correct topic.', () => {
            // Arrange 
            let valA: any = null;
            let valB: any = 'B';
            const target: any = createTarget();
            target.register('Foo');
            target.register('Bar');
            target.subscribeFoo(owner, (): any => valA);
            target.subscribeFoo(owner, (): any => valB);
            // Act 
            const result = target.yellFoo();
            // Assert 
            expect(result).toBe(valB);
        });
        
        it('should unsubscribe from the correct topic.', () => {
            // Arrange 
            let shouldBeNull: any = null;
            let shouldBeBar: any = null;
            const target: any = createTarget();
            const fooFn: (a: any) => any = (a: any) => shouldBeNull = a;
            target.register('Foo');
            target.register('Bar');
            target.subscribeFoo(owner, fooFn);
            target.subscribeBar(owner, (a: any) => shouldBeBar = a);
            // Act 
            target.unsubscribeFoo(owner, fooFn);
            target.publishFoo('Foo');
            target.publishBar('Bar');
            // Assert 
            expect(shouldBeNull).toBeNull();
            expect(shouldBeBar).toBe('Bar');
        });
    });

    describe('DeRegister', () => {
        function assertFunctionWasDestroyed(topic: string, expected: string) {
            // Arrange 
            const target = createTarget();
            target.register(topic);
            // Act 
            target.deregister(topic);
            // Assert 
            expect(target[expected]).not.toBeDefined();
        }
        
        it('should deregister the publish topic.', () => {
            assertFunctionWasDestroyed('Foo', 'publishFoo');
        });
        
        it('should deregister the yell topic.', () => {
            assertFunctionWasDestroyed('Foo', 'yellFoo'); 
        });
        
        it('should deregister the subscribe topic.', () => {
            assertFunctionWasDestroyed('Foo', 'subscribeFoo');
        });
        
        it('should deregister the unsubscribe topic.', () => {
            assertFunctionWasDestroyed('Foo', 'unsubscribeFoo');
        });
        
        it('should ignore the topic if it was not registered.', () => {
            // Arrange
            const target: any = createTarget();
            // Act 
            target.deregister('WasNotCreated');
            // Assert 
            expect(target.publishWasNotCreated).not.toBeDefined();
        });
        
        it('should throw an error when the topic is falsy.', () => {
            // Arrange 
            const target: ZPubSub = createTarget();
            // Act 
            const fn: () => void = target.deregister.bind(target, false);
            // Assert 
            expect(fn).toThrow();
        });
    });
});
