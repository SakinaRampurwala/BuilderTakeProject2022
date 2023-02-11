public class newOptionClass {
    @AuraEnabled
    public static String createoption(buildertek__Question__c option , Decimal salesPrice , String BudgetId , String budgetLineId){
        option.buildertek__Cost__c=salesPrice;
        option.buildertek__Budget_Line__c=budgetLineId;
        option.buildertek__Budget__c=BudgetId;
        insert option;
        return option.Id;
    }

    @AuraEnabled
    public static Product2 getProduct(String productId){
        Product2 prod = [SELECT Id, Name, buildertek__Manufacturer__c FROM Product2 WHERE Id =: productId];
        return prod;
    }
    @AuraEnabled
    public static List<buildertek__Budget__c> getBudget(String selectionTypeId){
        Set<Id> selectionCategoryIds= new Set<Id>();
        List<buildertek__Question_Group__c> selectionTypeList = [SELECT Id, Name, buildertek__Section__c, buildertek__Section__r.Name   FROM buildertek__Question_Group__c where id=:selectionTypeId];
        for(buildertek__Question_Group__c selectionType:selectionTypeList){
            selectionCategoryIds.add(selectionType.buildertek__Section__c);
        }
        buildertek__Section__c sectionList=[Select Id , Name , buildertek__Selection__c , buildertek__Selection__r.buildertek__Project__c from buildertek__Section__c	where Id=:selectionCategoryIds];
        List<buildertek__Budget__c> budgetList = [SELECT Id, Name  ,buildertek__Project__c FROM buildertek__Budget__c WHERE buildertek__Project__c =:sectionList.buildertek__Selection__r.buildertek__Project__c];
        return budgetList;
    }
    @AuraEnabled
    public static List<buildertek__Budget_Item__c> getBudgetLine(String BudgetId){
        List<buildertek__Budget_Item__c> budegtLineList = [SELECT Id, Name  ,buildertek__Budget__c FROM buildertek__Budget_Item__c WHERE buildertek__Budget__c =:BudgetId];
        return budegtLineList;
    }
    @AuraEnabled
    public static Decimal getBudgetLineUnitSalesPrice(String budgetLineId){
        buildertek__Budget_Item__c budgetLine = [SELECT Id, Name , buildertek__Sales_Price__c, buildertek__Budget__c FROM buildertek__Budget_Item__c WHERE Id =: budgetLineId LIMIT 1];
        System.debug(budgetLine.buildertek__Sales_Price__c);
        System.debug(budgetLine);

        return budgetLine.buildertek__Sales_Price__c;
    }
    
    
}