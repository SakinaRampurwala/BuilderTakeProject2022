({
    // Get picklist value dynamic 
    getPicklist: function(component, event, helper) {
        try {
            var action = component.get("c.getPickListValuesInMap");
            action.setParams({

            });
            action.setCallback(this, function(response) {

                var durationResult = response.getReturnValue().durationOptions;
                var statusResult = response.getReturnValue().statusOption;

                var durationMap = [];
                var statusMap = [];
                for (var key in durationResult) {
                    durationMap.push({ key: key, value: durationResult[key] });
                }
                component.set("v.getOption", durationMap);

                for (var key in statusResult) {
                    statusMap.push({ key: key, value: statusResult[key] });
                }
                component.set("v.getStatusOption", statusMap);

            });
            $A.enqueueAction(action);
        } catch (e) {
            console.log('OUTPUT : ', e);
        }

    }
})