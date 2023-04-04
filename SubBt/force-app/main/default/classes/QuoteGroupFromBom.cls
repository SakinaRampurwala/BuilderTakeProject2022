global without sharing class QuoteGroupFromBom {

    public string quoteId;
    public List<buildertek__Quote_Item__c> quoteLineList {get;set;}
    public List<BT_Lightning_Utils.dataTableFields> columns {get;set;}
    public quoteLineWrapperClass quoteLineWrapper {get;set;}

    public QuoteGroupFromBom() {
        quoteLineList = new List<buildertek__Quote_Item__c>();
        columns = new List<BT_Lightning_Utils.dataTableFields>();
        quoteLineWrapper = new quoteLineWrapperClass();
    }

    public void setrelatedToId(string Id){
        this.quoteId = Id;
        getQuoteData();
    }
    
    public string getrelatedToId( ){
        return quoteId;
    }

    public void getQuoteData(){
        System.debug('getQuoteData');
        String quoteId = this.quoteId;
        System.debug('quoteId ==> '+quoteId);
        // Fix Value Used Only For Development
        List<String> groupingList = new List<String>{'buildertek__Grouping__c', 'buildertek__Build_Phase__c', 'buildertek__Location_Detailed_Area__c', 'buildertek__Product_Family__c'};

        List<String> gorupingFieldList = new List<String>{'id','buildertek__Build_Phase__c', 'buildertek__Build_Reference_1__c','buildertek__Base_Location__c','buildertek__Location_Picklist__c','buildertek__Location_Detailed_Area__c','buildertek__Location_Detail_Reference_1__c','buildertek__BL_SERVICE_CATEGORY__c', 'buildertek__Product_Family__c', 'buildertek__Sub_Group__c', 'buildertek__Grouping__c'};
        String apiString = '';

        List<BT_Lightning_Utils.dataTableFields> column = BT_Lightning_Utils.getFieldSetForDataTable('buildertek__Quote_Item__c', 'buildertek__BT_Related_List_View_Fields');
        for(BT_Lightning_Utils.dataTableFields s : column){
            if (!gorupingFieldList.contains(s.fieldName)) {
                apiString += s.fieldName + ', ';
            }
        }
        String query = 'SELECT Id, '+apiString+' buildertek__Build_Phase__c, buildertek__Build_Phase__r.Name, buildertek__Build_Reference_1__c, buildertek__Base_Location__c, buildertek__Location_Picklist__c, buildertek__Location_Detailed_Area__c, ';
        query += 'buildertek__Location_Detail_Reference_1__c, buildertek__BL_SERVICE_CATEGORY__c, buildertek__Product_Family__c, buildertek__Sub_Group__c, buildertek__Sub_Group__r.Name, buildertek__Grouping__c, buildertek__Grouping__r.Name ';
        query += 'FROM buildertek__Quote_Item__c WHERE buildertek__Quote__c =\''+quoteId+'\''+' ORDER BY '+groupingList[0];
        if (groupingList.size() > 1) {
            query += ', '+groupingList[1];
        }
        if (groupingList.size() > 2) {
            query += ', '+groupingList[2];
        }
        if (groupingList.size() > 3) {
            query += ', '+groupingList[3];
        }
        query += ' NULLS LAST';

        System.debug('query ==> '+query);

        quoteLineList = Database.query(query);
        System.debug('quoteLineList ==> '+quoteLineList);

        quoteLineWrapper.quoteLineList = quoteLineList;
        quoteLineWrapper.columns = columns;

        for (buildertek__Quote_Item__c quoteLine : quoteLineList) {
            System.debug('quoteLine ==> '+quoteLine);
            System.debug(quoteLine.get(groupingList[0]));
        }

    }

    public class quoteLineWrapperClass{
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<fieldClassWrapper> fieldClassWrapperList {get; set;}
        public List<BT_Lightning_Utils.dataTableFields> columns {get; set;}
        public List<group1Wrapper> groupWrapperList {get; set;}
    }

    public class group1Wrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<fieldClassWrapper> fieldClassWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
        public List<group2Wrapper> groupWrapperList {get; set;}
    }

    public class group2Wrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<fieldClassWrapper> fieldClassWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
        public List<group3Wrapper> groupWrapperList {get; set;}
    }
    
    public class group3Wrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<fieldClassWrapper> fieldClassWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
        public List<group4Wrapper> groupWrapperList {get; set;}
    }

    public class group4Wrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<fieldClassWrapper> fieldClassWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
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