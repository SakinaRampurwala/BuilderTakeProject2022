({
    //======= Description:- This method is used to display option list =========
    doInitHelper: function(component, event, helper) {
        try {
            var recordId = component.get("v.recordId");
            console.log('recordId => ' + recordId);
            var action = component.get("c.getOption");
            action.setParams({
                recordId: recordId
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log('State => ' + state);
                var result = response.getReturnValue().getOptionList;
                component.set('v.projectId', response.getReturnValue().getProjectId);
                console.log('Result =>', { result });
                console.log({ response });
                console.log(response.getError());
                var error = response.getError();

                if (state == "SUCCESS") {
                    component.set('v.columns', [
                        { label: 'Option Name', fieldName: 'Name', type: 'text', sortable: true },
                        { label: 'Vendor', fieldName: 'ManufacturerName', type: 'text', sortable: true },
                        { label: 'Product', fieldName: 'ProductName', type: 'text', sortable: true },
                        { label: 'Quantity', fieldName: 'buildertek__Quantity__c', type: 'text' },
                        { label: 'Sales Price', fieldName: 'buildertek__Cost__c', type: 'currency', cellAttributes: { alignment: 'left' } }
                    ]);

                    result.forEach(element => {
                        console.log('element => ', { element });
                        element.ManufacturerName = element.buildertek__Manufacturer__r.Name;
                        element.ProductName = element.buildertek__Product__r.Name
                    });
                    component.set("v.data", result);

                    $A.get('e.force:refreshView').fire();

                    component.set("v.Spinner", false);

                } else {
                    $A.get("e.force:closeQuickAction").fire();
                    $A.get('e.force:refreshView').fire();
                    component.set("v.Spinner", false);
                    helper.showToast("Error", "Error", "Something went wrong", "5000");

                }
            });
            $A.enqueueAction(action);
        } catch (e) {
            console.log({ e });
        }


    },

    sortData: function(component, fieldName, sortDirection) {
        var data = component.get("v.data");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse));
        component.set("v.data", data);
        console.log("sorted data : ", component.get("v.data"));
    },

    sortBy: function(field, reverse, primer) {
        var key = primer ?
            function(x) { return primer(x.hasOwnProperty(field) ? (typeof x[field] === 'string' ? x[field].toLowerCase() : x[field]) : 'aaa') } :
            function(x) { return x.hasOwnProperty(field) ? (typeof x[field] === 'string' ? x[field].toLowerCase() : x[field]) : 'aaa' };
        reverse = !reverse ? 1 : -1;
        return function(a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    //===== Description:- This method is used to show toast message !!====
    showToast: function(type, title, message, time) {
        try {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": title,
                "type": type,
                "message": message,
                "duration": time
            });
            toastEvent.fire();
        } catch (error) {
            console.log({ error });
        }
    },


})