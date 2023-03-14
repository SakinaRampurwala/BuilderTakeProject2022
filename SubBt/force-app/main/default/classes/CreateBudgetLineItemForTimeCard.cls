public with sharing class CreateBudgetLineItemForTimeCard {

    public static void updateBudgetItem(Id timeCardId){
        buildertek__Time_Cards__c timeCardData = [Select Id,buildertek__Budget__c, buildertek__Budget_Line__c, Name from buildertek__Time_Cards__c where Id =:timeCardId limit 1];

        buildertek__Budget_Item__c budgetitem = new buildertek__Budget_Item__c();
        budgetitem.buildertek__Budget__c = timeCardData.buildertek__Budget__c;
        budgetitem.Name = timeCardData.buildertek__Resource__r.Name;
        budgetitem.buildertek__Quantity__c = 1; 
        budgetitem.buildertek__UOM__c = 'Each';
        insert budgetitem;

        timeCardData.buildertek__Budget_Line__c = budgetitem.id;
        update timeCardData;

    }

    public static void deleteBudgetItem(Id timecardId, Id BudgetLineId){
        buildertek__Time_Cards__c timeCardData = [Select Id,buildertek__Budget__c, buildertek__Budget_Line__c, Name from buildertek__Time_Cards__c where Id =:timeCardId limit 1];
        buildertek__Budget_Item__c budgetitem = [Select Id, Name from buildertek__Budget_Item__c where Id =:BudgetLineId limit 1];
        
        // if(expenseData.buildertek__Description__c == budgetitem.Name){
        delete budgetitem;
        // }
    }
    
}