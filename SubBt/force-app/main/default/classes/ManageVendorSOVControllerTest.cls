@isTest
public with sharing class ManageVendorSOVControllerTest {
    @TestSetup
    static void testData(){
        buildertek__Schedule_of_Values__c sov = new buildertek__Schedule_of_Values__c();
        sov.Name = 'Testing SOV';
        insert sov;

        buildertek__Schedule_of_Value_Lines__c sovLine = new buildertek__Schedule_of_Value_Lines__c();
        sovLine.buildertek__Schedule_of_Values__c = sov.Id;
        sovLine.buildertek__Description_of_Work__c = 'Test Work';
        sovLine.buildertek__Old_Sov_Line_Ids_From_Project__c='Test';
        sovLine.buildertek__Status__c = 'Rejected';
        insert sovLine;
       

    }

    @isTest
    static void testMethod1(){
        buildertek__Schedule_of_Values__c sov=[Select Id, Name From  buildertek__Schedule_of_Values__c LIMIT 1];
        buildertek__Schedule_of_Value_Lines__c sovLine=[Select Id From  buildertek__Schedule_of_Value_Lines__c LIMIT 1];
        List<String> listSovlineIds= new List<String>();
        listSovlineIds.add(sovLine.Id);
        Test.startTest();
        ManageVendorSOVController.getcurrency();
        ManageVendorSOVController.getSOVdata(sov.Id);
        ManageVendorSOVController.getUser();
        ManageVendorSOVController.getVendorSOVLines(sov.Id);
        ManageVendorSOVController.getSOVlineslistbyType(sov.Id , 'test');
        ManageVendorSOVController.ApproveSovLines(sovLine.Id);
        ManageVendorSOVController.rejectSovLines(sovLine.Id , 'test');
        ManageVendorSOVController.getAllApproved(listSovlineIds);
        ManageVendorSOVController.getAllApprovedexceptReject(listSovlineIds);
        Test.stopTest();

    }

    @isTest
    static void testMethod2(){
        buildertek__Schedule_of_Values__c sov=[Select Id, Name From  buildertek__Schedule_of_Values__c LIMIT 1];
        buildertek__Schedule_of_Value_Lines__c sovLine=[Select Id From  buildertek__Schedule_of_Value_Lines__c LIMIT 1];

        buildertek__Schedule_of_Value_Lines__c sovLine1 = new buildertek__Schedule_of_Value_Lines__c();
        sovLine1.buildertek__Schedule_of_Values__c = sov.Id;
        sovLine1.buildertek__Description_of_Work__c = 'Test Work';
        sovLine1.buildertek__Vendor_SOV_Line__c = sovLine.Id;
        sovLine1.buildertek__Old_Sov_Line_Ids_From_Project__c='Test';
        insert sovLine1;

        List<String> listSovlineIds= new List<String>();
        listSovlineIds.add(sovLine.Id);

        Test.startTest();
        ManageVendorSOVController.ApproveSovLines(sovLine.Id);
        ManageVendorSOVController.getAllApproved(listSovlineIds);

        Test.stopTest();

    }
}