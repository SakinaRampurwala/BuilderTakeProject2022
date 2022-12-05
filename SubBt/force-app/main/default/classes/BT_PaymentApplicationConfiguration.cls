public class BT_PaymentApplicationConfiguration {
    
	public Boolean vendorlienreleasevalue{ get; set; }
    public Boolean getLinesFromCO{ get; set; }
    public buildertek__Admin_Interface_Node_Configuration__c newrfi{ get; set; }
	public BT_PaymentApplicationConfiguration(){
        newrfi = new buildertek__Admin_Interface_Node_Configuration__c();
		buildertek__Admin_Interface_Node_Configuration__c adminInterfaceNodeConfigurations = [Select Id, buildertek__Require_Vendor_to_Sign_Lien_Release__c,buildertek__Default_Account_for_PA__c,
                                                                                              buildertek__Get_Lines_From_CO__c
		                                                                                      from buildertek__Admin_Interface_Node_Configuration__c
		                                                                                      WHERE Name = :'Payment Application Configuration'];
        vendorlienreleasevalue = adminInterfaceNodeConfigurations.buildertek__Require_Vendor_to_Sign_Lien_Release__c;
        getLinesFromCO = adminInterfaceNodeConfigurations.buildertek__Get_Lines_From_CO__c;

        newrfi.buildertek__Default_Account_for_PA__c = adminInterfaceNodeConfigurations.buildertek__Default_Account_for_PA__c;
	}

	public void onupdatepaymentapplication(){
		buildertek__Admin_Interface_Node_Configuration__c adminInterfaceNodeConfigurations = [Select Id, buildertek__Require_Vendor_to_Sign_Lien_Release__c,
                                                                                              buildertek__Default_Account_for_PA__c,
                                                                                              buildertek__Get_Lines_From_CO__c
		                                                                                      from buildertek__Admin_Interface_Node_Configuration__c
		                                                                                      WHERE Name = :'Payment Application Configuration'];
		adminInterfaceNodeConfigurations.buildertek__Require_Vendor_to_Sign_Lien_Release__c = vendorlienreleasevalue;
        		adminInterfaceNodeConfigurations.buildertek__Get_Lines_From_CO__c = getLinesFromCO;

        adminInterfaceNodeConfigurations.buildertek__Default_Account_for_PA__c = newrfi.buildertek__Default_Account_for_PA__c;
		update adminInterfaceNodeConfigurations;
		ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM, 'Updated Successfully'));
	}
}