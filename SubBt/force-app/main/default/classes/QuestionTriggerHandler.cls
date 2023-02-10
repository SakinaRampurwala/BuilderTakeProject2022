/*
Copyright (c) 2017-2018, BuilderTek.
All rights reserved. 

Developed By: Sagar
Date:  20-Jul-2018
*/
public with sharing class QuestionTriggerHandler {
    //Boolean variable to allow skipping execution of trigger in certain scenarios
    public static Boolean blnSkipTrigger = false;
    public static boolean firstRun = true; 

     
    private boolean m_isExecuting = false;
    private integer BatchSize = 0;
    
    public QuestionTriggerHandler (boolean isExecuting, integer size){
        m_isExecuting = isExecuting;
        BatchSize = size;
    }
    
    public void OnBeforeInsert(Question__c[] newQuestions){
        Set<Id> OptionIds=new Set<Id>();

        for(Question__c q : newQuestions){
            if (q.buildertek__Product__c != null) {
                Product2 prod = [SELECT Id, Name, (SELECT UnitPrice FROM PricebookEntries WHERE IsActive = True) FROM Product2 WHERE Id =: q.buildertek__Product__c];
                if (q.buildertek__Cost__c == null) {
                    if (prod.PricebookEntries.size() > 0) {
                        q.buildertek__Cost__c = prod.PricebookEntries[0].UnitPrice;
                    }
                }
                OptionIds.add(q.buildertek__Product__c);
            }

        }
    }
     
    public void OnBeforeUpdate(Question__c[] oldQuestions, Question__c[] updatedQuestions, Map<ID, Question__c> QuestionsMap){
        List<Question__c> questionList=new List<Question__c>();
        for(Question__c q : updatedQuestions){
            if (q.buildertek__Product__c != null) {
                Product2 prod = [SELECT Id, Name, (SELECT UnitPrice FROM PricebookEntries WHERE IsActive = True) FROM Product2 WHERE Id =: q.buildertek__Product__c];
                if (q.buildertek__Cost__c == null) {
                    if (prod.PricebookEntries.size() > 0) {
                        q.buildertek__Cost__c = prod.PricebookEntries[0].UnitPrice;
                    }
                }
            }

            List<Product2> prd=[select Id, name, buildertek__Manufacturer__c from Product2 where Id =: q.buildertek__Product__c];
            if (prd.size() > 0) {
                if(prd[0].buildertek__Manufacturer__c != null) {
                    q.buildertek__Manufacturer__c=prd[0].buildertek__Manufacturer__c;
                }
                questionList.add(q);
            }
        }
    }
     
    public void OnBeforeDelete(Question__c[] QuestionsToDelete, Map<ID, Question__c> QuestionsMap){
        
    }
     
    public void OnAfterInsert(Question__c[] newQuestions, Map<ID, Question__c> newQuestionsMap){ 
        
        // After insertion of quetion create question result
        List<Question_Result__c> results = new List<Question_Result__c>();
        Set<Id> selectionIds = new Set<Id>();
        Set<Id> optionIds = new Set<Id>();
        Set<Id> budgetLineIds = new Set<Id>();
        Map<Id,Question__c> optionMap  = new Map<Id,Question__c>();
        List<buildertek__Budget_Item__c> newBudgetLineList = new List<buildertek__Budget_Item__c>();
        List<buildertek__Question__c> newOptionList = new List<buildertek__Question__c>();

        
        for(Question__c q:newQuestions){
            optionIds.add(q.Id);

            if(Schema.sObjectType.Question_Result__c.fields.Selection_Category__c.isCreateable() && Schema.sObjectType.Question_Result__c.fields.Question__c.isCreateable()){
                Question_Result__c qr = new Question_Result__c();
                qr.Selection_Category__c = q.Section__c;
                qr.Question__c = q.Id;
                results.add(qr);
                selectionIds.add(q.Section__c);
            }

            if (q.buildertek__Budget_Line__c != null) {
                budgetLineIds.add(q.buildertek__Budget_Line__c);
                optionMap.put(q.Id, q);
            }
        }
        insert results;

        List<buildertek__Section__c> selection = new List<buildertek__Section__c>();
        if(Schema.sObjectType.buildertek__Section__c.fields.buildertek__Total_Options__c.isUpdateable()){
            for( buildertek__Section__c section :[Select Id,(Select Id from Questions__r), buildertek__Total_Options__c from buildertek__Section__c where Id IN:selectionIds]){
                section.buildertek__Total_Options__c = section.Questions__r.size();
                selection.add(section);
            }
        }
        if(!selection.isEmpty()) {
            update selection;
        }
        List<buildertek__Question__c> filterOptionList= [SELECT Id , Name , buildertek__Budget_Line__c From Question__c WHERE buildertek__Budget_Line__c IN :budgetLineIds AND Id NOT IN :optionIds];
        Map<Id, buildertek__Budget_Item__c> budgetLineMap = new Map<Id, buildertek__Budget_Item__c>([SELECT Id , Name , buildertek__Option__c FROM buildertek__Budget_Item__c WHERE Id = :budgetLineIds]);
        
        for (Question__c option : optionMap.values()) {
            buildertek__Budget_Item__c budgetLine = budgetLineMap.get(option.buildertek__Budget_Line__c);
            if (budgetLine != null) {
              budgetLine.buildertek__Option__c = option.Id;
              newBudgetLineList.add(budgetLine);
            }
        }
        if (newBudgetLineList.size() > 0) {
            update newBudgetLineList;
        }

        for(buildertek__Question__c option : filterOptionList){
            option.buildertek__Budget_Line__c= null;
            newOptionList.add(option);
        }

        if(newOptionList.size() > 0){
             update newOptionList;
        }
          
        
    }
     
    public void OnAfterUpdate(Question__c[] oldQuestions, Question__c[] updatedQuestions, Map<ID, Question__c> QuestionsMap, Map<Id, Question__c> oldQuestionsMap){
        System.debug('OnAfterUpdate');
        Set<Id> optionIds = new Set<Id>();
        Set<Id> budgetLineIds = new Set<Id>();
        Map<Id,Question__c> optionMap  = new Map<Id,Question__c>();
        List<buildertek__Budget_Item__c> newBudgetLineList = new List<buildertek__Budget_Item__c>();
        List<buildertek__Question__c> newOptionList = new List<buildertek__Question__c>();
      
        for(Question__c newOption:updatedQuestions){
            optionIds.add(newOption.Id);
            Question__c oldOption = oldQuestionsMap.get(newOption.Id);
            if(newOption.buildertek__Budget_Line__c != oldOption.buildertek__Budget_Line__c){
                budgetLineIds.add(newOption.buildertek__Budget_Line__c);
                optionMap.put(newOption.Id, newOption);
            }
        }
        List<buildertek__Question__c> filterOptionList= [SELECT Id , Name , buildertek__Budget_Line__c From Question__c WHERE buildertek__Budget_Line__c IN :budgetLineIds AND Id NOT IN :optionIds];
        Map<Id, buildertek__Budget_Item__c> budgetLineMap = new Map<Id, buildertek__Budget_Item__c>([SELECT Id , Name , buildertek__Option__c FROM buildertek__Budget_Item__c WHERE Id = :budgetLineIds]);
        for (Question__c option : optionMap.values()) {
            buildertek__Budget_Item__c budgetLine = budgetLineMap.get(option.buildertek__Budget_Line__c);
            if (budgetLine != null) {
                budgetLine.buildertek__Option__c = option.Id;
                newBudgetLineList.add(budgetLine);
            }
        }
        if (newBudgetLineList.size() > 0) {
            update newBudgetLineList;
        }
        System.debug(filterOptionList.size());
        for(buildertek__Question__c option : filterOptionList){
            option.buildertek__Budget_Line__c= null;
            newOptionList.add(option);
        }

        if(newOptionList.size() > 0){
            update newOptionList;

        }
     



    }
    
    public void OnBeforeUpdate(Question__c[] newQuestions, Map<ID, Question__c> newQuestionsMap){
        System.debug('OnBeforeUpdate');
    }
    
    public void OnAfterDelete(Question__c[] oldQuestions){
        Set<Id> selectionIds = new Set<Id>();
        for(Question__c q:oldQuestions){
            selectionIds.add(q.Section__c);
        } 
        
        List<buildertek__Section__c> selection = new List<buildertek__Section__c>();
        if(Schema.sObjectType.buildertek__Section__c.fields.buildertek__Total_Options__c.isUpdateable()){
            for( buildertek__Section__c section :[Select Id,(Select Id from Questions__r), buildertek__Total_Options__c from buildertek__Section__c where Id IN:selectionIds]){
                section.buildertek__Total_Options__c = section.Questions__r.size();
                selection.add(section);
            }
        }
        if(!selection.isEmpty()) {
            update selection;
        }
    }
}