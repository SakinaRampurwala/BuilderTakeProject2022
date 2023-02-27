@isTest
public class AccountProcessorTest {
    
    @isTest static void testMethod1(){
        List<Id> acc = new List<Id>();
        Account acc1 = new Account();
        acc1.name='test';
        insert acc1;
        acc.add(acc1.Id);
        
        Account acc2 = new Account();
        acc2.name='test';
        insert acc2;
        
        acc.add(acc2.Id);

        Test.startTest();
        AccountProcessor.countContacts(acc);
        
        Test.stopTest();
    }
    
    

}