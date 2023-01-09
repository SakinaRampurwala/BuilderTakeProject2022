({
    doInit : function(component, event, helper) {
       helper.doInithelper(component, event, helper)
    }, 

    editRecord : function(component, event, helper){
        console.log('Edit Record');
        helper.doInithelper(component, event, helper)
        component.set("v.viewMode", false);
    }, 

    leaveEditForm : function(component, event, helper){
        console.log('Leave Edit Form');
        $A.get('e.force:refreshView').fire();
        component.set("v.viewMode", true);
    }, 

    saveRecord : function(component, event, helper){
        console.log('Save Record');

        var action = component.get("c.updateRecord");
        action.setParams({            
            BudgetLine : component.get("v.BudgetLine")
        });
        action.setCallback(this, function (response) {
            component.set("v.viewMode", true);
            var state = response.getState();
            console.log('state ==> '+state);
            if (state === "SUCCESS") {
                $A.get('e.force:refreshView').fire();
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
    }, 

    editProductName : function(component, event, helper){
        try{
            //on change of product id get the product name
            var selectedProductId = component.get("v.BudgetLine.buildertek__Product__c");
            console.log('selectedProductId ==> '+selectedProductId);
            var action = component.get("c.getProductName");
            action.setParams({
                productId : selectedProductId
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    console.log('Result ==> ',{result});
                    component.set("v.BudgetLine.buildertek__Product_Name__c", result);
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
        } catch (error) {
            console.log('error ==> '+error);
        }
    }
})