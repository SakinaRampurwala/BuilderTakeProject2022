public class BT_ChangeOrderonOverage {
    public Boolean isCreateChangeOrderonOverage{get;set;}
    public buildertek__Admin_Interface_Node_Configuration__c adminterface {get;set;} 
    public string  emailsubject {get;set;}
    
    public BT_ChangeOrderonOverage(){
        buildertek__Admin_Interface_Node_Configuration__c adminInterfaceNodeConfigurations = [Select Id,buildertek__Change_Order_Configuration__c,buildertek__Email_Subject__c from buildertek__Admin_Interface_Node_Configuration__c WHERE Name=:'Change Order Configuration'];
        isCreateChangeOrderonOverage=adminInterfaceNodeConfigurations.buildertek__Change_Order_Configuration__c;
        emailsubject = adminInterfaceNodeConfigurations.buildertek__Email_Subject__c;
    }
    
    public void onCreateChangeOrderonOverage(){
        buildertek__Admin_Interface_Node_Configuration__c adminInterfaceNodeConfigurations = [Select Id,buildertek__Change_Order_Configuration__c,buildertek__Email_Subject__c from buildertek__Admin_Interface_Node_Configuration__c WHERE Name=:'Change Order Configuration'];
        adminInterfaceNodeConfigurations.buildertek__Change_Order_Configuration__c=isCreateChangeOrderonOverage;
        adminInterfaceNodeConfigurations.buildertek__Email_Subject__c = emailsubject;
        update adminInterfaceNodeConfigurations;
        ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Updated Successfully'));
    }
}