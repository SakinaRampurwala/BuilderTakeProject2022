({
    getQuoteName: function (component, event, helper) {
      //  alert("Hello");
        var action = component.get("c.getName");
        action.setParams({
            recordId: component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            component.set('v.recordName', response.getReturnValue());
        })
        $A.enqueueAction(action);
    },
    
    getTableFieldSet: function (component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setCallback(this, function (response) {
            console.log('Field Set Values::', response.getReturnValue());
            var fieldSetObj = JSON.parse(response.getReturnValue());
            component.set("v.fieldSetValues", fieldSetObj);
        })
        $A.enqueueAction(action);
    },
    getTotalRecord: function (component, event, helper) {
        // debugger;
        var action = component.get("c.getCount");
        action.setParams({
            recordId: component.get('v.recordId'),
        });
        action.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
                // debugger;
                component.set("v.TotalRecords", response.getReturnValue());
                console.log('Total record',response.getReturnValue());
            }
        })
        $A.enqueueAction(action);
    },
    
    getTableRows: function (component, event, helper ,pageNumber, pageSize) {
        // debugger;
        var action = component.get("c.getRecords");
        var fieldSetValues = component.get("v.fieldSetValues");
        var setfieldNames = new Set();
        
        for (var c = 0, clang = fieldSetValues.length; c < clang; c++) {
            if (!setfieldNames.has(fieldSetValues[c].name)) {
                setfieldNames.add(fieldSetValues[c].name);
                if (fieldSetValues[c].type == 'REFERENCE') {
                    if (fieldSetValues[c].name.indexOf('__c') == -1) {
                        setfieldNames.add(fieldSetValues[c].name.substring(0, fieldSetValues[c].name.indexOf('Id')) + '.Name');
                    } else {
                        setfieldNames.add(fieldSetValues[c].name.substring(0, fieldSetValues[c].name.indexOf('__c')) + '__r.Name');
                    }
                }
            }
        }
        
        var arrfieldNames = [];
        setfieldNames.forEach(v => arrfieldNames.push(v));
        component.set('v.arrfieldNames', arrfieldNames);
        console.log('Record Id::', component.get('v.recordId'));
        console.log('Arr Field Name::', JSON.stringify(arrfieldNames));
        action.setParams({
            parentRecordId: component.get("v.recordId"),
            fieldNameJson: JSON.stringify(arrfieldNames),
            pageNumber: pageNumber,
            pageSize: pageSize
        });
        action.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
                var list = JSON.parse(response.getReturnValue());
                if (list.length > 0) {
                    /* -----comment --
                    console.log('Records::', response.getReturnValue());
                    component.set("v.listOfRecords", []);
                    component.set("v.cloneListOfRecords", list);
                    component.set('v.numberOfItems', list.length);
                    component.set("v.PageNumber", pageNumber);
                    component.set("v.RecordStart", (pageNumber - 1) * pageSize + 1);
                    component.set("v.RecordEnd", (list.length + 3) * pageNumber);
                    component.set("v.TotalPages", Math.ceil(list.length / component.get('v.TotalRecords')));
                    if (component.get('v.TotalRecords') < pageNumber * pageSize) {
                        component.set("v.isNextDisabled", true);
                    } else {
                        component.set("v.isNextDisabled", false);
                    }
                    
                     ----- comment ------*/
                     component.set("v.listOfRecords", []);
                    component.set("v.cloneListOfRecords", []);
                    component.set('v.numberOfItems', 0);
                    component.set("v.PageNumber", 1);
                    component.set("v.RecordStart", 0);
                    component.set("v.RecordEnd", 0);
                    component.set("v.TotalPages", 0);
                    component.set("v.isNextVisible", true);
                    component.set('v.isLoading', false);
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
                
                }else {
                    component.set("v.listOfRecords", []);
                    component.set("v.cloneListOfRecords", []);
                    component.set('v.numberOfItems', 0);
                    component.set("v.PageNumber", 1);
                    component.set("v.RecordStart", 0);
                    component.set("v.RecordEnd", 0);
                    component.set("v.TotalPages", 0);
                    component.set("v.isNextVisible", true);
                    component.set('v.isLoading', false);
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
                }
            }
            else {
                component.set("v.listOfRecords", []);
                component.set("v.cloneListOfRecords", []);
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
            }
            
            component.set('v.isLoading', false);
        })
        $A.enqueueAction(action);
    },
    
    // getToDoFieldSet: function (component, event, helper, recordId) {
    //     var action = component.get("c.getFieldsFromFieldSet");
    //     action.setCallback(this, function (response) {
    //         var state = response.getState();
    //         if (state === "SUCCESS") {
    //             var fieldsStr = response.getReturnValue();
    //             var fields = JSON.parse(fieldsStr);
    //             component.set("v.fields", fields);
    //         } else {
    //             console.log('Error');
    //         }
    //     });
    //     $A.enqueueAction(action);
    // },
    
    
    updateMassRecords: function (component, event, helper) {
        
        // debugger;
        component.set('v.isLoading', true);
        var listOfRecords = component.get('v.listOfRecords');
       // alert( JSON.stringify(listOfRecords));
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        var deleteLines = component.get("v.deleteQuoteLines");
        var action = component.get("c.updateRecords");
        for (var i in listOfRecords) {
            var obj = listOfRecords[i];
           /* if (obj.Id == undefined) {
                obj.buildertek__Quote__c = component.get('v.recordId');
            }*/
            if (obj.Id.includes('custom')) {
                var key = "Id";
                delete obj[key]; 
               
                obj.buildertek__Quote__c = component.get('v.recordId');
            }
        }
        action.setParams({
            recordId: component.get('v.recordId'),
            updatedRecords: JSON.stringify(listOfRecords),
            fieldSetName: JSON.stringify(component.get('v.arrfieldNames')),
            pageNumber: pageNumber,
            pageSize: pageSize,
            deleteLineitems : JSON.parse(JSON.stringify(deleteLines))
        });
        
        action.setCallback(this, function (response) {
            // debugger;
            var state = response.getState();
            if (state === "SUCCESS") {
                var list = JSON.parse(response.getReturnValue());
                console.log('Save List :::',list);
                console.log('Save list.length :::',list.length);
                component.set('v.listOfRecords', list);
                component.set('v.numberOfItems', list.length);
                component.set('v.cloneListOfRecords', list);
                component.set("v.PageNumber", pageNumber);
                component.set("v.RecordStart", (pageNumber - 1) * pageSize + 1);
                component.set("v.RecordEnd", (list.length + 3) * pageNumber);
                component.set("v.TotalPages", Math.ceil(list.length / component.get('v.TotalRecords')));
                component.set('v.isLoading', false);
            } else if (state === "ERROR") {
                component.set('v.isLoading', false);
                console.log('A Problem Occurred: ' + JSON.stringify(response.error));
            }
        });
        $A.enqueueAction(action);
    },

    delete: function (component, event, helper, recordId) {
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        var action = component.get("c.deleteQuoteItem");
        action.setParams({
            quoteId: component.get('v.recordId'),
            recordId: recordId,
            fieldSetName: JSON.stringify(component.get('v.arrfieldNames')),
            pageNumber: pageNumber,
            pageSize: pageSize
        });

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var list = JSON.parse(response.getReturnValue());
                component.set('v.listOfRecords', list);
                component.set('v.numberOfItems', list.length);
                component.set('v.cloneListOfRecords', list);
                component.set("v.PageNumber", pageNumber);
                component.set("v.RecordStart", (pageNumber - 1) * pageSize + 1);
                component.set("v.RecordEnd", (list.length + 3) * pageNumber);
                component.set("v.TotalPages", Math.ceil(list.length / component.get('v.TotalRecords')));
                component.set('v.isLoading', false);
            } else if (state === "ERROR") {
                component.set('v.isLoading', false);
                console.log('A Problem Occurred: ' + JSON.stringify(response.error));
            }
        });
        $A.enqueueAction(action);
    },
})