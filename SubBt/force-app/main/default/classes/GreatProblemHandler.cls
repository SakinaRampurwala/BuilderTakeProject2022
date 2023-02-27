public  class GreatProblemHandler {
    
    public static void method1(List<Contact> contactList){
        try{
        double conAmount=0;
        double maxAmount=0;
       
        List<Id> acclist= new List<Id>();
        List <contact> ConList = new List <contact>();
        List <contact> newList = new List <contact>();


        for(Contact c: contactList){
            acclist.add(c.AccountId);
    
        }
        System.debug(conAmount);

       List<Account> accountList =[Select id , name ,Maximum_Amount__c,(Select Id ,AccountId , Amounty__c , LastName From Contacts) from Account where Id=:acclist];
      
        
         for(Account acc :accountList){
            maxAmount= acc.Maximum_Amount__c;
         }
         for (Contact con :contactList) {
            conAmount=con.Amounty__c;
            conAmount-=maxAmount;
            if(conAmount < maxAmount){
                con.Amounty__c=con.Amounty__c;

            }

            
            if(conAmount > maxAmount){
                con.Amounty__c=maxAmount;
                    while(conAmount >maxAmount){
                        Contact c = new Contact();
                        c.AccountId=con.AccountId;
                        c.Amounty__c=maxAmount;
                        c.LastName='test Trigger';
                        Conlist.add(c);
                        conAmount-=maxAmount;
                        if(conAmount < maxAmount){
                            Contact con1 = new Contact();
                            con1.AccountId=con.AccountId;
                            con1.Amounty__c=conAmount;
                            con1.LastName='test Trigger';
                            Conlist.add(con1);                
                    }
    
                    }
        
             }

           
         }

        insert Conlist;
        }catch(Exception e){
            ExceptionHandler exc= new ExceptionHandler('GreatProblemHandler' , 'method1' ,e.getMessage(), e.getTypeName(), e.getLineNumber() );
            System.debug(exc);
        }
    }
}