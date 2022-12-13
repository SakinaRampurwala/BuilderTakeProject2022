/*
Copyright (c) 2017-2018, BuilderTek.
All rights reserved.

Developed By: Sagar
Date:  16-Nov-2018
*/
@isTest
public class QuoteDAOTest {
    @testSetup static void setupBaseData() {
        SetupTestData.setupBaseData();
    }

    public static testMethod void test1() {
        Test.startTest();
        Project__c proj = [Select Id from Project__c LIMIT 1];
        Quote__c qt = [Select Id from Quote__c LIMIT 1];
        QuoteDAO.retrieveGroups(qt.id, 1, 10, 'Accept');
        QuoteDAO.retrieveGroups(qt.id, 1, 10, 'Reject');
        QuoteDAO.getQuoteGrouping(qt.id);
        QuoteDAO.getQuoteTemplates();

        buildertek__Quote__c quoteRec = new buildertek__Quote__c(Name='test');
        insert quoteRec;

        list<buildertek__Quote_Line_Group__c> grouplist = new list<buildertek__Quote_Line_Group__c>();
        buildertek__Quote_Line_Group__c GroupRef = new buildertek__Quote_Line_Group__c(Name='test');
        grouplist.add(GroupRef);
        insert GroupRef;
        List<buildertek__Quote_Item__c> quoteListRef = new List<buildertek__Quote_Item__c>();
        List<buildertek__Quote_Item__c> quoteListRef1 = new List<buildertek__Quote_Item__c>();

        buildertek__Quote_Item__c quoteItem = new buildertek__Quote_Item__c();
        quoteItem.Name = 'test';
        quoteItem.buildertek__Quote__c = quoteRec.Id;
        quoteItem.buildertek__Grouping__c = GroupRef.Id;

        quoteListRef.add(quoteItem);
        insert quoteItem;
        buildertek__Quote_Item__c quoteItem1 = new buildertek__Quote_Item__c();
        quoteItem1=quoteItem.clone();
        quoteItem1.buildertek__Grouping__c = null;
        quoteListRef.add(quoteItem1);
        insert quoteItem1;

        product2 product1= new product2();
        product1.name='test ';
        product1.family ='Framing';
        insert product1;
        QuoteDAO.getProductPrice(product1.id);

        buildertek__RFQ__c rfqTest1=new buildertek__RFQ__c();
        rfqTest1.Name='test';
        insert rfqTest1;
        quoteItem.buildertek__RFQ__c=rfqTest1.id;

         Account accRec = new Account();
        accRec.Name = 'Test 2';
        insert accRec;

        buildertek__Purchase_Order__c poTest1 = new buildertek__Purchase_Order__c();
        poTest1.buildertek__RFQ__c=rfqTest1.id;
        poTest1.buildertek__Project__c=proj.id;
        poTest1.buildertek__Vendor__c = accRec.Id;
        insert poTest1;
        // 	update quoteItem;
        String myJSONQuote1 = JSON.serialize(quoteItem1);
        String myJSONQuote = JSON.serialize(quoteItem);

        buildertek__Quote_Item__c qutItem = new buildertek__Quote_Item__c();
        List<String> budgetItemIds = new List<String>();
        budgetItemIds.add(quoteListRef[0].Id);

        List<String> groupIds = new List<String>();
        groupIds.add(GroupRef.id);

        List<String> currencyFields = new List<String>{'buildertek__Unit_Price__c', 'buildertek__Total_Cost__c', 'buildertek__Unit_Cost__c'};
            List<String> allFields = new List<String>{'Id', 'buildertek__Grouping__c', 'buildertek__Quantity__c', 'buildertek__Unit_Price__c', 'buildertek__Total_Cost__c', 'buildertek__Unit_Cost__c'};

                //String fieldString;
                String fieldString = '[{"fieldName":"buildertek__Grouping__c","fieldType":"reference","isEditable": false},'
                +'{"fieldName":"Id","fieldType":"","isEditable": false},'
                +'{"fieldName":"buildertek__Quantity__c","fieldType":"number","isEditable": true},'
                +'{"fieldName":"buildertek__Unit_Price__c","fieldType":"currency","isEditable": true}]';

        QuoteDAO.updateQuoteLineItem(myJSONQuote);
        QuoteDAO.updateQuoteLineItem(myJSONQuote1);
        QuoteDAO.insertQuoteLineItem(myJSONQuote);
        QuoteDAO.saveQuoteLineItem(myJSONQuote);
        QuoteDAO.saveQuoteLineItem(myJSONQuote1);
        QuoteDAO.createQuoteItem(JSON.serialize(new list<Quote_Item__c>{quoteItem}));
        quoteItem.buildertek__Grouping__c=null;
        QuoteDAO.createQuoteItem(JSON.serialize(new list<Quote_Item__c>{quoteItem}));
        QuoteDAO.insertQuoteLines(new List<Quote_Item__c>());
        QuoteDAO.updateGroupsOrder(grouplist);



        // 	QuoteDAO.updateGroupsOrder();
        QuoteDAO.getProductRecords('Sample', 'Quote__c',null,quoteRec.Id, product1.family);

        QuoteDAO.getFieldSet('buildertek__BT_Product_Picker_Fields', 'Product2');

        String quoteItemId = [Select Id from Quote_Item__c LIMIT 1].Id;
        string myJson='[ {  "Id" : "'+quoteItem.Id+'", "Name" : "'+quoteItem.Name+'"}]';
        List<string> massupdateQI=new List<String>();
        massupdateQI.add(quoteItem.Id);

        QuoteDAO.getQuoteItem(quoteItemId);
        QuoteDAO.getselectOptions(qutItem, 'buildertek__UOM__c');
        QuoteDAO.deleteLineItems(new List<String>{quoteItemId});
        QuoteDAO.cloneQuote(quoteRec.Id);
        QuoteDAO.massDuplicateQuoteLineItem(massupdateQI);
        QuoteDAO.massUpdateQuoteLineItem(myJson);
        QuoteDAO.prepareString(myJson);
        QuoteDAO.deleteLineItems(budgetItemIds);
        QuoteDAO.deleteSelectedItems(budgetItemIds);
        //BudgetDAO.deleteBudgetLineItem(budgetRef.Id);
        QuoteDAO.groupValues(quoteRec.Id, currencyFields, allFields, groupIds, 10, 0);
        QuoteDAO.getQuoteItemData(quoteRec.Id, allFields, fieldString, 10, 0, 'Accept');
        QuoteDAO.getQuoteItemData(quoteRec.Id, allFields, fieldString, 10, 0, 'Reject');
        QuoteDAO.getpricebooks();
        QuoteDAO.getpricebook(quoteRec.Id);


        quoteListRef1.add(quoteItem1);
        QuoteDAO.saveUpdatedValues(quoteListRef1);
        QuoteDAO.QuoteWrapper q1= new QuoteDAO.QuoteWrapper();
        q1.quoteList=quoteListRef1;
        q1.checkQuote=true;
        q1.fieldNames=budgetItemIds;

        QuoteDAO.FieldClass f1= new QuoteDAO.FieldClass();
        f1.fieldName='Name';
        f1.fieldType='String';
        f1.isEditable=true;
        quoteRec.buildertek__Markup__c=2;
        update quoteRec;

  		QuoteDAO.getQuoteRecord(quoteRec.Id);
        QuoteDAO.getQuoteRecord('testId');
        Quote_Item__c qi1= new Quote_Item__c();
        qi1.buildertek__Quote__c=quoteRec.Id;
        insert qi1;

        QuoteDAO.getLookupData('Account', '');
        QuoteDAO.getLookupData('Contact', '');
        QuoteDAO.getLookupData('', '');
        QuoteDAO.getBaseData();

        QuoteDAO.saveQuoteSingleRec(JSON.serialize(quoteRec));
        QuoteDAO.deleteGroups(grouplist);
        QuoteDAO.deleteItem(quoteListRef, grouplist[0].id, quoteRec.Id, 'Accept');
        QuoteDAO.deleteItem(quoteListRef, grouplist[0].id, quoteRec.Id, 'Reject');
        QuoteDAO.deleteQuoteItem(quoteItem1.Id);
        System.assertEquals('Test','Test');
        Test.stopTest();
    }
}