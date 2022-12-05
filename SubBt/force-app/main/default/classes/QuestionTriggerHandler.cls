/*
Copyright (c) 2017-2018, BuilderTek.
All rights reserved. 

Developed By: Sagar
Date:  20-Jul-2018
*/
public with sharing class QuestionTriggerHandler {
    //Boolean variable to allow skipping execution of trigger in certain scenarios
    public static Boolean blnSkipTrigger = false;
     
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
        
        // For Ticket BUIL-2789 (Comment this code because we create custom component - newOption for auto popupate name)
        // if(!OptionIds.isEmpty()){
        // 	System.debug('OptionIds--->'+OptionIds);
        //     Map<Id,Product2> ProductMap = new Map<Id,Product2>();
        //     List<Product2> ProductList = [SELECT id,Name,buildertek__Manufacturer__c FROM Product2 WHERE Id IN :OptionIds];    
        //     for(Product2 product : ProductList){
        //         ProductMap.put(product.Id, product);
        //         System.debug('Id--->'+product.Id);
        //         System.debug('Before Name--->'+product.Name);
        //     }  
        //     for(buildertek__Question__c option : newQuestions){
        //         if(option.buildertek__Product__c != null){
        //             option.Name = ProductMap.get(option.buildertek__Product__c).Name;
        //             option.buildertek__Manufacturer__c = ProductMap.get(option.buildertek__Product__c).buildertek__Manufacturer__c;
        //             System.debug('After Name------->'+option.Name);
        //             System.debug('Manufacturer--->'+option.buildertek__Manufacturer__c);
        //         }
        //     }
        // }
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
            // Product2 prd=[select Id, name, buildertek__Manufacturer__c from Product2 where Id =: q.buildertek__Product__c];
            // if(prd.buildertek__Manufacturer__c != null)
            // {
            //     q.buildertek__Manufacturer__c=prd.buildertek__Manufacturer__c;
            // }
            // questionList.add(q);

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
        for(Question__c q:newQuestions){
            if(Schema.sObjectType.Question_Result__c.fields.Selection_Category__c.isCreateable() && Schema.sObjectType.Question_Result__c.fields.Question__c.isCreateable()){
                Question_Result__c qr = new Question_Result__c();
                qr.Selection_Category__c = q.Section__c;
                qr.Question__c = q.Id;
                results.add(qr);
                
                selectionIds.add(q.Section__c);
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
        
    }
     
    public void OnAfterUpdate(Question__c[] oldQuestions, Question__c[] updatedQuestions, Map<ID, Question__c> QuestionsMap, Map<Id, Question__c> oldQuestionsMap){

    }
    
    public void OnBeforeUpdate(Question__c[] newQuestions, Map<ID, Question__c> newQuestionsMap){
     
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