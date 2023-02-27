@isTest
public  class TestRestrictContactByName {
    @isTest static void testMethod1(){
        Contact con = new Contact(Salutation='Mr.' , LastName='INVALIDNAME');
        insert con;
        // Perform test
        Test.startTest();
        String addError ='The Last Name "'+con.LastName+'" is not allowed for DM';  
        Test.stopTest();


    }

}