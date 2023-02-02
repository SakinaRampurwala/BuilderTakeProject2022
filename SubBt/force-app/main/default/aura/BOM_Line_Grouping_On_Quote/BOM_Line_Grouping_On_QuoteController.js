({
    doInit: function(component, event, helper){
        // For Set Tab Name
        // var workspaceAPI = component.find("workspace");
        // workspaceAPI.getEnclosingTabId().then((response) => {
        //     let opendTab = response.tabId;
        //     workspaceAPI.setTabLabel({
        //         tabId: opendTab,
        //         label: "BOM Grouping On Quote"
        //     });
        //     workspaceAPI.setTabIcon({
        //         tabId: opendTab,
        //         icon: 'custom:custom5',
        //         iconAlt: 'BOM Grouping On Quote'
        //     });
        // });
        var groupFieldList = component.get("v.groupFieldList");
        if (groupFieldList[0] != undefined) {
            helper.getQuoteDataHelper(component, event, helper);
        }
    }
})