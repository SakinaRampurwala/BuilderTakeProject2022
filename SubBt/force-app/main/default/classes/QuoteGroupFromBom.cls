global without sharing class QuoteGroupFromBom {

    public string quoteId;
    public List<buildertek__Quote_Item__c> allQuoteLineList {get;set;}
    public List<BT_Lightning_Utils.dataTableFields> columns {get;set;}
    public quoteLineWrapperClass quoteLineWrapper {get;set;}
    public List<String> groupingList {get;set;}
    public Integer totalLayer {get;set;}
    public Integer currentLayer {get;set;}
    public Boolean runCls {get;set;}


    public QuoteGroupFromBom() {
        System.debug('QuoteGroupFromBom');
        allQuoteLineList = new List<buildertek__Quote_Item__c>();
        columns = new List<BT_Lightning_Utils.dataTableFields>();
        quoteLineWrapper = new quoteLineWrapperClass();
        groupingList = new List<String>();
        totalLayer = 1;
        currentLayer = 1;
        runCls = true;
    }

    public void setrelatedToId(string Id){
        System.debug('setrelatedToId');
        this.quoteId = Id;
        if (runCls) {
            runCls = false;
            getQuoteData();
        }
    }
    
    public string getrelatedToId( ){
        return quoteId;
    }

    public void getQuoteData(){
        System.debug('-- getQuoteData --');
        String quoteId = this.quoteId;
        System.debug('quoteId ==> '+quoteId);

        // Grouping field list for set 4 layer grouping on quote lines (Fix Value Used Only For Development)
        // groupingList = new List<String>{'buildertek__Grouping__c', 'buildertek__Build_Phase__c', 'buildertek__Location_Detailed_Area__c', 'buildertek__Product_Family__c'};
        groupingList = new List<String>{'buildertek__Grouping__c', 'buildertek__Build_Phase__c'};

        // All fields in list that can be available in grouping fields.
        List<String> gorupingFieldList = new List<String>{'id','buildertek__Build_Phase__c', 'buildertek__Build_Reference_1__c','buildertek__Base_Location__c','buildertek__Location_Picklist__c','buildertek__Location_Detailed_Area__c','buildertek__Location_Detail_Reference_1__c','buildertek__BL_SERVICE_CATEGORY__c', 'buildertek__Product_Family__c', 'buildertek__Sub_Group__c', 'buildertek__Grouping__c'};
        String apiString = '';

        // Get field data from buildertek__BT_Related_List_View_Fields field set
        List<BT_Lightning_Utils.dataTableFields> column = BT_Lightning_Utils.getFieldSetForDataTable('buildertek__Quote_Item__c', 'buildertek__BT_Related_List_View_Fields');
        for(BT_Lightning_Utils.dataTableFields s : column){
            if (!gorupingFieldList.contains(s.fieldName)) {
                apiString += s.fieldName + ', ';
            }
        }

        // SOQL Query for get data from buildertek__Quote_Item__c
        String query = 'SELECT Id, '+apiString+' buildertek__Build_Phase__c, buildertek__Build_Phase__r.Name, buildertek__Build_Reference_1__c, buildertek__Base_Location__c, buildertek__Location_Picklist__c, buildertek__Location_Detailed_Area__c, ';
        query += 'buildertek__Location_Detail_Reference_1__c, buildertek__BL_SERVICE_CATEGORY__c, buildertek__Product_Family__c, buildertek__Sub_Group__c, buildertek__Sub_Group__r.Name, buildertek__Grouping__c, buildertek__Grouping__r.Name ';
        query += 'FROM buildertek__Quote_Item__c WHERE buildertek__Quote__c =\''+quoteId+'\'';
        if (groupingList.size() > 0) {
            query += ' ORDER BY '+groupingList[0];
        }
        if (groupingList.size() > 1) {
            query += ', '+groupingList[1];
            totalLayer += 1;
        }
        if (groupingList.size() > 2) {
            query += ', '+groupingList[2];
            totalLayer += 1;
        }
        if (groupingList.size() > 3) {
            query += ', '+groupingList[3];
            totalLayer += 1;
        }
        query += ' NULLS LAST';
        System.debug('query ==> '+query);

        allQuoteLineList = Database.query(query);
        System.debug('allQuoteLineList ==> '+allQuoteLineList);

        quoteLineWrapper.quoteLineList = allQuoteLineList;
        quoteLineWrapper.columns = columns;

        if (groupingList.size() > 0 & allQuoteLineList.size() > 0) {
            System.debug('totalLayer ==> '+totalLayer);
            quoteLineWrapper.groupWrapperList = newLayerGrouping(allQuoteLineList);
        }

    }

    // Use method for grouping layers
    public List<groupWrapper> newLayerGrouping(List<buildertek__Quote_Item__c> quoteLineList){
        // System.debug('-- newLayerGrouping --');

        System.debug('currentLayer ==> '+currentLayer);

        List<groupWrapper> groupWrapperList = new List<groupWrapper>();

        // Total quote line record count
        Integer quoteLineListSize = quoteLineList.size();
        System.debug('quoteLineListSize ==> '+quoteLineListSize);

        // Check field type of all grouping fields.
        Map<String, Schema.SObjectField> objectMap = Schema.SObjectType.buildertek__Quote_Item__c.fields.getMap();
        Schema.SObjectField field = objectMap.get(groupingList[currentLayer-1]);
        Schema.DisplayType fldType = field.getDescribe().getType();

        String selectedGroupName = '';
        if (String.valueOf(fldType) == 'REFERENCE') {
            if (quoteLineList[0].get(groupingList[currentLayer-1]) != null) {
                selectedGroupName = String.valueOf(quoteLineList[0].getSobject(groupingList[currentLayer-1].removeEnd('c')+'r').get('Name'));
            } else {
                selectedGroupName = 'No Grouping';
            }
        } else {
            selectedGroupName = String.valueOf(quoteLineList[0].get(groupingList[currentLayer-1]));
            if (selectedGroupName == '' || selectedGroupName == null) {
                selectedGroupName = 'No Grouping';
            }
        }

        System.debug('selectedGroupName ==> '+selectedGroupName);

        List<buildertek__Quote_Item__c> newQuoteLineList = new List<buildertek__Quote_Item__c>();

        for (Integer i = 0; i < quoteLineListSize; i++) {

            // Get current grouping name
            String currentGroupName = '';
            if (String.valueOf(fldType) == 'REFERENCE') {
                if (quoteLineList[i].get(groupingList[currentLayer-1]) != null) {
                    currentGroupName = String.valueOf(quoteLineList[i].getSobject(groupingList[currentLayer-1].removeEnd('c')+'r').get('Name'));
                } else {
                    currentGroupName = 'No Grouping';
                }
            } else {
                currentGroupName = String.valueOf(quoteLineList[i].get(groupingList[currentLayer-1]));
                if (currentGroupName == '' || currentGroupName == null) {
                    currentGroupName = 'No Grouping';
                }
            }

            System.debug('currentGroupName ==> '+currentGroupName);

            // create grouping accouring to the currentGroupName value
            if (selectedGroupName == currentGroupName) {
                newQuoteLineList.add(quoteLineList[i]);
                if (quoteLineListSize == i+1) {
                    groupWrapper groupWrap = new groupWrapper();
                    groupWrap.index = groupWrapperList.size() +1;
                    groupWrap.groupName = selectedGroupName;
                    groupWrap.quoteLineList = newQuoteLineList;
                    if (totalLayer > currentLayer) {
                        currentLayer += 1;
                        System.debug('newLayerGrouping');
                        groupWrap.groupWrapperList = newLayerGrouping(newQuoteLineList);
                    } else {
                        currentLayer -= 1;
                    }
                    groupWrapperList.add(groupWrap);
                }
            } else {
                groupWrapper groupWrap = new groupWrapper();
                groupWrap.index = groupWrapperList.size() +1;
                groupWrap.groupName = selectedGroupName;
                groupWrap.quoteLineList = newQuoteLineList;
                if (totalLayer > currentLayer) {
                    currentLayer += 1;
                    System.debug('newLayerGrouping');
                    groupWrap.groupWrapperList = newLayerGrouping(newQuoteLineList);
                    currentLayer -= 1;
                } else {
                    currentLayer -= 1;
                }
                groupWrapperList.add(groupWrap);

                newQuoteLineList = new List<buildertek__Quote_Item__c>();
                newQuoteLineList.add(quoteLineList[i]);
                selectedGroupName = currentGroupName;

                if (quoteLineListSize == i+1) {
                    groupWrapper groupWrapDup = new groupWrapper();
                    groupWrapDup.index = groupWrapperList.size() +1;
                    groupWrapDup.groupName = selectedGroupName;
                    groupWrapDup.quoteLineList = newQuoteLineList;
                    if (totalLayer > currentLayer) {
                        currentLayer += 1;
                        System.debug('newLayerGrouping');
                        groupWrapDup.groupWrapperList = newLayerGrouping(newQuoteLineList);
                    } else {
                        currentLayer -= 1;
                    }
                    groupWrapperList.add(groupWrapDup);
                }
            }
        }

        return groupWrapperList;
    }


    public class quoteLineWrapperClass{
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<fieldClassWrapper> fieldClassWrapperList {get; set;}
        public List<BT_Lightning_Utils.dataTableFields> columns {get; set;}
        public List<groupWrapper> groupWrapperList {get; set;}
    }

    public class groupWrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<fieldClassWrapper> fieldClassWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
        public List<groupWrapper> groupWrapperList {get; set;}
    }

    public class fieldClassWrapper{
        public buildertek__Quote_Item__c quoteLine {get; set;}
        public List<fieldClass> fieldClass {get; set;}
    }

    public class fieldClass{
        public String fieldName {get; set;}
        public String fieldType {get; set;}
        public String fieldValue {get; set;}
    }

    public class totalFieldClass{

    }

}