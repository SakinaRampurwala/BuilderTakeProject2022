({
    getQuoteDataHelper : function(component, event, helper) {
        try {
            console.log('*** getQuoteDataHelper ***');
            var action = component.get("c.getQuoteData");
            action.setStorable({
                ignoreExisting: true
            });
            action.setParams({
                quoteId: component.get("v.recordId"),
                pageNumber: page,
                recordToDisply: 50,
                status: 'Accept'
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    console.log('Quote Data ==> ',{ result });
                }
            });
            $A.enqueueAction(action);
        } catch (error) {
            console.log('getQuoteDataHelper Error => ',error);
        }
       
    }
})