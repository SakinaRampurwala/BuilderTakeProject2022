({
    showErrorToast: function(component, event, helper, title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: title,
            message: message,
            duration: "5000",
            key: "info_alt",
            type: "error",
            mode: "pester",
        });
        toastEvent.fire();
        component.set("v.Spinner", false);

    },
    showSuccessToast: function(component, event, helper, title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: title,
            message: message,
            duration: "5000",
            key: "info_alt",
            type: "success",
            mode: "pester",
        });
        toastEvent.fire();
    },

    addProductToRfqLines: function(component, event, helper, productIds, RfqId) {
        console.log({productIds});
        var action = component.get("c.addProductToRfq");
        component.set("v.Spinner", true);
        component.set("v.showMessage", true);
        action.setParams({
            "productIds": productIds,
            "RfqId": component.get("v.mainObjectId")
        });
        action.setCallback(this, function(response) {

            console.log(response.getState());
            console.log(response.getError());
            console.log(response.getReturnValue());


            if (response.getState() == "SUCCESS") {
                var recId = response.getReturnValue();
                // alert(recId);
                helper.showSuccessToast(component, event, helper, "Success!", 'Successfully added Rfq Line');
                $A.get("e.force:closeQuickAction").fire();
                // setTimeout(function() { location.reload(); }, 1000);
                component.set("v.Spinner", false);
                component.set("v.showMessage", false);


                var recordId = component.get("v.mainObjectId");
                $A.get("e.force:navigateToSObject").setParams({
                    "recordId": recordId

                }).fire();

                var workspaceAPI = component.find("workspace");
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                    var focusedTabId = response.tabId;
                    workspaceAPI.refreshTab({
                            tabId: focusedTabId,
                            includeAllSubtabs: true
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });

            } else {
                helper.showErrorToast(component, event, helper, "Error occurs", "Something went wrong!");
            }
        });
        $A.enqueueAction(action);
    },
    getRfqList: function(component, event, helper, productFamilyValue, tradeValue, productTypeValue, productValue, productCategoryValue, priceBook, vendor) {
       
        component.set("v.Spinner", true);
        var action = component.get("c.getProducts");
        var tradetype = component.get("v.rfqtradeType");
        var recId = component.get("v.recordId");
        action.setParams({
            "RFQRecId": recId,
            "productFamily": productFamilyValue,
            "tradeType": tradeValue,
            "productType": productTypeValue,
            "Product": productValue,
            "category": productCategoryValue,
            "priceBook": priceBook,
            "vendor": vendor,
            "rfqtradeType": tradetype,

        });
        action.setCallback(this, function(result) {
            var state = result.getState();
            console.log({state});
            console.log(result.getError());

            if (component.isValid() && state === "SUCCESS") {
                var resultData = result.getReturnValue();
                var records=resultData.recordList;
                component.set("v.rfqRecordList", resultData.recordList);
                console.log({records});
                console.log({productFamilyValue});
                console.log({priceBook});
                console.log({tradeValue});




                var pageSize = component.get("v.pageSize");
                var totalRecordsList = records;
                var totalLength = totalRecordsList.length ;
                component.set("v.totalRecordsCount", totalLength);
                component.set("v.startPage",0);
                component.set("v.endPage",pageSize-1);

                var PaginationLst = [];
                for(var i=0; i < pageSize; i++){
                    console.log(component.get("v.rfqRecordList").length > i);
                    if(component.get("v.rfqRecordList").length > i){
                        PaginationLst.push(records[i]);    
                    } 
                }
                component.set('v.PaginationList', PaginationLst);
                component.set("v.TotalPages", Math.ceil(totalLength / pageSize)); 
                console.log({resultData});
                if (resultData.categoryList && resultData.categoryList.length > 5) {
                    component.set("v.rfqCategoryList", resultData.categoryList.slice(0, 5));
                } else if (resultData.categoryList) {
                    component.set("v.rfqCategoryList", resultData.categoryList);
                }
                if (resultData.producttypeList && resultData.producttypeList.length > 5) {
                    component.set("v.rfqproducttypeList", resultData.producttypeList.slice(0, 5));
                } else if (resultData.producttypeList) {
                    component.set("v.rfqproducttypeList", resultData.producttypeList);
                }
                if (resultData.tradetypeList && resultData.tradetypeList.length > 5) {
                    component.set("v.rfqtradetypeList", resultData.tradetypeList.slice(0, 5));
                } else if (resultData.tradetypeList) {
                    component.set("v.rfqtradetypeList", resultData.tradetypeList);
                }
                if (resultData.vendorList && resultData.vendorList.length > 5) {
                    component.set("v.rfqvendorList", resultData.vendorList.slice(0, 5));
                } else if (resultData.vendorList) {
                    component.set("v.rfqvendorList", resultData.vendorList.slice(0, 5));
                }

                 component.set("v.Spinner", false);

               
                
            }
        });
        $A.enqueueAction(action);
    },
    changeEventHelper: function (component, event, helper) {

        console.log('changeEventHelper');
        component.set("v.Spinner", true);
        component.find("selectAllRFQ").set("v.value", false);

        console.log(component.get("v.searchPriceBookFilter") , '{{}}');

		var productAction = component.get("c.productfamilyList");
        productAction.setParams({
            ObjectName : "Product2",
            parentId: component.get("v.searchPriceBookFilter")
        });
        productAction.setCallback(this, function(response){
            console.log(response.getError());
            if(response.getState() === "SUCCESS"){
                
                component.set("v.Spinner", false);
                console.log(response.getReturnValue());
				component.set("v.listofproductfamily",response.getReturnValue());
                if (component.get("v.listofproductfamily").length > 0) {
                    if(component.get("v.listofproductfamily").length == 1){
                        component.set("v.searchProductFamilyFilter", component.get("v.listofproductfamily")[0].productfamilyvalues);
                    }else{
                        component.set("v.searchProductFamilyFilter", '');
                    }
				}

                helper.getRfqList(component, event, helper, '', '', '', '', '', component.get("v.searchPriceBookFilter"), '');
                
            }else{
                component.set("v.Spinner", false);
            }     
        });
        $A.enqueueAction(productAction);
	},
    next : function(component,event,sObjectList,end,start,pageSize){
        var Paginationlist = [];
        var counter = 0;
        for(var i = end + 1; i < end + pageSize + 1; i++){
            if(sObjectList.length > i){ 
                Paginationlist.push(sObjectList[i]);  
            }
            counter ++ ;
        }
        start = start + counter;
        end = end + counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.PaginationList', Paginationlist);

        const allActive = Paginationlist.every(function(obj) {
            return obj.isChecked === true;
         });
         if(allActive){
            component.find("selectAllRFQ").set("v.value", true);

        }else{
           component.find("selectAllRFQ").set("v.value", false);

        }

      
    },
    previous : function(component,event,sObjectList,end,start,pageSize){

        var Paginationlist = [];
        var counter = 0;
        for(var i= start-pageSize; i < start ; i++){
            if(i > -1){
                Paginationlist.push(sObjectList[i]); 
                counter ++;
            }else{
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.PaginationList', Paginationlist);
        const allActive = Paginationlist.every(function(obj) {
            return obj.isChecked === true;
         });
         if(allActive){
            component.find("selectAllRFQ").set("v.value", true);

        }else{
           component.find("selectAllRFQ").set("v.value", false);

        }
    },
    applyFilters : function(component, event, helper) {
        var filters = {
            productFamily: component.get('v.productFamily'),
            productCategory: component.get('v.productCategory'),
            productType: component.get('v.productType'),
            tradeType: component.get('v.tradeType'),
            vendor: component.get('v.vendor')
        };
        
        var updatedList = helper.searchHelper(component.get('v.rfqRecordList'), filters);
        component.set('v.filteredList', updatedList);
    },

    searchHelper : function(originalList, filters) {
        var updatedList = [];
        
        component.get('v.rfqRecordList').forEach(function(value) {
            if(helper.passesFilters(value, filters)) {
                updatedList.push(value);
            }
        });
        console.log({updatedList});
        
        return updatedList;
    },
    passesFilters : function(value, filters) {
        if(filters.productFamily && value.product.Family !== filters.productFamily) {
            return false;
        }
        
        if(filters.productCategory && (!value.product.buildertek__Category__c || value.product.buildertek__Category__r.Name !== filters.productCategory)) {
            return false;
        }
        
        if(filters.productType && (!value.product.buildertek__Product_Type__c || value.product.buildertek__Product_Type__r.Name !== filters.productType)) {
            return false;
        }
        
        if(filters.tradeType && (!value.product.buildertek__Trade_Type__c || value.product.buildertek__Trade_Type__r.Name !== filters.tradeType)) {
            return false;
        }
        
        if(filters.vendor && (!value.product.buildertek__Vendor__c || value.product.buildertek__Vendor__r.Name !== filters.vendor)) {
            return false;
        }
        
        return true;
    },

    // searchHelper:function(component, event, helper, selectedValue , filterName) {
    //     console.log({filterName});
    //     var allRecordList= component.get('v.rfqRecordList');
    //     var paginationList=component.get('v.PaginationList');
    //     var updatedList=[];
    //     var productFamily=component.get('v.searchProductFamilyFilter');
    //     var product=component.get('v.searchProductFilter');
    //     var productCategory=component.get('v.searchCategoryFilter');
    //     var productType=component.get('v.searchProductTypeFilter');
    //     var tradeType=component.get('v.searchTradeTypeFilter');
    //     var vendor=component.get('v.searchVendorFilter');

    //     console.log({productFamily});
    //     console.log({product});
    //     console.log({productCategory});
    //     console.log({productType});
    //     console.log({tradeType});
    //     console.log({vendor});





    //     var familyFilter=component.get('v.searchProductFamilyFilter');
        
    //     // var productFamily=selectedValue;
    //     allRecordList.forEach(function(value){
    //         if(selectedValue!== undefined && selectedValue!== ''){
                
    //             // if(productFamily!='' && productFamily!= undefined && product== '' && productCategory == '' && productType =='' &&  tradeType== '' && vendor==''){
    //             //     if(value.product.Family === productFamily){
    //             //                 updatedList.push(value);        
    //             //     }
    //             // }else if(productFamily!='' && productFamily!= undefined && product== '' && productCategory != '' && productType =='' &&  tradeType== '' && vendor==''){
    //             //     if(value.product.Family === productFamily &&  value.product.buildertek__Category__c!= undefined && value.product.buildertek__Category__r.Name ===productCategory){
    //             //             updatedList.push(value);        
    //             //     }
    //             // }else if(productFamily!='' && productFamily!= undefined && product== '' && productCategory != '' && productType !='' &&  tradeType== '' && vendor==''){
    //             //     if(value.product.Family === productFamily &&  value.product.buildertek__Category__c!= undefined && value.product.buildertek__Category__r.Name ===productCategory &&  value.product.buildertek__Product_Type__c!= undefined && value.product.buildertek__Product_Type__r.Name ===productType){
    //             //         updatedList.push(value);        
    //             //     }
    //             // }else if(productFamily!='' && productFamily!= undefined && product== '' && productCategory != '' && productType !='' &&  tradeType!= '' && vendor==''){
    //             //     if(value.product.Family === productFamily &&  value.product.buildertek__Category__c!= undefined && value.product.buildertek__Category__r.Name ===productCategory &&  value.product.buildertek__Product_Type__c!= undefined && value.product.buildertek__Product_Type__r.Name ===productType &&  value.product.buildertek__Trade_Type__c!= undefined && value.product.buildertek__Trade_Type__r.Name ===tradeType){
    //             //         updatedList.push(value);        
    //             //     }
    //             // }else if(productFamily!='' && productFamily!= undefined && product== '' && productCategory != '' && productType !='' &&  tradeType!= '' && vendor!=''){
    //             //     if(value.product.Family === productFamily &&  value.product.buildertek__Category__c!= undefined && value.product.buildertek__Category__r.Name ===productCategory &&  value.product.buildertek__Product_Type__c!= undefined && value.product.buildertek__Product_Type__r.Name ===productType &&  value.product.buildertek__Trade_Type__c!= undefined && value.product.buildertek__Trade_Type__r.Name ===tradeType &&  value.product.buildertek__Vendor__c!= undefined && value.product.buildertek__Vendor__r.Name ===vendor){
    //             //         updatedList.push(value);        
    //             //     }
    //             // }else if(productFamily=='' && product== '' && productCategory != '' && productType =='' &&  tradeType== '' && vendor==''){
    //             //     if(value.product.buildertek__Category__c!= undefined && value.product.buildertek__Category__r.Name ===productCategory){
    //             //         updatedList.push(value);        
    //             //     }
    //             // }else if(productFamily=='' && product== '' && productCategory == '' && productType !='' &&  tradeType == '' && vendor==''){
    //             //     if(value.product.buildertek__Product_Type__c!= undefined && value.product.buildertek__Product_Type__r.Name ===productType){
    //             //         updatedList.push(value);        
    //             //     }
    //             // }else if(productFamily=='' && product== '' && productCategory == '' && productType =='' &&  tradeType != '' && vendor==''){
    //             //     if(value.product.buildertek__Trade_Type__c!= undefined && value.product.buildertek__Trade_Type__r.Name ===tradeType){
    //             //         updatedList.push(value);        
    //             //     }
    //             // }else if(productFamily=='' && product== '' && productCategory == '' && productType =='' &&  tradeType == '' && vendor !=''){
    //             //     if(value.product.buildertek__Vendor__c!= undefined && value.product.buildertek__Vendor__r.Name ===vendor){
    //             //         updatedList.push(value);        
    //             //     }
    //             // }


    //             // if(filterName === 'Family'){
    //             //     if(value.product.Family === component.get('v.searchProductFamilyFilter')){
    //             //         updatedList.push(value);
    //             //         // familyList.push(value);

    //             //     }
    //             // }
    //             // if(filterName === 'Category'){
    //             //     if(value.product.Family!= undefined && value.product.Family === component.get('v.searchProductFamilyFilter') 
    //             //         && value.product.buildertek__Category__c!= undefined && value.product.buildertek__Category__r.Name === component.get('v.searchCategoryFilter')){
    //             //         updatedList.push(value);

    //             //     }

    //             // }
              
                
    //         }else{
    //             updatedList=allRecordList;
    //         }
           

    //     });
    //     console.log({allRecordList});
    //     console.log({updatedList});

    //     updatedList.filter(function(value){

    //     });

    //     component.set('v.PaginationList' ,updatedList);

    //     console.log(component.get('v.PaginationList').length);

    //     const allActive = updatedList.every(function(obj) {
    //         return obj.isChecked === true;
    //      });
    //      if(allActive){
    //         component.find("selectAllRFQ").set("v.value", true);

    //     }else{
    //        component.find("selectAllRFQ").set("v.value", false);

    //     }

        
    // },
})