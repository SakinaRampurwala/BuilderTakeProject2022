trigger GreatProblem on Contact (Before insert) {

    if(Trigger.isInsert && Trigger.isBefore){
        try{
        GreatProblemHandler.method1(Trigger.New);
        }catch(Exception e){
            ExceptionHandler exc= new ExceptionHandler('GreatProblemHandler' , 'method1' ,e.getMessage(), e.getTypeName(), e.getLineNumber() );

        }
    }

}