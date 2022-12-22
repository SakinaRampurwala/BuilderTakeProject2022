trigger pricingRequestLineTrigger on buildertek__Pricing_Request_Line__c(after insert , after update) {
   
    if((trigger.isInsert || trigger.isUpdate) && pricingRequestLineTriggerHandler.firstRun){
        pricingRequestLineTriggerHandler.afterEvent(Trigger.New);
     }

}