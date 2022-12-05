/*
Copyright (c) 2017-2018, BuilderTek.
All rights reserved. 

Developed By: Sagar
Date:  04-Sep-2018
*/
public with sharing class BT_MultiSelectLookupController {
    
    @AuraEnabled
    public static List < sObject > fetchLookUpValues(String searchKeyWord, String ObjectName, List<sObject> ExcludeitemsList,Boolean isPreQual,string recId) {
        system.debug('searchKeyWord'+searchKeyWord);
        system.debug('ExcludeitemsList'+ExcludeitemsList);
        String searchKey = '%' + searchKeyWord + '%';
        List < sObject > returnList = new List < sObject > ();
        
        List<string> lstExcludeitems = new List<string>();
        if(ExcludeitemsList!=null){
            for(sObject item : ExcludeitemsList ){
                lstExcludeitems.add(item.id);
            }            
        }
        
        try{
            // Create a Dynamic SOQL Query For Fetch Record List with LIMIT 5 and exclude already selected records  
            String sQuery = 'select id, Name from ' +ObjectName + ' where Name LIKE: searchKey AND Id NOT IN : lstExcludeitems order by createdDate DESC limit 5';
            if(ObjectName == 'contact') {
                if(isPreQual){
                    sQuery =  'select id, Name, Email from ' +ObjectName + ' where Name LIKE: searchKey AND Id NOT IN : lstExcludeitems AND AccountId=:recId order by createdDate DESC limit 5';
                }else{
                    sQuery =  'select id, Name, Email from ' +ObjectName + ' where Name LIKE: searchKey AND Id NOT IN : lstExcludeitems order by createdDate DESC limit 5';
                }
                
                
            }
            
            List < sObject > lstOfRecords; 
            if(ObjectName == 'contact') { 
                if(Schema.sObjectType.contact.fields.Id.isAccessible() &&
                   Schema.sObjectType.contact.fields.Name.isAccessible() &&
                   Schema.sObjectType.contact.fields.Email.isAccessible()){
                       lstOfRecords = Database.query(String.escapeSingleQuotes(sQuery));
                   } 
            }else{
                lstOfRecords = Database.query(String.escapeSingleQuotes(sQuery));
            }
            for (sObject obj: lstOfRecords) { 
                returnList.add(obj);
            }
            
        }catch(Exception e){
            system.debug('exception--->'+e.getMessage()+'--line no--->'+e.getLineNumber());
        }
        
        return returnList;
    }
}