public without sharing class PCFromPRController {

    @AuraEnabled
    public static void updatePRStatus(String pricingRequestId){
        System.debug('updatePRStatus');
        List<buildertek__Pricing_Request__c> pricingRequestList= [SELECT Id, buildertek__Date_Pricing_Returned__c, buildertek__Selections_Manager__c, buildertek__Status__c ,(SELECT Id ,buildertek__Status__c  From buildertek__Pricing_Request_Lines__r) From buildertek__Pricing_Request__c WHERE Id=:pricingRequestId];
        List<buildertek__Pricing_Request_Line__c> pricingRequestLineList = new List<buildertek__Pricing_Request_Line__c>();
        for(buildertek__Pricing_Request__c pricingRequest:pricingRequestList){
            for(buildertek__Pricing_Request_Line__c pricingRequestLine: pricingRequest.buildertek__Pricing_Request_Lines__r){
                pricingRequestLine.buildertek__Status__c='Pricing Complete';
                pricingRequestLineList.add(pricingRequestLine);
            }
        }
        update pricingRequestLineList;
    }
   
}