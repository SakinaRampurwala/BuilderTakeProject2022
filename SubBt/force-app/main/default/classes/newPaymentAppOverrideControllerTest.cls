@isTest
public with sharing class newPaymentAppOverrideControllerTest {
    @TestSetup
    static void payApp() {
        Id pId = [select id from profile where name='System Administrator'].id;

        User user = new User();
        user.alias = 'test123';
        user.email = 'test123@noemail.com';
        user.emailencodingkey = 'UTF-8';
        user.lastname = 'Testing';
        user.languagelocalekey = 'en_US';
        user.localesidkey = 'en_US';
        user.profileid = pId;
        user.country = 'United States';
        user.IsActive = true;
        user.timezonesidkey = 'America/Los_Angeles';
        user.username = 'tester@noemail.com';
        insert user;

        Contact con = new Contact();
        con.FirstName = 'Nm1';
        con.LastName = 'Test contact';
        con.email='test@test.com';
        insert con;

        Blob bodyBlob=Blob.valueOf('Unit Test Attachment Body');
        Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
        efa.setFileName('MSAForm.pdf');
        efa.setBody(bodyBlob);

        EmailTemplate emailTemplate = [SELECT Id FROM EmailTemplate LIMIT 1];
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        String[] sendTo = new String[]{'XXXXXXXXX@gmail.com'};
        email.setToAddresses(sendTo);
        email.setTemplateID(emailTemplate.Id);
        email.setTargetObjectId(con.Id);
        email.setHtmlBody(con.Name);
        email.setFileAttachments(new Messaging.EmailFileAttachment[]{ efa });

        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email }); 

        buildertek__SOV_Payment_Application__c app = new buildertek__SOV_Payment_Application__c();
        app.Name = 'Test app';
        app.buildertek__Retainage__c = 10;
        insert app;

        buildertek__SOV_Continuation__c sov = new buildertek__SOV_Continuation__c();
        sov.Name = 'Test';
        sov.buildertek__SOV_Payment_Application__c = app.Id;
        insert sov;

        buildertek__Admin_Interface_Node_Configuration__c admin = new buildertek__Admin_Interface_Node_Configuration__c();
        admin.Name = 'SOV Configuration';
        insert admin;

        buildertek__Budget__c budget = new buildertek__Budget__c();
        budget.Name = 'test';
        insert budget;

        buildertek__Budget_Item__c budgetItem = new buildertek__Budget_Item__c();
        budgetItem.Name = 'Test';
        budgetItem.buildertek__Budget__c = budget.Id;
        insert budgetItem;

        // buildertek__SOV_Continuation_Sheet_Lines__c sheetLine = new buildertek__SOV_Continuation_Sheet_Lines__c();
        // sheetLine.Name = budgetItem.Name;
        // sheetLine.buildertek__Budget_Grouping__c = 'Change Orders';
        // sheetLine.buildertek__Is_Created_In_This_App__c = true;
        // sheetLine.buildertek__Description_of_Work__c = budgetItem.Name;
        // sheetLine.buildertek__SOV_Continuation_Sheet__c = sov.Id;
        // insert sheetLine;

        buildertek__Schedule_of_Values__c schedule = new buildertek__Schedule_of_Values__c();
        schedule.Name = 'Test';
        insert schedule;
    }
    @isTest
    static void payAppTest(){
        buildertek__SOV_Payment_Application__c app = [select id,Name from buildertek__SOV_Payment_Application__c LIMIT 1];

        buildertek__SOV_Continuation__c sov = [select Id,Name,buildertek__SOV_Payment_Application__c from buildertek__SOV_Continuation__c where buildertek__SOV_Payment_Application__r.Id =: app.Id LIMIT 1];

        ListView lv=new ListView();
        lv=[SELECT Id, Name, DeveloperName, NamespacePrefix, SobjectType, IsSoqlCompatible, CreatedDate, CreatedBy.Name, LastModifiedDate, LastModifiedBy.Name, LastViewedDate, LastReferencedDate FROM ListView WHERE SobjectType = 'buildertek__Schedule_of_Values__c' and Name='All'];

        buildertek__Schedule_of_Values__c schedule = [select id,Name FROM buildertek__Schedule_of_Values__c LIMIT 1];

        newPaymentAppOverrideController.getRfqTo1();
        //newPaymentAppOverrideController.GetSheetid(app.Id);
        newPaymentAppOverrideController.Getadmindetails();
        newPaymentAppOverrideController.getUser();
        //newPaymentAppOverrideController.saveCommunityUserId(app.Id,'test');
        //newPaymentAppOverrideController.createlinesnewApp('Pay');
        //newPaymentAppOverrideController.deleteline(sov.Id);
        newPaymentAppOverrideController.getListViews();
        //newPaymentAppOverrideController.updateSubmittedDate(schedule.Id);
        //newPaymentAppOverrideController.isSovSubmitted(schedule.Id);
        //newPaymentAppOverrideController.createlines(app.Id,'ab','abc');
        newPaymentAppOverrideController.getmasterScheduleOValues(2,3);

    }
}