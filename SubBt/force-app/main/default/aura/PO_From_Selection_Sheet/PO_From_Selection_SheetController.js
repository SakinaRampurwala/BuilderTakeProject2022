({
    doInit: function(component, event, helper) {
        helper.doInitHelper(component, event, helper);
    },

    updateColumnSorting: function(component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    },

    updateSelectedText: function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        console.log('selectedRows => ', { selectedRows });
        component.set("v.selectedRowList", selectedRows);
    },


    //===== Description:- This method is used to create purchase order when user click on "create PO" button from Selection sheet =====
    createPOrecord: function(component, event, helper) {
        try {
            component.set("v.Spinner", true);
            var recordId = component.get("v.recordId");
            var selectedRowList = component.get("v.selectedRowList");

            console.log(selectedRowList);
            if (selectedRowList.length != 0) {

                var action = component.get("c.createPO");
                action.setParams({
                    recordId: recordId,
                    selectedRowList: selectedRowList

                });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    console.log(response.getError());
                    var prjId = component.get('v.projectId');
                    var getError = response.getError();
                    var setError;
                    console.log(Object.values(getError));

                    var object = Object.values(getError);
                    for (const key in object) {
                        var item = Object.values(object[key].fieldErrors).forEach(element => {
                            element.forEach(e => {
                                console.log(e.statusCode);
                                setError = e.statusCode;

                            });

                        });

                        console.log({ setError });
                    }

                    console.log(state);

                    if (state == "SUCCESS") {
                        helper.showToast("Success", "Success", "New PO and PO Line Created.", "5000");
                        var urlEvent = $A.get("e.force:navigateToURL");

                        if (prjId != null) {
                            urlEvent.setParams({
                                "url": "/lightning/r/buildertek__Project__c/" + prjId + "/related/buildertek__Purchase_Orders__r/view?ws=%2Flightning%2Fr%2Fbuildertek__Selection__c%2F" + recordId + "%2Fview"
                            });
                            urlEvent.fire();
                        } else {
                            urlEvent.setParams({
                                "url": "/lightning/o/buildertek__Purchase_Order__c/home"
                            });
                            urlEvent.fire();

                        }

                    } else {
                        if (setError == 'STRING_TOO_LONG') {
                            helper.showToast("Error", "Error", 'Poduct name is too long', "5000");
                        } else {
                            helper.showToast("Error", "Error", 'Something went wrong', "5000");
                        }
                    }
                    component.set("v.Spinner", false);
                    $A.get("e.force:closeQuickAction").fire();
                });
                $A.enqueueAction(action);
            } else {
                component.set("v.Spinner", false);
                helper.showToast("Error", "Error", "Please Select Options", "5000");
            }
        } catch (e) {
            console.log({ e });
        }
    },

    closeModal: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    }


})