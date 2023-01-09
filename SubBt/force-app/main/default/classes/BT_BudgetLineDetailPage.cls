public with sharing class BT_BudgetLineDetailPage {

    @AuraEnabled(cacheable=true)
    public static buildertek__Budget_Item__c getRecord(String recordId){
        System.debug('recordId: ' + recordId);
        buildertek__Budget_Item__c BudgetLine = [SELECT Id,buildertek__Product__c,buildertek__Product_Name__c, Name, buildertek__Complete__c,buildertek__Profit_Loss__c,buildertek__Cost_Code__c,buildertek__Contractor__c,buildertek__Budget__c,buildertek__Total_Costs__c,buildertek__Approved_CO__c,buildertek__Invoice_total__c,buildertek__Labor__c,buildertek__Additional_Costs__c,buildertek__Committed_Costs__c,buildertek__Original_Budget__c,buildertek__UOM__c,buildertek__Unit_Price__c,buildertek__Quantity__c,buildertek__Group__c FROM buildertek__Budget_Item__c WHERE Id =: recordId];
        return BudgetLine;
    }
    
    @AuraEnabled
    public static void updateRecord(buildertek__Budget_Item__c BudgetLine){

        System.debug('BudgetLine: ' + BudgetLine);
        System.debug('BudgetLine.buildertek__Product__c' + BudgetLine.buildertek__Product__c);
        // set 
        update BudgetLine;
    }    

    @AuraEnabled
    public static String getProductName(String productId){
        System.debug('ProductID: ' + productId);
        buildertek__Product__c Product = [SELECT Id, Name FROM buildertek__Product__c WHERE Id =: ProductID];
        System.debug('Product: ' + Product);
        System.debug('Product.Name: ' + Product.Name); 
        return Product.Name;      
    }
}