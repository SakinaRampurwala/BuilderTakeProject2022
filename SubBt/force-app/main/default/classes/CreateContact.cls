public class CreateContact {
    public Contact con{get;set;}
    public List<Account> acc{get;set;}
    public String selectedAccount{get;set;}
   
    
    public CreateContact(){
       con =new Contact();
        acc=[Select id , name from Account];
        System.debug(',,,' + selectedAccount);
        
    }
   
    public void saveCon(){
        insert con;
    }

}