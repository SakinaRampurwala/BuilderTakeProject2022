public without sharing class DemoPageClass {

    public static void sendemailfromapex() {
        //send email using single email message
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {'jaimin.s@mvclouds.com'};
        mail.setToAddresses(toAddresses);
        mail.setSubject('Test Email from Apex');
        mail.setPlainTextBody('Hello World!');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        System.debug('Email sent successfully');
    }
    

}