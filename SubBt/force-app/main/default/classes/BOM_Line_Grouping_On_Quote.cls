public with sharing class BOM_Line_Grouping_On_Quote {

    @AuraEnabled
    public static object getQuoteData(string quoteId, Decimal pageNumber, Integer recordToDisply, String status){
        Integer pageSize = recordToDisply;
        Integer offset = ((Integer)pageNumber - 1) * pageSize;
        quoteDetails Detail = new quoteDetails();
        Detail.groups = getQuoteGroupDetails(quoteId, null, recordToDisply, offset , status);
        Detail.columns = BT_Lightning_Utils.getFieldSetForDataTable('buildertek__Quote_Item__c', 'buildertek__BT_Related_List_View_Fields');

        List<String> groupIds = new List<String>();
        List<String> allFields = new List<String>();
        List<String> fieldsList = new List<String>();
        String fieldsType = '[';
        List<String> fieldsTypeList = new List<String>();
        for (quote_line_group__c grp : Detail.groups){
            groupIds.add(grp.Id);
        }
        for (BT_Lightning_Utils.dataTableFields dtFields : Detail.columns){
            if (dtFields.type != 'reference'){
                allFields.add(dtFields.fieldName);
            }
            if (dtFields.type == 'currency'){
                fieldsList.add(dtFields.fieldName);
            }
            if (dtFields.type == 'reference'){
                allFields.add(dtFields.fieldName.replace('__c', '__r.Name'));
            }
            fieldsType += '{"fieldName": "' + dtFields.fieldName + '","fieldType": "' + dtFields.type + '","isEditable":' + dtFields.editable + '},';
        }
        allFields.add('Id');
        allFields.add('buildertek__Grouping__c');
        fieldsType += '{"fieldName": "buildertek__Grouping__c","fieldType": "Reference","isEditable": false},';
        fieldsType += '{"fieldName": "Id","fieldType": "","isEditable": false}]';

        List<wrapperClass> wrapperList = new List<wrapperClass>();
        wrapperList = groupValues(quoteId, fieldsList, allFields, groupIds, recordToDisply, offset);
        TargetTable tarTable = new TargetTable();
        tarTable = getQuoteItemData(quoteId, allFields, fieldsType, recordToDisply, offset , status);
        FinalWrapperClass wrap = new FinalWrapperClass();
        wrap.tarTable = tarTable;
        wrap.wrapperList = wrapperList;
        wrap.columns = Detail.columns;
        wrap.totalColumns = Detail.columns.size() / 2;
        wrap.groups = Detail.groups;
        wrap.pageSize = pageSize;
        wrap.page = (Integer)pageNumber;
        wrap.total = [SELECT count() FROM buildertek__Quote_Item__c WHERE buildertek__Quote__c = :quoteId];
        return wrap;
    }

    public static List<quote_line_group__c> getQuoteGroupDetails(String quoteId, String groupId, Decimal recordToDisply, Integer offset , string status){
        List<quote_line_group__c> budgetGroup;
        String objectName = 'buildertek__Quote_Item__c';
        String filterConditions = ' AND buildertek__Quote__c =:quoteId';
        String fieldSetAPI = 'buildertek__BT_Related_List_View_Fields';
        String soql = 'SELECT Id, Name ';
        soql = soql + ', Grouping__c, Description__c, Product__c ';

        String namespacePrefix = BT_Utils.getNamespacePrefix();
        List<Schema.FieldSetMember> fieldSetMemberList = BT_Utils.getFieldSetMembers(fieldSetAPI, objectName);
        for (Schema.FieldSetMember fieldSetMemberObj : fieldSetMemberList){

            if (!soql.contains(fieldSetMemberObj.getFieldPath())){
                soql = soql + ',' + fieldSetMemberObj.getFieldPath();
            }

            if (String.ValueOf(fieldSetMemberObj.getType()).toUpperCase() == 'REFERENCE'){
                if (!fieldSetMemberObj.getFieldPath().Contains('__c')){
                    soql = soql + ',' + fieldSetMemberObj.getFieldPath().replace('Id', '.Name');
                } else{
                    soql = soql + ',' + fieldSetMemberObj.getFieldPath().replace('__c', '__r.Name');
                }
            }
        }
        soql = soql + ' FROM buildertek__Quote_Item__c';
        soql = soql + ' WHERE buildertek__Quote__c =: quoteId AND buildertek__status__c =: status ORDER BY buildertek__Grouping__r.buildertek__Sort_Id__c,buildertek__Grouping__r.Name  ASC limit ' + recordToDisply + ' OFFSET ' + offset;

        List<buildertek__Quote_Item__c> quoteItemList = new List<buildertek__Quote_Item__c>();
        quoteItemList = Database.query(soql);
        SET<Id> groupIdSet = new SET<Id>();
        for (buildertek__Quote_Item__c quoteItem : quoteItemList){
            groupIdSet.add(quoteItem.Grouping__c);
        }

        if (groupId != null){
            budgetGroup = Database.query('Select Id, Name, buildertek__Description__c,buildertek__Sort_Id__c From quote_line_group__c where Id =: groupId  ORDER BY buildertek__Sort_Id__c,Name ASC');
        } else{
            budgetGroup = Database.query('Select Id, Name,buildertek__Description__c,buildertek__Sort_Id__c From quote_line_group__c where Id IN: groupIdSet ORDER BY buildertek__Sort_Id__c,Name ASC');
        }
        return budgetGroup;
    }

    public static List<wrapperClass> groupValues(String recordId, list<String> currencyFields, List<String> allFields, List<String> groupIds, Decimal recordToDisply, Integer offset){
        Map<string, string> mapForLabel = new Map<string, string>();
        Map<string, string> mapForFieldType = new Map<string, string>();
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        Schema.SObjectType ctype = gd.get('buildertek__Quote_Item__c');
        Map<String, Schema.SobjectField> fmap = ctype.getDescribe().fields.getMap();
        for (String fieldName : fmap.keySet()){
            mapForLabel.put(fieldName, fmap.get(fieldName).getDescribe().getLabel());
            mapForFieldType.put(fieldName, string.valueof(fmap.get(fieldName).getDescribe().getType()));
        }
        List<buildertek__Quote_Item__c> quoteItemList = new List<buildertek__Quote_Item__c>();
        list<AggregateResult> childObjGroup = new list<AggregateResult>();
        string myqueries = '';
        String myquery = '';
        String aggregateFields = '';
        String queryFields = '';
        integer i = 1;
        for (string sumOfFields : currencyFields){
            queryFields += ', ' + sumOfFields.trim();
        }
        string status = 'Accept';
        myquery = 'select buildertek__Grouping__c ' + queryFields + ' from buildertek__Quote_Item__c where buildertek__Quote__c =: recordId AND buildertek__Status__c =: status Order by buildertek__Grouping__r.buildertek__Sort_Id__c,buildertek__Grouping__r.Name, buildertek__Priority__c ASC, Name ASC limit ' + recordToDisply + ' OFFSET ' + offset;
        quoteItemList = database.query(myquery);
        for (string sumOfFields : currencyFields){
            aggregateFields += ', SUM(' + sumOfFields.trim()+') total' + i;
            i++;
        }

        myqueries = 'select buildertek__Grouping__c ' + aggregateFields + ' from buildertek__Quote_Item__c where Id IN: quoteItemList  Group By buildertek__Grouping__c';
        childObjGroup = database.query(myqueries);
        string Childs = 'select Id, Name from buildertek__Quote_Line_Group__c where id IN: groupIds order by buildertek__Sort_Id__c,Name ASC';
        list<buildertek__Quote_Line_Group__c> childObjGroups;
        if (Schema.sObjectType.buildertek__Quote_Line_Group__c.fields.Id.isAccessible() && Schema.sObjectType.buildertek__Quote_Line_Group__c.fields.Name.isAccessible()){
            childObjGroups = database.query(Childs);
        }
        Map<string, string> GroupNameMap = new Map<String, string>();
        for (buildertek__Quote_Line_Group__c Grps : childObjGroups){
            GroupNameMap.put((String)Grps.get('Id'), (String)Grps.get('Name'));
        }

        Map<String, Boolean> fieldTypeMap = new Map<String, Boolean>();
        for (string sumOfFields : currencyFields){
            fieldTypeMap.put(sumOfFields, true);
        }
        List<wrapperClass> wrapperClassList = new List<wrapperClass>();
        for (AggregateResult objAgr : childObjGroup){
            integer j = 1;
            integer child = 1;
            for (string sumOfFields : allFields){
                if (child >= 2){
                    if (fieldTypeMap.get(sumOfFields) == true){
                        wrapperClassList.add(new wrapperClass(GroupNameMap.get((String)objAgr.get('buildertek__Grouping__c')), (Decimal)objAgr.get('total' + j), string.valueOf(mapForFieldType.get(sumOfFields.toLowercase().replace(' ', ''))), sumOfFields));
                        j++;
                    } else{
                        wrapperClassList.add(new wrapperClass(GroupNameMap.get((String)objAgr.get('buildertek__Grouping__c')), null, 'false', sumOfFields));
                    }

                }
                child++;
            }
        }
        return wrapperClassList;
    }

    public static TargetTable getQuoteItemData(String recordId, List<String> fieldsList, String fieldString, Decimal recordToDisply, Integer offset ,  string status ){
        List<FieldClass> fieldClassList = (List<FieldClass>)System.JSON.deserialize(fieldString, List<FieldClass>.class);
        TargetTable TargetTable_inst = new TargetTable();
        List<EachRecord> allListOfRecords = new List<EachRecord>();
        String aggregateFields = '';
        String objectName = 'buildertek__Quote_Item__c';
        String listType = 'List<' + objectName + '>';
        String EachRecordType = '' + objectName + '';
        SObject IndividualMember = (SObject)Type.forName(EachRecordType).newInstance();
        for (string sumOfFields : fieldsList){
            if (sumOfFields != null){
                aggregateFields += ', ' + sumOfFields;
            }
        }
        String myqueries = '';
        String myqueries2 = '';

        myqueries = 'select buildertek__Quote__c,buildertek__Status__c ,buildertek__Grouping__r.Name,buildertek__Grouping__r.buildertek__Sort_Id__c ' + aggregateFields + ' from buildertek__Quote_Item__c where buildertek__Quote__c =: recordId  AND buildertek__Status__c =: status  Order By buildertek__Grouping__r.buildertek__Sort_Id__c,buildertek__Grouping__r.Name, buildertek__Priority__c ASC , Name ASC limit ' + recordToDisply + ' OFFSET ' + offset;
        List<SObject> ListOfRecords;
        ListOfRecords = Database.query(myqueries);

        Integer count = 0;
        for (Integer i = 0; i < ListOfRecords.size(); i++){
            IndividualMember = ListOfRecords[i];
            EachRecord Each_record_nested_List_Of_Fields = new EachRecord();
            List<object> temp = new List<object>();
            List<RecordsList> recList = new List<RecordsList>();
            for (FieldClass field : fieldClassList){
                if (field.fieldName == 'id'){
                    Each_record_nested_List_Of_Fields.recordId = (Id)IndividualMember.get(field.fieldName);
                } else{
                    if (field.fieldName != null && field.fieldName != 'buildertek__Grouping__c' && field.fieldName != 'Name' && !field.fieldName.contains('__r.Name')){
                        if (field.fieldType == 'currency'){
                            recList.add(new RecordsList(field.isEditable, (IndividualMember.get(field.fieldName) == null) ? '$0.00' : '$' + IndividualMember.get(field.fieldName), field.fieldName, (IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName), field.fieldType, ''));
                            temp.add((IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName));
                        } else if (field.fieldType == 'string'){
                            recList.add(new RecordsList(field.isEditable, (IndividualMember.get(field.fieldName) == null) ? '0.00%' : IndividualMember.get(field.fieldName)+'%', field.fieldName, (IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName), field.fieldType, ''));
                            temp.add((IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName));
                        } else if (field.fieldType == 'reference' && field.fieldName != null){
                            String referenceField = field.fieldName.replace('__c', '__r');
                            if (IndividualMember.getSobject(referenceField) != null && IndividualMember.getSobject(referenceField).get('Name') != null){
                                recList.add(new RecordsList(field.isEditable, (IndividualMember.get(field.fieldName) == null) ? '0.00%' : IndividualMember.get(field.fieldName)+'%', field.fieldName, (IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName), field.fieldType, String.valueOf(IndividualMember.getSobject(referenceField).get('Name'))));
                            } else{
                                recList.add(new RecordsList(field.isEditable, (IndividualMember.get(field.fieldName) == null) ? '0.00%' : IndividualMember.get(field.fieldName)+'%', field.fieldName, (IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName), field.fieldType, ''));
                            }
                            temp.add((IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName));
                        } else{
                            recList.add(new RecordsList(field.isEditable, (IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName)+'', field.fieldName, (IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName), field.fieldType, ''));
                            temp.add((IndividualMember.get(field.fieldName) == null) ? '' : IndividualMember.get(field.fieldName));
                        }
                    }
                }
                if (field.fieldName == 'buildertek__Grouping__c'){
                    Each_record_nested_List_Of_Fields.groupId = (Id)IndividualMember.get(field.fieldName);
                }
                if (field.fieldName == 'Name'){
                    Each_record_nested_List_Of_Fields.recordName = (String)IndividualMember.get(field.fieldName);
                }
            }

            Each_record_nested_List_Of_Fields.recordValue = temp;
            Each_record_nested_List_Of_Fields.recordList = recList;
            Each_record_nested_List_Of_Fields.recordCount = count;
            Each_record_nested_List_Of_Fields.isSelected = false;
            allListOfRecords.add(Each_record_nested_List_Of_Fields);
            count++;
        }
        TargetTable_inst.records = ListOfRecords;
        TargetTable_inst.ListOfEachRecord = allListOfRecords;

        return TargetTable_inst;
    }

    public class quoteDetails{
        @AuraEnabled
        public List<quote_line_group__c> groups{ get; set; }

        @AuraEnabled
        public List<String> headerFields{ get; set; }

        @AuraEnabled
        public List<BT_Lightning_Utils.dataTableFields> columns{ get; set; }

        public quoteDetails(){
            groups = new List<quote_line_group__c>();
            headerFields = new List<String>();
            columns = new List<BT_Lightning_Utils.dataTableFields>();
        }
    }

    public class wrapperClass{
        @AuraEnabled
        public String groupName{ get; set; }

        @AuraEnabled
        public Decimal totalValue{ get; set; }

        @AuraEnabled
        public String fieldType{ get; set; }

        @AuraEnabled
        public String fieldLabel{ get; set; }

        public wrapperClass(String groupName, Decimal totalValue, String fieldType, String fieldLabel){
            this.groupName = groupName;
            this.totalValue = totalValue;
            this.fieldType = fieldType;
            this.fieldLabel = fieldLabel;
        }
    }

    public class EachRecord{
        @AuraEnabled
        public Integer recordCount;
        @AuraEnabled
        public Boolean isSelected;
        @AuraEnabled
        public List<RecordsList> recordList;
        @AuraEnabled
        public List<object> recordValue;
        @AuraEnabled
        public Id recordId;
        @AuraEnabled
        public String recordName;
        @AuraEnabled
        public String groupName;
        @AuraEnabled
        public Id groupId;
    }

    public class TargetTable{
        @AuraEnabled
        public List<sObject> records; 
        @AuraEnabled
        public List<EachRecord> ListOfEachRecord;
    }

    public class FinalWrapperClass{
        @AuraEnabled
        public TargetTable tarTable;
        @AuraEnabled
        public List<wrapperClass> wrapperList;
        @AuraEnabled
        public List<BT_Lightning_Utils.dataTableFields> columns;

        @AuraEnabled
        public List<quote_line_group__c> groups{ get; set; }

        @AuraEnabled
        public Integer totalColumns{ get; set; }

        @AuraEnabled
        public Integer pageSize{ get; set; }

        @AuraEnabled
        public Integer page{ get; set; }

        @AuraEnabled
        public Integer total{ get; set; }

        @AuraEnabled
        public String status{get;set;}
    }

    public class FieldClass{
        @AuraEnabled
        public String fieldName;
        @AuraEnabled
        public String fieldType;
        @AuraEnabled
        public Boolean isEditable;
    }

    public class RecordsList{
        @AuraEnabled
        public Boolean isEditable;
        @AuraEnabled
        public String recordValue;
        @AuraEnabled
        public String fieldName;
        @AuraEnabled
        public Object originalValue;
        @AuraEnabled
        public String fieldType;
        @AuraEnabled
        public String referenceValue;
        public RecordsList(Boolean isEditable, String recordValue, String fieldName, Object originalValue, String fieldType, String referenceValue){
            this.isEditable = isEditable;
            this.recordValue = recordValue;
            this.fieldName = fieldName;
            this.originalValue = originalValue;
            this.fieldType = fieldType;
            this.referenceValue = referenceValue;
        }
    }
    
}