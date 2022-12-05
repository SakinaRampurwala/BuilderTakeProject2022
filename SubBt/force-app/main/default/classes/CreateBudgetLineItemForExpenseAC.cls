/*

Developed By: Laxman
Date: 06/05/2020
*/
public with sharing class CreateBudgetLineItemForExpenseAC {
   public static boolean isUpdateExpense = false;
    @AuraEnabled
    public static object getBudgets(String ExpenseId){
        List<buildertek__Expense__c> expenseRec = [select id,name,buildertek__Budget__c,buildertek__Budget_Line__c from buildertek__Expense__c where Id=:ExpenseId AND buildertek__Budget_Line__c = null ];
        if(expenseRec.size()>0){
            list<buildertek__Budget__c> BudgetrecList;
            BudgetrecList = [SELECT Id,
                             Name,
                             buildertek__Project__c,
                             buildertek__Project__r.Name,
                             buildertek__Type__c
                             FROM buildertek__Budget__c
                             WHERE id =: expenseRec[0].buildertek__Budget__c]; 
            List<MasterBudgetsClass> MasterBudgetsClassList = new List<MasterBudgetsClass>();
            for(buildertek__Budget__c bud : BudgetrecList){
                MasterBudgetsClass MasterBudgetsClassRecord = new MasterBudgetsClass(); 
                MasterBudgetsClassRecord.budgetRecord = bud;
                MasterBudgetsClassRecord.budgetCheck = false;
                MasterBudgetsClassList.add(MasterBudgetsClassRecord);
            }
            return  MasterBudgetsClassList; 
        }
        else{
            return 'Associated Record';
        } 
    }
    @AuraEnabled
    public static MessageClass createBudgetLineFromExpense(String ExpenseId, String BudgetId){
       MessageClass msg = new MessageClass();
         system.debug('ExpenseId-------'+ExpenseId);
        try {
         buildertek__Quote_Line_Group__c  linegroup =[select id,Name from buildertek__Quote_Line_Group__c  where Name = 'Expense' limit 1];
         buildertek__Budget_Line_Group__c  budgetlinegroup =[select id,Name from buildertek__Budget_Line_Group__c  where Name = 'Expense' limit 1];
            buildertek__Expense__c expenseRec;
             if(Schema.sObjectType.buildertek__Expense__c.fields.Id.isAccessible()&&
                Schema.sObjectType.buildertek__Expense__c.fields.Name.isAccessible()&&
                Schema.sObjectType.buildertek__Expense__c.fields.buildertek__Budget__c.isAccessible() &&
                Schema.sObjectType.buildertek__Expense__c.fields.buildertek__Description__c.isAccessible() &&
                Schema.sObjectType.buildertek__Expense__c.fields.buildertek__Amount__c.isAccessible() &&
                Schema.sObjectType.buildertek__Expense__c.fields.buildertek__Tax_Rate__c.isAccessible() &&
                Schema.sObjectType.buildertek__Expense__c.fields.buildertek__Cost_Code__c.isAccessible() &&
                Schema.sObjectType.buildertek__Expense__c.fields.buildertek__Total_Expense__c.isAccessible() &&
                Schema.sObjectType.buildertek__Expense__c.fields.buildertek__Type__c.isAccessible() && 
                Schema.sObjectType.buildertek__Expense__c.fields.buildertek__Vendor__c.isAccessible()){
                expenseRec = [Select Id, Name, 
                            buildertek__Budget__c,
                            buildertek__Description__c,
                            buildertek__Amount__c,
                            buildertek__Tax_Rate__c,
                            buildertek__Total_Expense__c, 
                            buildertek__Cost_Code__c,
                            buildertek__Type__c,
                            buildertek__Vendor__c
                            from buildertek__Expense__c where Id =: ExpenseId];
             }
           string Budget = '';
            if(BudgetId != null){
                system.debug('BudgetId'+BudgetId);
                Budget = BudgetId;
            }else{
                
                Budget = expenseRec.buildertek__Budget__c;
                system.debug('Budget'+Budget);
            } 
             buildertek__Budget_Item__c budgetitem = new buildertek__Budget_Item__c();
             budgetitem.buildertek__Budget__c = Budget;
             //budgetitem.buildertek__Budget__c = expenseRec.buildertek__Budget__c;
             budgetitem.Name = expenseRec.buildertek__Description__c;
             budgetitem.buildertek__Quantity__c = 1;
             //budgetitem.buildertek__Unit_Price__c = expenseRec.buildertek__Total_Expense__c * -1;
             budgetitem.buildertek__UOM__c = 'Each';
            /*if(BudgetId != null){
                budgetitem.buildertek__Group__c  = budgetlinegroup.id; 
            }else{
               budgetitem.buildertek__Budget_Line_Group__c = linegroup.id;
            }*/
            budgetitem.buildertek__Group__c  = budgetlinegroup.id; 
             budgetitem.buildertek__Cost_Code__c = expenseRec.buildertek__Cost_Code__c;
             budgetitem.buildertek__Contractor__c = expenseRec.buildertek__Vendor__c;
              if(Schema.sObjectType.buildertek__Budget_Item__c.fields.Name.isCreateable()&& 
                Schema.sObjectType.buildertek__Budget_Item__c.fields.buildertek__Budget__c.isCreateable() &&
                Schema.sObjectType.buildertek__Budget_Item__c.fields.buildertek__Quantity__c.isCreateable() &&
                Schema.sObjectType.buildertek__Budget_Item__c.fields.buildertek__Unit_Price__c.isCreateable() &&
                Schema.sObjectType.buildertek__Budget_Item__c.fields.buildertek__Group__c.isCreateable() &&
                Schema.sObjectType.buildertek__Budget_Item__c.fields.buildertek__UOM__c.isCreateable() &&
                Schema.sObjectType.buildertek__Budget_Item__c.fields.buildertek__Cost_Code__c.isCreateable() &&
                Schema.sObjectType.buildertek__Budget_Item__c.fields.buildertek__Contractor__c.isCreateable() ){
                 insert budgetitem;
                 
                }
              //if(BudgetId == null){
                //isUpdateExpense = true;
                expenseRec.Id = ExpenseId;
                expenseRec.buildertek__Budget_Line__c = budgetitem.id;
                Update expenseRec;
             // }
             system.debug('budgetitem'+budgetitem);
                msg.Status = 'Success';
                msg.Message = 'Budget Line Created Successfully';
            return msg;
            
                    
        } catch(Exception exp){
            msg.Status = 'Failed';
            msg.Message = exp.getMessage();  
            return msg;
            
        } 
        
    }
    
     public static void createExpenseToBudgetItemLink(List<buildertek__Expense__c> Expenserecs){
        
        List<buildertek__Expense_To_Budget_Item_Link__c> ExpenseToBudgetItemLinks = new List<buildertek__Expense_To_Budget_Item_Link__c>();
        
        for(buildertek__Expense__c expns: Expenserecs){
            
            if(expns.buildertek__Budget_Line__c != null) {
                
                    buildertek__Expense_To_Budget_Item_Link__c ExpnseToBudgetItemLink = new buildertek__Expense_To_Budget_Item_Link__c();
                    ExpnseToBudgetItemLink.buildertek__Expense__c = expns.Id;
                    ExpnseToBudgetItemLink.buildertek__Budget_Line__c = expns.buildertek__Budget_Line__c;
                    ExpenseToBudgetItemLinks.add(ExpnseToBudgetItemLink);
                }
            
        }
        
        if(!ExpenseToBudgetItemLinks.isEmpty()){
            insert ExpenseToBudgetItemLinks;
            system.debug('ExpenseToBudgetItemLinks-----'+ExpenseToBudgetItemLinks);
        }
    }
    
     public static void RollUpExpenseAmount(set<Id> ExpenseIds){
        List<buildertek__Expense_To_Budget_Item_Link__c> ExpenseToBudgetItemLinks = new List<buildertek__Expense_To_Budget_Item_Link__c>();
        for(buildertek__Expense_To_Budget_Item_Link__c ExpnseToBudgetLink: [Select Id, Auto_Roll_Up__c from buildertek__Expense_To_Budget_Item_Link__c Where buildertek__Expense__c IN:ExpenseIds]) {
           
                ExpnseToBudgetLink.Auto_Roll_Up__c = true;
                ExpenseToBudgetItemLinks.add(ExpnseToBudgetLink);
            
        }
        
        if(!ExpenseToBudgetItemLinks.isEmpty()) {
            
        update ExpenseToBudgetItemLinks;
             
        }
    }
    public static void deletemethod(List<Id> budgetitemIds) {
        List<buildertek__Expense_To_Budget_Item_Link__c> ExpenseToBudgetItemLinks = [Select Id,Name,buildertek__Budget_Line__c,buildertek__Expense__c from buildertek__Expense_To_Budget_Item_Link__c
                                                                                     where buildertek__Budget_Line__c IN: budgetitemIds];
        if(ExpenseToBudgetItemLinks.size () > 0){
            delete ExpenseToBudgetItemLinks;
        }
    }

    public class MessageClass{
        @AuraEnabled
        public String Status {get;set;}
         @AuraEnabled
        public string Message {get;set;}
        
    } 
    
     public class MasterBudgetsClass{
         @AuraEnabled
         public buildertek__Budget__c budgetRecord {get;set;}
        
         @AuraEnabled
         public boolean budgetCheck {get;set;}
    }
}