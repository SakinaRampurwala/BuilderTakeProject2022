public with sharing class ImportPOinCOController {

    @AuraEnabled
    public static List<buildertek__Purchase_Order__c>  getPoList(String recordId){
        buildertek__Change_Order__c changeOrder=[SELECT Id, Name, buildertek__Project__c  FROM buildertek__Change_Order__c where Id=:recordId AND  buildertek__Project__c != null LIMIT 1];
        
        if(changeOrder!=null){
        
            List<buildertek__Purchase_Order__c> poList =[SELECT Id,Name ,buildertek__PO_Total__c, buildertek__Project__c  ,buildertek__Status__c,buildertek__Vendor__c , buildertek__Vendor__r.Name  FROM buildertek__Purchase_Order__c where buildertek__Project__c=:changeOrder.buildertek__Project__c];
            System.debug(poList);
            System.debug(poList.size());
            return poList;
       
        }else{
           
            return null;
        }

       
    }


    // This method used to create change order Line 
    @AuraEnabled
    public static String  createCoLine(String poRecordId , String coRecordId){

        List<buildertek__Change_Order_Item__c> changeOrderLineList= new List<buildertek__Change_Order_Item__c>();
        buildertek__Purchase_Order__c purchaseOrder ;
        List<buildertek__Purchase_Order_Item__c> poLineList ;

        if(poRecordId != null && poRecordId!=''){
            purchaseOrder = [Select Id , Name, buildertek__Vendor__c From buildertek__Purchase_Order__c  where Id=:poRecordId LIMIT 1];
            poLineList = [SELECT Id, Name, buildertek__Quantity__c, buildertek__Unit_Price__c, buildertek__Purchase_Order__c FROM buildertek__Purchase_Order_Item__c where buildertek__Purchase_Order__c=:poRecordId];
        }

        if(poLineList.size() > 0){
            for(buildertek__Purchase_Order_Item__c poLine: poLineList){
                buildertek__Change_Order_Item__c changeOrderLine= new buildertek__Change_Order_Item__c();
                changeOrderLine.buildertek__Quantity__c = poLine.buildertek__Quantity__c;
                changeOrderLine.buildertek__Unit_Price__c = poLine.buildertek__Unit_Price__c;
                changeOrderLine.Name=poLine.Name;
                changeOrderLine.buildertek__Vendor__c=purchaseOrder.buildertek__Vendor__c;
                if(coRecordId != null && coRecordId != ''){
                    changeOrderLine.buildertek__Change_Order__c = coRecordId;
                }
                changeOrderLineList.add(changeOrderLine);
            }

            if(changeOrderLineList.size() > 0){
                insert changeOrderLineList;
                System.debug(changeOrderLineList);
                System.debug(changeOrderLineList.size());

                // update change order vendor value equal to Purchase order vendor value
                buildertek__Change_Order__c changeOrder = new buildertek__Change_Order__c();
                changeOrder.Id = coRecordId;
                changeOrder.buildertek__Vendor__c = purchaseOrder.buildertek__Vendor__c;
                update changeOrder;
                System.debug(changeOrder);
                
            }
            return 'success';

        }else{
            return 'noRecords';
        }

    }
    
}
