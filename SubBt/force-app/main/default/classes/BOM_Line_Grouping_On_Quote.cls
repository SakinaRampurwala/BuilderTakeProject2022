public with sharing class BOM_Line_Grouping_On_Quote {

    @AuraEnabled
    public static quoteWrapperClass getQuoteData(string quoteId, Decimal pageNumber, Integer recordToDisply, String groupingList){
        
        quoteWrapperClass qWrp = new quoteWrapperClass();
        Integer pageSize = recordToDisply;
        Integer offset = ((Integer)pageNumber - 1) * pageSize;
        List<String> gorupingFieldList = new List<String>{'id','buildertek__Build_Phase__c', 'buildertek__Build_Reference_1__c','buildertek__Base_Location__c','buildertek__Location_Picklist__c','buildertek__Location_Detailed_Area__c','buildertek__Location_Detail_Reference_1__c','buildertek__BL_SERVICE_CATEGORY__c'};
        String apiString = '';
        List<buildertek__Quote__c> quoteLineList = new List<buildertek__Quote__c>();

        List<BT_Lightning_Utils.dataTableFields> column = BT_Lightning_Utils.getFieldSetForDataTable('buildertek__Quote_Item__c', 'buildertek__BT_Related_List_View_Fields');
        for(BT_Lightning_Utils.dataTableFields s : column){
            if (!gorupingFieldList.contains(s.fieldName)) {
                apiString += s.fieldName + ', ';
            }
        }
        String query = 'SELECT Id, '+apiString+' buildertek__Build_Phase__r.Name, buildertek__Build_Reference_1__c, buildertek__Base_Location__c, buildertek__Location_Picklist__c, buildertek__Location_Detailed_Area__c, buildertek__Location_Detail_Reference_1__c, buildertek__BL_SERVICE_CATEGORY__c FROM buildertek__Quote_Item__c WHERE buildertek__Quote__c =\''+quoteId+'\''+' ORDER BY '+groupingList;

        qWrp.quoteLineList = Database.query(query);

        return qWrp;

    }


    public class quoteWrapperClass{

        @AuraEnabled
        public List<buildertek__Quote_Item__c> quoteLineList;
    
        @AuraEnabled
        public List<group1WrapperClass> wrapperList;
    
        @AuraEnabled
        public List<BT_Lightning_Utils.dataTableFields> columns;
    
        @AuraEnabled
        public Integer pageSize{ get; set; }
    
        @AuraEnabled
        public Integer page{ get; set; }
    
        @AuraEnabled
        public Integer total{ get; set; }
    
        @AuraEnabled
        public String status{get;set;}
    }
    
    
    public class group1WrapperClass{
    
        @AuraEnabled
        public List<buildertek__Quote_Item__c> quoteList;
    
    }

}