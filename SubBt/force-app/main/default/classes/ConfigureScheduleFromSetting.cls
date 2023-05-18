public with sharing class ConfigureScheduleFromSetting {

    public Boolean hideInternalResource{get;set;}
    public Boolean hideContractor{get;set;}
    public Boolean hideContractorResource{get;set;}

    public ConfigureScheduleFromSetting() {

        buildertek__Admin_Interface_Node_Configuration__c adminInterfaceNodeConfigurations = [Select Id, buildertek__Hide_Internal_Resource__c, buildertek__Hide_Contractor__c, buildertek__Hide_Contractor_Resource__c
                                                                                              from buildertek__Admin_Interface_Node_Configuration__c WHERE Name=:'Schedule Configuration'];

        hideInternalResource = adminInterfaceNodeConfigurations.buildertek__Hide_Internal_Resource__c;
        hideContractor = adminInterfaceNodeConfigurations.buildertek__Hide_Contractor__c;
        hideContractorResource = adminInterfaceNodeConfigurations.buildertek__Hide_Contractor_Resource__c;
    }

    public void onSave(){
        buildertek__Admin_Interface_Node_Configuration__c adminInterfaceNodeConfigurations = [Select Id, buildertek__Hide_Internal_Resource__c, buildertek__Hide_Contractor__c, buildertek__Hide_Contractor_Resource__c
                                                                                                from buildertek__Admin_Interface_Node_Configuration__c WHERE Name=:'Schedule Configuration'];

        adminInterfaceNodeConfigurations.buildertek__Hide_Internal_Resource__c = hideInternalResource;
        adminInterfaceNodeConfigurations.buildertek__Hide_Contractor__c = hideContractor;
        adminInterfaceNodeConfigurations.buildertek__Hide_Contractor_Resource__c = hideContractorResource;

        update adminInterfaceNodeConfigurations;
        ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Updated Successfully'));
    }
}