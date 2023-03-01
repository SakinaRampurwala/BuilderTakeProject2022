({
    doInit : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setParams({
            objectName: "buildertek__Billings__c",
            fieldSetName: "buildertek__New_InvoiceAR_ComponentFields",

        });
        action.setCallback(this, function (response) {
            console.log(response.getState());
            console.log(response.getError());
            if (response.getState() == 'SUCCESS') {
                var allFieldsLabel = JSON.parse(response.getReturnValue());
                console.log({allFieldsLabel});

                component.set('v.allFieldsLabel' , allFieldsLabel);
                console.log({allFieldsLabel});

            } 
        });
        $A.enqueueAction(action);
    },
    Cancel:function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
        $A.get("e.force:closeQuickAction").fire();
        component.set("v.isOpen", false);
        window.setTimeout(
            $A.getCallback(function() {
                $A.get('e.force:refreshView').fire();
            }), 1000
        );

    },
})