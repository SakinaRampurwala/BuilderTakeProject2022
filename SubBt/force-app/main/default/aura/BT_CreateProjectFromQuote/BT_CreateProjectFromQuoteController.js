({
    doInit : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var action = component.get("c.getQuote");
        action.setParams({ 
            recordId: component.get("v.recordId"),
            searchNameValue : '',
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
            }
        });
        $A.enqueueAction(action);

        var action1 = component.get("c.getQuoteName1");
        action1.setParams({
            searchNameValue: ''
        });
        action1.setCallback(this, function (response) {
            var result = response.getReturnValue();
            var recordName = '';
            result.forEach(element => {
                if (element.Id == recordId) {
                    recordName = element.Name;
                }
            });
            component.set("v.searchNameFilter", recordName);
            component.set("v.recordData", recordId);

        });
        $A.enqueueAction(action1);
        
  
    },
    
    closeModel : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();    
    },

    doSearch: function (component, event, helper) {
        console.log('====doSearch====');
        helper.searchHelper(component, event, helper);
    },
    
    clickHandler3: function (component, event, helper){
        console.log('====clickHandler3====');
        var record = event.currentTarget.dataset.value;
        console.log('record --> ',{record});
        var recordName = '';
        var ProductNameList = component.get("v.ProductNameList");
        ProductNameList.forEach(element => {
            if (element.Id == record) {
                recordName = element.Name;
            }
        });
        component.set("v.searchNameFilter", recordName);
        component.set("v.recordData", record);

        
    },

    saveModel : function(component, event, helper) {
        component.set("v.Spinner", true);
        var project = component.find("projectNameId").get("v.value");
        var accountId = component.find("accountId").get("v.value");
        var projectManagerId = component.find("projectManagerId").get("v.value");
        var contractDateId = component.find("contractDateId").get("v.value");
        var QuoteRec = component.get("v.recordData");        
        console.log('QuoteRec---->>>',{QuoteRec});
        var action = component.get("c.createProject");
        action.setParams({
            recordId : QuoteRec,
            projectName : project,
            account : accountId,
            projectManager : projectManagerId,
            contractDate : contractDateId,
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                component.set("v.Spinner", false);
                $A.get("e.force:closeQuickAction").fire();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success',
                    message: 'Project Created successfully.',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
                toastEvent.fire();
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": result,
                    "slideDevName": "related"
                });
                navEvt.fire();
                $A.get('e.force:refreshView').fire();
            }
        });
        $A.enqueueAction(action);
        
    },
    searchQuote: function (component, event, helper){
        var searchNameValue = component.get("v.searchNameFilter");
        component.set("v.oldSearchNameFilter", searchNameValue);

        var action = component.get("c.getQuoteName1");
        action.setParams({
            searchNameValue: searchNameValue
        });
        action.setCallback(this, function (response) {
            var result = response.getReturnValue();
            console.log('result ===> ',{result});
            component.set("v.ProductNameList", result);
            component.set("v.displayNameList", true);
        });
        // component.set("v.displayNameList", false);
        $A.enqueueAction(action);
    }, 
    
    clearAccountSelectedValue : function(component, event, helper) {
        component.set("v.isAccount", true);
        component.set("v.selectedLookUpRecord", null);
        component.set("v.selectedLookUpRecordName", '');
    },

    closeSearchOption: function (component, event, helper){
        component.set("v.displayNameList", false);
    },
})