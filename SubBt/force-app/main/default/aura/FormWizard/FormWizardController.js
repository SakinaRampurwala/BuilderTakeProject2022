({
    doInit: function(component, event, helper) {
        helper.doInit(component, event, helper);
    },
    handleKeyUp: function(component, event, helper) {
        var queryTerm = component.find('enter-search').get('v.value');
        console.log(queryTerm);
        var action = component.get('c.searchAccount');
        action.setParams({
            searchKey: queryTerm
        });
        action.setCallback(this, function(response) {
            var result = response.getReturnValue();
            var state = response.getState();
            console.log(result.length);
            if (result != null && state == 'SUCCESS') {
                component.set('v.recordList', result);
            }
        });
        $A.enqueueAction(action);


    }
})