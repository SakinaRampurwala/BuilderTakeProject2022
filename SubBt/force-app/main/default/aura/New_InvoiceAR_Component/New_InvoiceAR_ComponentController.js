({
    doInit : function(component, event, helper) {
        component.set('v.Spinner' , true);
        var action = component.get("c.getFieldSet");
        action.setParams({
            objectName: "buildertek__Billings__c",
            fieldSetName: "buildertek__New_InvoiceAR_ComponentFields",

        });
        action.setCallback(this, function (response) {
            console.log(response.getState());
            console.log(response.getError());
            if (response.getState() == 'SUCCESS') {
                component.set('v.Spinner' , false);
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
    },
    handleSubmit : function(component, event, helper) {
        console.log('handleSubmit');
        event.preventDefault();  
        var fields = event.getParam('fields');

        var data = JSON.stringify(fields);

        console.log('data-->>',{data});
        component.set('v.Spinner' , true);
        var action = component.get("c.saveRecord");
        console.log('-----');
        action.setParams({
            "salesInvoiceData": data
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            var error = response.getError();
            console.log('Error =>',{error});
            console.log('state =>',{state});

            if (state === "SUCCESS") {
                component.set('v.Spinner' , false);

                console.log('success');
                console.log(response.getReturnValue());
                var recordId = response.getReturnValue();
                console.log('recordId-->>',{recordId});
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "Success",
                    "title": "Success!",
                    "message": "The record has been created successfully."
                });
                toastEvent.fire();
  
                var saveNnew = component.get("v.isSaveAndNew");
                console.log('saveNnew: ' + saveNnew);
  
                if(saveNnew){
                    $A.get('e.force:refreshView').fire();
                }
                else{
                    console.log('---Else---');
                    console.log('saveAndClose');
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": recordId,
                        "slideDevName": "Detail"
                    });
                    navEvt.fire();
                    // component.set("v.parentRecordId", null);
  
                    var focusedTabId = '';
                    var workspaceAPI = component.find("workspace");
                    workspaceAPI.getFocusedTabInfo().then(function(response) {
                        focusedTabId = response.tabId;
                    })
  
                    window.setTimeout(
                        $A.getCallback(function() {
                            workspaceAPI.closeTab({tabId: focusedTabId});
                        }), 1000
                    );
                }
            }
            else if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "Error",
                    "title": "Error!",
                    "message": "Something Went Wrong"
                });
                toastEvent.fire();
                console.log('error', response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    handlesaveNnew : function(component, event, helper) {
        component.set('v.Spinner' , true);
        component.set("v.isSaveAndNew", true);
        component.set('v.Spinner' , false);

    },
  
    saveNnew : function(component, event, helper) {
        component.set("v.isSaveAndNew", true);
        console.log('saveNnew');
    }
})