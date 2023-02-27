trigger ClosedOpportunityTrigger on Opportunity (after insert , after update) {

    if(Trigger.isAfter){

        List<Task> createdTask = new List<Task>();
        for(Opportunity opp : Trigger.new){
            if(opp.StageName == 'Closed Won'){
                Task t =new Task();
                t.Subject = 'Follow Up Test Task';
                t.WhatId= opp.Id;
                createdTask.add(t);
            }
        }

        if(createdTask.size()> 0){
            insert createdTask;
        }
    }

}