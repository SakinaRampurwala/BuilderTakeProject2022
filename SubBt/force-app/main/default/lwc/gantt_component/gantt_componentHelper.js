// import insertUpdateTask from '@salesforce/apex/BT_NewGanttChartCls.insertUpdateTask';
// import {
//     ShowToastEvent
// } from "lightning/platformShowToastEvent";

function formatApexDatatoJSData(scheduleData, scheduleItemsData, scheduleItemsDataList) {
    var taskData = scheduleItemsData;
    var taskDependencyData = [];
    var resourceRowData = [];
    var resourceRowIdList = []
    var assignmentRowData= [];
    var scheduleItemIdsList = [];
    var rows = [];
    var formattedData = {}

    var taskListForPhase = scheduleItemsDataList;
    var firstRowDup = {};
    console.log('taskListForPhase :- ' + JSON.stringify(taskListForPhase));
    firstRowDup["id"] = scheduleData.Id;
    firstRowDup["name"] = scheduleData.Name
    firstRowDup["startDate"] = ""
    firstRowDup["expanded"] = true
    firstRowDup["type"] = 'Project'
    firstRowDup['customtype'] = 'Project'
    firstRowDup["endDate"] = ""
    firstRowDup["children"] = []
    firstRowDup["constraintType"] = 'none'
    var newPhaseFlag = true;
    var taskWithphaseList = [];
    var taskPhaseRow;
    var phIndex = -1;
    for(var i=0;i<taskListForPhase.length;i++){
        if(taskListForPhase[i].buildertek__Phase__c && taskPhaseRow){
            console.log('method 1 in helper');

            if(taskPhaseRow['name'] != taskListForPhase[i].buildertek__Phase__c){
                phIndex = phIndex+1;
                taskPhaseRow = {}
                taskPhaseRow["type"] = 'Phase'

                taskPhaseRow["id"] = taskListForPhase[i].buildertek__Schedule__c+"_"+taskListForPhase[i].buildertek__Phase__c
                taskPhaseRow["name"] = taskListForPhase[i].buildertek__Phase__c

                taskPhaseRow["startDate"] = ""
                taskPhaseRow["expanded"] = true
                taskPhaseRow["Contractor"] = 'test'
                taskPhaseRow["endDate"] = ""
                taskPhaseRow["children"] = []
                taskPhaseRow["customtype"] = 'Phase'

                taskPhaseRow["constraintType"] = 'none'
                newPhaseFlag = false;
            }
            var rowChilObj = {};
            rowChilObj["type"] = 'Task'
            rowChilObj["customtype"] = taskListForPhase[i].buildertek__Type__c
                if(taskListForPhase[i].buildertek__Type__c == 'Milestone'){
                rowChilObj["cls"] = 'milestoneTypeColor'
            }
            rowChilObj["iconCls"] = "b-fa b-fa-arrow-right"
            rowChilObj["indentVal"] = taskListForPhase[i].buildertek__Indent_Task__c;
                if(taskListForPhase[i].buildertek__Indent_Task__c){
                rowChilObj["iconCls"] = "b-fa b-fa-arrow-left indentTrue"

            }
            rowChilObj['phase'] = taskListForPhase[i].buildertek__Phase__c


                if(taskListForPhase[i].buildertek__Dependency__c){
                rowChilObj["constraintType"] = ''
                }else{
                rowChilObj["constraintType"] = 'startnoearlierthan'
            }

                if(scheduleItemIdsList.indexOf(taskListForPhase[i].Id) < 0){
                scheduleItemIdsList.push(taskListForPhase[i].Id)
            }
            rowChilObj["id"] = taskListForPhase[i].Id
            rowChilObj["name"] = taskListForPhase[i].Name
            rowChilObj["percentDone"] = taskListForPhase[i].buildertek__Completion__c
            rowChilObj["startDate"] = taskListForPhase[i].buildertek__Start__c
            rowChilObj['predecessor'] = taskListForPhase[i].buildertek__Dependency__c;

            if (taskListForPhase[i].hasOwnProperty('buildertek__Dependency__c') == true) {
                rowChilObj['predecessorName'] = taskListForPhase[i].buildertek__Dependency__r.Name;
            } else {
                rowChilObj['predecessorName'] = '';
            }

            rowChilObj['internalresource'] = taskListForPhase[i].buildertek__Resource__c;

                if(taskListForPhase[i].buildertek__Resource__c){
                rowChilObj['internalresourcename'] = taskListForPhase[i].buildertek__Resource__r.Name;
                }else{
                rowChilObj['internalresourcename'] = '';
            }

            rowChilObj['contractorresource'] = taskListForPhase[i].buildertek__Contractor_Resource__c;

                if(taskListForPhase[i].buildertek__Contractor_Resource__c){
                rowChilObj['contractorresourcename'] = taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
                }else{
                rowChilObj['contractorresourcename'] = '';
            }
            rowChilObj['contractoracc'] = taskListForPhase[i].buildertek__Contractor__c;

                if(taskListForPhase[i].buildertek__Contractor__c){
                    rowChilObj["contractorname"] = taskListForPhase[i].buildertek__Contractor__r.Name;  //Added for contractor
                }else{
                rowChilObj["contractorname"] = '';
            }

            rowChilObj['notes'] = taskListForPhase[i].buildertek__Notes__c;
                if(taskListForPhase[i].buildertek__Lag__c != undefined && taskListForPhase[i].buildertek__Lag__c != null && taskListForPhase[i].buildertek__Lag__c != 0){
                    var startDate = new Date(taskListForPhase[i].buildertek__Start__c);
                    rowChilObj["startDate"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0)
                }
            rowChilObj["duration"] = taskListForPhase[i].buildertek__Duration__c

                if(taskListForPhase[i].buildertek__Milestone__c){
                rowChilObj["duration"] = 0
                rowChilObj["durationMile"] = taskListForPhase[i].buildertek__Duration__c;
                rowChilObj["cls"] = 'milestoneCompleteColor'
                rowChilObj['orgmilestone'] = taskListForPhase[i].buildertek__Milestone__c;
            }
            rowChilObj["expanded"] = true
            rowChilObj["order"] = taskListForPhase[i].buildertek__Order__c
            var dependencyRow = {};
                if(taskListForPhase[i].buildertek__Dependency__c){
                    dependencyRow["id" ]  = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Dependency__c
                dependencyRow["fromTask"] = taskListForPhase[i].buildertek__Dependency__c
                    dependencyRow["toTask"]  = taskListForPhase[i].Id
                    dependencyRow["lag"]  = taskListForPhase[i].buildertek__Lag__c
                taskDependencyData.push(dependencyRow)
            }


                if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Resource__c){
                    if(resourceRowIdList.indexOf(taskListForPhase[i].buildertek__Resource__c) < 0){
                    var resourceRow = {}
                    resourceRow['id'] = taskListForPhase[i].buildertek__Resource__c;
                    resourceRow['name'] = taskListForPhase[i].buildertek__Resource__r.Name;
                    resourceRow['calendar'] = "general";
                    resourceRowData.push(resourceRow)
                    resourceRowIdList.push(taskListForPhase[i].buildertek__Resource__c)
                }

            }
                if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Contractor_Resource__c){

                    if(resourceRowIdList.indexOf(taskListForPhase[i].buildertek__Contractor_Resource__c) < 0){
                    var resourceRow = {}
                    resourceRow['id'] = taskListForPhase[i].buildertek__Contractor_Resource__c
                    resourceRow['name'] = taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
                    resourceRow['calendar'] = "general";
                    resourceRowData.push(resourceRow)
                    resourceRowIdList.push(resourceRow['id'])
                }
            }


                if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Resource__c){
                var assignmentRow = {}
                    assignmentRow['id'] = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Resource__c+'__index_'+i+'Resource_Name'+taskListForPhase[i].buildertek__Resource__r.Name;
                assignmentRow['event'] = taskListForPhase[i].Id
                assignmentRow['resource'] = taskListForPhase[i].buildertek__Resource__c;
                assignmentRowData.push(assignmentRow)
            }
                if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Contractor_Resource__c){
                var assignmentRow = {}
                    assignmentRow['id'] = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Contractor_Resource__c+'__index'+i+'ContractorResource_Name'+taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
                assignmentRow['event'] = taskListForPhase[i].Id
                assignmentRow['resource'] = taskListForPhase[i].buildertek__Contractor_Resource__c;
                assignmentRowData.push(assignmentRow)
            }
            taskPhaseRow["children"].push(rowChilObj);

            var found = false;
            if(firstRowDup['children'].length){
                for(var k=0;k<firstRowDup['children'].length;k++){
                    if(firstRowDup['children'][k].id == taskPhaseRow['id']){
                        firstRowDup['children'][k] = taskPhaseRow
                        found = true
                    }
                }
            }else{
                firstRowDup['children'].push(taskPhaseRow);
                found = true
            }
            if(!found){
                firstRowDup['children'].push(taskPhaseRow);
            }
        }else if(taskListForPhase[i].buildertek__Phase__c && !taskPhaseRow){
            console.log('method 2 in helper');

            taskPhaseRow = {};
            phIndex = phIndex+1;
            taskPhaseRow["type"] = 'Phase'
            taskPhaseRow["id"] = taskListForPhase[i].buildertek__Schedule__c+"_"+taskListForPhase[i].buildertek__Phase__c
            taskPhaseRow["name"] = taskListForPhase[i].buildertek__Phase__c
            taskPhaseRow["startDate"] = ""
            taskPhaseRow["expanded"] = true
            taskPhaseRow["endDate"] = ""
            taskPhaseRow["children"] = []
            taskPhaseRow["constraintType"] = 'none'
            var rowChilObj = {};
            rowChilObj["type"] = 'Task'
            rowChilObj["customtype"] = taskListForPhase[i].buildertek__Type__c
                if(taskListForPhase[i].buildertek__Type__c == 'Milestone'){
                rowChilObj["cls"] = 'milestoneTypeColor'
            }
            rowChilObj["iconCls"] = "b-fa b-fa-arrow-right"
            rowChilObj["indentVal"] = taskListForPhase[i].buildertek__Indent_Task__c;
                if(taskListForPhase[i].buildertek__Indent_Task__c){
                rowChilObj["iconCls"] = "b-fa b-fa-arrow-left indentTrue"
            }
            rowChilObj['phase'] = taskListForPhase[i].buildertek__Phase__c
                if(taskListForPhase[i].buildertek__Dependency__c){
                rowChilObj["constraintType"] = ''
                }else{
                rowChilObj["constraintType"] = 'startnoearlierthan'
            }
                if(scheduleItemIdsList.indexOf(taskListForPhase[i].Id) < 0){
                scheduleItemIdsList.push(taskListForPhase[i].Id)
            }
            rowChilObj["id"] = taskListForPhase[i].Id
            rowChilObj["name"] = taskListForPhase[i].Name
            rowChilObj["percentDone"] = taskListForPhase[i].buildertek__Completion__c
            rowChilObj["startDate"] = taskListForPhase[i].buildertek__Start__c

            rowChilObj['predecessor'] = taskListForPhase[i].buildertek__Dependency__c;

            if (taskListForPhase[i].hasOwnProperty('buildertek__Dependency__c') == true) {
                rowChilObj['predecessorName'] = taskListForPhase[i].buildertek__Dependency__r.Name;
            } else {
                rowChilObj['predecessorName'] = '';
            }

            rowChilObj['internalresource'] = taskListForPhase[i].buildertek__Resource__c;

                if(taskListForPhase[i].buildertek__Resource__c){
                rowChilObj['internalresourcename'] = taskListForPhase[i].buildertek__Resource__r.Name;
                }else{
                rowChilObj['internalresourcename'] = '';
            }

            rowChilObj['contractorresource'] = taskListForPhase[i].buildertek__Contractor_Resource__c;

                if(taskListForPhase[i].buildertek__Contractor_Resource__c){
                rowChilObj['contractorresourcename'] = taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
                }else{
                rowChilObj['contractorresourcename'] = ''
            }
            rowChilObj['contractoracc'] = taskListForPhase[i].buildertek__Contractor__c;

                if(taskListForPhase[i].buildertek__Contractor__c){
                    rowChilObj["contractorname"] = taskListForPhase[i].buildertek__Contractor__r.Name;  //Added for contractor
                }else{
                rowChilObj["contractorname"] = '';
            }

            rowChilObj['notes'] = taskListForPhase[i].buildertek__Notes__c;

                if(taskListForPhase[i].buildertek__Lag__c != undefined && taskListForPhase[i].buildertek__Lag__c != null && taskListForPhase[i].buildertek__Lag__c != 0){
                var startDate = new Date(taskListForPhase[i].buildertek__Start__c);
                startDate.setDate(startDate.getDate());
                rowChilObj["startDate"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0)
                }
            rowChilObj["duration"] = taskListForPhase[i].buildertek__Duration__c


                if(taskListForPhase[i].buildertek__Milestone__c){
                rowChilObj["duration"] = 0;
                rowChilObj["cls"] = 'milestoneCompleteColor'
                rowChilObj['orgmilestone'] = taskListForPhase[i].buildertek__Milestone__c;
            }

            rowChilObj["expanded"] = true
            rowChilObj["order"] = taskListForPhase[i].buildertek__Order__c
            var dependencyRow = {};
                if(taskListForPhase[i].buildertek__Dependency__c){
                    dependencyRow["id" ]  = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Dependency__c
                dependencyRow["fromTask"] = taskListForPhase[i].buildertek__Dependency__c
                dependencyRow["toTask"]  = taskListForPhase[i].Id
                dependencyRow["lag"]  = taskListForPhase[i].buildertek__Lag__c
                taskDependencyData.push(dependencyRow)
            }


                if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Resource__c){
                    if(resourceRowIdList.indexOf(taskListForPhase[i].buildertek__Resource__c) < 0){
                    var resourceRow = {}
                    resourceRow['id'] = taskListForPhase[i].buildertek__Resource__c;
                    resourceRow['name'] = taskListForPhase[i].buildertek__Resource__r.Name;
                    resourceRow['calendar'] = "general";
                    resourceRowData.push(resourceRow)
                    resourceRowIdList.push(resourceRow['id'])
                }

            }
                if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Contractor_Resource__c){

                    if(resourceRowIdList.indexOf(taskListForPhase[i].buildertek__Contractor_Resource__c) < 0){
                    var resourceRow = {}
                    resourceRow['id'] = taskListForPhase[i].buildertek__Contractor_Resource__c
                    resourceRow['name'] = taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
                    resourceRow['calendar'] = "general";
                    resourceRowData.push(resourceRow)
                    resourceRowIdList.push(resourceRow['id'])
                }
            }


                if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Resource__c){
                var assignmentRow = {}
                    assignmentRow['id'] = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Resource__c+'__index_'+i+'Resource_Name'+taskListForPhase[i].buildertek__Resource__r.Name;
                assignmentRow['event'] = taskListForPhase[i].Id
                assignmentRow['resource'] = taskListForPhase[i].buildertek__Resource__c;
                assignmentRowData.push(assignmentRow)
            }
                if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Contractor_Resource__c){
                var assignmentRow = {}
                    assignmentRow['id'] = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Contractor_Resource__c+'__index'+i+'ContractorResource_Name'+taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
                assignmentRow['event'] = taskListForPhase[i].Id
                assignmentRow['resource'] = taskListForPhase[i].buildertek__Contractor_Resource__c;
                assignmentRowData.push(assignmentRow)
            }
            taskPhaseRow["children"].push(rowChilObj);
            console.log(taskPhaseRow)
            newPhaseFlag = false;
        }else if(!taskListForPhase[i].buildertek__Phase__c){
            console.log('method 3 in helper');
            phIndex = phIndex+1;
            var rowChilObj = {};
            rowChilObj["type"] = 'Task'
            rowChilObj["customtype"] = taskListForPhase[i].buildertek__Type__c
            if(taskListForPhase[i].buildertek__Type__c == 'Milestone'){
                rowChilObj["cls"] = 'milestoneTypeColor'
            }
            rowChilObj["iconCls"] = "b-fa b-fa-arrow-right"
            rowChilObj["indentVal"] = taskListForPhase[i].buildertek__Indent_Task__c;
            if(taskListForPhase[i].buildertek__Indent_Task__c){
                rowChilObj["iconCls"] = "b-fa b-fa-arrow-left indentTrue"
            }
            rowChilObj['phase'] = taskListForPhase[i].buildertek__Phase__c
            if(taskListForPhase[i].buildertek__Dependency__c){
                rowChilObj["constraintType"] = ''
            }else{
                rowChilObj["constraintType"] = 'startnoearlierthan'
            }
            if(scheduleItemIdsList.indexOf(taskListForPhase[i].Id) < 0){
                scheduleItemIdsList.push(taskListForPhase[i].Id)
            }
            rowChilObj["id"] = taskListForPhase[i].Id
            rowChilObj["name"] = taskListForPhase[i].Name
            rowChilObj["percentDone"] = taskListForPhase[i].buildertek__Completion__c
            rowChilObj["startDate"] = taskListForPhase[i].buildertek__Start__c


            rowChilObj['predecessor'] = taskListForPhase[i].buildertek__Dependency__c;

            if (taskListForPhase[i].hasOwnProperty('buildertek__Dependency__c') == true) {
                rowChilObj['predecessorName'] = taskListForPhase[i].buildertek__Dependency__r.Name;
            } else {
                rowChilObj['predecessorName'] = '';
            }

            rowChilObj['internalresource'] = taskListForPhase[i].buildertek__Resource__c;

            if(taskListForPhase[i].buildertek__Resource__c){
                rowChilObj['internalresourcename'] = taskListForPhase[i].buildertek__Resource__r.Name;
            }else{
                rowChilObj['internalresourcename'] = '';
            }
            rowChilObj['contractorresource'] = taskListForPhase[i].buildertek__Contractor_Resource__c;

            if(taskListForPhase[i].buildertek__Contractor_Resource__c){
                rowChilObj['contractorresourcename'] = taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
            }else{
                rowChilObj['contractorresourcename'] = '';
            }
            rowChilObj['contractoracc'] = taskListForPhase[i].buildertek__Contractor__c;

            if(taskListForPhase[i].buildertek__Contractor__c){
                rowChilObj["contractorname"] = taskListForPhase[i].buildertek__Contractor__r.Name;  //Added for contractor
            }else{
                rowChilObj["contractorname"] = '';
            }

            rowChilObj['notes'] = taskListForPhase[i].buildertek__Notes__c;

            if(taskListForPhase[i].buildertek__Lag__c != undefined && taskListForPhase[i].buildertek__Lag__c != null && taskListForPhase[i].buildertek__Lag__c != 0){
            var startDate = new Date(taskListForPhase[i].buildertek__Start__c);

            startDate.setDate(startDate.getDate());

            rowChilObj["startDate"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0)
            }
            rowChilObj["duration"] = taskListForPhase[i].buildertek__Duration__c

            if(taskListForPhase[i].buildertek__Milestone__c){
                rowChilObj["duration"] = 0
                rowChilObj["cls"] = 'milestoneCompleteColor'
                rowChilObj['orgmilestone'] = taskListForPhase[i].buildertek__Milestone__c;
            }

            rowChilObj["expanded"] = true
            rowChilObj["order"] = taskListForPhase[i].buildertek__Order__c
            firstRowDup['children'].push(rowChilObj);
            var dependencyRow = {};
            if(taskListForPhase[i].buildertek__Dependency__c){
                dependencyRow["id" ]  = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Dependency__c
                dependencyRow["fromTask"] = taskListForPhase[i].buildertek__Dependency__c
                dependencyRow["toTask"]  = taskListForPhase[i].Id
                dependencyRow["lag"]  = taskListForPhase[i].buildertek__Lag__c
                taskDependencyData.push(dependencyRow)
            }


            if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Resource__c){
                if(resourceRowIdList.indexOf(taskListForPhase[i].buildertek__Resource__c) < 0){
                    var resourceRow = {}
                    resourceRow['id'] = taskListForPhase[i].buildertek__Resource__c;
                    resourceRow['name'] = taskListForPhase[i].buildertek__Resource__r.Name;
                    resourceRow['calendar'] = "general";
                    resourceRowData.push(resourceRow)
                    resourceRowIdList.push(resourceRow['id'])
                }

            }

            if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Contractor_Resource__c){

                if(resourceRowIdList.indexOf(taskListForPhase[i].buildertek__Contractor_Resource__c) < 0){
                    var resourceRow = {}
                    resourceRow['id'] = taskListForPhase[i].buildertek__Contractor_Resource__c
                    resourceRow['name'] = taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
                    resourceRow['calendar'] = "general";
                    resourceRowData.push(resourceRow)
                    resourceRowIdList.push(resourceRow['id'])
                }
            }


            if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Resource__c){
                var assignmentRow = {}
                assignmentRow['id'] = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Resource__c+'__index_'+i+'Resource_Name'+taskListForPhase[i].buildertek__Resource__r.Name;
                assignmentRow['event'] = taskListForPhase[i].Id
                assignmentRow['resource'] = taskListForPhase[i].buildertek__Resource__c;
                assignmentRowData.push(assignmentRow)
            }
            if(!taskListForPhase[i].buildertek__Milestone__c && taskListForPhase[i].buildertek__Contractor_Resource__c){
                var assignmentRow = {}
                assignmentRow['id'] = taskListForPhase[i].Id+'_'+taskListForPhase[i].buildertek__Contractor_Resource__c+'__index'+i+'ContractorResource_Name'+taskListForPhase[i].buildertek__Contractor_Resource__r.Name;
                assignmentRow['event'] = taskListForPhase[i].Id
                assignmentRow['resource'] = taskListForPhase[i].buildertek__Contractor_Resource__c;
                assignmentRowData.push(assignmentRow)
            }

        }

    }
    rows.push(firstRowDup);
    formattedData['rows'] = rows;
    formattedData['resourceRowData'] = resourceRowData;
    formattedData['assignmentRowData'] = assignmentRowData
    formattedData['taskDependencyData'] = taskDependencyData;
    console.log('rows ==> ',rows);
    console.log('resourceRowData ==> ',resourceRowData);
    console.log('assignmentRowData ==> ',assignmentRowData);
    console.log('taskDependencyData ==> ',taskDependencyData);
    return formattedData;
}

function convertJSONtoApexData(data, taskData, dependenciesData, resourceData) {
    console.log('Data-->', data)
    console.log('taskData-->', taskData)
    console.log('dependenciesData-->', dependenciesData)
    console.log('resourceData-->', resourceData)
    let dataToPassIntoApex = {};
    let scheduleObj = {};
    var rowData = [];
    if (data) {
        if (data.length > 1) {
            function getChildren(data) {
                if (data.children) {
                    for (var i = 0; i < data.children.length; i++) {
                        getChildren(data.children[i])
                    }
                } else {
                    rowData.push(data)
                }
            }
            for (let j = 0; j < taskData.length; j++) {
                getChildren(taskData[j])
            }
            var updateDataList = [];
            var updateDataCloneList = [];
            for (var i = 0; i < rowData.length; i++) {
                var updateData = {}
                var updateDataClone = {}
                var endDate
                if (rowData[i]['name'] != 'Milestone Complete') {
                    endDate = new Date(rowData[i].endDate);
                    endDate.setDate(endDate.getDate() - 1)
                } else {
                    endDate = new Date(rowData[i].endDate);
                    //endDate.setDate(endDate.getDate() + 1)
                }

                rowData[i].endDate = endDate;
                if (rowData[i]['id'].indexOf('_generate') == -1) {
                    updateData['Id'] = rowData[i]['id']
                }
                updateData['buildertek__Schedule__c'] = taskData[0].id;
                updateData['Name'] = rowData[i]['name']
                updateData['buildertek__Order__c'] = i + 1;
                //var startdate = new Date(rowData[i]['startDate'])
                // console.log('test',new Date(rowData[i]['endDate']).toLocaleDateString())
                var enddate = new Date(rowData[i]['endDate']).toLocaleDateString().split('/')
                //var enddate = new Date(rowData[i]['endDate']).toJSON();
                var enddate = new Date(rowData[i]['endDate'])
                // console.log('test', rowData[i]['startDate'])
                updateData['buildertek__Start__c'] = rowData[i]['startDate'].split('T')[0]
                //updateData['buildertek__Finish__c'] = enddate[2] + '-'+ enddate[1] + '-'+enddate[0]
                //updateData['buildertek__Finish__c'] = enddate.split('T')[0]
                updateData['buildertek__Finish__c'] = enddate.getFullYear() + '-' + Number(enddate.getMonth() + 1) + '-' + enddate.getDate();
                updateData['buildertek__Duration__c'] = rowData[i]['duration']
                updateData['buildertek__Completion__c'] = rowData[i]['percentDone']
                console.log('check custom type ',rowData[i]['customtype']);
                if (rowData[i]['customtype']) {
                    updateData['buildertek__Type__c'] = rowData[i]['customtype']
                }else{
                    if (rowData[i]['duration'] == 0) {
                        updateData['buildertek__Type__c'] = 'Milestone'
                    }else{
                        updateData['buildertek__Type__c'] = 'Task'
                    }
                }

                if (rowData[i]['cls']) {
                    var check = rowData[i]['cls']
                    if (check.includes('milestoneCompleteColor')) {
                        updateData['buildertek__Milestone__c'] = true;
                    }
                }
                if (rowData[i]['iconCls'] == 'b-fa b-fa-arrow-left indentTrue') {
                    updateData['buildertek__Indent_Task__c'] = true
                } else {
                    updateData['buildertek__Indent_Task__c'] = false;
                }
                //updateData['buildertek__Indent_Task__c'] = rowData[i]['iconCls'].includes('indentTrue')
                if (rowData[i]['parentId']) {
                    // console.log(rowData[i]['parentId'])
                    if (rowData[i]['parentId'].split('_')[1]) {
                        updateData['buildertek__Phase__c'] = rowData[i]['parentId'].split('_')[1]
                    }
                }

                var filledDependency = false
                for (var j = 0; j < dependenciesData.length; j++) {
                    if (dependenciesData[j]['to'] == rowData[i]['id']) {
                        if (dependenciesData[j]['id'].indexOf('_generated') >= 0) {
                            updateData['buildertek__Dependency__c'] = dependenciesData[j]['from']
                        } else {
                            updateData['buildertek__Dependency__c'] = dependenciesData[j]['from']
                        }
                        filledDependency = true;
                    }
                    if (!filledDependency) {
                        updateData['buildertek__Dependency__c'] = null;
                    }
                }
                updateDataClone = Object.assign({}, updateData);
                // console.log(updateDataClone);
                /* for (var j = 0; j < resourceData.length; j++) {
                    if (resourceData[j]['event'] == rowData[i]['id']) {
                        if (resourceData[j]['id'].indexOf('ContractorResource') >= 0) {
                            var conresName = resourceData[j]['id'].split('ContractorResource_Name')[1];
                            var obj = { 'Name': conresName }
                            updateData['buildertek__Contractor_Resource__r'] = obj;
                            updateData['buildertek__Contractor_Resource__c'] = resourceData[j]['resource']
                            updateDataClone['buildertek__Contractor_Resource__c'] = resourceData[j]['resource']
                        } else if (resourceData[j]['id'].indexOf('Resource') >= 0) {
                            var resName = resourceData[j]['id'].split('Resource_Name')[1];
                            var obj = { 'Name': resName }
                            updateData['buildertek__Resource__c'] = resourceData[j]['resource']
                            updateData['buildertek__Resource__r'] = obj;
                            updateDataClone['buildertek__Resource__c'] = resourceData[j]['resource']
                        }
                    }
                } */
                if (rowData[i]['id'].indexOf('_generate') == -1) {
                    updateDataCloneList.push(updateDataClone)
                }
                updateDataList.push(updateData)
            }

            if (data[0]._data['type'] === "Project") {
                scheduleObj['id'] = data[0]._data.id;
                scheduleObj['buildertek__End_date__c'] = covertIntoDate(data[0]._data.endDate);
            }
            console.log('updateDataList ==> ', { updateDataList });
            dataToPassIntoApex['scheduleData'] = scheduleObj;
            dataToPassIntoApex['taskData'] = updateDataList;

            return dataToPassIntoApex;
        }
    }
}

// for converting into date time formate
function convertDateTime(dateString) {
    // Convert the date string to a JavaScript Date object
    const date = new Date(dateString);
    // Get the current time zone offset in milliseconds
    const timeZoneOffset = date.getTimezoneOffset() * 60000;
    // Convert the date to UTC
    const utcDate = new Date(date.getTime() - timeZoneOffset);
    // Format the UTC date to the desired format
    const formattedDate = utcDate.toISOString();
    // Remove the "Z" at the end of the formatted date
    const newDate = formattedDate.slice(0, -1);
    return newDate;
  }

function covertIntoDate(date) {
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export{ formatApexDatatoJSData, convertJSONtoApexData};