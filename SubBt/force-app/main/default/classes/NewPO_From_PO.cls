public with sharing class NewPO_From_PO {
    @AuraEnabled
    public static List<buildertek__Purchase_Order_Item__c> getPOLines(String recordId) {
        List<buildertek__Purchase_Order_Item__c> POLines = [SELECT Id,Name,buildertek__Quantity__c,buildertek__Unit_Price__c,buildertek__Tax__c,buildertek__Purchase_Order__c FROM buildertek__Purchase_Order_Item__c WHERE buildertek__Purchase_Order__c =: recordId];
        System.debug('POLines---->>>'+POLines);
        return POLines;
    }

    @AuraEnabled
    public static String createNewPo(String recordId, List<buildertek__Purchase_Order_Item__c> POLineList) {
        buildertek__Purchase_Order__c po = [SELECT Id, Name, buildertek__Vendor__c, buildertek__Project__c FROM buildertek__Purchase_Order__c WHERE Id =: recordId];

        buildertek__Purchase_Order__c newPO = new buildertek__Purchase_Order__c();
        newPO.buildertek__Vendor__c = po.buildertek__Vendor__c;
        newPO.buildertek__Project__c = po.buildertek__Project__c;
        newPO.buildertek__Old_Purchase_Order__c = po.Id;
        insert newPO;

        Map<ID, buildertek__Purchase_Order_Item__c> POLineMap = new Map<ID, buildertek__Purchase_Order_Item__c>([SELECT Id, buildertek__Quantity__c FROM buildertek__Purchase_Order_Item__c WHERE buildertek__Purchase_Order__c =: recordId]);
        for(Id key: POLineMap.keySet()){
            System.debug('PO Line--->: ' + POLineMap.get(key));
        }

        List<buildertek__Purchase_Order_Item__c> newPolineList = new List<buildertek__Purchase_Order_Item__c>();
        for (buildertek__Purchase_Order_Item__c POLine : POLineList) {
            buildertek__Purchase_Order_Item__c newPoLine = new buildertek__Purchase_Order_Item__c();
            System.debug('POLine value--->>>'+POLine);
            newPoLine.Name = POLine.Name;
            newPoLine.buildertek__Quantity__c = POLine.buildertek__Quantity__c;
            newPoLine.buildertek__Unit_Price__c = POLine.buildertek__Unit_Price__c;
            newPoLine.buildertek__Tax__c = POLine.buildertek__Tax__c;
            newPoLine.buildertek__Purchase_Order__c = newPO.Id;
            newPolineList.add(newPoLine);
        }
        if (newPolineList.size() > 0) {
            insert newPolineList;
            System.debug('newPolineList--->>>'+newPolineList);
        }

        return newPO.Id;
        
    }
}