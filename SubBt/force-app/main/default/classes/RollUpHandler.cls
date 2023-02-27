public class RollUpHandler {
    
    public static void addTotalAmount(List<Contact> contactList){
        List<Id> accIds = new List<Id>();
        List<Id> conIds = new List<Id>();
        
        for(Contact c :contactList){
            if(c.AccountId != null){
          		accIds.add(c.AccountId);
                conIds.add(c.Id);
            }
          
        }
        if(accIds.size()>0) {
            Account accountList=[Select id , name , Total_Amount__c From Account where id =:accIds];
            AggregateResult aggr = [Select sum(Amounty__c) From Contact where AccountId=:accIds];
            System.debug(aggr);
             System.debug(aggr.get('expr0'));
                integer n = integer.valueof(aggr.get('expr0'));
              accountList.Total_Amount__c=n;
           update  accountList;
        }

    }
    
    
     public static void afterDelete(List<Contact> contactList){
        List<Id> accIds = new List<Id>();
        
        for(Contact c :contactList){
            if(c.AccountId != null){
          		accIds.add(c.AccountId);
            }
          
        }
        if(accIds.size()>0) {
            Account accountList=[Select id , name , Total_Amount__c From Account where id =:accIds];
            AggregateResult aggr = [Select sum(Amounty__c) From Contact where AccountId=:accIds];
            System.debug(aggr);
                        System.debug('------DELETE---');

             System.debug(aggr.get('expr0'));
                integer n = integer.valueof(aggr.get('expr0'));
              accountList.Total_Amount__c=n;
           update  accountList;
        }

    }
    


}