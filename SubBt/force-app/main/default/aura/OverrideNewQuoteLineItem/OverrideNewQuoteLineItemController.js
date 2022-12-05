({
	doInit : function(component, event, helper) {
	    component.set("v.isOpen", true);
	  //  component.set("v.Spinner", true);
	    var value = helper.getParameterByName(component , event, 'inContextOfRef');
    	var context = '';
    	var parentRecordId = '';
    	component.set("v.parentRecordId",parentRecordId);
    	if(value != null){
    		context = JSON.parse(window.atob(value));
    		parentRecordId = context.attributes.recordId;
            component.set("v.parentRecordId",parentRecordId);
		}else{
		    var relatedList = window.location.pathname;
		    var stringList = relatedList.split("/"); 
           // alert('stringList---'+stringList);
		    parentRecordId = stringList[4];
            if(parentRecordId == 'related'){
                var stringList = relatedList.split("/");
                parentRecordId = stringList[3];
            }
		    component.set("v.parentRecordId",parentRecordId);
		}
        
        component.find('quantityId').set("v.value", 1);
        //alert('parent-------'+ parentRecordId);
		//component.find('QuoteId').set("v.value", parentRecordId);
		helper.fetchpricebooks(component, event, helper);
		//component.set("v.Spinner", false);
	}, 
	
	handleComponentEvent : function(component, event, helper) {
	    var selectedAccountGetFromEvent = event.getParam("recordByEvent");
	    component.set("v.newQuoteItem.Name",selectedAccountGetFromEvent.Name);
	    component.set("v.newQuoteItem.buildertek__Product__c",selectedAccountGetFromEvent.Id);
	    component.set("v.productId", selectedAccountGetFromEvent.Id);
		component.set("v.productName", selectedAccountGetFromEvent.Name);
	    helper.getProductDetails(component, event, helper);
        //alert('test');
    },
    ClearhandleComponentEvent: function (component, event, helper) {
        
    },
    handleComponentEvents : function(component, event, helper) {
	    var selectedAccountGetFromEvent = event.getParam("recordByEvent");
	    component.set("v.newQuoteItem.Name",selectedAccountGetFromEvent.Name);
	    component.set("v.newQuoteItem.buildertek__Product__c",selectedAccountGetFromEvent.Id);
	    component.set("v.productId", selectedAccountGetFromEvent.Id);
		component.set("v.productName", selectedAccountGetFromEvent.Name);
	    helper.getProductDetails(component, event, helper);
        //alert('test handler');
    },
	
	closeModel: function(component, event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
        $A.get("e.force:closeQuickAction").fire();
        component.set("v.isOpen", false);
        window.setTimeout(
            $A.getCallback(function() {
                $A.get('e.force:refreshView').fire();
            }), 1000
        );
   },
    
    save : function(component, event, helper) {
        var selectedCostCode = component.get("v.selectedCostCode");
        var costcode;
        if(selectedCostCode != undefined){
            costcode = selectedCostCode.Id;     
        }else{
            costcode = null;
        }
        var selectedGroup = component.get("v.selectedGroup");
        var quotelinegroup;
        if(selectedGroup != undefined){
            quotelinegroup = selectedGroup.Id;
        }else{
            quotelinegroup = null;
        }
        
        var selectedPo = component.get("v.selectedPORecord");
        var Porec;
        if(selectedPo != undefined){
            Porec = selectedPo.Id;
        }else{
            Porec = null;
        } 
        var selectedQuote = component.get("v.selectedQuoteRecord");
        var parentRecordId = component.get("v.parentRecordId");
        var selectedQuoteRecordId;
        if(parentRecordId != undefined){
            selectedQuoteRecordId =  parentRecordId;   
        }else{
            if(selectedQuote != undefined){
                selectedQuoteRecordId = selectedQuote.Id;    
            }
        }
        component.set("v.newQuoteItem.buildertek__Purchase_Order__c", Porec);
      //  component.set("v.newPOItem.buildertek__Quote__c", liabilityGLAccount);
        component.set("v.newQuoteItem.buildertek__Grouping__c", quotelinegroup);
        component.set("v.newQuoteItem.buildertek__Cost_Code__c", costcode);
        //component.set("v.newPOItem.buildertek__Purchase_Order__c", PO);
        var QuoteLineToInsert = JSON.stringify(component.get("v.newQuoteItem"));
        var QuoteLineName=component.get("v.newQuoteItem.Name");
        //alert(QuoteLineName);
        if(selectedQuoteRecordId != undefined){
            if(QuoteLineName==undefined){
                //alert('test');
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        mode: 'sticky',
                        message: 'Please Provide a Product Description.',
                        type : 'error',
                        duration: '10000',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
            }else{
            var action = component.get("c.saveQuotelineItem");
            action.setParams({
                QuoteLines : QuoteLineToInsert,
                QuoteId : selectedQuoteRecordId
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if(state === "SUCCESS"){
                     component.set("v.Spinner", true);
                    var url = location.href;
                    var baseURL = url.substring(0, url.indexOf('/', 14));
                    var result = response.getReturnValue();
                    $A.get("e.force:closeQuickAction").fire();
                    var workspaceAPI = component.find("workspace");
                    workspaceAPI.getFocusedTabInfo().then(function(response) {
                        var focusedTabId = response.tabId;
                         workspaceAPI.closeTab({tabId: focusedTabId});
                         //$A.get('e.force:refreshView').fire();
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                    
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        mode: 'sticky',
                        message: 'Quote Line was created ',
                        messageTemplate: "Quote Line {0} was created",
                        messageTemplateData: [{
                        url: baseURL+'/lightning/r/buildertek__Quote_Item__c/'+escape(result.Id)+'/view',
                        label: result.Name,
                        }],
                        type : 'success',
                        duration: '10000',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                    component.set("v.Spinner", false);
                    
                    window.open ("/"+result.Id,"_Self");     
                }
            });
            $A.enqueueAction(action);   
            }
        }else{
            var pillTarget = component.find("errorId"); 
            $A.util.addClass(pillTarget, 'showErrorMessage');    
        }
        
   },
   saveAndNew : function(component, event, helper) {
       //component.set("v.Spinner", true);
          var selectedCostCode = component.get("v.selectedCostCode");
        var costcode;
        if(selectedCostCode != undefined){
            costcode = selectedCostCode.Id;     
        }else{
            costcode = null;
        }
        var selectedGroup = component.get("v.selectedGroup");
        var quotelinegroup;
        if(selectedGroup != undefined){
            quotelinegroup = selectedGroup.Id;
        }else{
            quotelinegroup = null;
        }
        
        var selectedPo = component.get("v.selectedPORecord");
        var Porec;
        if(selectedPo != undefined){
            Porec = selectedPo.Id;
        }else{
            Porec = null;
        } 
        var selectedQuote = component.get("v.selectedQuoteRecord");
        var parentRecordId = component.get("v.parentRecordId");
        var selectedQuoteRecordId;
        if(parentRecordId != undefined){
            selectedQuoteRecordId =  parentRecordId;   
        }else{
            if(selectedQuote != undefined){
                selectedQuoteRecordId = selectedQuote.Id;    
            }
        }
      
        component.set("v.newQuoteItem.buildertek__Grouping__c", quotelinegroup);
        component.set("v.newQuoteItem.buildertek__Quote__c", selectedQuoteRecordId);
        component.set("v.newQuoteItem.buildertek__Cost_Code__c", costcode);
        component.set("v.newQuoteItem.buildertek__Purchase_Order__c", Porec);
        var QuoteLineToInsert = JSON.stringify(component.get("v.newQuoteItem"));
        var QuoteLineName=component.get("v.newQuoteItem.Name");
        if(selectedQuoteRecordId != undefined){
            if(QuoteLineName==undefined){
                //alert('test');
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        mode: 'sticky',
                        message: 'Please Provide a Product Description.',
                        type : 'error',
                        duration: '10000',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
            }else{
        var action = component.get("c.saveQuotelineItem");
        action.setParams({
            QuoteLines : QuoteLineToInsert,
                QuoteId : selectedQuoteRecordId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var url = location.href;
                var baseURL = url.substring(0, url.indexOf('/', 14));
                var result = response.getReturnValue();
                component.set("v.newQuoteItem", null); 
                component.set("v.Spinner", false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'sticky',
                    message: 'Quote Line was created',
                    messageTemplate: "Quote Line {0} was created",
                    messageTemplateData: [{
                    url: baseURL+'/lightning/r/buildertek__Quote_Item__c/'+escape(result.Id)+'/view',
                    label: result.Name,
                    }],
                    type : 'success',
                    duration: '10000',
                    mode: 'dismissible'
                });
                toastEvent.fire();
                component.set("v.Spinner", false);
                window.location.reload(true);
            }
        });
        $A.enqueueAction(action);  
            }
            }else{
            var pillTarget = component.find("errorId"); 
            $A.util.addClass(pillTarget, 'showErrorMessage');    
        }
   },
     changefamily : function(component, event, helper) {
        
        var product = component.get('v.selectedLookUpRecord');
                var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
                compEvent.setParams({"recordByEvent" : product });  
                compEvent.fire();
       component.set('v.newQuoteItem.Name', '');
       component.set('v.newQuoteItem.buildertek__Unit_Price__c', '');
        component.set('v.newQuoteItem.buildertek__Unit_Cost__c', '');
        component.set('v.newQuoteItem.buildertek__Markup__c', '');
         
        
    },
    changeEvent: function(component, event, helper) {
         
                var product = component.get('v.selectedLookUpRecord');
                var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
                compEvent.setParams({"recordByEvent" : product });  
                compEvent.fire();
              // component.set('v.newQuote.Name', '');
              //  component.set('v.newQuote.buildertek__Grouping__c', null);
               // component.set('v.newQuote.buildertek__UOM__c', '');
               // component.set('v.newQuote.buildertek__Unit_Cost__c', '');
               // component.set('v.newQuote.buildertek__Quantity__c', 1);
              //  component.set('v.newQuote.buildertek__Markup__c', ''); 
        var pribooknames = component.get("v.pricebookName");
          var action = component.get("c.getProductfamilyRecords");
      // set param to method  
        action.setParams({ 
            'ObjectName' : "Product2",
            'parentId' : component.get("v.pricebookName")
          });
      // set a callBack    
        action.setCallback(this, function(response) {
          $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
               // helper.fetchPickListVal(component, event, helper);
                var storeResponse = response.getReturnValue();
              // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listofproductfamily", storeResponse);
                
                if(component.get("v.listofproductfamily").length >0){
                 component.set("v.productfamily",component.get("v.listofproductfamily")[0].productfamilyvalues);
                }
                 
            }
 
        });
      // enqueue the Action  
        $A.enqueueAction(action);
    },
})