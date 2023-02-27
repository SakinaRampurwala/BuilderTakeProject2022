trigger AccountAddressTrigger on Account (before insert , before update) {
   
    if(Trigger.isInsert || Trigger.isUpdate){
        for(Account acc : Trigger.new){
            System.debug(acc.Match_Billing_Address__c +'-----------------------' + acc.ShippingPostalCode+ '----------'+ acc.BillingPostalCode );
            if(acc.Match_Billing_Address__c	== true){
                acc.ShippingPostalCode = acc.BillingPostalCode;
            }
        }
    }

}