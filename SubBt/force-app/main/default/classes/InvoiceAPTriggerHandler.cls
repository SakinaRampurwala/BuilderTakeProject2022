public class InvoiceAPTriggerHandler {

    public void OnAfterUpdate(buildertek__Account_Payable_Clone__c[] invoiceList, Map<Id, buildertek__Account_Payable_Clone__c> invoiceMap){

        Set<Id> budgetIdSet = new Set<Id>();

        for (buildertek__Account_Payable_Clone__c invoice : invoiceList) {
            buildertek__Account_Payable_Clone__c oldInvoiceData = invoiceMap.get(invoice.Id);
            if (invoice.buildertek__Budget_Line__c == null && oldInvoiceData.buildertek__Budget_Line__c != null) {
                budgetIdSet.add(oldInvoiceData.buildertek__Budget_Line__c);
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