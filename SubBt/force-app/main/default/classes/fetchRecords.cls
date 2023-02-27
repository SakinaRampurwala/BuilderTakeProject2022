public with sharing class fetchRecords {
    @AuraEnabled
    public static  List<Account> getRecords(){
        try {
            List<Account> acc = new List<Account>();
            acc=[Select Id , Name , (Select Id , name From Contacts) From Account];
            return acc;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static  List<Account> searchAccount(String searchKey){
        try {
            List<Account> acc = new List<Account>();
            // String sql = 'Select Name From Account WHERE Name LIKE \'%' + searchKeyword + '%\'';
            String  searchKeyword ='%' + searchKey + '%';
            acc=[Select Id , Name , (Select Id , name From Contacts) From Account where Name LIKE:searchKeyword];
            return acc;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

   
}