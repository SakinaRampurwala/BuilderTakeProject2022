public class AccountProcessor {
   @future
    public static void countContacts(List<Id> accId){
        List<Account> accList = [Select Id , Name , Number_Of_Contacts__c, (Select Id , Name , AccountId From Contacts where AccountId=:accId) From Account Where Id =:accId];
        for(Account acc :accList){
            List<Contact> con = acc.Contacts;
            acc.Number_Of_Contacts__c = con.Size();
            
        }
        update accList;
       
    }

}