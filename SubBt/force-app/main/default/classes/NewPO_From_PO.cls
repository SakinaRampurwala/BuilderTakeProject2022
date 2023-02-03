public with sharing class NewPO_From_PO {
    @AuraEnabled
    public static List<buildertek__Purchase_Order_Item__c> getPOLines(String recordId) {
        List<buildertek__Purchase_Order_Item__c> POLines = [SELECT Id,Name,buildertek__Quantity__c,buildertek__Unit_Price__c,buildertek__Tax__c,buildertek__Purchase_Order__c FROM buildertek__Purchase_Order_Item__c WHERE buildertek__Purchase_Order__c =: recordId];
        System.debug('POLines---->>>'+POLines);
        return POLines;
    }
}