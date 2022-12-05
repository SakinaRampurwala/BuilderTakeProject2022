public with sharing class CloneMeetingController {

    /*
    Description:- This method used for get meeting record
    Created Date:- 30th November
    */
    @AuraEnabled
    public static wrapMeetingData getMeetingData(String recordId){
        try {
            wrapMeetingData wrapmeet= new wrapMeetingData();
            wrapmeet.meet = new buildertek__Meeting__c();
            // get meeting record
            wrapmeet.meet=[Select Id, buildertek__Subject__c ,buildertek__Location__c, buildertek__Project__c,buildertek__Meeting_Date__c,buildertek__Opportunity__c,
            buildertek__Status__c,buildertek__Start_Time__c,buildertek__Duration__c,buildertek__End_Time__c From buildertek__Meeting__c where Id=:recordId LIMIT 1];

            // get List of Atendee whose parent Id(buildertek__Meeting__c) Present in recordId
            wrapmeet.Attendee=[Select Id ,Name,buildertek__Attendee_s_FirstName__c	,buildertek__Attendee_s_LastName__c	,CreatedById,CurrencyIsoCode,buildertek__Email_Address__c,LastModifiedById,buildertek__Meeting_Date__c,buildertek__Meeting_Subject__c	,buildertek__Phone__c	,buildertek__Present__c,buildertek__Role__c, buildertek__Meeting__c , buildertek__Contact__c from buildertek__Attendee__c where buildertek__Meeting__c=:recordId];
            System.debug(wrapmeet);

            // get List of Action Item  whose parent Id(buildertek__Meeting__c) Present in recordId
            wrapmeet.actionItem=[Select Id , buildertek__Owner__c	 , CreatedById, name, CurrencyIsoCode,buildertek__Description__c,buildertek__Details__c	,buildertek__Due_Date__c,LastModifiedById,buildertek__Meeting__c,buildertek__Status__c From buildertek__Action_Item__c where buildertek__Meeting__c=:recordId];
            return wrapmeet;
            
        } catch (Exception e) {
            System.debug(e.getMessage() + e.getLineNumber());
            return null;
        } 
    }

  
    /*
    Description:- This method used for get picklist value dynamically
    Created Date:- 30th November
    */

    @AuraEnabled 
    public static wrapPicklist  getPickListValuesInMap(){
        try{
        wrapPicklist picklist = new wrapPicklist();
        
        // Get Picklist value of Duration Field 
        Schema.DescribeFieldResult durationFieldResult = buildertek__Meeting__c.buildertek__Duration__c.getDescribe();
        List<Schema.PicklistEntry> durationValues = durationFieldResult.getPicklistValues();
        System.debug(durationValues);
        picklist.durationOptions= new  Map<String, String>();
        picklist.statusOption= new  Map<String, String>();
        for (Schema.PicklistEntry duration: durationValues) {
            picklist.durationOptions.put(duration.getValue(), duration.getLabel());
        }

        // Get Picklist value of Status Field 
        Schema.DescribeFieldResult statusFieldResult = buildertek__Meeting__c.buildertek__Status__c.getDescribe();
        List<Schema.PicklistEntry> statusValues = statusFieldResult.getPicklistValues();
        for (Schema.PicklistEntry status: statusValues) {

            picklist.statusOption.put(status.getValue(), status.getLabel());
        }
        System.debug(picklist);
        // return wrapper of duration and status picklist value 
        return picklist;
    }catch(Exception e){
        System.debug(e.getMessage() + e.getLineNumber());
        return null;
    }

    }

    /*
    Description:- This method clone meeting and its related list
    Created Date:- 30th November
    */

    @AuraEnabled
    public static String save(buildertek__Meeting__c meet , List<buildertek__Attendee__c> attendee , List<buildertek__Action_Item__c> action){
        try {
            insert meet;
            //Cloning the Attendee Record 
            List<buildertek__Attendee__c> getAtendeeList = new List<buildertek__Attendee__c>();
            for(buildertek__Attendee__c attendObj : attendee){
                attendObj.buildertek__Meeting__c = meet.Id;
                buildertek__Attendee__c cloneAtendee  = attendObj.clone(false, false, false, false);
                getAtendeeList.add(cloneAtendee);

            }
            insert getAtendeeList;

            //Cloning the Action Item  Record 

            List<buildertek__Action_Item__c> getActionItemList = new List<buildertek__Action_Item__c>();
            for(buildertek__Action_Item__c actionObj : action){
                actionObj.buildertek__Meeting__c = meet.Id;
                buildertek__Action_Item__c cloneActionItem  = actionObj.clone(false, false, false, false);
                getActionItemList.add(cloneActionItem);

            }
            insert getActionItemList;



            return meet.Id;

        } catch (Exception e) {
            System.debug(e.getLineNumber()+ e.getMessage());
            return null;
        }
    }


    /*
    Description:- Wrapper class of picklist
    Created Date:- 30th November
    */

    public class wrapPicklist {
       @AuraEnabled 
       public Map<String, String> durationOptions {get; set;}
       @AuraEnabled 
       public Map<String, String> statusOption {get; set;}
     }
   
 /*
    Description:- Wrapper class of Meeting object
    Created Date:- 30th November
    */
     public class wrapMeetingData {
        @AuraEnabled 
        public buildertek__Meeting__c meet {get; set;}
        @AuraEnabled 
        public list<buildertek__Attendee__c>  Attendee {get; set;}
        @AuraEnabled 
        public list<buildertek__Action_Item__c>  actionItem {get; set;}
        	
      }
 


   
}