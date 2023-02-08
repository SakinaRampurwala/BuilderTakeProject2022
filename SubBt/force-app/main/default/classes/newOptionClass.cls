public class newOptionClass {
    @AuraEnabled
    public static String createoption(buildertek__Question__c option , Decimal salesPrice , String budgetLineId){
        option.buildertek__Cost__c=salesPrice;
        option.buildertek__Budget_Line__c=budgetLineId;
        insert option;
        return option.Id;
    }

    @AuraEnabled
    public static Product2 getProduct(String productId){
        Product2 prod = [SELECT Id, Name, buildertek__Manufacturer__c FROM Product2 WHERE Id =: productId];
        return prod;
    }
    @AuraEnabled
    public static List<buildertek__Budget_Item__c> getBudgetLine(String budgetId){
        List<buildertek__Budget_Item__c> budgetLineList = [SELECT Id, Name , buildertek__Budget__c FROM buildertek__Budget_Item__c WHERE buildertek__Budget__c =: budgetId];
        return budgetLineList;
    }
    @AuraEnabled
    public static Decimal getBudgetLineUnitSalesPrice(String budgetLineId){
        buildertek__Budget_Item__c budgetLine = [SELECT Id, Name , buildertek__Sales_Price__c, buildertek__Budget__c FROM buildertek__Budget_Item__c WHERE Id =: budgetLineId LIMIT 1];
        System.debug(budgetLine.buildertek__Sales_Price__c);
        System.debug(budgetLine);

        return budgetLine.buildertek__Sales_Price__c;
    }
    
    
}