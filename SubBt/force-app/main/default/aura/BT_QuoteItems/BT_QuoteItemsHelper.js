({
    getDropDownValues: function (component, event, helper, fieldName) {
        var record = component.get('v.record');
        var action = component.get("c.getDropDown");
        action.setParams({
            fieldName: fieldName
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.dropDown', response.getReturnValue());
            } else if (state === "ERROR") {
                console.log('A Problem Occurred: ' + JSON.stringify(response.error));
            }
        });
        $A.enqueueAction(action);
    },
    fetchpricebooks: function (component, event, helper) {
        console.log(component.get("v.recordId"));
        var action = component.get("c.getpricebook");
        action.setParams({
            quoteId: component.get("v.recordId"),
        });
         var opts = [];
         action.setCallback(this, function (response) {
            console.log(response.getState());
            console.log(response.getReturnValue() , 'RESPONSE:::::::::::::::');

             if (response.getState() == "SUCCESS") {
                 var pricebook = component.get("v.recordItem").pricebookName
                //  var productfamily = component.get("v.recordItem").productfamily
                //  var productId = component.get("v.recordItem").product.Id;
                //  var productName = component.get("v.recordItem").product.Name;
                //  var newBudgetLine = component.get("v.recordItem").newBudgetLine
                //  var UOMvalues = component.get("v.recordItem").UOMvalues
                //  var vendor = component.get("v.recordItem").Vendor
                //  component.set("v.pricebookName",pricebook)
                //  component.set("v.selectedLookUpRecord",component.get("v.recordItem").product)
                //  component.set("v.productfamily",productfamily)
                //  component.set("v.selectedContractor",vendor)
                //  component.set("v.newBudgetLine",newBudgetLine)
                //  component.set("v.UOMvalues",UOMvalues)
                //  component.set("v.productId",productId)
                //  component.get("v.productName",productName)
                //  helper.fetchPickListVal(component, event, helper);
                //  if(productfamily){
                //      var valObj = {'productfamilyvalues': productfamily}
                //      var prodFam = [];
                //      prodFam.push(valObj);
                //      component.set("v.listofproductfamily", prodFam);
                //  }
                 
                 if(!pricebook){
                   component.set("v.pricebookName", response.getReturnValue());  
                 }

               
             }
         });
        $A.enqueueAction(action);
        var actions = component.get("c.getpricebooks");
        var opts = [];
        actions.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                var result = response.getReturnValue();
                var opts = [];
                opts.push({
                    key: "None",
                    value: "",
                });
                for (var key in result) {
                    opts.push({
                        key: key,
                        value: result[key],
                    });
                }
                component.set("v.pricebookoptions", opts);
            }
        });
        $A.enqueueAction(actions);
    },
    
})