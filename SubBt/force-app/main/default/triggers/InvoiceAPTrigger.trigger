trigger InvoiceAPTrigger on buildertek__Account_Payable_Clone__c (after update) {

    InvoiceAPTriggerHandler handler = new  InvoiceAPTriggerHandler();
    if (Trigger.isAfter){
        handler.OnAfterUpdate(Trigger.new, Trigger.oldMap); 
    }
}