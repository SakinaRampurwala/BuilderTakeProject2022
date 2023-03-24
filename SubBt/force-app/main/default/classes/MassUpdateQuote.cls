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
    public Class QuoteClass{
        @AuraEnabled
        public String Id{ get; set; }

        @AuraEnabled
        public String values{ get; set; }
    }
    @AuraEnabled
    public static string getselectOptions(sObject QuoteObject, string QuoteField){
        system.debug('QuoteObject --->' + QuoteObject);
        system.debug('QuoteField --->' + QuoteField);
        Schema.sObjectType objType = QuoteObject.getSObjectType();
        // Describe the SObject using its object type.
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
        list<Schema.PicklistEntry> values = fieldMap.get(QuoteField).getDescribe().getPickListValues();

        list<QuoteClass> allQuoteOptions = new list<QuoteClass>();
        integer i = 1;
        for (Schema.PicklistEntry a : values){
            QuoteClass allQuoteOption = new QuoteClass();
            allQuoteOption.Id = a.getLabel();
            allQuoteOption.values = a.getValue();
            allQuoteOptions.add(allQuoteOption);
            i++;
        }
        String AllQuotevalues = json.serialize(allQuoteOptions);
        system.debug('allOpts ---->' + allQuoteOptions);
        //allOpts.sort();
        return AllQuotevalues;
    }
     
    @AuraEnabled
    public static list<PricebookEntry> getProductPrice(string productId, String pricebookId){
        System.debug('########pricebook' + productId);
        list<PricebookEntry> pList = new list<PricebookEntry>();

        pList = [select id, UnitPrice, buildertek__Unit_Cost__c, buildertek__Markup__c, buildertek__Discount__c, Product2.Name, Product2Id, Product2.buildertek__Quote_Group__r.Name
                 from PricebookEntry
                 where product2Id = :productId and pricebook2Id =: pricebookId];

        system.debug('====pList' + pList);
        return pList;
    }
    @AuraEnabled
    public static String updateMultipleQuoteLine(String recordId, String updatedRecords, String fieldSetName, Integer pageNumber, Integer pageSize, List<String> deleteLineitems){
        try{
            if (String.isNotBlank(updatedRecords)){
                List<buildertek__Quote_Item__c> quoteItemList = new List<buildertek__Quote_Item__c>();
                List<multipleQuoteLinesClass> items = (List<multipleQuoteLinesClass>)JSON.deserialize(updatedRecords, List<multipleQuoteLinesClass>.class);
                if(items.Size()>0){
               // system.debug(items );
                List<buildertek__Quote_Line_Group__c> quoteGroup = [select Id, Name
                                                                            from buildertek__Quote_Line_Group__c
                                                                            where Name = 'No Grouping'];
                    Id nogroupId;
                    
                     Map<Id,product2> prdctrec = new Map<Id,product2>([SELECT id, Name, buildertek__Cost_Code__c
                                            FROM product2]);
 
                    for(multipleQuoteLinesClass listItem : items){
                       buildertek__Quote_Item__c quoteRec = new buildertek__Quote_Item__c();
                       quoteRec  = listItem.newQuoteLine;
                  //  system.debug('Budget Group ------------> ' + quoteRec.buildertek__Budget_Line_Group__c);
                    
                
                    if (quoteRec.buildertek__Grouping__c == null){
                        
                        if (quoteGroup.size() > 0){
                            quoteRec.buildertek__Grouping__c = quoteGroup[0].Id;
                        } else{
                            if(nogroupId == null){
                                buildertek__Quote_Line_Group__c budGroup = new buildertek__Quote_Line_Group__c();
                                budGroup.Name = 'No Grouping';
                                insert budGroup;
                                nogroupId = budGroup.Id;
                            }else{
                                quoteRec.buildertek__Grouping__c = nogroupId ;
                            }
                        }
                    }
                    
                    if (quoteRec.buildertek__Product__c != null){
                                              quoteRec.buildertek__Cost_Code__c = prdctrec.get(quoteRec.buildertek__Product__c).buildertek__Cost_Code__c;
                    }
                    buildertek__Quote_Item__c QuoteLineToInsert = new buildertek__Quote_Item__c();
                    
                  //  System.debug('p------>---Budget Line Items recordId --> ' + quoteRec.buildertek__Product__c);
                    //System.debug('---Budget Line Items recordId --> '+recordId);
                    QuoteLineToInsert.buildertek__Product__c = quoteRec.buildertek__Product__c;
                    //QuoteLineToInsert.buildertek__Product__c = productId;
                    if (quoteRec.Name.length() > 79){
                        QuoteLineToInsert.Name = quoteRec.Name.left(78);
                        QuoteLineToInsert.buildertek__Description__c = quoteRec.Name;
                    } else{
                        QuoteLineToInsert.Name = quoteRec.Name;
                    }
                    QuoteLineToInsert.buildertek__Quote__c = recordId;
                    // QuoteLineToInsert.buildertek__Quote_Line_Group__c = quoteRec.buildertek__Quote_Line_Group__c;
                    // QuoteLineToInsert.buildertek__UOM__c = listItem.UOMvalues;
                //    if(listItem.Vendor != null){
                //        QuoteLineToInsert.buildertek__Contractor__c = listItem.Vendor.Id;
                //    }
                    
                    // QuoteLineToInsert.buildertek__Trade_Type__c = tradeType;
                    QuoteLineToInsert.buildertek__Unit_Price__c = quoteRec.buildertek__Unit_Price__c;
                    // QuoteLineToInsert.buildertek__Sales_Price__c = quoteRec.buildertek__Sales_Price__c;
                    QuoteLineToInsert.buildertek__Quantity__c = quoteRec.buildertek__Quantity__c;
                    //QuoteLineToInsert.buildertek__Budget__c = quoteRec.buildertek__Budget__c;
                    QuoteLineToInsert.buildertek__Cost_Code__c = quoteRec.buildertek__Cost_Code__c;
                    QuoteLineToInsert.buildertek__Grouping__c = quoteRec.buildertek__Grouping__c;
                    QuoteLineToInsert.buildertek__Sub_Group__c = quoteRec.buildertek__Sub_Group__c;
                    // QuoteLineToInsert.buildertek__Discount__c = quoteRec.buildertek__Discount__c;
                    QuoteLineToInsert.buildertek__Notes__c=quoteRec.buildertek__Notes__c;
                     System.debug('---Budget Line Items recordId 321--> ' + QuoteLineToInsert);
                     quoteItemList.add(QuoteLineToInsert);
                     
                    }
                   
                   if(quoteItemList.Size()>0){
                       insert quoteItemList;
                   }
                    

                }
               
            }
        } catch (Exception e){
            System.debug('Error::' + e.getMessage());
            System.debug('Error Line::' + e.getLineNumber());
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }
    public class multipleQuoteLinesClass{
        @AuraEnabled
        public String pricebookName{ get; set; }
        
        @AuraEnabled
        public String  productfamily{ get; set; }
        
        @AuraEnabled
        public Product2 product{ get; set; }
        
        @AuraEnabled
        public Integer index{ get; set; }
        
        @AuraEnabled
        public buildertek__Quote_Item__c newQuoteLine{ get; set; }
        
    
        
        
    }
    @AuraEnabled
    public static List<Boolean> getadminvalues(){
        buildertek__Admin_Interface_Node_Configuration__c adminInterfaceNodeConfigurations = [Select Id, buildertek__Remove_Single_Quote_Line_Option__c, buildertek__Hide_Global_Margin__c, buildertek__Hide_Global_Markup__c
                                                                                              from buildertek__Admin_Interface_Node_Configuration__c
                                                                                              WHERE Name = :'Quote Configuration'];

        Boolean checkSingleQLine = adminInterfaceNodeConfigurations.buildertek__Remove_Single_Quote_Line_Option__c ;
        Boolean checkButtonMargin = adminInterfaceNodeConfigurations.buildertek__Hide_Global_Margin__c;
        Boolean checkButtonMarkup = adminInterfaceNodeConfigurations.buildertek__Hide_Global_Markup__c;

        List<Boolean> islien = new List<Boolean>{checkSingleQLine, checkButtonMargin,checkButtonMarkup};


        return islien;
    }   

    
}