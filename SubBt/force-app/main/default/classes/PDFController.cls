public without sharing class PDFController {
     @AuraEnabled(cacheable=true)
    public static String getStaticResourceDescription() {
      String  staticResourceName = 'Releasenote'; 
        // Query the static resource metadata to get the description
        List<StaticResource> staticResources = [
            SELECT Description
            FROM StaticResource
            WHERE Name = :staticResourceName
            LIMIT 1
        ];

        if (!staticResources.isEmpty()) {
            return staticResources[0].Description;
        }

        return null;
    }

    @AuraEnabled
    public static String sendemail(String name, String email, String subject, String body){
        try{
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            String myCustomLabel = System.Label.supportEmail;
            List<String> toEmailAddress = new List<String>();
            if(myCustomLabel.contains(',')){
                toEmailAddress.addAll(myCustomLabel.split(','));
            }else{ 
                toEmailAddress.add(myCustomLabel); 
            }             

            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setSubject(subject);
            mail.setplaintextbody(body + '\n\n\nFrom ' + name + '\nEmail ' + email);
            mail.setToAddresses(toEmailAddress) ;
            emailList.add(mail);
            Messaging.sendEmail(emailList);

            return 'success';
        } catch (Exception e){
            return 'fail';
        }
    }

    @AuraEnabled
    public static String createCase(String subject, String body) {
        Case newCase = new Case();
        newCase.Subject = subject;
        newCase.Description = body;
        newCase.Origin = 'Web';
        // newCase.CurrencyIsoCode = 'USD - U.S. Dollar';
        newCase.Status = 'New';

        try {
            insert newCase;
            System.debug('Case created successfully with ID: ' + newCase.Id);
            return newCase.Id;
        } catch (Exception ex) {
            System.debug('Error creating case: ' + ex.getMessage());
            return null;
        }
    }

}