public with sharing class DocuSign {

    public string  sendEnvelope(String email, String name){ 

        DocuSignCredientials__c credientials =[SELECT Id, Name, AccountId__c, UserId__c, IntegrationKey__c, Password__c FROM DocuSignCredientials__c];
        String accountID = credientials.AccountId__c; 
        
        String userName = credientials.UserId__c; 
        
        String Password = credientials.Password__c; 
        
        String integratorKey = credientials.IntegrationKey__c; 
        
        String templateID = '07d80b9a-21b3-4f92-9ace-adf439536a57';

        String endPoint = 'https://demo.docusign.net/restapi/v2/accounts/'+accountID+'/envelopes'; 
        

        HttpRequest req = new HttpRequest(); 
        req.setEndpoint(endPoint); 
        req.setMethod('POST'); 
        String authorizationHeader ='<DocuSignCredentials><Username>'+userName+'</Username><Password>'+Password+'</Password><IntegratorKey>'+integratorKey+'</IntegratorKey></DocuSignCredentials>';
        System.debug(authorizationHeader);

        req.setHeader('X-DocuSign-Authentication', authorizationHeader); 
        
        req.setHeader('Accept','application/json'); 
        
        req.setHeader('Content-Length','162100'); 
        
        req.setHeader('Content-Type','application/json'); 
        
        System.debug(endPoint);
         
        String json='{'+ 
            
            ' '+ 
            
            ' "emailSubject": "Agreement",'+ 
            
            ' "emailBlurb": "Please View and Sign The Document. ",'+ 
            
            ' "templateId": "'+templateID+'",'+ 
            
            ' "envelopeIdStamping": "false",'+ 
            
            ' "templateRoles": ['+ 
            
            ' {'+ 
            
            '"roleName": "Signers",'+ 
            
            '"name": "'+name+'",'+ 
            
            '"email": "'+email+'",'+ 
            
            '"recipientId": "1"'+ 
            
            '}'+ 
            
            ' ],'+ 
            
            ' "status": "sent"'+ 
            
            '}'; 
        
        req.setBody(json);

        System.debug(json); 

        Http http = new Http(); 

        System.debug(req);
        
        HTTPResponse res; 
        
        system.debug('Complete Response '+res);
        
        try{ 
            
            //Docusign Request Callout. 
            
            res = http.send(req); 
            system.debug('DocuSign Response'+ res.getBody());
            system.debug('DocuSign Response'+ res.getStatus());


            EnvelopeId envId =  (EnvelopeId) System.JSON.deserialize(res.getBody(), EnvelopeId.class);
            
            
            EnvelopeId docuTemps = new EnvelopeId();
            docuTemps.envelopeId = envId.envelopeId;
            docuTemps.uri = envId.uri;
            docuTemps.statusDateTime = envId.statusDateTime;
            docuTemps.status = envId.status;
            
            // system.debug(ObjName);
            system.debug(docuTemps);

         }catch(Exception e){ 
            System.debug(e);
        } 

        return null; 

   }

   public class EnvelopeId{
    @AuraEnabled
    public String envelopeId {get;set;}
    
    @AuraEnabled
    public String uri {get;set;}
    
    @AuraEnabled
    public String statusDateTime {get;set;}
    
    @AuraEnabled
    public String status {get;set;}
}


}