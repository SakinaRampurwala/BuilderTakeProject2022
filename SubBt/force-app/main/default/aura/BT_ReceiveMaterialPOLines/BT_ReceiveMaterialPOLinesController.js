({
    doInit : function(component, event, helper) {
        var myPageRef = component.get("v.pageReference");
       // var pageSize = component.get("v.pageSize");
          var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var action =component.get("c.getProducts");
        action.setParams({
            "recordId" : JSON.parse(JSON.stringify(component.get("v.recordId")))
        });
        action.setCallback(this, function(a){ 
            var obj = JSON.parse(JSON.stringify(a.getReturnValue()))
            obj['quantity_recieved'] = ''
           // alert(JSON.stringify(obj.length));
            component.set("v.rfqRecordList", obj);
            
             component.set("v.totalRecords", component.get("v.rfqRecordList").length);
             var pageNumber = component.get("v.totalRecords");
        //alert(pageNumber);
                component.set("v.startPage", 0);
                component.set("v.endPage", pageSize - 1);
                for (var i = 0; i < pageSize; i++) {
                    if (component.get("v.rfqRecordList").length > i)
                        paginationList.push(obj[i]);
                }
                component.set('v.paginationList', paginationList);
            
            
            
        });
        $A.enqueueAction(action);
          var workspaceAPI = component.find("workspace");
        workspaceAPI.getEnclosingTabId().then((response) => {
            let opendTab = response.tabId;
            workspaceAPI.setTabLabel({
            tabId: opendTab,
            label: "Receive Material"
        });
        workspaceAPI.setTabIcon({
            tabId: opendTab,
            icon: 'custom:custom18',
            iconAlt: 'Receive Material'
        });
    });
    
    },
    
    
    addToPOLines: function (component, event, helper, ProductsList) {
        var  purchaseId = component.get("v.recordId");
      
        var rfqlist= component.get("v.rfqRecordList");
        var action =component.get("c.addProducts");
        let productIdList=[];
        
        
        var productList = [];
        for(var i=0;i<rfqlist.length;i++){
            if(rfqlist[i].buildertek__Product__c != null){
                productIdList.push(rfqlist[i].buildertek__Product__c);
                var obj = {};
                console.log(rfqlist[i].quantity_recieved);
                console.log('{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}');
                if(rfqlist[i].quantity_recieved != null){
                    obj['prodId'] = rfqlist[i].buildertek__Product__c
                    obj['quantity_recieved'] = rfqlist[i].quantity_recieved
                    obj['polineId'] = rfqlist[i].Id
                    
                    productList.push(obj);
                }
            }
            
        }
        
        console.log(productList);
        debugger;
        component.set("v.Spinner", true);
        component.set("v.showMessage", true);
        action.setParams({
            productId:productIdList,
            "ProductsList" : JSON.stringify(productList),
            
        })
        
        action.setCallback(this,function(response){
            console.log(response.getState() , 'State=====');
            console.log(response.getError());
            if(response.getState() == "SUCCESS"){
               // console.log(response);
                //alert(response.getState());
                var result = response.getReturnValue();
                console.log(result);
                debugger;

                if(result){
                    var recId = response.getReturnValue();
                    // alert(recId);
                    var recordId = component.get("v.recordId");
                    
                    $A.get("e.force:closeQuickAction").fire();
                    setTimeout(function(){ location.reload(); }, 1800);
                    component.set("v.Spinner", false);
                    component.set("v.showMessage", false);
                // alert(recordId);
                /*   $A.get("e.force:navigateToSObject").setParams({
                        "recordId": recordId,
                        "slideDevName": "detail"
                    }).fire();*/
                    
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": '/lightning/r/buildertek__Purchase_Order__c/'+recordId+'/view'
                    });
                    urlEvent.fire();
                }else{
                    component.set("v.Spinner", false);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Error',
                        message: 'Quantity received and quantity delivered must be less than or equal to quantity ordered. ',
                        duration: ' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
                    
                 
                
                
            }
        });
        
        $A.enqueueAction(action);
        
    },
    
    closeModal: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var Spinner = component.get("v.spinner",true);
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        
        .catch(function(error) {
            console.log(error);
        });
        //component.get("v.onCancel")(); 
    },
    
    handleBlur : function(component, event, helper) {
       // var QuantityReceived = component.get('QuantityReceived');
        
        var inputField = event.getSource();
        
        var quantityReceived = event.getSource().get("v.value");
        
        var POQuantity = event.getSource().get("v.name");
        
       // alert('quantityReceived'+quantityReceived);
      //  alert('POQuantity'+POQuantity);
        
        if(quantityReceived > POQuantity) {
            
            inputField.setCustomValidity("Items Delivered must be lessthan Quantity");
       
            component.find("submit").set("v.disabled", true);
        }else{
            inputField.setCustomValidity("");
            component.find("submit").set("v.disabled", false);
        }

    },
    
    
    next: function (component, event, helper) {
        var sObjectList = component.get("v.rfqRecordList");
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0;
        for (var i = end + 1; i < end + pageSize + 1; i++) {
            if (sObjectList.length > i) {
                paginationList.push(sObjectList[i]);
            }
            counter++;
        }
        start = start + counter;
        end = end + counter;
        component.set("v.startPage", start);
        component.set("v.endPage", end);
        component.set('v.paginationList', paginationList);
    },
    previous: function (component, event, helper) {
        var sObjectList = component.get("v.rfqRecordList");
         var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0;
        for (var i = start - pageSize; i < start; i++) {
            if (i > -1) {
                paginationList.push(sObjectList[i]);
                counter++;
            } else {
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.startPage", start);
        component.set("v.endPage", end);
        component.set('v.paginationList', paginationList);
    },
    
    
})