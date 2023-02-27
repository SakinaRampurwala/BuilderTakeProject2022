@isTest
public class DailyLeadProcessorTest {
    @isTest static void testmethod1(){
        
         List<Lead> leads= new List<Lead>();
         Lead l1= new Lead();
         l1.LeadSource= '';
         l1.LastName='Test';
         l1.Company='Test';
        leads.add(l1);
        
         Lead l2= new Lead();
         l2.LeadSource= '';
         l2.LastName='Test';
         l2.Company='Test';
        leads.add(l2);
        
        insert leads;

        
       
        Test.startTest();
        String corn ='0 0 0 * * ? *';
        system.schedule('test' ,corn , new DailyLeadProcessor() );
        Test.stopTest();
    }


}