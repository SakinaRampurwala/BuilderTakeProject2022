public  class ExceptionHandler  {
    public ExceptionHandler(String ClassName , String MethodName , String Message , String ExceptionType , Integer LineNumber) {
        Error_Log__c error = new Error_Log__c();
        error.ClassName__c	=ClassName;
        error.MethodName__c=MethodName;
        error.ExceptionMessage__c= Message;
        error.ExceptionType__c	=ExceptionType;
        error.LineNumber__c	=LineNumber;
        insert  error;



    }
}