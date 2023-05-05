({
    doInit : function(component, event, helper) {
        component.set("v.isLoading", true);
        var recordId = component.get("v.recordId");
        console.log('recordId: ' + recordId);
        helper.nameTheTab(component, event, helper);
        helper.createBudgetItemWrapperList(component, event, helper);
        helper.getBudgetLineGroups(component, event, helper);
        helper.getAccounts(component, event, helper);
        var action = component.get("c.getpricebooks");
        action.setParams({
            "recordId" : recordId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                // component.set("v.isLoading", false);
                var pricebookList = response.getReturnValue();
                console.log('pricebooks: ', pricebookList); 
                var pricebookOptions = [];
                pricebookOptions.push({
                    label: 'None',
                    value: ''
                });
                for(var i = 0; i < pricebookList[0].priceWrapList.length; i++) {
                    pricebookOptions.push({
                        label: pricebookList[0].priceWrapList[i].Name,
                        value: pricebookList[0].priceWrapList[i].Id
                    });
                }
                console.log('pricebookOptions: ', pricebookOptions);
                component.set("v.pricebookOptions", pricebookOptions);
                component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);


    },

    getFamily : function(component, event, helper) {
        component.set("v.isLoading", true);
        var index = event.getSource().get("v.name");
        console.log('index: ', index);
        var priceBookId = component.get("v.budgetLineWrapperList")[index].pricebookEntryId;
        if(priceBookId != '') {
            helper.getFamily(component, event, helper, priceBookId, index);
        }else{
            var budgetlineWrapperList = component.get("v.budgetLineWrapperList");
            budgetlineWrapperList[index].productFamilyList = [
                {
                    label : 'Please Select Pricebook',
                    value : ''
                }
            ];
            budgetlineWrapperList[index].productOptionList = [
                {
                    label: 'Please Select Pricebook',
                    value: ''
                }
            ];
            budgetlineWrapperList[index].ProductList = [];
            budgetlineWrapperList[index].BudgetLine = {
                buildertek__Budget__c : component.get("v.recordId"),
                buildertek__Product__c : '',
                Name : '',
                buildertek__Grouping__c : '',
                buildertek__Quantity__c : '',
                buildertek__UOM__c : '',
                buildertek__Vendor__c : '',
                buildertek__Unit_Cost__c : '',
            };
            component.set("v.budgetLineWrapperList", budgetlineWrapperList);
            component.set("v.isLoading", false);       
        }
    },

    getProduct : function(component, event, helper) {
        component.set("v.isLoading", true);
        var budgetlineWrapperList = component.get("v.budgetLineWrapperList");
        var index = event.getSource().get("v.name");
        var family = budgetlineWrapperList[index].productFamily;
        console.log('family: ', family);
        if(family!=''){
            helper.getProduct(component, event, helper, family, index);
        }else{
            console.log('family is empty');
            var productList = budgetlineWrapperList[index].ProductList;
            var productOptionList =[
                {
                    label: 'Please Select Product',
                    value: ''
                }
            ];
            for(var i = 0; i < productList.length; i++) {
                productOptionList.push({
                    label: productList[i].Name,
                    value: productList[i].Id
                });
            }
            budgetlineWrapperList[index].productOptionList = productOptionList;
            budgetlineWrapperList[index].BudgetLine = {
                buildertek__Budget__c : component.get("v.recordId"),
                buildertek__Product__c : '',
                Name : '',
                buildertek__Grouping__c : '',
                buildertek__Quantity__c : '',
                buildertek__UOM__c : '',
                buildertek__Vendor__c : '',
                buildertek__Unit_Cost__c : '',
            }
            component.set("v.budgetLineWrapperList", budgetlineWrapperList);
            component.set("v.isLoading", false);
        }


    },

    gotProduct : function(component, event, helper) {
        component.set("v.isLoading", true);
        var index = event.getSource().get("v.name");
        var productId = component.get("v.budgetLineWrapperList")[index].productId;
        if(productId != '') {
            helper.gotProduct(component, event, helper, productId, index);
        }else{
            var budgetlineWrapperList = component.get("v.budgetLineWrapperList");
            budgetlineWrapperList[index].BudgetLine = {
                buildertek__Budget__c : component.get("v.recordId"),
                buildertek__Product__c : '',
                Name : '',
                buildertek__Grouping__c : '',
                buildertek__Quantity__c : '',
                buildertek__UOM__c : '',
                buildertek__Vendor__c : '',
                buildertek__Unit_Cost__c : '',
            };
            component.set("v.budgetLineWrapperList", budgetlineWrapperList);
            component.set("v.isLoading", false);
        }
    },

    onCancel : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getEnclosingTabId().then((response) => {
            let opendTab = response.tabId;
            workspaceAPI.closeTab({tabId: opendTab});
        });
    },

    onAddClick : function(component, event, helper) {
        var budgetLineWrapperList = component.get("v.budgetLineWrapperList");
        for(var i = 0; i < 5; i++) {
            let budgetLineWrapper = helper.createBudgetLineWrapper(component, event, helper);
            budgetLineWrapperList.push(budgetLineWrapper);
        }
        component.set("v.budgetLineWrapperList", budgetLineWrapperList);
    },

    deleteRow : function(component, event, helper) {
        var index = event.target.getAttribute('data-index');
        var budgetLineWrapperList = component.get("v.budgetLineWrapperList");
        budgetLineWrapperList.splice(index, 1);
        component.set("v.budgetLineWrapperList", budgetLineWrapperList);
    },

    onMassUpdate : function(component, event, helper) {
        component.set("v.isLoading", true);
        var budgetLineWrapperList = component.get("v.budgetLineWrapperList");
        var budgetLineList = [];
        for(var i = 0; i < budgetLineWrapperList.length; i++) {
            if(budgetLineWrapperList[i].BudgetLine.Name != '') {
                budgetLineList.push(budgetLineWrapperList[i].BudgetLine);
            }
        }
        if(budgetLineList.length > 0) {
            helper.saveBudgetLine(component, event, helper, budgetLineList);
        }else{
            component.set("v.isLoading", false);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please enter atleast one BudgetLine.',
                duration: ' 5000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }

    },

})