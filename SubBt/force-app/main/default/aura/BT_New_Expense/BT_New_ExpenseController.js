({
    doInit: function (component, event, helper) {
        component.set('v.isLoading' , true);
        var myPageRef = component.get("v.pageReference"); 
        var fieldValue = myPageRef.state.buildertek__fieldValue;
        if(fieldValue != null){
           component.set("v.parentRecordId",fieldValue);
        } 
       var value = helper.getParameterByName(component, event, 'inContextOfRef');
        var context = '';
        var parentRecordId = '';
        component.set("v.parentRecordId", parentRecordId);

        console.log('parentRecordId ==> '+parentRecordId);
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
        setTimeout(function () {
                helper.getName(component,helper,event);
                helper.getFields(component, event, helper);
                helper.getparentrecord(component,event,helper);
            }, 100);
    },
    reInit : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    },

    closeModel: function (component, event, helper) {
        component.set('v.isLoading' , true);
        console.log('quick action close');
        console.log(component.get('v.parentRecordId'));
        console.log(event.getSource().get('v.name'));
        let getName=event.getSource().get('v.name');
        if(getName == 'Cancel' || getName == 'close'){
            var workspaceAPI = component.find("workspace");
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({tabId: focusedTabId});
            })
            .catch(function(error) {
            console.log(error);
            });
            var action = component.get("c.getListViews");
            action.setCallback(this, function(response){
                var state = response.getState();
                component.set('v.isLoading' , false);
                if (state === "SUCCESS") {
                     var listviews = response.getReturnValue();
                     var navEvent = $A.get("e.force:navigateToList");
                    navEvent.setParams({
                    "listViewId": listviews.Id,
                    "listViewName": null,
                    "scope": "buildertek__Expense__c"
                    });
                    navEvent.fire();
                }
            });
            $A.enqueueAction(action);
            component.set('v.isLoading' , false);


        }else{
            component.set('v.isLoading' , false);
            component.set("v.duplicateExp",false); 

            var x= document.querySelector('.maindiv');
            x.style.visibility='visible';
        }
       
    },
    handleLoad : function (component, event, helper) {
        console.log('On load handle');
        console.log(component.get('v.parentobjectName'));
        component.set('v.typevalue', 'Material');
        var RecordId = component.get("v.parentRecordId");
        if(component.get('v.parentobjectName') == 'buildertek__Budget__c'){
            component.find("incidentlookupid").set("v.value", RecordId);
        }
        if(component.get('v.parentobjectName') == 'buildertek__Project__c' && component.get('v.isProjectFieldExist') == true){
            component.find("projectlookupid").set("v.value", RecordId);
        }
    },
    submitForm :  function(component, event, helper) {
       console.log('Submit form');
       document.getElementById('submitForm').click();
       component.set("v.duplicateExp",false); 
    },
    handleSubmit: function (component, event, helper) {
        console.log('handle submit');
        component.set('v.isLoading' , true);
        event.preventDefault(); // stop form submission
        var eventFields = event.getParam("fields");
        var expenseDescription = eventFields["buildertek__Description__c"];
        var expenseType = component.get("v.typevalue");
        var expensePaymentMethod = eventFields["buildertek__Payment_Method__c"];
        if(eventFields["buildertek__Amount__c"] != null && eventFields["buildertek__Amount__c"] != ''){
            var expenseAmount = eventFields["buildertek__Amount__c"];
        }else{
            var expenseAmount = null;
        }
        if(component.get("v.duplicateExp") == false){
            var action = component.get("c.duplicateExpense");
            action.setParams({
                "expenseDescription": expenseDescription,
                "expenseType": expenseType,
                "expensePaymentMethod": expensePaymentMethod,
                "expenseAmount": expenseAmount,
            });
            action.setCallback(this, function (response) {
                if (response.getState() === "SUCCESS") {
                   

                    var result = response.getReturnValue();
                    if(result == 'DuplicateExpense'){
                        component.set('v.isLoading', false);
                        console.log('If COndition');
                        //component.set("v.isnew", false);
                        component.set("v.duplicateExp",true); 
                        var x= document.querySelector('.maindiv');
                        x.style.visibility='hidden';
                    }else{
                        console.log('Else condition');

                        if(component.get('v.parentobjectName') == 'buildertek__Project__c'){
                            eventFields["buildertek__Project__c"] = component.get("v.parentRecordId");
                        }

                        console.log(eventFields["buildertek__Budget__c"]);
                        eventFields["buildertek__Budget__c"] = component.get("v.selectedBudget");
                        eventFields["buildertek__Budget_Line__c"] = component.get("v.selectedBudgetLine");
                        console.log(eventFields["buildertek__Budget_Line__c"]);
                        console.log('eventFields ==> '+eventFields);

                        var action = component.get("c.creteExpense");
                        action.setParams({ 
                            expenseData : eventFields
                        });
                        action.setCallback(this, function(response) {
                            component.set('v.isLoading', false);
                            console.log('State => '+response.getState());
                            if(response.getState() == 'SUCCESS'){
                                var response = response.getReturnValue();
                                console.log('response ==> ',{response});

                                var action0 = component.get("c.onRecordSuccess");
                                $A.enqueueAction(action0);

                                var navEvt = $A.get("e.force:navigateToSObject");
                                navEvt.setParams({
                                    "recordId": response,
                                    "slideDevName": "detail"
                                });
                                navEvt.fire();
                            } else{
                                var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    "title": 'Error',
                                    "type": 'Error',
                                    "message": 'Something Went Wrong',
                                    "duration": '5000'
                                });
                                toastEvent.fire();
                            }
                        });
                        $A.enqueueAction(action);

                        // component.find('recordViewForm').submit(eventFields); // Submit form
                        helper.getbtadminrecord(component,event,helper);
                    }
                }else{
                    component.set('v.isLoading', false);
                    var temp = response.getError();
                    debugger
                    console.log('error msg --> ',{temp});
                }
            });
            $A.enqueueAction(action);
        }
        else{
           if(component.get('v.parentobjectName') == 'buildertek__Project__c'){
                eventFields["buildertek__Project__c"] = component.get("v.parentRecordId");
            }
            console.log('Budger ==> '+component.get("v.selectedBudget"));
            eventFields["buildertek__Budget__c"] = component.get("v.selectedBudget");
            eventFields["buildertek__Budget_Line__c"] = component.get("v.selectedBudgetLine");
            console.log(eventFields["buildertek__Budget_Line__c"]);

            console.log('eventFields===> '+eventFields);

            var action = component.get("c.creteExpense");
            action.setParams({ 
                expenseData : eventFields
            });
            action.setCallback(this, function(response) {
                component.set('v.isLoading', false);
                console.log('State => '+response.getState());
                if(response.getState() == 'SUCCESS'){
                    var response = response.getReturnValue();
                    console.log('response ==> ',{response});

                    var action0 = component.get("c.onRecordSuccess");
                    $A.enqueueAction(action0);

                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": response,
                        "slideDevName": "detail"
                    });
                    navEvt.fire();
                } else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": 'Error',
                        "type": 'Error',
                        "message": 'Something Went Wrong',
                        "duration": '5000'
                    });
                    toastEvent.fire();
                }
            });
            $A.enqueueAction(action);

            // component.find('recordViewForm').submit(eventFields); // Submit form
            helper.getbtadminrecord(component,event,helper);
        }         
    },
    onRecordSuccess: function (component, event, helper) {
        // debugger;
        console.log('on record success');
        var payload = event.getParams().response;
        var expenseId = (payload.id).replace('"','').replace('"',''); 
        component.set("v.expenseRecordId",payload.id);
        component.set("v.expenseRecordName",payload.Name);
        console.log(component.get('v.selectedBudget') + 'budget id::::::');
        console.log(component.get('v.selectedBudgetLine') + 'selectedLine id::::::');

        
        if(component.get('v.budgetId')){
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
                component.set('v.isLoading', false);
                // var payload = event.getParams().response;
                var url = location.href;
                var baseURL = url.substring(0, url.indexOf('/', 14));
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'sticky',
                    message: 'Your Expense was added to the Budget.',
                    messageTemplate: "Your Expense was added to the Budget.",
                    messageTemplateData: [{
                        url: baseURL + '/lightning/r/buildertek__Expense__c/' + escape(payload.id) + '/view',
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
            }, 100);
        }else{
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
                component.set('v.isLoading', false);
                // var payload = event.getParams().response;
                var url = location.href;
                var baseURL = url.substring(0, url.indexOf('/', 14));
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'sticky',
                    message: 'Expense created successfully',
                    messageTemplate: "Expense created successfully.",
                    messageTemplateData: [{
                        url: baseURL + '/lightning/r/buildertek__Expense__c/' + escape(payload.id) + '/view',
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
            }, 100);
        }
    },

    saveAndNew: function (component, event, helper) {
        console.log('Save and new');
        component.set('v.isLoading', true);
        event.preventDefault(); // Prevent default submit
        component.set('v.callSaveNew' , true);
        var fields = event.getParam("listOfFields");

        var action = component.get("c.creteExpense");
        action.setParams({ 
            expenseData : eventFields
        });
        action.setCallback(this, function(response) {
            console.log('State => '+response.getState());
            var response = response.getReturnValue();
            console.log('response ==> ',{response});
            component.set('v.isLoading', false);
            $A.get('e.force:refreshView').fire();
        });
        $A.enqueueAction(action);

        // component.find('recordViewForm').submit(fields); // Submit form


    },

    getProjectValue:function (component, event, helper) {
        console.log('jon');
       helper.getProjectValue(component, event, helper);
    },

    displayBudget:function (component, event, helper) {
        component.set("v.displayuBudgetLine", true);
    }, 
    displayBudgetRelatedProject:function (component, event, helper) {
        console.log('proj');
        component.set("v.displayuBudget", true);
    }, 

    clickHandler:function (component, event, helper){
        console.log(event.currentTarget.value);
        // var record = event.currentTarget.dataset.value;
        var record = event.currentTarget.id;
        var value=event.currentTarget.dataset.value;
        console.log('record ==> '+record);
        component.set("v.selectedLine", value);
        component.set("v.selectedBudgetLine", record);

        component.set("v.displayuBudgetLine", false);

    }, 
    clickHandler0:function (component, event, helper){
        console.log(event.currentTarget.id);
        console.log(event.currentTarget.dataset.value);

        var record = event.currentTarget.id;
        var value=event.currentTarget.dataset.value;
        console.log('record ==> '+record);
        component.set("v.selectedBudget", record);
        component.set("v.selectedBudgetName", value);

        
        component.set("v.displayuBudget", false);
        var action = component.get("c.getBudgetline");
		action.setParams({
            recordId:record
        });
		action.setCallback(this, function (response) {
           component.set('v.budgetLineList' , response.getReturnValue());
           console.log(component.get('v.budgetLineList'));
        })
        $A.enqueueAction(action);

    }, 

    closeModal:function (component, event, helper){
        var className = event.target.className;
        if (className != '') {
            component.set("v.displayuBudget", false);
            component.set("v.displayuBudgetLine", false);
        }
    }, 

    changeBudget:function (component, event, helper) {
        var budgetName = component.find("incidentlookupid").get("v.value");
        console.log('budgetNameStr ==> '+budgetName);
        if (budgetName == '' || budgetName == null) {
            component.set("v.selectedBudget", null);
        }
        var action = component.get("c.getBudgetNew");
		action.setParams({
            recordId: component.get('v.projectId'),
            budgetNameStr: budgetName
        });
		action.setCallback(this, function (response) {
            console.log(response.getReturnValue());
            console.log(response.getState());

            if(response.getState() == 'SUCCESS'){
                component.set('v.budgetList' , response.getReturnValue());
                console.log(component.get('v.budgetList'));
            }

        })
        $A.enqueueAction(action);
    }, 
    
    changeBudgetLine:function (component, event, helper) {
        var budgetLineName = component.find("incidentlookupids").get("v.value");
        console.log('budgetLineNameStr ==> '+budgetLineName);
        if (budgetLineName == '' || budgetLineName == null) {
            component.set("v.selectedLine", null);
        }
        var action = component.get("c.getBudgetlineNew");
		action.setParams({
            recordId: component.get('v.selectedBudget'),
            budgetLineNameStr: budgetLineName
        });
		action.setCallback(this, function (response) {
            console.log(response.getReturnValue());
            console.log(response.getState());

            if(response.getState() == 'SUCCESS'){
                component.set('v.budgetLineList' , response.getReturnValue());
                console.log(component.get('v.budgetLineList'));
            }

        })
        $A.enqueueAction(action);
    },
})