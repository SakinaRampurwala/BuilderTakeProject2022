({
    doInit: function(component, event, helper) {
        helper.doInitHelper(component, event, helper);
    },

    closeModal: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },

    updateSelectedText: function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        component.set('v.selectedPOLines',selectedRows);
        console.log('selectedRows--->>',{selectedRows});
    },

    openEditModel: function(component, event, helper) {
        var selectedLine = component.get('v.selectedPOLines');
        if(selectedLine.length>0){
            component.set("v.DisplayPOLine", false);
        }else{
            helper.showToast("Error", "Error", "Please select at least one PO Line", "5000");
        }
    },

    createPO: function(component, event, helper) {
        var selectedLine = component.get('v.selectedPOLines');
        console.log('selectedLine--->>>',{selectedLine});

        var recordId = component.get("v.recordId");

        var action = component.get('c.createNewPo');
        action.setParams({
            recordId: recordId,
            POLineList: selectedLine
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log("Result ---> ", { result });
                helper.showToast("Success", "Success", "New PO is created successfully", "5000");
                $A.get("e.force:closeQuickAction").fire();
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                  "recordId": result,
                  "slideDevName": "Detail"
                });
                navEvt.fire();
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
                helper.showToast("Success", "Success", "Something Went Wrong", "5000");
            }
        }));
        $A.enqueueAction(action);

    },
})