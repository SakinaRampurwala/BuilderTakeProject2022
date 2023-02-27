trigger RollUp on Contact (after insert , after update , after delete ) {
    if(Trigger.isInsert || Trigger.isUpdate ){
        RollUpHandler.addTotalAmount(Trigger.New);
    }
     if(Trigger.isDelete ){
        RollUpHandler.afterDelete(Trigger.Old);
    }


}