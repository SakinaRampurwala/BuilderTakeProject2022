public with sharing class Invoice_From_PaymentApp {

    @AuraEnabled
    public static buildertek__SOV_Payment_Application__c getPaymentAppData(String recordId) {
        buildertek__SOV_Payment_Application__c paymentApp = [SELECT Id, Name, buildertek__PA_Type__c FROM buildertek__SOV_Payment_Application__c WHERE Id =: recordId];
        return paymentApp;
    }

    @AuraEnabled
    public static String createInvoice(String recordId) {
        buildertek__SOV_Payment_Application__c paymentApp = [SELECT Id, Name, buildertek__PA_Type__c, buildertek__Owner_Account__c, buildertek__Project__c FROM buildertek__SOV_Payment_Application__c WHERE Id =: recordId];

        System.debug('paymentApp ==> '+paymentApp);

        List<buildertek__SOV_Continuation_Sheet_Lines__c> sovLineList = [SELECT Id, Name, buildertek__Vendor_Work_Completed_This_Period__c FROM buildertek__SOV_Continuation_Sheet_Lines__c WHERE buildertek__SOV_Continuation_Sheet__r.buildertek__SOV_Payment_Application__c =: recordId];

        if (paymentApp.buildertek__PA_Type__c == 'AP') {
            buildertek__Account_Payable_Clone__c invoiceAP = new buildertek__Account_Payable_Clone__c();
            invoiceAP.buildertek__Status__c = 'Open';
            invoiceAP.buildertek__Terms__c = 'Due on Receipt';
            invoiceAP.buildertek__Vendor__c = paymentApp.buildertek__Owner_Account__c;
            invoiceAP.buildertek__Due_Date__c = System.today().addDays(30);
            invoiceAP.buildertek__Project__c = paymentApp.buildertek__Project__c;
            insert invoiceAP;
            System.debug('invoiceAP ==> '+invoiceAP);

            List<buildertek__Account_Payable_Item_Clone__c> invoiceAPLineList = new List<buildertek__Account_Payable_Item_Clone__c>();
            for (buildertek__SOV_Continuation_Sheet_Lines__c sovLine : sovLineList) {
                buildertek__Account_Payable_Item_Clone__c invoiceAPLine = new buildertek__Account_Payable_Item_Clone__c();
                invoiceAPLine.Name = sovLine.Name;
                invoiceAPLine.buildertek__Description__c = sovLine.Name;
                invoiceAPLine.buildertek__Quantity__c = 1;
                invoiceAPLine.buildertek__Unit_Price__c = sovLine.buildertek__Vendor_Work_Completed_This_Period__c;
                invoiceAPLine.buildertek__Account_Payable_Clone__c = invoiceAP.Id;
                invoiceAPLineList.add(invoiceAPLine);
            }
            insert invoiceAPLineList;
            return invoiceAP.Id;

        } else if (paymentApp.buildertek__PA_Type__c == 'AR') {
            buildertek__Billings__c invoiceAR = new buildertek__Billings__c();
            invoiceAR.Name = paymentApp.Name;
            invoiceAR.buildertek__Status__c = 'Open';
            invoiceAR.buildertek__Terms__c = 'Due on Receipt';
            invoiceAR.buildertek__Customer_Account__c = paymentApp.buildertek__Owner_Account__c;
            invoiceAR.buildertek__Invoiced_Date__c = System.today();
            invoiceAR.buildertek__Due_Date__c = System.today().addDays(30);
            invoiceAR.buildertek__Project__c = paymentApp.buildertek__Project__c;
            insert invoiceAR;
            System.debug('invoiceAR ==> '+invoiceAR);

            List<buildertek__Billable_Lines__c> invoiceARLineList = new List<buildertek__Billable_Lines__c>();
            for (buildertek__SOV_Continuation_Sheet_Lines__c sovLine : sovLineList) {
                buildertek__Billable_Lines__c invoiceARLine = new buildertek__Billable_Lines__c();
                invoiceARLine.buildertek__Item_Name__c = sovLine.Name;
                invoiceARLine.buildertek__Description__c = sovLine.Name;
                invoiceARLine.buildertek__Quantity__c = 1;
                invoiceARLine.buildertek__Unit_Price__c = sovLine.buildertek__Vendor_Work_Completed_This_Period__c;
                invoiceARLine.buildertek__Billings__c = invoiceAR.Id;
                invoiceARLineList.add(invoiceARLine);
            }
            insert invoiceARLineList;
            return invoiceAR.Id;

        } else {
            return null;
        }
    }

}