({
    doInitHelper: function(component, event, helper){
        component.set("v.Spinner", true);
        var recordId = component.get("v.recordId");
        var action = component.get("c.getOption");
        action.setParams({
            recordId: recordId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('State => ' + state);
            var result = response.getReturnValue();
            console.log('Result =>', { result });

            if (state == "SUCCESS") {
                component.set('v.columns', [
                    { label: 'Option Name', fieldName: 'linkName', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'} },
                    { label: 'Manufacturer', fieldName: 'ManufacturerName', type: 'text' },
                    { label: 'Quantity', fieldName: 'buildertek__Quantity__c', type: 'text' },
                    { label: 'Sales Price', fieldName: 'buildertek__Cost__c', type: 'currency', cellAttributes: { alignment: 'left' } },
                    { label: 'Upgrade Cost', fieldName: 'buildertek__Upgrade_Costs__c', type: 'currency', cellAttributes: { alignment: 'left' } }
                ]);

                result.forEach(element => {
                    element.linkName = '/'+element.Id;
                    if (element.buildertek__Manufacturer__c != null) {
                        element.ManufacturerName = element.buildertek__Manufacturer__r.Name;
                    }
                });
                component.set("v.data", result);
                component.set("v.Spinner", false);
            } else{
                component.set("v.Spinner", false);
                helper.showToast("Error", "Error", "Something Went Wrong", "5000");
                $A.get("e.force:closeQuickAction").fire();
            }
        });
        $A.enqueueAction(action);
    },

    createRecord: function(component, event, helper){
        var coData = component.get('v.changeOrder');
        console.log('CO Data ==> '+coData.Name);
        if (coData.Name != '') {
            var selectedRowList = component.get("v.selectedRowList");
            console.log('selectedRowList =>', {selectedRowList});
            if (selectedRowList.length != 0) {
                component.set("v.Spinner", true);
                var action = component.get("c.createCO");
                action.setParams({
                    coData: coData,
                    selectedRowList: selectedRowList
                });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    console.log('State => ' + state);
                    if (state == "SUCCESS") {
                        var result = response.getReturnValue();
                        console.log('Result ==> '+result);
                        helper.showToast("Success", "Success", "New CO and CO Lines Created.", "5000");
                        $A.get("e.force:closeQuickAction").fire();
                        var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({
                            "recordId": result,
                            "slideDevName": "Detail"
                        });
                        navEvt.fire();
                    } else{
                        helper.showToast("Error", "Error", "Something Went Wrong", "5000");
                        var error = response.getError();
                        console.log('Error =>', {error});
                    }
                    component.set("v.Spinner", false);
                });
                $A.enqueueAction(action);
            } else {
                helper.showToast("Error", "Error", "Please Select Options", "5000");
            }
        } else{
            helper.showToast("Error", "Error", "Please Write Change Order Name", "5000");
        }

    },

    showToast: function(type, title, message, time) {
        try {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": title,
                "type": type,
                "message": message,
                "duration": time
            });
            toastEvent.fire();
        } catch (error) {
            console.log({ error });
        }
    },
})