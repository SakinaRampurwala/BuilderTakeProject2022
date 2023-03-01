({
    doInit : function(component, event, helper) {
        var getFields = component.get("c.getFieldSet");
        getFields.setParams({
            objectName: 'buildertek__Walk_Through_List__c',
            fieldSetName: 'buildertek__New_WalkThrough_ComponentFields'
        });
        getFields.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
                var listOfFields0 = JSON.parse(response.getReturnValue());
                console.log({listOfFields0});
                component.set("v.listOfFields0", listOfFields0);
            }
        });
        $A.enqueueAction(getFields);
    },
})