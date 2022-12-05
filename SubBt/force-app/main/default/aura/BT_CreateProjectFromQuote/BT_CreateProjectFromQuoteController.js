({
    doInit : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var action = component.get("c.getQuote");
        action.setParams({ 
            recordId: component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
            }
        });
        $A.enqueueAction(action);
    },
    
    closeModel : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();    
    },
    
    saveModel : function(component, event, helper) {
        component.set("v.Spinner", true);
        var project = component.find("projectNameId").get("v.value");
        var accountId = component.find("accountId").get("v.value");
        var projectManagerId = component.find("projectManagerId").get("v.value");
        var contractDateId = component.find("contractDateId").get("v.value");
        
        var action = component.get("c.createProject");
        action.setParams({
            recordId : component.get("v.recordId"),
            projectName : project,
            account : accountId,
            projectManager : projectManagerId,
            contractDate : contractDateId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                component.set("v.Spinner", false);
                $A.get("e.force:closeQuickAction").fire();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success',
                    message: 'Project Created successfully.',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
                toastEvent.fire();
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": result,
                    "slideDevName": "related"
                });
                navEvt.fire();
                $A.get('e.force:refreshView').fire();
            }
        });
        $A.enqueueAction(action);
        
    },
    
    clearAccountSelectedValue : function(component, event, helper) {
        component.set("v.isAccount", true);
        component.set("v.selectedLookUpRecord", null);
        component.set("v.selectedLookUpRecordName", '');
    }
})