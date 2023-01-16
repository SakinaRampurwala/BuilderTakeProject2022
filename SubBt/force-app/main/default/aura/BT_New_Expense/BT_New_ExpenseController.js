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
            //component.find("projectlookupid").set("v.value", parentRecordId);
            //alert(component.get("v.parentRecordId"));
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
        console.log(event.getSource().get('v.label'));
        let getLabel=event.getSource().get('v.label');
        if(getLabel == 'Cancel'){
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
            //alert('RecordId'+RecordId);
            component.find("incidentlookupid").set("v.value", RecordId);
        }
        if(component.get('v.parentobjectName') == 'buildertek__Project__c' && component.get('v.isProjectFieldExist') == true){
            
            component.find("projectlookupid").set("v.value", RecordId);
        }
       
    },
    submitForm :  function(component, event, helper) {
       console.log('Submit form');
       console.log(document.getElementById('submitForm'));
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
         console.log(component.get("v.duplicateExp") + 'Duplicate xp' );
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
                    component.set('v.isLoading', false);

                     var result = response.getReturnValue();
                     if(result == 'DuplicateExpense'){
                         //component.set("v.isnew", false);
                         component.set("v.duplicateExp",true); 
                         var x= document.querySelector('.maindiv');
                         x.style.visibility='hidden';
                  
                        //  component.set("v.isnew",false); 

                     }else{
                         if(component.get('v.parentobjectName') == 'buildertek__Project__c'){
                             eventFields["buildertek__Project__c"] = component.get("v.parentRecordId");
                         }
                         console.log(component.find('recordViewForm'));
                         component.find('recordViewForm').submit(eventFields); // Submit form
                         helper.getbtadminrecord(component,event,helper);
                     }
                 }
             });
             $A.enqueueAction(action);
         }
         else{
            if(component.get('v.parentobjectName') == 'buildertek__Project__c'){
                 eventFields["buildertek__Project__c"] = component.get("v.parentRecordId");
             }
             component.set('v.isLoading', true);
             component.find('recordViewForm').submit(eventFields); // Submit form
             helper.getbtadminrecord(component,event,helper);
         } 
         component.set('v.isLoading' , false);
        
         
     },

 

    onRecordSuccess: function (component, event, helper) {
        console.log('on record success');
        var payload = event.getParams().response;
        var expenseId = (payload.id).replace('"','').replace('"',''); 
        component.set("v.expenseRecordId",payload.id);
        component.set("v.expenseRecordName",payload.Name);
        if(component.get('v.budgetId')){
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
        var fields = event.getParam("listOfFields");
        component.find('recordViewForm').submit(fields); // Submit form
        $A.get('e.force:refreshView').fire();
    },

})