public class DailyLeadProcessor implements Schedulable {
    public void execute(SchedulableContext ctx) {
        // awesome code here
        List<Lead> ld = [Select id , Name , LeadSource From Lead    WHERE LeadSource='' LIMIT 200];
        System.debug('ld' + ld);
        for(Lead l : ld){
                l.LeadSource='Dreamforce';
                ld.add(l);
            
        }
        System.debug(ld + '------------');
        update ld;
    }

}