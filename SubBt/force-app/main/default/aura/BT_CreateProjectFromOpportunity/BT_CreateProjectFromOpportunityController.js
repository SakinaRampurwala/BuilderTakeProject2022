({
	doInit : function(component, event, helper) {
	    var recordId = component.get("v.recordId");
        var action = component.get("c.getOpportunity");
        action.setParams({ 
           recordId: component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                if(result.AccountId != undefined){
                    component.find("accountId").set("v.value", result.Account.Id); 
                }
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
                component.set("v.Spinner", false);
                $A.get("e.force:closeQuickAction").fire();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({ 
                    "message": "Project Created successfully.",
                    "mode": 'sticky',
                    "type": 'success',
                    "duration": 8000
                });
                toastEvent.fire();
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