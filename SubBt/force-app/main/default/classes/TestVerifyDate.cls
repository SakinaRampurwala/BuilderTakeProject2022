@isTest
public with sharing class TestVerifyDate {

    @isTest static void testMethod1(){
        Date myDate1 = Date.newInstance(1960, 2, 17);
        Date myDate2 = Date.newInstance(1960, 2, 17);
        VerifyDate.CheckDates(myDate1, myDate2);
        System.assertEquals('1960-02-17' , '1960-02-17');
    }

    @isTest static void testMethod2(){
        Date myDate3 = Date.newInstance(2022, 10, 07);
        Date myDate4 = Date.newInstance(2022, 10, 01);
        VerifyDate.CheckDates(myDate3, myDate4);


    }


}