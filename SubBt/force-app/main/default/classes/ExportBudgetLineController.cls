public without sharing class ExportBudgetLineController {
    public ExportBudgetLineController() {

    }
    @AuraEnabled
    public static List<buildertek__Budget_Item__c> getBudgetLine(String BudgetId){
        if(BudgetId != null){

            List<buildertek__Budget_Item__c> budgetLineList=[Select  Id, Name , buildertek__Unit_Price__c, buildertek__Product_Name__c, buildertek__Quantity__c, buildertek__Markup__c, buildertek__Tax__c, buildertek__Group_Name__c From buildertek__Budget_Item__c WHERE buildertek__Budget__c=:BudgetId AND buildertek__Group_Name__c != null Order by buildertek__Group_Name__c ]; 
            return budgetLineList;
        }else{
            return null;
        }
       
    }
}