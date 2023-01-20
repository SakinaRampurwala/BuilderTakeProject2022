({
	getParameterByName: function (component, event, name) {
		name = name.replace(/[\[\]]/g, "\\$&");
		var url = window.location.href;
		var regex = new RegExp("[?&]" + name + "(=1\.([^&#]*)|&|#|$)");
		var results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	},
	getName: function (component, event, helper) {
        // component.set('v.isLoading' , true);
        console.log('get name');
        console.log(component.get("v.parentRecordId"));
		var action = component.get("c.getBudgetNameFromProject");
		action.setParams({
			recordId: component.get("v.parentRecordId")
		});
		action.setCallback(this, function (response) {
			if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
				var budgetList = response.getReturnValue();
                console.log('budgetList ==> ',{budgetList});
                if (budgetList.length > 0) {
                    component.set("v.selectedBudget", budgetList[0].Id);
                    component.set("v.selectedBudgetName", budgetList[0].Name);

                    var action = component.get("c.getBudgetline");
                    action.setParams({
                        recordId:budgetList[0].Id
                    });
                    action.setCallback(this, function (response) {
                       component.set('v.budgetLineList' , response.getReturnValue());
                       console.log(component.get('v.budgetLineList'));
                    })
                    $A.enqueueAction(action);

                    component.set("v.budgetList", budgetList);
                }
                // console.log('budget ==> ',{budget});

                // component.set("v.selectedBudget", budget.Id);
			} else {
				console.log('Error :::' , response.getReturnValue());
			}
		});
		$A.enqueueAction(action);

	},
	getFields: function (component, event, helper) {
		var action = component.get("c.getFieldSet");
		action.setParams({
			objectName: 'buildertek__Expense__c',
			fieldSetName: 'buildertek__New_Expense_Field_Set'
		});
		action.setCallback(this, function (response) {
			if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
				var listOfFields = JSON.parse(response.getReturnValue());
				//var flag = false;
				var projectfield = '';
				for(var i in listOfFields){
					if(listOfFields[i].name =='buildertek__Project__c'){
						//flag = true;
						//projectfield = true
                        component.set('v.isProjectFieldExist',true);
					}
                    if(listOfFields[i].name =='buildertek__Budget_Line__c'){
                        console.log('yes budget line');
					}
				}
				/*if(!flag){
					var obj = {};
					obj.name='buildertek__Project__c';
					obj.type='REFERENCE';
					obj.required='false';
					obj.label ='Project';
					listOfFields.push(obj);
					component.set('v.isProjectFieldExist',false);
					component.set("v.listOfFields", listOfFields);
				}*/
                component.set("v.listOfFields", listOfFields);
                console.log(component.get('v.listOfFields'));
			} else {
				console.log('Error');
			}
		});
		$A.enqueueAction(action);
	},
    getparentrecord : function (component, event, helper) {
        console.log('Parent records');
        var action = component.get("c.getParentObjRec");
          action.setParams({ 
            parentrecordid :  component.get("v.parentRecordId")
        });
        action.setCallback(this, function(response) {
            component.set('v.isLoading' , false);
            console.log(response.getReturnValue());
            if (response.getState() === "SUCCESS") {
                var response = response.getReturnValue();
                var lookuprec = response.LookupRec;
                var ObjName = response.ObjectName;
                component.set('v.parentobjectName',ObjName);
               // alert('parentobjectName'+component.get('v.parentobjectName'));
            }
            });
            $A.enqueueAction(action);

        },
    getbtadminrecord : function (component, event, helper) {
        console.log('admin records');
        console.log(component.get("v.ExpenseId"));
        var action = component.get("c.getbudgetrecord");
         action.setParams({ 
            Expenserecid :  component.get("v.ExpenseId")
        });
        action.setCallback(this, function(response) {
            console.log(response.getState());
            console.log(response.getError());

            if (response.getState() === "SUCCESS") {
                var TimeCard = response.getReturnValue();
                    if(TimeCard == 'Message'){
                        component.set('v.btadminvalue',TimeCard);
                    }
            }
        });
        $A.enqueueAction(action);
    },
  
    getMessage : function (component, event, helper) {
        var expenseId;
        component.set('v.isLoading', false);
        setTimeout(function () {
            var workspaceAPI = component.find("workspace");
            workspaceAPI.getFocusedTabInfo().then(function (response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({
                    tabId: focusedTabId
                });
            }).catch(function (error) {
                console.log('Error', JSON.stringify(error));
            });
            
           // component.set("v.ismessage",false);
            var url = location.href;
            var baseURL = url.substring(0, url.indexOf('/', 14));
            var toastEvent = $A.get("e.force:showToast");
            expenseId = component.get("v.expenseRecordId");
            toastEvent.setParams({
                mode: 'sticky',
                message: 'Expense created successfully',
                messageTemplate: "Expense created successfully.",
                messageTemplateData: [{
                    url: baseURL + '/lightning/r/buildertek__Expense__c/' + escape(component.get("v.expenseRecordId")) + '/view',
                    label: component.get("v.expenseRecordName"),
                }],
                type: 'success',
                duration: '10000',
                mode: 'dismissible'
            });
            toastEvent.fire();
               // $A.get("e.force:closeQuickAction").fire();
            
            component.set("v.ismessage",false); 
        }, 1500);
        setTimeout(function () {
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": expenseId,
                "slideDevName": "related"
            });
            navEvt.fire(); 
        }, 2000);
    },
    getProjectValue:function (component, event, helper) {
        console.log('inside pro ifd');
        var getId=event.getSource().get('v.value');
        console.log(getId);
        component.set('v.projectId' , getId);
        var action = component.get("c.getBudget");
		action.setParams({
            recordId:component.get('v.projectId')
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


})