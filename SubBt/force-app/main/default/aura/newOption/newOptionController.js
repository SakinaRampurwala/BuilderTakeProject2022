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
        component.set('v.selectionTypeId', addressableContext.attributes.recordId);

        var action2 = component.get("c.getFieldSet");
        console.log(action2);
        action2.setParams({
            objectName: 'buildertek__Question__c',
            fieldSetName: 'buildertek__NewOptionPageFields'
        });
        action2.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
                var listOfFields0 = JSON.parse(response.getReturnValue());
                console.log({listOfFields0});
                component.set("v.listOfFields0", listOfFields0);
            }
        });
        $A.enqueueAction(action2);


    

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
            "BudgetId":component.get('v.budgetId'),
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
        helper.showDropDownCategory(component, event, helper);

        var action = component.get("c.getBudget");
        action.setParams({
            selectionTypeId:component.get('v.Option.buildertek__Question_Group__c')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log({state});
            var result= response.getReturnValue();
            if (state === "SUCCESS") {
                console.log({result});
                component.set('v.searchBudget' ,result);
                $A.util.addClass(component.find("mySpinner"), "slds-hide");
                $A.util.removeClass(component.find("mySpinner"), "slds-show");
            }
        });
        $A.enqueueAction(action);
        
    },


    showDropDownCategory:function(component, event, helper) {   
        helper.showDropDownCategory(component, event, helper);
        console.log(component.get('v.searchBudget'));
        var action = component.get("c.getBudgetLine");
        action.setParams({
            BudgetId:component.get('v.budgetId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log({state});
            var result= response.getReturnValue();
            if (state === "SUCCESS") {
                console.log({result});
                component.set('v.searchCategoryFilter' ,result);
                $A.util.addClass(component.find("mySpinner2"), "slds-hide");
                $A.util.removeClass(component.find("mySpinner2"), "slds-show");



            }
        });
        $A.enqueueAction(action);
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
        if(eve.getLocalId() == 'searchCategory_2'){
            window.setTimeout(
                $A.getCallback(function() {
                    var forOpen = component.find('searchCategoryRes_2');
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
        var forOpen = component.find("searchCategoryRes_2");
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
    selectBudgetOption: function (component, event, helper) {
        event.preventDefault();
        event.stopPropagation();
        console.log('NAME=== '+ event.target.id);
        component.set('v.budgetId' , event.target.id);
        component.set("v.searchBudget",event.target.innerText);
        var forOpen = component.find("searchCategoryRes_1");
        if(forOpen){
            forOpen.getElement().style.display = 'none';
        }
    },
    onSelectionChanged:function(component, event, helper) {
        var getValue = event.getSource().get("v.value");
        component.set('v.Option.buildertek__Question_Group__c' , getValue[0]);
        console.log(component.get('v.Option.buildertek__Question_Group__c'));


    },
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
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

     changeSelectionType:function(component, event, helper) {
        helper.changeSelectionType(component, event, helper);
     },
     handleComponentEvent : function(component, event, helper) {

        console.log('handle compoennt event');
        let typeId= component.get('v.selectionTypeId')
        component.set("v.productId", typeId);
        console.log(typeId);


    },
    handleComponentEvents : function(component, event, helper) {
        console.log('handle compoennt events');
        let typeId= component.get('v.selectionTypeId')
        component.set("v.productId", typeId);
        console.log(typeId);


    },
    handleSubmit: function (component, event, helper) {
        component.set("v.isDisabled", true);
		$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "SHOW" }).fire();
        event.preventDefault(); // Prevent default submit
        var fields = event.getParam("fields");
        var allData = JSON.stringify(fields);
        var action = component.get("c.saveData");
        action.setParams({
            allData : allData
        });
        action.setCallback(this, function(response){
            if (response.getState() == 'SUCCESS') {
                var result = response.getReturnValue();

                $A.get("e.force:closeQuickAction").fire();
                window.setTimeout(
                    $A.getCallback(function() {
                        $A.get('e.force:refreshView').fire();
                    }), 1000
                );

                console.log({result});

                var saveNnew = component.get("v.isSaveNew");

                if(saveNnew){
                    $A.get('e.force:refreshView').fire();
                    component.set("v.isSaveNew", false);
                }
                else{
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": result,
                        "slideDevName": "Detail"
                    });
                    navEvt.fire();
                    debugger
                    var workspaceAPI = component.find("workspace");
                    workspaceAPI.getFocusedTabInfo().then(function(response) {
                        var focusedTabId = response.tabId;
                        workspaceAPI.closeTab({tabId: focusedTabId});
                    })
                }


                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: 'Success',
                    message: 'Option created successfully.',
                    duration: ' 5000',
                    type: 'success'
                });
                toastEvent.fire();
                $A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();

                }else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Error',
                        message: 'Something went wrong',
                        duration: ' 5000',
                        type: 'error'
                    });
                    toastEvent.fire();
                }
            });
            $A.enqueueAction(action);
    },

    handlesaveNnew : function(component, event, helper) {
        component.set("v.isSaveNew", true);
    },

})