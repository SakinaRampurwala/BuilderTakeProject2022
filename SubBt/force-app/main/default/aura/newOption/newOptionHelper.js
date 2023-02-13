({
	saveAndNew : function(component, event) {
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
				workspaceAPI.getFocusedTabInfo().then(function (response) {
					var focusedTabId = response.tabId;
					workspaceAPI.closeTab({
						tabId: focusedTabId
					});
				})
				.catch(function (error) {
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
			} else{
				var error= a.getError();
				console.log('error ==> ',{error});
				alert("Failed");
			}
		});
		$A.enqueueAction(action)
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
	changeSelectionType:function(component, event, helper) {
		console.log('change selection type');
		let getValue= event.getSource().get('v.value');
		var temp = getValue;
		console.log('check name --> ',temp[0]);
		component.set('v.selectionTypeId', temp[0]);

        var action = component.get("c.getBudget");
        action.setParams({
            seleTypeId:temp[0]
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
			console.log(response.getError());
            console.log({state});
            var result= response.getReturnValue();
            if (state === "SUCCESS") {

                console.log({result});
                component.set('v.selectedLookUpRecord' ,result);
                component.set('v.selectedtRecord' ,result);

				
            }
        });
        $A.enqueueAction(action);
		
     },

})