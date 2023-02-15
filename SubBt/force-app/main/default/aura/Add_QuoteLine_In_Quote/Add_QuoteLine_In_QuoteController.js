({
    doInit : function(component, event, helper) {
      component.set("v.isModalOpen", false);

        var action = component.get("c.getpricebooks");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
               var result = response.getReturnValue();
               var opts = [];
               opts.push({ key: "None", value: "" });
               for (var key in result) {
                  opts.push({ key: key, value: result[key] });
               }
               component.set("v.pricebookoptions", opts);
            }
        });
        $A.enqueueAction(action);
    },    
     closeModel: function(component, event, helper) {
        component.set("v.isModalOpen", false);
     },
    
     submitDetails: function(component, event, helper) {
        // Set isModalOpen attribute to false
        //Add your code to call apex method or do some processing
        component.set("v.isModalOpen", false);
     },
     showNext: function(component, event, helper) {
        component.set("v.productPage", false);
        component.set("v.quoteLineItem", true);
     },
     showPrevious: function(component, event, helper) {
        component.set("v.productPage", true);
        component.set("v.quoteLineItem", false);
     },
     handlePriceBookchange: function(component, event, helper) {
         var selectedPriceBook = component.get("v.selectedPriceBook");
         console.log('selectedPriceBook'+selectedPriceBook);
     }
})