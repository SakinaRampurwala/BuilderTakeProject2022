/*
Copyright (c) 2017-2018, BuilderTek.
All rights reserved. 

Developed By: Sagar
Date:  19-Nov-2018
*/
@isTest
public class BT_ImportScheduleTest {
     @testSetup static void setupBaseData() {
        // SetupTestData.setupBaseData();
    }
    
    // public static testMethod void test1() {
    // 	schedule__c sd = new schedule__c();
    // 	sd.Description__c = 'test';
    // 	sd.Type__c = 'Master';
    // 	sd.Project__c = [Select id from project__c LIMIT 1].Id;
    // 	insert sd;
    	
    // 	ApexPages.StandardController sc = new ApexPages.StandardController(sd);
    //     BT_ImportSchedule testa = new BT_ImportSchedule(sc);
    //     testa.masterSchedules[0].isSelected = true;
    //     testa.save();
        
    //     Apexpages.currentPage().getParameters().put('Id', sd.Project__c);
    //     ApexPages.StandardSetController stdSetController = new ApexPages.StandardSetController(new List<Schedule__c>{sd});
	//     stdSetController.setSelected(new List<Schedule__c>{sd});
	//     BT_ImportSchedule test = new BT_ImportSchedule(stdSetController);
	//     System.assertEquals('Test','Test');
	 
    // }
}