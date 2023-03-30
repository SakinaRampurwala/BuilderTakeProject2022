({
    doInit: function (component, event, helper) {
        component.set('v.isLoading', true);
        helper.getTableFieldSet(component, event, helper);
        helper.getAdminValues(component, event, helper);
        helper.nameTheTab(component, event, helper);
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        helper.createQuoteLineWrapperList(component, event, helper);
        var action = component.get("c.getpricebooks");
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var pricebookList = response.getReturnValue();
                var pricebookOptions = [];
                pricebookOptions.push({
                    label : 'None',
                    value : '',
                })
                for(var key in pricebookList){
                    pricebookOptions.push({
                        label : key,
                        value : pricebookList[key],
                    })
                }
                console.log('pricebookOptions',pricebookOptions);
                component.set("v.pricebookOptions",pricebookOptions);
                component.set('v.isLoading', false);

            }
        });
        $A.enqueueAction(action);
    },

    getFamily : function(component, event, helper) {
        console.log('getFamily');
        console.log('event',event.getSource());
        console.log('event',event.getSource().get("v.value"));
        console.log('Index => '+event.getSource().get("v.name"));
        var quoteLineWrapperList = component.get("v.quoteLineWrapperList");
        console.log('quoteLineWrapperList',quoteLineWrapperList);

    },

    onAddClick: function (component, event, helper) {
        var fields = component.get('v.fieldSetValues');
        var list = component.get('v.listOfRecords');
        for(var i=0 ;i<5;i++){
            var obj = {};
            for (var k in fields) {
				obj['Id'] = 'custom'+i                
                obj[fields[k].name] = '';
            }
            list.unshift(obj);
        }
        component.set('v.listOfRecords', list);
    },

    onMassUpdate: function (component, event, helper) {
        component.set('v.isLoading', true);
        if (!component.get('v.massUpdateEnable')) {
            component.set('v.massUpdateEnable', true);
            component.set('v.isLoading', false);
        } else if (component.get('v.massUpdateEnable')) {
            component.set('v.isLoading', true);
            component.set('v.massUpdateEnable', false);
            helper.updateMassRecords(component, event, helper);
        }
    },

    onMassUpdateCancel: function (component, event, helper) {
        if (component.get('v.massUpdateEnable')) {
            var workspaceAPI = component.find("workspace");
            workspaceAPI.getFocusedTabInfo().then(function (response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({
                    tabId: focusedTabId
                });
            }) 
         
            .catch(function (error) {
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
    }
})