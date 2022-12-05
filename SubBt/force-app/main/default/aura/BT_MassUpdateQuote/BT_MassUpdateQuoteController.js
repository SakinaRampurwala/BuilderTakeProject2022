({
    doInit: function (component, event, helper) {
        
          var workspaceAPI = component.find("workspace");
        workspaceAPI.getEnclosingTabId().then((response) => {
            let opendTab = response.tabId;
            workspaceAPI.setTabLabel({
            tabId: opendTab,
            label: "Mass Add Line"
        });
        workspaceAPI.setTabIcon({
            tabId: opendTab,
            icon: 'custom:custom5',
            iconAlt: 'Mass Add Line'
        });
    });
        component.set('v.isLoading', true);
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        helper.getTableFieldSet(component, event, helper);
        window.setTimeout(
            $A.getCallback(function () {
                helper.getQuoteName(component, event, helper);
                helper.getTotalRecord(component, event, helper);
                helper.getTableRows(component, event, helper, pageNumber, pageSize);
                component.set('v.isLoading', false);
            }), 1000
        );

    },

    onAddClick: function (component, event, helper) {
        var fields = component.get('v.fieldSetValues');
      // alert( JSON.stringify(fields));
        var list = component.get('v.listOfRecords');
        
        
       // alert(JSON.stringify(obj));
       
       /* for (var i in fields) {
            obj[fields[i].name] = '';
           // alert('haiii'+obj[fields[i].name]);
        }*/
        for(var i=0 ;i<5;i++){
            var obj = {};
            for (var k in fields) {
				obj['Id'] = 'custom'+i                
                obj[fields[k].name] = '';
                // alert('haiii'+obj[fields[i].name]);
            }
            
            list.unshift(obj);
            
            //list.unshift(obj);
        }
        //list.unshift(obj);
        component.set('v.listOfRecords', list);
        
       // alert( JSON.stringify(list));
        
    },

    onMassUpdate: function (component, event, helper) {
      //  alert("1");
       // var listOfRecords = component.get('v.listOfRecords');
       // alert( JSON.stringify(listOfRecords));
        component.set('v.isLoading', true);
        if (!component.get('v.massUpdateEnable')) {
           // alert("2");
            component.set('v.massUpdateEnable', true);
           // alert("3");
            component.set('v.isLoading', false);
        } else if (component.get('v.massUpdateEnable')) {
            component.set('v.isLoading', true);
            component.set('v.massUpdateEnable', false);
          //  alert("4")
            helper.updateMassRecords(component, event, helper);
        }
    },

    onMassUpdateCancel: function (component, event, helper) {
        if (component.get('v.massUpdateEnable')) {
           // component.set('v.isCancelModalOpen', true);
            var workspaceAPI = component.find("workspace");
            workspaceAPI.getFocusedTabInfo().then(function (response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({
                    tabId: focusedTabId
                });
            }) 
         
            .catch(function (error) {
               // console.log(error);
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": component.get('v.recordId'),
                    "slideDevName": "related"
                });
                navEvt.fire();
            });
            $A.get("e.force:closeQuickAction").fire();
            window.setTimeout(
                $A.getCallback(function () {
                    $A.get('e.force:refreshView').fire();
                }), 1000
            );
        }
    },

    closeScreen: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function (response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({
                    tabId: focusedTabId
                    
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        $A.get("e.force:closeQuickAction").fire();
        window.setTimeout(
            $A.getCallback(function () {
                $A.get('e.force:refreshView').fire();
            }), 1000
        );

        // var workspaceAPI = component.find("workspace");
        // workspaceAPI.openTab({
        //     pageReference: {
        //         "type": "standard__recordPage",
        //         "attributes": {
        //             "recordId":component.get('v.recordId'),
        //             "actionName":"view"
        //         },
        //         "state": {}
        //     },
        //     focus: true
        // }).then(function(response) {
        //     workspaceAPI.getTabInfo({
        //         tabId: response
        // }).then(function(tabInfo) {
        //     console.log("The recordId for this tab is: " + tabInfo.recordId);
        // });
        // }).catch(function(error) {
        //     console.log(error);
        // });
    },

    closeCancelModal: function (component, event, helper) {
        component.set('v.isCancelModalOpen', false);
    },

    deleteRecord: function (component, event, helper) {
        var target = event.target;
        var index = target.getAttribute("data-index");
        var records = component.get('v.listOfRecords');
        if (records[index].Id != undefined) {
            component.set('v.selectedRecordIndex', index);
            component.set('v.quoteLineName', records[index].Name);
            component.set('v.isModalOpen', true);
        } else if (records[index].Id == undefined) {
            records.splice(index, 1);
            component.set('v.listOfRecords', records);
        }
    },
    deletequotelineRecord: function (component, event, helper) {
       /* var target = event.target;
        var index = target.getAttribute("data-index");
        var records = component.get('v.listOfRecords');
        if (records[index].Id != undefined) {
            component.set('v.selectedRecordIndex', index);
            component.set('v.quoteLineName', records[index].Name);
            component.set('v.isModalOpen', true);
        } else if (records[index].Id == undefined) {
            records.splice(index, 1);
            component.set('v.listOfRecords', records);
        }*/
        var dataAttr = event.currentTarget.dataset.recordid.split("_");
        var recordid = dataAttr[0]; 
        var recordList;
        if(JSON.parse(JSON.stringify(component.get("v.deleteQuoteLines"))).length){
            recordList = JSON.parse(JSON.stringify(component.get("v.deleteQuoteLines")));
        }else{
            recordList =[];
        }
        var quoteLines = component.get("v.listOfRecords");
        quoteLines.splice(Number(dataAttr[1]),1);
        if(recordid){
            recordList.push(recordid);
        }
        component.set("v.listOfRecords",quoteLines);
        component.set("v.deleteQuoteLines",recordList);
    },
    handleNext: function (component, event, helper) {
        component.set('v.isLoading', true);
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        pageNumber++;
        helper.getTableRows(component, event, helper, pageNumber, pageSize);
    },

    handlePrev: function (component, event, helper) {
        component.set('v.isLoading', true);
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        pageNumber--;
        helper.getTableRows(component, event, helper, pageNumber, pageSize);
    },

    handleCancel: function (component, event, helper) {
        component.set('v.isModalOpen', false);
    },

    handleDelete: function (component, event, helper) {
        var records = component.get('v.listOfRecords');
        var index = component.get('v.selectedRecordIndex');
        if (records[index].Id != undefined) {
            helper.delete(component, event, helper, records[index].Id);
            component.set('v.isModalOpen', false);
        }
    }, 

    reloadMethod: function (component, event, helper){
        console.log('************ reloadMethod ************');
        var action = component.get("c.getFieldSet");
        action.setCallback(this, function (response) {
            console.log('Field Set Values::', response.getReturnValue());
            var fieldSetObj = JSON.parse(response.getReturnValue());
            component.set("v.fieldSetValues", fieldSetObj);
        })
        $A.enqueueAction(action);
    }
})