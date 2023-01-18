({
    //doInit : function(component, event, helper) {
              
    //},
    addNewRFQLine : function(component, event, helper) {

        // action
        var action = component.get("c.getRFQLinesUsingProduct");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                if(result){
                    // call below yes 
                    var action2 = component.get("c.Yes");
                    $A.enqueueAction(action2);
                }else{
                    // call below no
                    var action3 = component.get("c.No");
                    $A.enqueueAction(action3);
                }
            }
        });
        $A.enqueueAction(action);
                    
        // if(!component.get('v.openModel')){
        //      component.set('v.open',true)
        // }
      
        if(component.get('v.openModel')){
            component.set('v.openModel',false);
             $A.createComponents(
            [
                ["aura:html", {
                    "tag": "h2",
                    "body": "New RFQ Lines",
                    "HTMLAttributes": { 
                        "class": "slds-text-heading_medium slds-hyphenate" 
                    }
                }],
                ["c:BT_New_RFQ_Items_Override", {
                    "mainObjectFieldAPI": component.get("v.objectAPI"),
                    "mainObjectId": component.get("v.recordId"),
                    "showProductFileds" :  component.get("v.showProductFields"),
                    "onCancel":function(){
                        //alert('hi DFL');
                        //$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
                        component.get('v.modalPromise').then(function (modal) {
                            modal.close();
                        });
                        $A.get('e.force:refreshView').fire();
                    },
                    "onSuccess":function(file){
                        //alert('hi');
                        $A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
                        component.get('v.modalPromise').then(function (modal) {
                            modal.close();
                        });
                        $A.get('e.force:refreshView').fire();
                        // var toastEvent = $A.get("e.force:showToast");
                        // toastEvent.setParams({
                        //     mode: 'sticky',
                        //     message: 'RFQ Line created successfully',
                        //     type : 'success',
                        //     duration: '10000',
                        //     mode: 'dismissible'
                        // });
                        // toastEvent.fire();
                    }
                }], 
                
            ], function(components, status) {
                if (status === 'SUCCESS') {
                    
                    var modalPromise = component.find('overlay').showCustomModal({
                        header: components[0],
                        body: components[1],
                        footer:components[1].find("footer") ,
                        showCloseButton: true,
                        cssClass: '',
                        closeCallback: function() {
                            
                        }
                    });
                    component.set("v.modalPromise", modalPromise);
                }
            });
        }
            //component.set('v.modalPromise',false);
        
        /*if(component.get("v.rfqRecord.buildertek__Status__c") == 'Accepted'){*/
           
                /*}else{
	        var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'sticky',
                message: 'You cannot create RFQ Lines until the RFQ is Awarded',
                type : 'error',
                duration: '10000',
                mode: 'dismissible'
            });
            toastEvent.fire();   
	    }*/
                
                },
                
                importMasterRFQLine : function(component, event, helper) {
                //alert('hi');
                if(component.get("v.rfqRecord.buildertek__Status__c") != 'Awarded'){
                $A.createComponents(
                [
                ["aura:html", {
                "tag": "h2",
                "body": "Import Master RFQ Lines",
                "HTMLAttributes": { 
                "class": "slds-text-heading_medium slds-hyphenate" 
                }
                }],
            ["c:ImportMasterRFQItem", {
                "mainObjectFieldAPI": component.get("v.objectAPI"),
                "mainObjectId": component.get("v.recordId"),
                "onCancel":function(){
                    //alert('hi DFL');
                    //$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
                    component.get('v.modalPromise').then(function (modal) {
                        modal.close();
                    });
                    $A.get('e.force:refreshView').fire();
                },
                "onSuccess":function(file){
                    //alert('hi');
                    $A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
                    component.get('v.modalPromise').then(function (modal) {
                        modal.close();
                    });
                    $A.get('e.force:refreshView').fire();
                }
            }], 
            
            ], function(components, status) {
                if (status === 'SUCCESS') {
                    
                    var modalPromise = component.find('overlay').showCustomModal({
                        header: components[0],
                        body: components[1],
                        footer:components[1].find("footer") ,
                        showCloseButton: true,
                        cssClass: '',
                        closeCallback: function() {
                            
                        }
                    });
                    component.set("v.modalPromise", modalPromise);
                }
            }); 
    }else{
    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
    mode: 'sticky',
    message: 'You cannot create RFQ lines after an RFQ has been Awarded',
    type : 'error',
    duration: '10000',
    mode: 'dismissible'
}); 
toastEvent.fire();    
}    
},
    
    importProducts : function(component, event, helper) {
        $A.createComponents(
            [
                ["aura:html", {
                    "tag": "h2",
                    "body": "Import Products",
                    "HTMLAttributes": { 
                        "class": "slds-text-heading_medium slds-hyphenate" 
                    }
                }],
                ["c:Import_Products_On_RfqLines", {
                    "mainObjectFieldAPI": component.get("v.objectAPI"),
                    "mainObjectId": component.get("v.recordId"),
                    
                    "onCancel":function(){
                        //alert('hi DFL');
                        //$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
                        component.get('v.modalPromise').then(function (modal) {
                            modal.close();
                        });
                        $A.get('e.force:refreshView').fire();
                    },
                    "onSuccess":function(file){
                        //alert('hi');
                        $A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
                        component.get('v.modalPromise').then(function (modal) {
                            modal.close();
                        });
                        $A.get('e.force:refreshView').fire();
                    }
                }], 
                
            ], function(components, status) {
                if (status === 'SUCCESS') {
                    
                    var modalPromise = component.find('overlay').showCustomModal({
                        header: components[0],
                        body: components[1],
                        footer:components[1].find("footer") ,
                        showCloseButton: true,
                        cssClass: '',
                        closeCallback: function() {
                            
                        }
                    });
                    component.set("v.modalPromise", modalPromise);
                }
            }); 
                
                },
                
                
         Yes : function(component, event, helper) {
                var newButton = component.find("newButtonDiv");
                $A.util.toggleClass(newButton, "slds-show"); 
                component.set('v.openModel',true);
                component.set('v.open',false)
                component.set("v.showProductFields",true);
                },
       No : function(component, event, helper) {
                component.set('v.openModel',true);
                component.set('v.open',false)
                 component.set("v.showProductFields",false);
       }                        
})