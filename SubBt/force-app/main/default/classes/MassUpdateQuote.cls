public with sharing class MassUpdateQuote{
    Public String recordId{ get; set; }
    
    Private ApexPages.StandardController controller;
    
    Public MassUpdateQuote(){
        recordId = ApexPages.currentPage().getParameters().get('Id');
    }
    
    @AuraEnabled
    public static string getName(String recordId){
        try{
            List<buildertek__Quote__c> record = [Select Id, Name
                                                 From buildertek__Quote__c
                                                 WHERE Id = :recordId];
            if (record.size() > 0){
                return record[0].Name;
            }
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }
    @AuraEnabled
    public static Integer getCount(String recordId){
        try{
            if(String.isNotBlank(recordId)){
                return [Select COUNT()
                        FROM buildertek__Quote_Item__c
                        WHERE buildertek__Quote__c = :recordId];
                
            }
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }
    
    // @AuraEnabled
    // public static String getRecords(String parentRecordId, String fieldNameJson,Integer pageNumber, Integer pageSize){
        
    //     List<sObject> lstResult = new List<sObject>();
    //     String result = '[]';
    //     try{
    //         if(String.isNotBlank(parentRecordId)){
    //             Integer offset = (pageNumber - 1) * pageSize;
    //             List<String> fieldNames = (List<String>)JSON.deserialize(fieldNameJson, List<String>.class);
    //             Set<String> setFieldNames = new Set<String>();
    //             String query = 'SELECT ' + String.join(fieldNames, ',')+' FROM buildertek__Quote_Item__c';
    //             query += ' WHERE buildertek__Quote__c= : parentRecordId ORDER BY Name ASC NULLS LAST';
    //             query += ' LIMIT : pageSize OFFSET : offset';
    //             for (sObject s : Database.query(query)){
    //                 lstResult.add(s);
    //                 system.debug('result'+lstResult);
    //             }
    //             if (lstResult.size() > 0){
    //                 result = JSON.serialize(lstResult);
    //                 return result;
    //             }
    //         }
    //     } catch (Exception e){
    //         System.debug('Error' + e.getMessage());
    //     }
    //     return null;
    // }
    
    @AuraEnabled
    public static String getFieldSet(){
        String result = '';
        try{
            List<String> pickListValuesList = new List<String>();
            SObjectType objToken = Schema.getGlobalDescribe().get('buildertek__Quote_Item__c');
            Schema.DescribeSObjectResult d = objToken.getDescribe();
            Map<String, Schema.FieldSet> FsMap = d.fieldSets.getMap();
            if (FsMap.containsKey('buildertek__BT_Related_List_View_Fields'))
                for (Schema.FieldSetMember f : FsMap.get('buildertek__BT_Related_List_View_Fields').getFields()){
                    if (result != ''){
                        result += ',';
                    }
                    String jsonPart = '{';
                    jsonPart += '"label":"' + f.getLabel()+'",';
                    jsonPart += '"required":"' + (f.getDBRequired() || f.getRequired())+'",';
                    jsonPart += '"type":"' + (f.getType())+'",';
                    jsonPart += '"name":"' + f.getFieldPath()+'"';
                    if (String.valueOf(f.getType()) == 'PICKLIST'){
                        pickListValuesList = getDropDown('buildertek__Quote_Item__c', String.valueOf(f.getFieldPath()));
                        jsonPart += ',"pickListValuesList":' + JSON.serialize(pickListValuesList);
                    }
                    jsonPart += '}';
                    result += jsonPart;
                }
        } catch (Exception e){
            result += e.getLineNumber()+' : ' + e.getMessage();
        }
        return '[' + result + ']';
    }
    
    @AuraEnabled
    public static List<String> getDropDown(String objName, String fieldName){
        List<String> pickListValuesList = new List<String>();
        try{
            Schema.SObjectType s = Schema.getGlobalDescribe().get(objName);
            Schema.DescribeSObjectResult r = s.getDescribe();
            Map<String, Schema.SObjectField> fields = r.fields.getMap();
            Schema.DescribeFieldResult fieldResult = fields.get(fieldName).getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry pickListVal : ple){
                pickListValuesList.add(pickListVal.getLabel());
            }
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        return pickListValuesList;
    }
    
    @AuraEnabled
    public static String updateRecords(String recordId, String updatedRecords, String fieldSetName, Integer pageNumber, Integer pageSize, List<String> deleteLineitems){
        try{
            if (String.isNotBlank(updatedRecords)){
                List<buildertek__Quote_Item__c> items = (List<buildertek__Quote_Item__c>)JSON.deserialize(updatedRecords, List<buildertek__Quote_Item__c>.class);
                for (buildertek__Quote_Item__c item : items){
                    if(item.Id == null){
                        item.buildertek__Quote__c = recordId;
                    }
                }
                if (items.size() > 0){
                    upsert items;
                }
                List<buildertek__Quote_Item__c> deleteList = [SELECT Id from buildertek__Quote_Item__c WHERE Id IN: deleteLineitems];
               // system.debug('delete==>'+deleteList);
                if(deleteList.Size()>0){
                    delete deleteList;
                }
                return getRecords(recordId, fieldSetName, pageNumber, pageSize);
            }
        } catch (Exception e){
            System.debug('Error::' + e.getMessage());
            System.debug('Error Line::' + e.getLineNumber());
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }
    
    @AuraEnabled
    public static String deleteQuoteItem(String quoteId, String recordId, String fieldSetName, Integer pageNumber, Integer pageSize){
        try{
            if (String.isNotBlank(recordId)){
                delete [Select Id
                        FROM buildertek__Quote_Item__c
                        WHERE Id = :recordId];
                return getRecords(quoteId, fieldSetName, pageNumber, pageSize);
            }
        } catch (Exception e){
            System.debug('Error::' + e.getMessage());
            System.debug('Error Line::' + e.getLineNumber());
            throw new AuraHandledException(e.getMessage());
        }
        return null;
        
    }  
    @AuraEnabled
    public static string getpricebook(string quoteId){
        list<buildertek__Quote__c> quotesList;
        If (Schema.sObjectType.buildertek__Quote__c.fields.Id.isAccessible() && Schema.sObjectType.buildertek__Quote__c.fields.Name.isAccessible() && Schema.sObjectType.buildertek__Quote__c.fields.buildertek__Project__c.isAccessible() && Schema.sObjectType.buildertek__Project__c.fields.buildertek__Price_Book__c.isAccessible()){
            quotesList = [select id, buildertek__Project__r.buildertek__Price_Book__c
                          from buildertek__Quote__c
                          where id = :quoteId];
        }
        if (quotesList.size() > 0){
            return quotesList[0].buildertek__Project__r.buildertek__Price_Book__c;
        }
        return null;
    }
    @AuraEnabled
    public static Map<String, String> getpricebooks(){
        Map<String, String> options = new Map<String, String>();
        list<pricebook2> PriceList;
        PriceList = [select Id, Name
                     from pricebook2 
                     Where buildertek__BT_Visible__c = true AND isActive = true ORDER BY Name ASC];
        for (pricebook2 p : PriceList){
            options.put(p.name, p.Id);
        }
        return options;
    }  
    @AuraEnabled
    public static String getRecords(String parentRecordId, String fieldNameJson,Integer pageNumber, Integer pageSize){
        
        List<sObject> lstResult = new List<sObject>();
        String result = '[]';
        try{
            if(String.isNotBlank(parentRecordId)){
                Integer offset = (pageNumber - 1) * pageSize;
                List<String> fieldNames = (List<String>)JSON.deserialize(fieldNameJson, List<String>.class);
                Set<String> setFieldNames = new Set<String>();
                String query = 'SELECT ' + String.join(fieldNames, ',')+' FROM buildertek__Quote_Item__c';
                query += ' WHERE buildertek__Quote__c = : parentRecordId ORDER BY Name ASC NULLS LAST';
                query += ' LIMIT : pageSize OFFSET : offset';
                for (sObject s : Database.query(query)){
                    lstResult.add(s);
                }
                if (lstResult.size() > 0){
                    result = JSON.serialize(lstResult);
                    return result;
                }
            }
        } catch (Exception e){
            System.debug('Error' + e.getMessage());
        }
        return null;
    }
    public class productfamilyClass{
        @AuraEnabled
        public string productfamilyvalues{ get; set; }
    }
    

    @AuraEnabled
    public static list<productfamilyClass> getProductfamilyRecords(String ObjectName, string parentId){
       // system.debug('ObjectName-->' + ObjectName);
        Map<String, String> options = new Map<String, String>();
        List<sObject> returnList = new List<sObject>();
        
        list<string> ProdIds = new list<string>();
        if (ObjectName == 'Product2' && parentId != null){
            
            list<pricebookEntry> PElist;
            
            PElist = [select id, Product2Id
                      from pricebookEntry
                      where pricebook2Id = :parentId];
            
            for (pricebookEntry PE : PElist){
                ProdIds.add(PE.Product2Id);
            }
        }
        //list<Product2> productfamlylst = [select id, Name,family from Product2 where Id IN :ProdIds AND family != null order by family];
        List<AggregateResult> productfamlylst = [SELECT family
                                                 FROM Product2
                                                 where (Id IN :ProdIds AND family != null)
                                                 group by family];
        list<productfamilyClass> pfwrapperlst = new list<productfamilyClass>();
        if (productfamlylst.size() > 0){
            for (AggregateResult agg : productfamlylst){
                productfamilyClass pf = new productfamilyClass();
                pf.productfamilyvalues = string.valueof(agg.get('family'));
                pfwrapperlst.add(pf);
            }
           // system.debug('pfwrapperlst---->' + pfwrapperlst);
        }
        return pfwrapperlst;
    }
    
}