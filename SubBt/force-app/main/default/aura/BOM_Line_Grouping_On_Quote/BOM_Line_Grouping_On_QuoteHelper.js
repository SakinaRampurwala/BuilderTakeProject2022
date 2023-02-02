({
    getQuoteDataHelper : function(component, event, helper) {
        console.log('*** getQuoteDataHelper ***');
        component.set("v.Spinner", true);
        var page = component.get("v.page") || 1
        var groupFieldList = component.get("v.groupFieldList");
        if (groupFieldList[1] != undefined) {
            component.set("v.secondGrouping", true);
        }
        if (groupFieldList[2] != undefined) {
            component.set("v.thirdGrouping", true);
        }
        if (groupFieldList[3] != undefined) {
            component.set("v.forthGrouping", true);
        }
        var action = component.get("c.getQuoteData");
        action.setParams({
            quoteId: component.get("v.recordId"),
            pageNumber: page,   // It's for future use, currnetly it's not in used
            recordToDisply: 50, // It's for future use, currnetly it's not in used
            groupingList: groupFieldList
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var quoteLineWrapper = response.getReturnValue();
                console.log('*** Quote Wrapper Data ***');
                console.log('Quote Wrapper Data => ',{ quoteLineWrapper });
                var quoteLineList = quoteLineWrapper.quoteLineList;
                component.set("v.totalColumn", quoteLineWrapper.columns.length);
                if (quoteLineList.length > 0) {
                    quoteLineList.forEach(element => {
                        var quoteLineFieldData = []
                        quoteLineWrapper.columns.forEach(ele => {
                            var FieldData = {fieldName: ele.fieldName, fieldType: ele.type, fieldValue: element[ele.fieldName]}
                            quoteLineFieldData.push(FieldData);
                        });
                        element.FieldDataList = quoteLineFieldData;
                        if (element.buildertek__Build_Phase__c != undefined) {
                            element.buildertek__Build_Phase__c = element.buildertek__Build_Phase__r.Name;
                        }
                    });
                    var group1Wrapper = [];
                    var group1Value = quoteLineList[0][groupFieldList[0]];
                    var quoteLines1 = [];
                    quoteLineList.forEach((element, index) => {
                        if (group1Value == element[groupFieldList[0]]) {
                            quoteLines1.push(element);
                            if (quoteLineList.length == index+1) {
                                if (groupFieldList[1] != undefined) {
                                    quoteLines1 = helper.addSecondGrouping(component, helper, quoteLines1, groupFieldList);
                                }
                                var wrapperData = {groupName : group1Value, quoteLineList: quoteLines1}
                                group1Wrapper.push(wrapperData);
                            }
                        } else{
                            if (groupFieldList[1] != undefined){
                                quoteLines1 = helper.addSecondGrouping(component, helper, quoteLines1, groupFieldList);
                            }
                            var wrapperData = {groupName : group1Value, quoteLineList: quoteLines1}
                            group1Wrapper.push(wrapperData);

                            quoteLines1 = [];
                            group1Value = element[groupFieldList[0]]
                            quoteLines1.push(element);
                        }
                    });
                    quoteLineWrapper.groupWrapper = group1Wrapper;
                    component.set("v.QuoteLineWrapper", quoteLineWrapper);
                    component.set("v.Spinner", false);
                }
            } else{
                var error = response.getError();
                console.log('Error => ',{error});
                component.set("v.Spinner", false);
            }                
        });
        $A.enqueueAction(action);
    }, 

    addSecondGrouping : function(component, helper, quoteLines1, groupFieldList){
        var group2Wrapper = [];
        if (quoteLines1.length > 0) {
            var group2Value = quoteLines1[0][groupFieldList[1]];
            var quoteLines2 = [];
            quoteLines1.forEach((element, index) => {
                if (group2Value == element[groupFieldList[1]]){
                    quoteLines2.push(element);
                    if (quoteLines1.length == index+1){
                        if (groupFieldList[2] != undefined) {
                            quoteLines2 = helper.addThirdGrouping(component, helper, quoteLines2, groupFieldList);
                        }
                        var wrapperData = {groupName : group2Value, quoteLineList: quoteLines2}
                        group2Wrapper.push(wrapperData);
                    }
                } else{
                    if (groupFieldList[2] != undefined) {
                        quoteLines2 = helper.addThirdGrouping(component, helper, quoteLines2, groupFieldList);
                    }
                    var wrapperData = {groupName : group2Value, quoteLineList: quoteLines2}
                    group2Wrapper.push(wrapperData);

                    quoteLines2 = [];
                    group2Value = element[groupFieldList[1]]
                    quoteLines2.push(element);
                }
            });
            return group2Wrapper;
        }
    },

    addThirdGrouping : function(component, helper, quoteLines2, groupFieldList){
        var group3Wrapper = [];
        if (quoteLines2.length > 0) {
            var group3Value = quoteLines2[0][groupFieldList[2]];
            var quoteLines3 = [];
            quoteLines2.forEach((element, index) => {
                if (group3Value == element[groupFieldList[2]]){
                    quoteLines3.push(element);
                    if (quoteLines2.length == index+1){
                        if (groupFieldList[3] != undefined) {
                            quoteLines3 = helper.addFourthGrouping(component, helper, quoteLines3, groupFieldList);
                        }
                        var wrapperData = {groupName : group3Value, quoteLineList: quoteLines3}
                        group3Wrapper.push(wrapperData);
                    }
                } else{
                    if (groupFieldList[3] != undefined) {
                        quoteLines3 = helper.addFourthGrouping(component, helper, quoteLines3, groupFieldList);
                    }
                    var wrapperData = {groupName : group3Value, quoteLineList: quoteLines3}
                    group3Wrapper.push(wrapperData);

                    quoteLines3 = [];
                    group3Value = element[groupFieldList[2]]
                    quoteLines3.push(element);
                }
            });
            return group3Wrapper;
        }
    }, 

    addFourthGrouping : function(component, helper, quoteLines3, groupFieldList){
        var group4Wrapper = [];
        if (quoteLines3.length > 0) {
            var group4Value = quoteLines3[0][groupFieldList[3]];
            var quoteLines4 = [];
            quoteLines3.forEach((element, index) => {
                if (group4Value == element[groupFieldList[3]]){
                    quoteLines4.push(element);
                    if (quoteLines3.length == index+1){
                        var wrapperData = {groupName : group4Value, quoteLineList: quoteLines4}
                        group4Wrapper.push(wrapperData);
                    }
                } else{
                    var wrapperData = {groupName : group4Value, quoteLineList: quoteLines4}
                    group4Wrapper.push(wrapperData);

                    quoteLines4 = [];
                    group4Value = element[groupFieldList[3]]
                    quoteLines4.push(element);
                }
            });
            return group4Wrapper;
        }
    }
})