({
    doInit: function (component, event, helper) {
        component.set("v.isOpen", true);
        //component.set("v.Spinner", true);
        var value = helper.getParameterByName(component, event, 'inContextOfRef');
        var context = '';
        var parentRecordId = '';
        component.set("v.parentRecordId", parentRecordId);
        if (value != null) {
            context = JSON.parse(window.atob(value));
            parentRecordId = context.attributes.recordId;
            component.set("v.parentRecordId", parentRecordId);
        } else {
            var relatedList = window.location.pathname;
            var stringList = relatedList.split("/");
            parentRecordId = stringList[4];
            if (parentRecordId == 'related') {
                var stringList = relatedList.split("/");
                parentRecordId = stringList[3];
            }

            component.set("v.parentRecordId", parentRecordId);
        }
        //alert('parentRecordId----'+parentRecordId);
        //component.find('POId').set("v.value", parentRecordId);
        //component.find('quantityId').set("v.value", 1);
        helper.fetchpricebooks(component, event, helper);
        helper.getFields(component, event, helper);
    },

    handleComponentEvent: function (component, event, helper) {
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        component.set("v.newPOItem.Name", selectedAccountGetFromEvent.Name);
        component.set("v.newPOItem.buildertek__Product__c", selectedAccountGetFromEvent.Id);
        component.set("v.productId", selectedAccountGetFromEvent.Id);
        component.set("v.productName", selectedAccountGetFromEvent.Name);
        helper.getProductDetails(component, event, helper);
    },

    handleComponentEvents: function (component, event, helper) {
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        component.set("v.newPOItem.Name", selectedAccountGetFromEvent.Name);
        component.set("v.newPOItem.buildertek__Product__c", selectedAccountGetFromEvent.Id);
        component.set("v.productId", selectedAccountGetFromEvent.Id);
        component.set("v.productName", selectedAccountGetFromEvent.Name);
        helper.getProductDetails(component, event, helper);
    },

    closeModel: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function (response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({
                    tabId: focusedTabId
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        $A.get("e.force:closeQuickAction").fire();
        component.set("v.isOpen", false);
        window.setTimeout(
            $A.getCallback(function () {
                $A.get('e.force:refreshView').fire();
            }), 1000
        );
    },

    // save: function (component, event, helper) {

    //     var selectedPO = component.get("v.selectedPORecord");
    //     var parentRecordId = component.get("v.parentRecordId");
    //     var selectedPORecordId;
    //     if (parentRecordId != undefined) {
    //         selectedPORecordId = parentRecordId;
    //     } else {
    //         if (selectedPO != undefined) {
    //             selectedPORecordId = selectedPO.Id;
    //         }
    //     }

    //     //component.set("v.newPOItem.buildertek__Purchase_Order__c", PO);
    //     var POLineToInsert = JSON.stringify(component.get("v.listOfFields"));
    //     console.log('PO Lines::', POLineToInsert);
    //     if (selectedPORecordId != undefined) {
    //         component.set("v.Spinner", true);
    //         var action = component.get("c.savePOItem");
    //         action.setParams({
    //             POLines: POLineToInsert,
    //             POId: selectedPORecordId
    //         });
    //         action.setCallback(this, function (response) {
    //             var state = response.getState();
    //             if (state === "SUCCESS") {
    //                 var url = location.href;
    //                 var baseURL = url.substring(0, url.indexOf('/', 14));
    //                 var result = response.getReturnValue();
    //                 $A.get("e.force:closeQuickAction").fire();
    //                 var workspaceAPI = component.find("workspace");
    //                 workspaceAPI.getFocusedTabInfo().then(function (response) {
    //                         var focusedTabId = response.tabId;
    //                         workspaceAPI.closeTab({
    //                             tabId: focusedTabId
    //                         });
    //                         //$A.get('e.force:refreshView').fire();
    //                     })
    //                     .catch(function (error) {
    //                         console.log(error);
    //                     });

    //                 var toastEvent = $A.get("e.force:showToast");
    //                 toastEvent.setParams({
    //                     mode: 'sticky',
    //                     message: 'Purchase Order Line was created ',
    //                     messageTemplate: "Purchase Order Line {0} was created",
    //                     messageTemplateData: [{
    //                         url: baseURL + '/lightning/r/buildertek__Purchase_Order_Item__c/' + escape(result.Id) + '/view',
    //                         label: result.Name,
    //                     }],
    //                     type: 'success',
    //                     duration: '10000',
    //                     mode: 'dismissible'
    //                 });
    //                 toastEvent.fire();

    //                 window.open("/" + result.Id, "_Self");
    //             }
    //         });
    //         $A.enqueueAction(action);
    //     } else {
    //         var pillTarget = component.find("errorId");
    //         $A.util.addClass(pillTarget, 'showErrorMessage');
    //     }

    // },
    // saveAndNew: function (component, event, helper) {
    //     component.set("v.Spinner", true);

    //     var selectedPO = component.get("v.selectedPORecord");
    //     var parentRecordId = component.get("v.parentRecordId");
    //     var selectedPORecordId;
    //     if (parentRecordId != undefined) {
    //         selectedPORecordId = parentRecordId;
    //     } else {
    //         if (selectedPO != undefined) {
    //             selectedPORecordId = selectedPO.Id;
    //         }
    //     }

    //     component.set("v.newPOItem.buildertek__Purchase_Order__c", selectedPORecordId);
    //     var POLineToInsert = JSON.stringify(component.get("v.newPOItem"));
    //     var action = component.get("c.savePOItem");
    //     action.setParams({
    //         POLines: POLineToInsert,
    //         POId: selectedPORecordId
    //     });
    //     action.setCallback(this, function (response) {
    //         var state = response.getState();
    //         if (state === "SUCCESS") {
    //             var url = location.href;
    //             var baseURL = url.substring(0, url.indexOf('/', 14));
    //             var result = response.getReturnValue();
    //             component.set("v.newPOItem", null);
    //             component.set("v.Spinner", false);
    //             var toastEvent = $A.get("e.force:showToast");
    //             toastEvent.setParams({
    //                 mode: 'sticky',
    //                 message: 'Purchase Order Line was created',
    //                 messageTemplate: "Purchase Order Line {0} was created",
    //                 messageTemplateData: [{
    //                     url: baseURL + '/lightning/r/buildertek__Purchase_Order_Item__c/' + escape(result.Id) + '/view',
    //                     label: result.Name,
    //                 }],
    //                 type: 'success',
    //                 duration: '10000',
    //                 mode: 'dismissible'
    //             });
    //             toastEvent.fire();
    //             window.location.reload(true);
    //         }
    //     });
    //     $A.enqueueAction(action);
    // },

    changefamily: function (component, event, helper) {

        var product = component.get('v.selectedLookUpRecord');
        var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
        compEvent.setParams({
            "recordByEvent": product
        });
        compEvent.fire();
        component.set('v.newPOItem.Name', '');
        component.set('v.newPOItem.buildertek__Unit_Price__c', '');

    },
    changeEvent: function (component, event, helper) {

        var product = component.get('v.selectedLookUpRecord');
        var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
        compEvent.setParams({
            "recordByEvent": product
        });
        compEvent.fire();

        var pribooknames = component.get("v.pricebookName");
        var action = component.get("c.getProductfamilyRecords");
        // set param to method  
        action.setParams({
            'ObjectName': "Product2",
            'parentId': component.get("v.pricebookName")
        });
        // set a callBack    
        action.setCallback(this, function (response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
                // helper.fetchPickListVal(component, event, helper);
                var storeResponse = response.getReturnValue();
                // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listofproductfamily", storeResponse);

                if (component.get("v.listofproductfamily").length > 0) {
                    component.set("v.productfamily", component.get("v.listofproductfamily")[0].productfamilyvalues);
                }

            }

        });
        // enqueue the Action  
        $A.enqueueAction(action);
    },

    handleSubmit: function (component, event, helper) {
        component.set('v.Spinner', true);
        var fields = event.getParam("fields");
        var selectedProductId = component.get('v.selectedLookUpRecord');
        if (selectedProductId != undefined && selectedProductId.Id != undefined) {
            if(fields.buildertek__Product__c == undefined){
                fields.buildertek__Product__c='';
            }
            fields.buildertek__Product__c = selectedProductId.Id;
        }
        event.preventDefault(); // Prevent default submit
        component.find('recordViewForm').submit(fields); // Submit form
    },

    onRecordSuccess: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function (response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({
                tabId: focusedTabId
            });
        }).catch(function (error) {
            console.log('Error', JSON.stringify(error));
        });
        setTimeout(function () {
            component.set("v.isOpen", false);
            component.set('v.Spinner', false);
            var payload = event.getParams().response;
            var url = location.href;
            var baseURL = url.substring(0, url.indexOf('/', 14));
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'sticky',
                message: 'Purchase Order Line created successfully',
                messageTemplate: "Purchase Order Line created successfully.",
                messageTemplateData: [{
                    url: baseURL + '/lightning/r/buildertek__Purchase_Order__c/' + escape(payload.id) + '/view',
                    label: payload.name,
                }],
                type: 'success',
                duration: '10000',
                mode: 'dismissible'
            });
            toastEvent.fire();

            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": payload.id,
                "slideDevName": "related"
            });
            navEvt.fire();
        }, 200);
    },

    saveAndNew: function (component, event, helper) {
        component.set('v.Spinner', true);
        event.preventDefault(); // Prevent default submit
        var fields = event.getParam("listOfFields");
        component.find('recordViewForm').submit(fields); // Submit form
        $A.get('e.force:refreshView').fire();
    }
})