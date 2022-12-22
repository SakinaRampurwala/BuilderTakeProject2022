trigger UpdateOptionQuatityAndSalesPrice on buildertek__Pricing_Request_Line__c(after insert , after update) {
   
    if((trigger.isInsert || trigger.isUpdate) && UpdateOptionQuatityAndSalesPriceHandler.firstRun==true){
        UpdateOptionQuatityAndSalesPriceHandler.afterEvent(Trigger.New);
     }

}