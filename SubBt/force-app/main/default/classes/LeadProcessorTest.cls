@isTest
public class LeadProcessorTest {
    @testSetup 
    static void setup() {
        List<Lead> l = new List<Lead>();
        for(Integer i=0; i<200 ; i++){
        Lead myLeads = new Lead();
        myLeads.Salutation ='Mr';
        myLeads.Company='Mv';
        myLeads.LeadSource='Other';
        myLeads.LastName='Test';
        l.add(myLeads);

        }
        insert l;
    }

    static testMethod void testMethod1() {
    Test.startTest();
    LeadProcessor lp =new LeadProcessor();
    Database.executeBatch(lp);
    Test.stopTest();
    System.assertEquals(200, [SELECT count() FROM Lead]);

   }
}