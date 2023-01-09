({
    doInithelper : function(component, event, helper) {
        var action = component.get("c.getRecord");
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log('Result ==> ',{result});
                component.set("v.BudgetLine", result);

            } else {
                var toastEvent = $A.get("e.force:showToast");
				toastEvent.setParams({
					"type": "Error",
					"title": "Error!",
					"message": "Something Went Wrong."
				});
				toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    }
})