({
    doInit: function(component, event, helper) {
        helper.doInitHelper(component, event, helper);
    },

    selectCheck : function(component, event, helper){
        helper.selectAll(component, event, helper);
    },

    closeModal: function(component, event, helper) {
        // $A.get("e.force:closeQuickAction").fire();
        component.set("v.openPOBox", fallse);
    },

    updateSelectedText: function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        console.log('selectedRows-->>',{selectedRows});
        var selectedRowList = component.get("v.listOfSelectedIds")
        console.log('selectedRowList--->',{selectedRowList});
        var selectedRowList = component.get("v.listOfSelectedIds")
        var NewselectedRows = [];
        for (var i = 0; i < selectedRows.length; i++) {
            if (selectedRowList.indexOf(selectedRows[i].Id) < 0) {
                selectedRowList.push(selectedRows[i].Id)

            } else {
                console.log("yes")
            }
            NewselectedRows.push(selectedRows[i].Id);
        }
    },

    closeBox2: function(component, event, helper) {
        component.set("v.data1", [])
        component.set("v.selectedRows", "");
        component.set("v.data2", "");
        component.set("v.data2", []);
        component.set("v.listOfSelectedIds", []);
        component.set("v.openPOLineBox", false);
    },

    cancelBox: function(component, event, helper) {
        var abc = component.get("v.listOfSelectedIds");
        component.set("v.openPOLineBox", false);
    },

    openPOLineModel: function(component, event, helper) {
        component.set("v.openPOBox", false);
        console.log('Next');
        component.set("v.Spinner", true);
        var listid = component.get("v.listOfSelectedIds");
        console.log("List of selected Id when click next : ", listid)

        if (listid.length > 0 && listid != undefined && listid != "") {
            component.set("v.openPOLineBox", true);
            console.log('In If');
            component.set("v.Spinner", false);
        }
        else {
            component.set("v.Spinner", false);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select at least one Product.',
                duration: ' 5000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },
})