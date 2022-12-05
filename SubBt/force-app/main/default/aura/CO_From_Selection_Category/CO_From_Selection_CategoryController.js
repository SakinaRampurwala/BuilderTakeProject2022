({
    doInit: function(component, event, helper){
        helper.doInitHelper(component, event, helper);
    },

    updateSelectedText: function (component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        console.log('selectedRows => ', {selectedRows});
        component.set("v.selectedRowList", selectedRows);
    },

    createRecord: function(component, event, helper){
        helper.createRecord(component, event, helper);
    },

    closeModal: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    }
})