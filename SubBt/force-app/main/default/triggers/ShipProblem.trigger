trigger ShipProblem on Contact ( after update) {
    if(Trigger.isUpdate){

        List<Contact> con = new List<Contact>();
        List<Id> beforeIds = new List<Id>();
        List<Id> afterIds = new List<Id>();

        for(Contact c : Trigger.new){
            beforeIds.add(Trigger.oldMap.get(c.Id).AccountId);
            afterIds.add(Trigger.newMap.get(c.Id).AccountId);
            
        }
        
        List<Contact> conList=[Select Id , Name , AccountId From Contact where AccountId=:beforeIds];
        System.debug(conList);
        for(Contact c: conList){
            c.AccountId=afterIds[0];
        }
        update conList;
            
        
    }

}