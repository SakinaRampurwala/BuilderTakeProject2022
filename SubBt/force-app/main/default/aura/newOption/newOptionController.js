({
    doInit: function(component, event, helper) {
        /*var recordId = component.get("v.recordId")
        console.log('getting recordId '+recordId);*/
        var pageRef = component.get("v.pageReference");
        var state = pageRef.state;
        var base64Context = state.inContextOfRef;
        if (base64Context.startsWith("1\.")) {
            base64Context = base64Context.substring(2);
        }
        var addressableContext = JSON.parse(window.atob(base64Context));
        component.set("v.recordId", addressableContext.attributes.recordId);
        component.set('v.Option.buildertek__Question_Group__c', addressableContext.attributes.recordId);

    },

    createRecord: function(component, event, helper) {
        component.set("v.Spinner", true);
        var Option = component.get('v.Option');

        console.log('Option ::', JSON.stringify(Option));

        var action = component.get("c.createoption");
        action.setParams({
            "option": Option
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {

                var workspaceAPI = component.find("workspace");
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                        var focusedTabId = response.tabId;
                        workspaceAPI.closeTab({
                            tabId: focusedTabId
                        });
                    })
                    .catch(function(error) {
                        console.log(error);
                    });

                var name = a.getReturnValue();
                console.log(name);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "Success",
                    "title": "Success!",
                    "message": "The record has been created successfully."
                });
                toastEvent.fire();
                var navEvent = $A.get("e.force:navigateToSObject");
                navEvent.setParams({
                    "recordId": name,
                });
                navEvent.fire();
            } else {
                var error = a.getError();
                console.log('error ==> ', { error });
                alert("Failed");
            }
        });
        $A.enqueueAction(action)
    },

    closePopup: function(component, event, helper) {


        var workspaceAPI = component.find("workspace");
        workspaceAPI.isConsoleNavigation().then(function(response) {
            if (response == true) {
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                        var focusedTabId = response.tabId;
                        workspaceAPI.closeTab({
                            tabId: focusedTabId
                        });

                        var recordId = component.get("v.recordId");
                        if (recordId) {
                            var navEvt = $A.get("e.force:navigateToSObject");
                            navEvt.setParams({
                                "recordId": recordId,
                                "slideDevName": "detail"
                            });
                            navEvt.fire();
                        } else {

                            // $A.get('e.force:refreshView').fire();
                            var urlEvent = $A.get("e.force:navigateToURL");
                            urlEvent.setParams({
                                "url": "/lightning/o/buildertek__Question__c/list?filterName=Recent"
                            });
                            urlEvent.fire();


                            $A.get("e.force:closeQuickAction").fire();
                            window.setTimeout(
                                $A.getCallback(function() {
                                    $A.get('e.force:refreshView').fire();
                                }), 1000
                            );
                        }

                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            } else {
                var recordId = component.get("v.recordId");
                if (recordId) {
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": recordId,
                        "slideDevName": "detail"
                    });
                    navEvt.fire();
                } else {

                    // $A.get('e.force:refreshView').fire();
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": "/lightning/o/buildertek__Question__c/list?filterName=Recent"
                    });
                    urlEvent.fire();


                    $A.get("e.force:closeQuickAction").fire();
                    window.setTimeout(
                        $A.getCallback(function() {
                            $A.get('e.force:refreshView').fire();
                        }), 1000
                    );
                }

            }

        });



    },

    changeProduct: function(component, event, helper) {
        var Option = component.get('v.Option');
        var productId = Option.buildertek__Product__c;
        console.log('product ==> ' + productId);

        productId = productId.toString();
        console.log(typeof productId);

        if (productId != '') {
            var action = component.get("c.getProduct");

            action.setParams({
                "productId": productId
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log('Status => ' + state);
                var result = response.getReturnValue();
                console.log('result => ', { result });

                Option.Name = result.Name;
                Option.buildertek__Manufacturer__c = result.buildertek__Manufacturer__c;

                console.log('Option ==> ', { Option });
                component.set("v.Option", Option);

            });
            $A.enqueueAction(action);
        }
    },

    saveAndNew: function(component, event, helper) {
        helper.saveAndNew(component, event);
        $A.get("e.force:refreshView").fire();
    },

    onSelectedChanged: function(component, event, helper) {
        var checkValue = component.find('selectCheck').get("v.checked");
        var Option = component.get('v.Option');
        Option.buildertek__Selected__c = checkValue;
        component.set("v.Option", Option);
    },

    onOptionChanged: function(component, event, helper) {
        var checkValue = component.find('optionCheck').get("v.checked");
        var Option = component.get('v.Option');
        Option.buildertek__Default_Option__c = checkValue;
        component.set("v.Option", Option);
    },

    onUpgradeChanged: function(component, event, helper) {
        var checkValue = component.find('upgradeCheck').get("v.checked");
        var Option = component.get('v.Option');
        Option.buildertek__Upgrade__c = checkValue;
        component.set("v.Option", Option);
    },


})