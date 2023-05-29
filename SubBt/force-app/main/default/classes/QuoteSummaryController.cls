global with sharing class QuoteSummaryController {

    // public Id quoteId { get; set; }
    global string quoteId;
    global buildertek__Quote__c quote {get;set;}
    global List<buildertek__Quote_Item__c> QuoteLineRecordList { get; set; }


    global void setrelatedToId(string Id){
        this.quoteId = Id;
        getQuoteData();
    }
    
    global string getrelatedToId( ){
        return quoteId;
    }

    global void getQuoteData(){
        System.debug('-- getQuoteData --');
        String quoteId = this.quoteId;
        quote = [SELECT Id, Name, buildertek__Quote_Line_Grouping_Fields__c, buildertek__Roll_Up__c FROM buildertek__Quote__c WHERE Id =: quoteId];
        
        // quote = [SELECT Id, Name, buildertek__Quote_Line_Grouping_Fields__c, buildertek__Roll_Up__c FROM buildertek__Quote__c WHERE Id =: 'a081K00000yiUCMQA2'];
        // getQuoteItemData(quoteId);
        QuoteLineRecordList = new List<buildertek__Quote_Item__c>();
        if (quoteId != null) {
            QuoteLineRecordList = [SELECT buildertek__BL_SERVICE_CATEGORY__c,buildertek__Description__c,buildertek__Quantity__c, buildertek__Unit_Cost__c, buildertek__Total_Cost__c  
                FROM buildertek__Quote_Item__c  WHERE buildertek__Quote__c =: quoteId];
        }        
    }

    // global void getQuoteItemData(String quoteId){
        // System.debug('-- getQuoteItemData --');
        // // String quoteId = this.quoteId;
        // if (quoteId != null) {
        //     QuoteLineRecordList = [SELECT Id, buildertek__Quantity__c, buildertek__Unit_Cost__c, buildertek__Total_Cost__c,buildertek__Quote__c  
        //     FROM buildertek__Quote_Item__c  WHERE buildertek__Quote__c =: quoteId];
        // } 
        // String quoteId = this.quoteId;
        // List<buildertek__Quote_Item__c> QuoteLineRecordList = new List<buildertek__Quote_Item__c>();
        
        // QuoteLineRecordList = new List<buildertek__Quote_Item__c>();
        // QuoteLineRecordList = [SELECT Id, buildertek__Quantity__c, buildertek__Unit_Cost__c, buildertek__Total_Cost__c,buildertek__Quote__c  
        //     FROM buildertek__Quote_Item__c  WHERE buildertek__Quote__c =: quoteId];
        // QuoteLineRecordList = [SELECT Id, buildertek__Quantity__c, buildertek__Unit_Cost__c, buildertek__Total_Cost__c,buildertek__Quote__c  
        //     FROM buildertek__Quote_Item__c  WHERE buildertek__Quote__c =: 'a081K00000yiUCMQA2'];    

        // return QuoteLineRecordList;
    // }

    // global void setrelatedToId(string Id){
    //     this.quoteId = Id;
    // }
    
    // global string getrelatedToId( ){
    //     return quoteId;
    // }

    // global void getQuoteLineData(){
    //     String quoteId = this.quoteId;

    //     if (quoteId != null) {
    //         QuoteLineRecordList = [SELECT Id, buildertek__Quantity__c, buildertek__Unit_Cost__c, buildertek__Total_Cost__c,buildertek__Quote__c  
    //         FROM buildertek__Quote_Item__c  WHERE buildertek__Quote__c =: quoteId];
    //     }
    // }
}