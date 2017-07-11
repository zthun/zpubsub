import {ZPubSubEventObject} from './zpubsub-event';

describe('ZPubSubEventObject', () => {
    let owner: any = null;
    let callback: ()=>any = null;
    
    beforeEach(()=>owner = 'abcd');
    beforeEach(()=>callback = ()=>'abcdefg');
    
    function createTestTarget() {
        return new ZPubSubEventObject(owner, callback);
    }
    
    describe('Construction', ()=>{
        it('sets the owner.', ()=>{
            // Arrange
            // Act 
            let target = createTestTarget();
            // Assert
            expect(target.owner).toEqual(owner);
        });
       
        it('sets the callback.', ()=>{
            // Arrange
            // Act
            let target = createTestTarget();
            // Assert
            expect(target.callback).toEqual(callback);
        });
    });
});