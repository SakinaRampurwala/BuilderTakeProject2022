public without sharing class CreateScheduleFromQuoteController {
   
    @AuraEnabled
    public static void createScheduleLine(String scheduleId ,String quoteId) {
        if(scheduleId!= null){
            list<buildertek__Project_Task__c> scheduleLineList = new list<buildertek__Project_Task__c>();
            buildertek__Schedule__c scheduleList=[Select Id , buildertek__Initial_Start_Date__c  From buildertek__Schedule__c where Id=:scheduleId LIMIT 1];
            List<buildertek__Quote_Item__c> quoteLineList=[Select Id , Name , buildertek__Quote__c From buildertek__Quote_Item__c where buildertek__Quote__c=:quoteId];

            if(quoteLineList.size() > 0){
                for(buildertek__Quote_Item__c quoteLineRec:quoteLineList){
                    buildertek__Project_Task__c scheduleLineRec = new buildertek__Project_Task__c();
                    scheduleLineRec.Name=quoteLineRec.Name;
                    scheduleLineRec.buildertek__Schedule__c=scheduleId;
                    scheduleLineRec.buildertek__Start__c=scheduleList.buildertek__Initial_Start_Date__c;
                    scheduleLineRec.buildertek__Duration__c=1;
                    scheduleLineList.add(scheduleLineRec);
                }
                if(scheduleLineList.size() > 0){
                     insert scheduleLineList;
                }
            }
        } 
    }
    
}