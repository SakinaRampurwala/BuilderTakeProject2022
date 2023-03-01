public with sharing class New_PO_ComponentController {
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

    @AuraEnabled
    public static string saveRecord(String data){
        // String jsonStr = '{"buildertek__Date_Ordered__c": null}';
        // Map<String, Object> jsonMap = (Map<String, Object>) JSON.deserializeUntyped(jsonStr);

        // System.debug('In save method');
        // buildertek__Purchase_Order__c QuoteToInsert = (buildertek__Purchase_Order__c)JSON.deserialize(data, buildertek__Purchase_Order__c.class);
        // // QuoteToInsert = (QuoteToInsert.get('buildertek__Date_Ordered__c') != null) ? Date.valueOf((String) QuoteToInsert.get('buildertek__Date_Ordered__c')) : null;
        // System.debug('QuoteToInsert ==? '+QuoteToInsert);
        // insert QuoteToInsert;
        // return QuoteToInsert.ID;


        // Map<String, Object> jsonObj = (Map<String, Object>) JSON.deserializeUntyped(data);
        // buildertek__Purchase_Order__c po = new buildertek__Purchase_Order__c();
        // if (jsonObj.containsKey('buildertek__Date_Ordered__c')) {
        //     String dateString = (String)jsonObj.get('buildertek__Date_Ordered__c');
        //     if (dateString != null && dateString.trim() != '') {
        //         po.buildertek__Date_Ordered__c = Date.valueOf(dateString);
        //     }
        // }
        // insert po;
        // return po.ID;

        Map<String, Object> jsonObj = (Map<String, Object>) JSON.deserializeUntyped(data);
        buildertek__Purchase_Order__c po = new buildertek__Purchase_Order__c();
        for (String key : jsonObj.keySet()) 
        {
            Object value = jsonObj.get(key);
            if (key == 'buildertek__Date_Ordered__c') 
            {
                String dateString = (String) value;
                if (dateString != null && dateString.trim() != '') 
                {
                    po.buildertek__Date_Ordered__c = Date.valueOf(dateString);
                }
            } else if (key != 'buildertek__Date_Ordered__c') {
                // po;
            }
        }
        insert po;
        return po.ID;
    
    }

    @AuraEnabled
    public static String getobjectName(Id recordId){
        String sObjName = recordId.getSObjectType().getDescribe().getName();  
        return sObjName;
    }
}