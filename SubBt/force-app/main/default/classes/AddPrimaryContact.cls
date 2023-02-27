public  class AddPrimaryContact implements Queueable {
    Contact con;
    String state;
    public AddPrimaryContact(Contact con , String state) {
        this.con =con;
        this.state=state;

    }

    public void execute(QueueableContext qc){
        List<Account> acc = [Select ID, Name From Account WHERE BillingState =:state LIMIT 200];
        System.debug(acc + '----acc');
        List<Contact> conts = new List<Contact>();
        System.debug(conts + '-------');
        for(Account acnt : acc){
            System.debug(acnt + '-------->>>>>>>');
            Contact c = con.clone(false , false , false , false);
            c.AccountId = acnt.Id;
            conts.add(c);
        }

        if(conts.size() >0){
            insert conts;
        }


    }
}