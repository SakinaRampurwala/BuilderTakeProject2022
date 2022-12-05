({
	
    doInit: function(component, event, helper) {
        //alert('hello1');
        component.set("v.Spinner", true);
        var showPoDetails = component.get("v.isFromExistingPOs");
        var selectedPO = component.get("v.selectedPO");
        component.set("v.selectedExistingPO",selectedPO);
        component.set("v.showPODetails",showPoDetails);
        var action = component.get("c.getProduct");
        var poItem = JSON.stringify(component.get("v.newPOItems"));
        action.setParams({
            poItems: poItem
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                component.set("v.poItemsToInsert", result);
                component.set("v.Spinner", false);
                if(component.get("v.showPODetails") == true){
                    var action = component.get('c.doSave');
                    $A.enqueueAction(action);
                }
            }
        });
        $A.enqueueAction(action);
         helper.fetchPickListVal(component, event, helper);
        //var budgetlineitem = component.get("v.budgetlineid");
    },
    
    removeProduct : function(component, event, helper) {
        var rowIndex = event.target.dataset.name;
         //alert('rowIndex--->'+rowIndex);
        var FiltersList = component.get("v.poItemsToInsert"); 
        FiltersList.splice(rowIndex,1);
        //alert('FiltersList--->'+FiltersList);
        for(var i=0;i<FiltersList.length;i++){
            FiltersList[i].rowIndex = i;
        }
        component.set("v.poItemsToInsert", FiltersList);
    },
    updateProductInfo: function(component, event, helper) {
        var indexOfElementChanged = event.getParam('value'); 
        helper.productselectedprice(component, event, helper,indexOfElementChanged);
        //alert('indexOfElementChanged---'+indexOfElementChanged);
        
    },
    addProduct : function(component, event, helper) {
        var poItemsToInsert = component.get("v.poItemsToInsert");
        var lstOfFilters = JSON.stringify(poItemsToInsert);
	    var action = component.get("c.addProductsToList");
	    action.setParams({
	        POItems : lstOfFilters,
	        POItem : component.get("v.newPOItem"),
	        count : poItemsToInsert.length
	    });
	    action.setCallback(this, function(response){
	        var state = response.getState();
	        if(state === "SUCCESS"){
	            var result = response.getReturnValue();
	            component.set("v.poItemsToInsert", result);
	        }
	    });
        $A.enqueueAction(action);
    },
    
    onChangeproduct: function (component, event, helper) {
      //  alert('test');
        var rowIndex = event.target.dataset.name;
      //  alert('rowIndex--->'+rowIndex); 
    },
    
    doSave:function(component, event, helper) {
    debugger;
    	/*var cmpPoContainer = component.find('poContainer');
        $A.util.addClass(cmpPoContainer, 'slds-hide');
        
        
        var btspinner = component.find('btspinner');
        $A.util.removeClass(btspinner, 'slds-hide');
        component.set('v.newPO.buildertek__Vendor__r',null);
		var action;
		action = component.get("c.createPO");
        action.setParams({
            poJson: JSON.stringify(component.get("v.newPO")),
            poItemsJson: JSON.stringify(component.get("v.newPOItems"))
        });
        action.setCallback(this, function (response) {
            if (component.isValid() && response.getState() === "SUCCESS") {
            	component.find('notifLib').showNotice({
		            "variant": "success",
		            "header": "PO has been created!",
		            "message": "PO created",
		            closeCallback: function() {
		            	//$A.enqueueAction(component.get("v.saveCallback"));
		            	//component.get("v.cancelCallback")();
		            	//
		            	var sObjectEvent = $A.get("e.force:navigateToSObject");
                        sObjectEvent.setParams({
                            "recordId": response.getReturnValue().Id,
                        })
                        sObjectEvent.fire();
		            }
		        });
			} else {
				component.find('notifLib').showNotice({
		            "variant": "error",
		            "header": "Error!",
		            "message": response.getError()[0].message,
		            closeCallback: function() {
		            }
		        });
			}
        });*/
        var poItem = JSON.stringify(component.get("v.newPOItems"));
        //alert('poItem'+poItem);
       // alert('component.get("v.selectedExistingPO")-->'+component.get("v.selectedExistingPO"));
        //alert('component.get("v.budgetlineid")-->'+component.get("v.budgetlineid"));
       // alert('hii1'+JSON.stringify(component.get("v.poItemsToInsert")));
        component.set("v.Spinner", true);
       // alert('budline--->'+component.get("v.budgetlineid"));
       var isExisted = component.get("v.showPODetails");
    	var action;
        console.log('New PO FIELD ::::',JSON.stringify(component.get("v.newPO")));
        if(!isExisted){
            //component.set("v.Spinner", true);
           // alert('component.get("v.budgetlineid")-->'+component.get("v.budgetlineid"));
            action = component.get("c.createPO");
            action.setParams({
                poJson:  component.get("v.newPO"),
                poItemsJson: JSON.stringify(component.get("v.poItemsToInsert")),
                budgetlineid : component.get("v.budgetlineid")
            });
        }else if(isExisted){
            
           //component.set("v.Spinner", false);
            
            var poItem = JSON.stringify(component.get("v.poItemsToInser"));
            var selectedPO = component.get("v.selectedExistingPO");
            action = component.get("c.createLinesForExistedPO");
            //alert('%%%'+component.get("v.selectedbudgetRecs"));
            action.setParams({
                "poRecordID" : component.get("v.selectedExistingPO"),
                "poItemsJson": JSON.stringify(component.get("v.poItemsToInsert")), //poItem,
                "budgetlineid" : component.get("v.budgetlineid"),
                "addbudgetlineids" : component.get("v.selectedbudgetRecs"),
            });
        }
		
        action.setCallback(this, function (response) {
            debugger;
            if (component.isValid() && response.getState() === "SUCCESS") {
            //	$A.enqueueAction(component.get("v.saveCallback"));
            	var result = response.getReturnValue();
            	if(result.isSuccess === true){
            	   //  component.set("v.Spinner", false);
            	  
                    var sObjectEvent = $A.get("e.force:navigateToSObject");
                            sObjectEvent.setParams({
                                "recordId": result.strRecordId,
                            })
                            
                        var isFromExistingPOs = component.get("v.isFromExistingPOs");
                   
                    
                    if(isFromExistingPOs == false){
                        sObjectEvent.fire();
                    }else{
                         $A.enqueueAction(component.get("v.saveCallback"));
                        //component.get("v.cancelCallback")();
                      
                       //  $A.get('e.force:refreshView').fire();
                           // location.reload();
                     
                        
                    }
                        
                      component.set("v.Spinner", false);
                    
                    // comment by laxman 20/07/2020
                    // Description :- no need to display sucess message
            	     /*component.find('notifLib').showNotice({
                        "variant": "success",
                        "header": "Success",
                        "message": 'Purchase Order created successfully',
                        closeCallback: function() {
                            var sObjectEvent = $A.get("e.force:navigateToSObject");
                            sObjectEvent.setParams({
                                "recordId": result.strRecordId,
                            })
                            sObjectEvent.fire(); 
                        }
                    });   */
            	}else{
            	    component.set("v.Spinner", false);
            	    component.find('notifLib').showNotice({
                        "variant": "error",
                        "header": "Error",
                        "message": result.strMessage,
                        closeCallback: function() {
                        }
                    });   
            	} 
			}
        }); 
        
        $A.enqueueAction(action);
	},
	
	doCancel:function(component, event, helper) {
		component.get("v.cancelCallback")();
	}
})