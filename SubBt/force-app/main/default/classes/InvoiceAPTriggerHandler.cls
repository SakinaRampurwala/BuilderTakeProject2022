public class InvoiceAPTriggerHandler {


    public void OnAfterInsert(buildertek__Account_Payable_Clone__c[] invoiceList, Map<Id, buildertek__Account_Payable_Clone__c> invoiceNewMap){

        Set<Id> invoiceIds = new Set<Id>();
        for (buildertek__Account_Payable_Clone__c invoice : invoiceList) {
            invoiceIds.add(invoice.Id);
        }
        if (invoiceIds.size() > 0) {
            List<buildertek__Finance_Transaction__c> transactionList = [SELECT Id, Name, buildertek__Payable_Invoice_AP__c FROM buildertek__Finance_Transaction__c WHERE buildertek__Payable_Invoice_AP__c IN: invoiceIds];
            for (buildertek__Finance_Transaction__c fTransaction : transactionList) {
                fTransaction.buildertek__Amount__c = invoiceNewMap.get(fTransaction.buildertek__Payable_Invoice_AP__c).buildertek__Total_Amount__c * (-1);
                fTransaction.buildertek__Debit_Amount__c = invoiceNewMap.get(fTransaction.buildertek__Payable_Invoice_AP__c).buildertek__Total_Amount__c;
            }
            if (transactionList.size() > 0) {
                update transactionList;
            }
        }
    }

    public void OnAfterUpdate(buildertek__Account_Payable_Clone__c[] invoiceList, Map<Id, buildertek__Account_Payable_Clone__c> invoiceNewMap, Map<Id, buildertek__Account_Payable_Clone__c> invoiceOldMap){

        Set<Id> budgetIdSet = new Set<Id>();
        Set<Id> invoiceIds = new Set<Id>();

        for (buildertek__Account_Payable_Clone__c invoice : invoiceList) {
            buildertek__Account_Payable_Clone__c oldInvoiceData = invoiceOldMap.get(invoice.Id);
            if (invoice.buildertek__Budget_Line__c == null && oldInvoiceData.buildertek__Budget_Line__c != null) {
                budgetIdSet.add(oldInvoiceData.buildertek__Budget_Line__c);
            }
            if (invoice.buildertek__Total_Amount__c != oldInvoiceData.buildertek__Total_Amount__c) {
                invoiceIds.add(invoice.Id);
            }
        }

        if (invoiceIds.size() > 0) {
            List<buildertek__Finance_Transaction__c> transactionList = [SELECT Id, Name, buildertek__Payable_Invoice_AP__c FROM buildertek__Finance_Transaction__c WHERE buildertek__Payable_Invoice_AP__c IN: invoiceIds];
            for (buildertek__Finance_Transaction__c fTransaction : transactionList) {
                fTransaction.buildertek__Amount__c = invoiceNewMap.get(fTransaction.buildertek__Payable_Invoice_AP__c).buildertek__Total_Amount__c * (-1);
                fTransaction.buildertek__Debit_Amount__c = invoiceNewMap.get(fTransaction.buildertek__Payable_Invoice_AP__c).buildertek__Total_Amount__c;
            }
            if (transactionList.size() > 0) {
                update transactionList;
            }
        }

        if (budgetIdSet.size() > 0) {
            List<buildertek__Budget_Item__c> budgetItemList = [SELECT Id, Name, buildertek__Invoice_total__c FROM buildertek__Budget_Item__c WHERE Id IN: budgetIdSet];
            for (buildertek__Budget_Item__c budget : budgetItemList) {
                budget.buildertek__Invoice_total__c = 0;
            }
            update budgetItemList;
        }

    }

}