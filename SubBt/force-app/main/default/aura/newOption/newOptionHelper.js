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
	}
})