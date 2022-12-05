trigger invoiceTrigger on Billings__c (before insert, before update, before delete, after update) {
    InvoiceTrigger_HDL handler = new InvoiceTrigger_HDL();
    list<buildertek__Billings__c> BillingRecordList = new list<buildertek__Billings__c>();
    if(Trigger.isInsert && Trigger.isBefore){
        BT_Utils.genrateAutoNumber([Select Id, buildertek__Auto_Number1__c from buildertek__Billings__c 
                                 where Project__c =:trigger.New[0].Project__c 
                                 ORDER BY CREATEDDATE DESC  LIMIT 1], trigger.New, 'buildertek__Auto_Number1__c');
    }
    if(Trigger.isInsert || Trigger.isUpdate && Trigger.isBefore){
        for(buildertek__Billings__c BillingRec : trigger.New){
            if(BillingRec.buildertek__Balance__c <= 0 && BillingRec.buildertek__Total_Amount_Tax__c > 0){
                if(Trigger.isBefore && trigger.isUpdate) {
                    BillingRec.buildertek__Status__c = 'Paid';
                }
                
            }
            else if(BillingRec.buildertek__Receipts__c > 0 && BillingRec.buildertek__Balance__c > 0){
                BillingRec.buildertek__Status__c = 'Partially Paid';
            }
            BillingRecordList.add(BillingRec);
        }
        
           handler.OnBeforeInsert(Trigger.new);
        
    }else if(Trigger.isUpdate && Trigger.isAfter){
        handler.OnAfterUpdate(Trigger.old, Trigger.new, Trigger.newMap, trigger.oldMap); 
    }
   
   else if(Trigger.isDelete && Trigger.isBefore){
        system.debug('before Delete');
        for(buildertek__Billings__c Inv : trigger.old){
            if(Inv.buildertek__Status__c == 'Paid' || Inv.buildertek__Status__c == 'Partially Paid' ){
                Inv.adderror('You cannot delete a Paid or Partially Paid Invoice');    
            }
        }
    }
    
    
    
}