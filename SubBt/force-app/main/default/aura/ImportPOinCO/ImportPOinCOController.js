({
    doInit: function(component, event, helper) {
        try {
            component.set("v.Spinner", true);
            console.log('init');
            var action = component.get('c.getPoList');
            action.setParams({
                recordId: component.get('v.recordId')
            });
            action.setCallback(this, function(response) {
                console.log(response.getState());
                console.log(response);
                var result = response.getReturnValue();
                console.log(result);
                component.set('v.columns', [
                    { label: 'Name', fieldName: 'linkName', type: 'url', typeAttributes: { label: { fieldName: 'Name' }, target: '_blank', }, sortable: true },
                    { label: 'Vendor', fieldName: 'vendorLinkName', type: 'text', type: 'url', typeAttributes: { label: { fieldName: 'vendorName' }, target: '_blank', } },
                    { label: 'Status', fieldName: 'buildertek__Status__c' },
                    { label: 'Total', fieldName: 'buildertek__PO_Total__c', type: 'currency' },
                ]);

                if (result != null && response.getState() === 'SUCCESS') {
                    console.log({ result });
                    if (result.length > 0) {
                        component.set("v.Spinner", false);
                        component.set('v.isEmpty', false);
                        result.forEach(element => {
                            element.linkName = '/' + element.Id;
                            element.vendorLinkName = '/' + element.buildertek__Vendor__c;
                            if (element.buildertek__Vendor__c != undefined) {
                                element.vendorName = element.buildertek__Vendor__r.Name;
                            }
                        });

                    } else {
                        let setStyle = document.querySelector('.maindiv');
                        setStyle.style.height = '35vh';
                        setStyle.style.overflow = 'hidden';
                        component.set("v.Spinner", false);
                        component.set('v.isEmpty', true);
                    }
                    component.set("v.data", result);
                };

                if (result == null) {
                    let setStyle = document.querySelector('.maindiv');
                    setStyle.style.height = '35vh';
                    setStyle.style.overflow = 'hidden';

                    component.set("v.Spinner", false);
                    component.set('v.isEmpty', true);
                }



            });
            $A.enqueueAction(action);

        } catch (e) {
            console.log({ e });
        }

    },

    selectPurchaseOrder: function(component, event, helper) {
        console.log(event.getParam('selectedRows'));
        var selectedRow = event.getParam('selectedRows');
        for (let element of selectedRow) {
            console.log({ element });
            console.log(element.Id);
            component.set('v.poRecordId', element.Id);

        }

    },
    createCO: function(component, event, helper) {
        let poId = component.get('v.poRecordId');
        let dataFound = component.get('v.isEmpty');
        console.log(poId);
        if (dataFound == false && (poId != null || poId != undefined)) {
            component.set("v.Spinner", true);
            var action = component.get("c.createCoLine");
            action.setParams({
                poRecordId: poId,
                coRecordId: component.get('v.recordId')
            });
            action.setCallback(this, function(response) {
                component.set("v.Spinner", false);

                if (response.getState() === 'SUCCESS' && response.getReturnValue() == 'success') {
                    $A.get("e.force:closeQuickAction").fire();
                    $A.get('e.force:refreshView').fire();

                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "type": "success",
                        "message": "Change Order Line Import Successfully",
                    });
                    toastEvent.fire();
                } else if (response.getReturnValue() == 'noRecords') {
                    $A.get("e.force:closeQuickAction").fire();
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "type": "error",
                        "message": "There is no PO Line related to this Purchase Order",
                    });
                    toastEvent.fire();

                } else {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "type": "error",
                        "message": "Something went wrong",
                    });
                    toastEvent.fire();
                }
            });
            $A.enqueueAction(action);

        } else {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error!",
                "type": "error",
                "message": "Please Select PurchaseOrder",
            });
            toastEvent.fire();

        }

    },
    cancel: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },

})