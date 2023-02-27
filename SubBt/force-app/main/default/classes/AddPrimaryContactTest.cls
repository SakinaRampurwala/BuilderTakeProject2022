@isTest
public class AddPrimaryContactTest {
    @isTest static void testmethod1(){

        String state ='CA';
        Contact con =new Contact();
        con.LastName='test';
        insert con ;

        List<Account> acc = new  List<Account>();

        Account acc1 = new Account();
        acc1.Name='test';
        acc1.BillingState='CA';
        acc.add(acc1);

        Account acc2 = new Account();
        acc2.BillingState='CA';
        acc2.Name='test2';
        acc.add(acc2);

        insert acc;

        List<Account> acnt = [Select ID, Name From Account WHERE BillingState =:state LIMIT 50];

        List<Contact> con2 = new List<Contact>();
        for(Account a :acnt){
            Contact c = con.clone(false , false , false , false);
            c.AccountId= a.Id;
            con2.add(c);
        }

        insert con2;

        Test.startTest();
         System.enqueueJob(new AddPrimaryContact(con , state));
        Test.stopTest();

    }


    @isTest static void testmethod2(){

        String state ='NY';
        Contact con =new Contact();
        con.LastName='test';
        insert con ;

        List<Account> acc = new  List<Account>();

        Account acc1 = new Account();
        acc1.Name='test';
        acc1.BillingState='NY';
        acc.add(acc1);

        Account acc2 = new Account();
        acc2.BillingState='NY';
        acc2.Name='test2';
        acc.add(acc2);

        insert acc;

        List<Account> acnt = [Select ID, Name From Account WHERE BillingState =:state LIMIT 50];

        List<Contact> con2 = new List<Contact>();
        for(Account a :acnt){
            Contact c = con.clone(false , false , false , false);
            c.AccountId= a.Id;
            con2.add(c);
        }

        insert con2;

        Test.startTest();
         System.enqueueJob(new AddPrimaryContact(con , state));
        Test.stopTest();

    }
}