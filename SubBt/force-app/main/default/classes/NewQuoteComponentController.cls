public with sharing class NewQuoteComponentController {
    
    @AuraEnabled
    public static String getFieldSet(String objectName, String fieldSetName){
        String result = '';
        List<String> pickListValuesList = new List<String>();
        try{
            SObjectType objToken = Schema.getGlobalDescribe().get(objectName);
            Schema.DescribeSObjectResult d = objToken.getDescribe();
            Map<String, Schema.FieldSet> FsMap = d.fieldSets.getMap();
            if (FsMap.containsKey(fieldSetName)){
                for (Schema.FieldSetMember f : FsMap.get(fieldSetName).getFields()){
                    if (result != ''){
                        result += ',';
                    }
                    String jsonPart = '{';
                    jsonPart += '"label":"' + f.getLabel()+'",';
                    jsonPart += '"required":"' + (f.getDBRequired() || f.getRequired())+'",';
                    jsonPart += '"type":"' + (f.getType())+'",';
                    jsonPart += '"name":"' + f.getFieldPath()+'"';
                    if (String.valueOf(f.getType()) == 'PICKLIST'){
                        pickListValuesList = getDropDown(objectName, String.valueOf(f.getFieldPath()));
                        jsonPart += ',"pickListValuesList":' + JSON.serialize(pickListValuesList);
                    }
                    jsonPart += '}';
                    result += jsonPart;
                }
            }
            
        } catch (Exception e){
            result += e.getLineNumber()+' : ' + e.getMessage();
            System.debug('Error::' + e.getMessage());
            System.debug('Error At Line::' + e.getLineNumber());
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

    public class masterQuoteWrapper{
        @AuraEnabled
        public  List<buildertek__Quote__c> quoteList;
        @AuraEnabled
        public Integer totalQuotes;
    }

    @AuraEnabled
    public static masterQuoteWrapper getAllMasterQuote(Integer recordLimit, Integer recordOffset){
        masterQuoteWrapper  masterQuoteWrapperRecords= new masterQuoteWrapper();
        masterQuoteWrapperRecords.quoteList= new List<buildertek__Quote__c>();
        masterQuoteWrapperRecords.quoteList=[SELECT Id, Name , buildertek__Status__c, buildertek__Description__c , buildertek__Type__c  From buildertek__Quote__c WHERE buildertek__Type__c = 'Master' LIMIT :recordLimit Offset :recordOffset];
       
       
        AggregateResult results = [SELECT Count(Id) TotalQuotes  From buildertek__Quote__c WHERE buildertek__Type__c = 'Master' ];
        Integer totalQuotesRec = (Integer)results.get('TotalQuotes');

        masterQuoteWrapperRecords.totalQuotes=totalQuotesRec;
        return masterQuoteWrapperRecords;
    }

    @AuraEnabled
    public static string saveRecord(String data , String masterQuoteId){
        buildertek__Quote__c QuoteToInsert = (buildertek__Quote__c)JSON.deserialize(data, buildertek__Quote__c.class);
        if(QuoteToInsert.Name.length() > 79){
            QuoteToInsert.Name = QuoteToInsert.Name.left(78);
        }
        insert QuoteToInsert;
        NewQuoteComponentController.cloneQuoteLines(QuoteToInsert.Id , masterQuoteId);
        return QuoteToInsert.ID;
    }

    @AuraEnabled
    public static String getobjectName(Id recordId){
        String sObjName = recordId.getSObjectType().getDescribe().getName();  
        return sObjName;
    }

    // @future
    public static void cloneQuoteLines(String quoteId , String masterQuoteId){
        Set<String> SobjectFields = Schema.getGlobalDescribe().get('buildertek__Quote_Item__c').getDescribe().fields.getMap().keySet();  
        List<String> fieldsInList = new List<String>(SobjectFields);
        String query = 'SELECT ' + String.join(fieldsInList, ',') + ' FROM buildertek__Quote_Item__c WHERE buildertek__Quote__c=:masterQuoteId'; 
        System.debug(query);
        List<buildertek__Quote_Item__c> quoteItemList = Database.query(query);
        list<buildertek__Quote_Item__c> newQuoteItemList= new List<buildertek__Quote_Item__c>();
        for(buildertek__Quote_Item__c quoteItem:quoteItemList){

            buildertek__Quote_Item__c newQuoteItemRec=quoteItem.clone(false, false, false, false);
            newQuoteItemRec.buildertek__Quote__c=quoteId;
            newQuoteItemList.add(newQuoteItemRec);
        
        }
        if(newQuoteItemList.size() >0){

            insert newQuoteItemList;
        }
    
    }

}