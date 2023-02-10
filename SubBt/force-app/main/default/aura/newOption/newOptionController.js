({
    doInit: function(component, event, helper) {
        /*var recordId = component.get("v.recordId")
        console.log('getting recordId '+recordId);*/
        component.set('v.disableIt' , false);
        
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
        component.set('v.disableIt' , true);
        component.set("v.Spinner", true);
        var Option = component.get('v.Option');
        

        console.log('Option ::', JSON.stringify(Option));

        var action = component.get("c.createoption");
        action.setParams({
            "option": Option,
            "salesPrice": component.get('v.unitSalesPrice'),
            "budgetLineId":component.get('v.selectedBudgetLineId')

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
    onBudgetChanged:function(component, event, helper) {
        var getValue = event.getSource().get("v.value");
        console.log(getValue[0]);
        var action = component.get("c.getBudgetLine");
        action.setParams({
            budgetId: getValue[0]
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log({state});
            var result= response.getReturnValue();
            if (state === "SUCCESS") {
                console.log({result});
                component.set('v.parentValue' , getValue[0]);
                component.set('v.selectedLookupValue' ,result );
            }
        });
        $A.enqueueAction(action);
        
    },
    showDropDownCategory:function(component, event, helper) {
        // var getValue=component.get('v.selectedLookupValue');
        // console.log(getValue);
        var auraId = event.getSource().getLocalId(); //returns the aura:id of the clicked button
        var auraIdName = auraId.split('_')[0];
        var index = auraId.split('_')[1];
        var forOpen = component.find(auraIdName+'Res_'+index);
        for(var i=1;i<=4;i++){
            if(i != index){
                var forClose = component.find(auraIdName+'Res_'+i);
                if(forClose){
                     forClose.getElement().style.display = 'none';
                }
               
            }
        }
        forOpen.getElement().style.display = 'block'
         var getInputkeyWord = '';
         event.stopPropagation();
        event.preventDefault();
    },
    hideDropDownCategory : function (component, event, helper) {
        event.preventDefault();
        var eve = event.getSource();
        console.log(event.target)
        if(eve.getLocalId() == 'searchCategory_1'){
            window.setTimeout(
                $A.getCallback(function() {
                    var forOpen = component.find('searchCategoryRes_1');
                     if(forOpen){
                        forOpen.getElement().style.display = 'none';
                    }
                }), 1000
            );
        }
        var getInputkeyWord = '';
       
    },
    selectRecordOption : function (component, event, helper) {
        event.preventDefault();
        event.stopPropagation();
        console.log('NAME=== '+ event.target.id);
        component.set("v.searchCategoryFilter",event.target.innerText);
        var forOpen = component.find("searchCategoryRes_1");
        if(forOpen){
            forOpen.getElement().style.display = 'none';
        }

        component.set('v.selectedBudgetLineId' ,event.target.id);
        var action = component.get("c.getBudgetLineUnitSalesPrice");
        action.setParams({
            budgetLineId: component.get('v.selectedBudgetLineId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log({state});
            var result= response.getReturnValue();
            if (state === "SUCCESS") {
                console.log({result});
                component.set('v.unitSalesPrice' , result);

            }
        });
        $A.enqueueAction(action);
    },

})