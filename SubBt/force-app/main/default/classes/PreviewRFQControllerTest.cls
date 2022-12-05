@isTest
public with sharing class PreviewRFQControllerTest {
    @TestSetup
    static void previewRFQ() {
        
        Contact con = new Contact();
        con.LastName = 'Test';
        con.Email = 'test@gmail.com';
        insert con;
        
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
        
		System.runAs(new User(Id=UserInfo.getUserId())){
            EmailTemplate et = new EmailTemplate(); 
            et.isActive = true; 
            et.Name = 'Testing11'; 
            et.DeveloperName = 'Test_Template'; 
            et.TemplateType = 'text';
            et.Subject = 'Test Subject';
            et.FolderId = UserInfo.getUserId(); 
            et.htmlvalue = 'TextArea';
            et.Body = 'test'; 
            insert et; 
        }
        EmailTemplate emailTemplate = [SELECT Id FROM EmailTemplate LIMIT 1];
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        String[] sendTo = new String[]{'XXXXXXXXX@gmail.com'};
        email.setToAddresses(sendTo);
        email.setTemplateID(emailTemplate.Id);
        email.setTargetObjectId(con.Id);
        email.setHtmlBody(con.Name);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });   
        List<Messaging.SendEmailResult> results = Messaging.SendEmail(new Messaging.Email[] { email });
        System.debug('result----->---'+results);

        ContentVersion contentVersion = new ContentVersion(
            Title = 'CompanySignature',
            PathOnClient = 'Penguins.jpg',
            VersionData = Blob.valueOf('Test Content'),
            IsMajorVersion = true
        );
        insert contentVersion;

        List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = con.id;
        cdl.ContentDocumentId = documents[0].Id;
        cdl.shareType = 'V';
        insert cdl;


    }
    @isTest
    static void previewRFQ2(){
        
        EmailTemplate et = [SELECT Id FROM EmailTemplate Limit 1];
        Contact con = [select Id,Name from Contact Limit 1];
        List<String> to = new List<String>();
        List<String> cc = new List<String>();
        PreviewRFQController.getTemplates();
        PreviewRFQController.getPurchaseOrderLines(con.Id,et.Id);
        PreviewRFQController.sendProposal('abc',con.Id,et.Id,to,cc,'f');
        PreviewRFQController.acceptandsendProposal('abc',con.Id,et.Id,to,cc,'sub','f');
        PreviewRFQController.saveSign(con.Id,'abc','abcd','ab');
    }
}