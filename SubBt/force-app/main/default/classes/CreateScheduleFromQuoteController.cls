public without sharing class CreateScheduleFromQuoteController {
   
    @AuraEnabled
    public static void createScheduleLine(String scheduleId ,String quoteId) {
        System.debug('createScheduleLine');
        System.debug('scheduleId' + scheduleId);

        if(scheduleId!= null){
            list<buildertek__Project_Task__c> scheduleLineList = new list<buildertek__Project_Task__c>();
            buildertek__Schedule__c scheduleList=[Select Id , buildertek__Initial_Start_Date__c  From buildertek__Schedule__c where Id=:scheduleId LIMIT 1];
            List<buildertek__Quote_Item__c> quoteLineList=[Select Id , Name , buildertek__Vendor__c, buildertek__Grouping__r.Name , buildertek__Grouping__c, buildertek__Quote__c From buildertek__Quote_Item__c where buildertek__Quote__c=:quoteId];

            System.debug('quoteLineList' + quoteLineList.size());

            if(quoteLineList.size() > 0){
                for(buildertek__Quote_Item__c quoteLineRec:quoteLineList){
                    buildertek__Project_Task__c scheduleLineRec = new buildertek__Project_Task__c();
                    scheduleLineRec.Name=quoteLineRec.Name;
                    scheduleLineRec.buildertek__Schedule__c=scheduleId;
                    scheduleLineRec.buildertek__Start__c=scheduleList.buildertek__Initial_Start_Date__c;
                    scheduleLineRec.buildertek__Duration__c=1;

                    scheduleLineRec.buildertek__Phase__c=quoteLineRec.buildertek__Grouping__r.Name;
                    scheduleLineRec.buildertek__Contractor__c=quoteLineRec.buildertek__Vendor__c;

                    scheduleLineList.add(scheduleLineRec);
                }
                System.debug('scheduleLineList' + scheduleLineList.size());
                System.debug('scheduleLineList' + scheduleLineList);


                if(scheduleLineList.size() > 0){
                     insert scheduleLineList;
                }
            }
        } 
    }
    
}