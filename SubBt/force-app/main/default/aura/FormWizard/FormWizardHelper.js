({
    doInit: function(component, event, helper) {
        console.log('init');
        var action = component.get('c.getRecords');
        action.setParams({

        });
        action.setCallback(this, function(response) {
            var result = response.getReturnValue();
            if (result != null) {
                component.set('v.recordList', result);
            }

        });
        $A.enqueueAction(action);


    }
})