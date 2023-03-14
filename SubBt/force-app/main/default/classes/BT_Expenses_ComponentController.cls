public with sharing class BT_Expenses_ComponentController {

    @AuraEnabled
    public static List<Project__c> getProjects(){
        List<buildertek__Project__c> projects = [SELECT Id, Name FROM buildertek__Project__c ORDER BY Name ASC];
        return projects;
    }

    @AuraEnabled
    public static List<buildertek__Expense__c> getExpenses(Id projectId){
        List<buildertek__Expense__c> ExpenseList = new List<buildertek__Expense__c>();
        ExpenseList = [SELECT Id, Name, buildertek__Project__c, buildertek__Description__c,buildertek__Budget_Line__c, buildertek__Vendor__c, buildertek__Vendor__r.Name, buildertek__Budget__c,
                                buildertek__Total_Expense__c, buildertek__Cost_Code__r.Name FROM buildertek__Expense__c
                                WHERE buildertek__Budget_Line__c = null AND buildertek__Budget__c = null AND buildertek__Project__c=: projectId ORDER BY Name ASC];
        return ExpenseList;
    }

    @AuraEnabled
    public static List<buildertek__Budget__c> getBudgets(Id projectId){
        List<buildertek__Budget__c> BudgetList = new List<buildertek__Budget__c>();
        BudgetList = [SELECT Id, Name, buildertek__Project__c FROM buildertek__Budget__c
                                WHERE buildertek__Project__c=: projectId ORDER BY Name ASC];
        return BudgetList;
    }

    @AuraEnabled
    public static List<buildertek__Budget_Item__c> getBudgetLines(Id budgetId){
        List<buildertek__Budget_Item__c> BudgetLineList = new List<buildertek__Budget_Item__c>();
        BudgetLineList = [SELECT Id, Name, buildertek__Budget__c, buildertek__Cost_Code__c, buildertek__Cost_Code__r.Name FROM buildertek__Budget_Item__c
                                WHERE buildertek__Budget__c=: budgetId ORDER BY Name ASC];
        return BudgetLineList;
    }

    @AuraEnabled
    public static void saveExp(List<buildertek__Expense__c> expenses){
        System.debug('expenses: ' + expenses);
        update expenses;
    }

}