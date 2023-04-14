({
    getParameterByName: function (component, event, name) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var url = window.location.href;
        var regex = new RegExp("[?&]" + name + "(=1\.([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    getProductDetails: function (component, event, helper) {
        var action = component.get("c.getProductPrice");
        var productId = component.get("v.productId");
        var productName = component.get("v.productName");
        action.setParams({
            "productId": productId
        });
        action.setCallback(this, function (respo) {
            var res = respo.getReturnValue();
            var getProductDetails = component.get("v.newPOItem");
            ////console.log("@Budgetline@",component.get("v.recordId"));
            getProductDetails.buildertek__Purchase_Order__c = component.get("v.mainObjectId");
            //alert('getProductDetails.buildertek__Purchase_Order__c----'+getProductDetails.buildertek__Purchase_Order__c);
            getProductDetails.Name = productName;
            component.set("v.PdtName", productName);
            if (res.length >= 1) {
                if(res[0].buildertek__Unit_Cost__c !=null){
                getProductDetails.buildertek__Unit_Price__c = res[0].buildertek__Unit_Cost__c;
                component.set("v.UnitPrice", res[0].buildertek__Unit_Cost__c);
                }
                if (res[0].buildertek__Discount__c != null) {
                    getProductDetails.buildertek__Discount__c = res[0].buildertek__Discount__c;
                }
            } else {
                getProductDetails.buildertek__Unit_Price__c = 0;
                component.set("v.UnitPrice", '0');
            }
            getProductDetails.buildertek__Product__c = productId;

            getProductDetails.Name = productName;
             component.set("v.PdtName", productName);
            component.set("v.newPOItem", getProductDetails);
        });
        $A.enqueueAction(action);
    },

    fetchpricebooks: function (component, event, helper) {
        console.log('fetchpricebooks');
        var action = component.get("c.getpricebook");
        action.setParams({
            "BudgetId": component.get("v.recordId")
        });
        var opts = [];
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {

                component.set("v.pricebookName", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);

        console.log(component.get("v.parentRecordId"));

        var actions = component.get("c.getpricebooks");
        actions.setParams({
            recordId: component.get("v.parentRecordId")
        });

        var opts = [];
        actions.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                var result = response.getReturnValue();

                console.log({result});
                let projectHavePricebook=result[0].defaultValue;
                var pricebookOptions = [];
                if(Object.keys(projectHavePricebook).length !=0){
                    pricebookOptions.push({ key: projectHavePricebook.Name, value: projectHavePricebook.Id });
                    result[0].priceWrapList.forEach(function(element){
                        if(projectHavePricebook.Id !== element.Id){
                            pricebookOptions.push({ key: element.Name, value: element.Id });
                        }else{
                            pricebookOptions.push({ key: "None", value: "" });

                        }
                    });
                    component.set('v.pricebookName' , projectHavePricebook.Name);
                    component.set('v.pricebookoptions' , pricebookOptions);


                }else{
                    pricebookOptions.push({ key: "None", value: "" });
                    result[0].priceWrapList.forEach(function(element){
                        pricebookOptions.push({ key: element.Name, value: element.Id });
                    });
                    component.set("v.pricebookoptions", pricebookOptions);                

                }


                // var opts = [];
                // opts.push({
                //     key: "None",
                //     value: ""
                // });
                // for (var key in result) {
                //     opts.push({
                //         key: key,
                //         value: result[key]
                //     });
                // }
                // component.set("v.pricebookoptions", opts);
              
                // $A.get('e.force:refreshView').fire();
                   
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(actions);
    },

    getFields: function (component, event, helper) {

        var action = component.get("c.getFieldSet");
        action.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
                var listOfFields = JSON.parse(response.getReturnValue());
                console.log('listOfFields::',listOfFields);
                component.set("v.listOfFields", listOfFields);
                component.set("v.isLoading", false);

            } else {
                console.log('Error');
            }
        });
        $A.enqueueAction(action);
    }
})