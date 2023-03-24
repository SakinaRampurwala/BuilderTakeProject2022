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
        helper.fetchpricebooks(component, event, helper);
        window.setTimeout(
            $A.getCallback(function () {
                helper.getTableRows(component, event, helper, pageNumber, pageSize);
                component.set('v.isLoading', false);
                component.set("v.listofproductfamily", '');
                var list = component.get('v.listOfRecords');
                var obj = {
                    "productfamily": '',
                    "pricebookName" : '',
                    "product": {
                        "Id":'',
                        "Name":''
                    },
                    "newBudgetLine" : {},
                    "UOMvalues" : '',
                    "Vendor" : {},
                };
                // list.unshift(obj);
                for(var i=0;i<5;i++){
                    list.push(obj);
                }
                component.set('v.listOfRecords', list);
                
            }), 1000
        );
        var btadminaction = component.get("c.getadminvalues");
        btadminaction.setCallback(this, function(response) {
            console.log(response.getState());
            console.log(response.getReturnValue());
            console.log('admnvalues');

            if (response.getState() === 'SUCCESS') {
                var result = response.getReturnValue();
                console.log({result});
                console.log(response.getState());
                console.log(response.getError());


                if (response.getState() === 'SUCCESS') {
                    var result = response.getReturnValue();
                   
                    component.set('v.removeSingleQuoteLineOption', result[0]);
                    component.set('v.hideGlobalMargin', result[1]);
                    component.set('v.hideGlobalMarkup', result[2]);


                }
            }

        });
        $A.enqueueAction(btadminaction);

    },

    onAddClick: function (component, event, helper) {
        var fields = component.get('v.fieldSetValues');
        var list = component.get('v.listOfRecords');
        var obj = {};
        var obj = {
           "productfamily": '',
           "pricebookName" : '',
           "product": {
               "Id":'',
               "Name":''
           },
           "newQuoteLine" : {},
           
        };
      
        for (var i = 0; i < 5; i++) {
            list.push(obj);
        }
        component.set('v.listOfRecords', list);
        
    },

    onMassUpdate: function (component, event, helper) {
        component.set('v.isLoading', true);
        helper.updateMassRecords(component, event, helper);

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
    },
    handleChildBudgetLineEvent : function (component, event, helper) {
        console.log('=======handleChildBudgetLineEvent======');
        // var isdelete = JSON.parse(JSON.stringify(event.getParam("isdelete")));
        // console.log({isdelete});
        // if(!isdelete){
        //     var valueFromChild = JSON.parse(JSON.stringify(event.getParam("message")));
            
        //     var listRecord = component.get("v.DuplistOfRecords");
        //     if(listRecord.length){
        //         if(listRecord[valueFromChild.index]){
        //             listRecord[valueFromChild.index] = valueFromChild;
        //         }else{
        //             listRecord.push(valueFromChild);
        //         }
        //     }else{
        //         listRecord.push(valueFromChild)
        //     }
        // }else if(isdelete){
        //     var valueFromChild = JSON.parse(JSON.stringify(event.getParam("message")));
        //     var listRecord = component.get("v.listOfRecords");
        //     listRecord.splice(valueFromChild.index, 1);
        //     component.set("v.listOfRecords",listRecord);
        // }
        
        
       	//component.set("v.listOfRecords",listRecord);
        // console.log(JSON.parse(JSON.stringify(listRecord)));
        // component.set("v.DuplistOfRecords",listRecord);
        // console.log(component.get("v.DuplistOfRecords"));

        

        //component.set("v.enteredValue", valueFromChild);


        var data = event.getParam("message");
        console.log("data ==> ",{data});
    },
})