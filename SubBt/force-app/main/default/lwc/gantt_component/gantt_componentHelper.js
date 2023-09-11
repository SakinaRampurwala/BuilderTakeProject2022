// import insertUpdateTask from '@salesforce/apex/BT_NewGanttChartCls.insertUpdateTask';
// import {
//     ShowToastEvent
// } from "lightning/platformShowToastEvent";

function formatApexDatatoJSData(scheduleData, scheduleItemsData, scheduleItemsDataList) {
    var taskData = scheduleItemsData;
    var taskDependencyData = [];
    var resourceRowData = [];
    var resourceRowIdList = [];
    var assignmentRowData= [];
    var scheduleItemIdsList = [];
    var rows = [];
    var formattedData = {}

    var taskListForPhase = scheduleItemsDataList;
    var firstRowDup = {};
    console.log('taskListForPhase :- ' , JSON.parse(JSON.stringify(taskListForPhase)));
    firstRowDup["id"] = scheduleData.Id;
    firstRowDup["name"] = scheduleData.buildertek__Description__c;
    firstRowDup["startDate"] = scheduleData.buildertek__Initial_Start_Date__c;
    console.log('scheduleData.startDate ',scheduleData.startDate);
    firstRowDup["expanded"] = true
    firstRowDup["type"] = 'Project'
    firstRowDup['customtype'] = 'Project'
    firstRowDup["endDate"] = ""
    firstRowDup["children"] = []
    // firstRowDup["constraintType"] = 'startnoearlierthan'
    // firstRowDup["constraintDate"] = ""
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
                // taskPhaseRow["constraintDate"] = ""

                // taskPhaseRow["constraintType"] = 'startnoearlierthan'
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
                // rowChilObj["constraintType"] = ''
                }else{
                // rowChilObj["constraintType"] = 'startnoearlierthan'
            }

                if(scheduleItemIdsList.indexOf(taskListForPhase[i].Id) < 0){
                scheduleItemIdsList.push(taskListForPhase[i].Id)
            }
            rowChilObj["id"] = taskListForPhase[i].Id
            rowChilObj["name"] = taskListForPhase[i].Name
            rowChilObj["percentDone"] = taskListForPhase[i].buildertek__Completion__c
            rowChilObj["startDate"] = taskListForPhase[i].buildertek__Start__c
            rowChilObj["constraintDate"] = taskListForPhase[i].buildertek__Start__c
            rowChilObj["constraintType"] = 'startnoearlierthan'
            rowChilObj['predecessor'] = taskListForPhase[i].buildertek__Dependency__c;

            if (taskListForPhase[i].hasOwnProperty('buildertek__Dependency__c') == true) {
                rowChilObj['predecessorName'] = taskListForPhase[i].buildertek__Dependency__r.Name;
                // rowChilObj['']
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
            rowChilObj['contractorId'] = taskListForPhase[i].buildertek__Contractor__c;

                if(taskListForPhase[i].buildertek__Contractor__c){
                    rowChilObj["contractorname"] = taskListForPhase[i].buildertek__Contractor__r.Name;  //Added for contractor
                }else{
                    rowChilObj["contractorname"] = '';
                }

            rowChilObj['notes'] = taskListForPhase[i].buildertek__Notes__c;
                if(taskListForPhase[i].buildertek__Lag__c != undefined && taskListForPhase[i].buildertek__Lag__c != null && taskListForPhase[i].buildertek__Lag__c != 0){
                    var startDate = new Date(taskListForPhase[i].buildertek__Start__c);
                    rowChilObj["startDate"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0)
                    rowChilObj["constraintDate"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0)
                    rowChilObj["constraintType"] = 'startnoearlierthan'
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

            // if(taskListForPhase[i].buildertek__ConstraintType__c == 'None' || taskListForPhase[i].buildertek__ConstraintType__c == '--None--' || taskListForPhase[i].buildertek__ConstraintType__c == null || taskListForPhase[i].buildertek__ConstraintType__c == undefined){
                rowChilObj["constraintDate"] =  scheduleData.buildertek__Start__c;
                rowChilObj["constraintType"] =  "startnoearlierthan";
            // } else{
            //     rowChilObj["constraintDate"] =  taskListForPhase[i].buildertek__ConstraintDate__c;
            //     rowChilObj["constraintType"] =  taskListForPhase[i].buildertek__ConstraintType__c;
            //     }

                if(rowChilObj["customtype"] == "Milestone"){
                rowChilObj["constraintDate"] =  taskListForPhase[i].buildertek__End_date__c;
                rowChilObj["constraintType"] =  "muststarton";

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
            taskPhaseRow["constraintDate"] = ""
            taskPhaseRow["expanded"] = true
            taskPhaseRow["endDate"] = ""
            taskPhaseRow["children"] = []
            // taskPhaseRow["constraintType"] = 'startnoearlierthan'
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
            console.log('taskListForPhase[i].buildertek__Phase__c ',taskListForPhase[i].buildertek__Phase__c);
            rowChilObj['phase'] = taskListForPhase[i].buildertek__Phase__c
                //     if(taskListForPhase[i].buildertek__Dependency__c){
                //     // rowChilObj["constraintType"] = ''
                //     }else{
                //     // rowChilObj["constraintType"] = 'startnoearlierthan'
            // }
                if(scheduleItemIdsList.indexOf(taskListForPhase[i].Id) < 0){
                scheduleItemIdsList.push(taskListForPhase[i].Id)
            }
            rowChilObj["id"] = taskListForPhase[i].Id
            rowChilObj["name"] = taskListForPhase[i].Name
            rowChilObj["percentDone"] = taskListForPhase[i].buildertek__Completion__c
            rowChilObj["startDate"] = taskListForPhase[i].buildertek__Start__c
            rowChilObj["constraintDate"] = taskListForPhase[i].buildertek__Start__c
            rowChilObj["constraintType"] = 'startnoearlierthan'

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
            rowChilObj['contractorId'] = taskListForPhase[i].buildertek__Contractor__c;

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
                rowChilObj["constraintDate"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0)
                rowChilObj["constraintType"] = 'startnoearlierthan'
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
            // if(taskListForPhase[i].buildertek__ConstraintType__c == 'None' || taskListForPhase[i].buildertek__ConstraintType__c == '--None--' || taskListForPhase[i].buildertek__ConstraintType__c == null || taskListForPhase[i].buildertek__ConstraintType__c == undefined){
                rowChilObj["constraintDate"] =  scheduleData.buildertek__Start__c;
                rowChilObj["constraintType"] =  "startnoearlierthan";
            // } else{
            //     rowChilObj["constraintDate"] =  taskListForPhase[i].buildertek__ConstraintDate__c;
            //     rowChilObj["constraintType"] =  taskListForPhase[i].buildertek__ConstraintType__c;
            //     }


            taskPhaseRow["children"].push(rowChilObj);
            console.log('taskPhaseRow ',taskPhaseRow)
            firstRowDup['children'].push(taskPhaseRow);
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
                // rowChilObj["constraintType"] = ''
            }else{
                // rowChilObj["constraintType"] = 'startnoearlierthan'
            }
            if(scheduleItemIdsList.indexOf(taskListForPhase[i].Id) < 0){
                scheduleItemIdsList.push(taskListForPhase[i].Id)
            }
            rowChilObj["id"] = taskListForPhase[i].Id
            rowChilObj["name"] = taskListForPhase[i].Name
            rowChilObj["percentDone"] = taskListForPhase[i].buildertek__Completion__c
            rowChilObj["startDate"] = taskListForPhase[i].buildertek__Start__c
            rowChilObj["constraintDate"] = taskListForPhase[i].buildertek__Start__c
            rowChilObj["constraintType"] = 'startnoearlierthan'


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
            rowChilObj['contractorId'] = taskListForPhase[i].buildertek__Contractor__c;

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
            rowChilObj["constraintDate"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0)
            rowChilObj["constraintType"] = 'startnoearlierthan'
            }
            rowChilObj["duration"] = taskListForPhase[i].buildertek__Duration__c


            rowChilObj["expanded"] = true
            rowChilObj["order"] = taskListForPhase[i].buildertek__Order__c
            // if(taskListForPhase[i].buildertek__ConstraintType__c == 'None' || taskListForPhase[i].buildertek__ConstraintType__c == '--None--' || taskListForPhase[i].buildertek__ConstraintType__c == null || taskListForPhase[i].buildertek__ConstraintType__c == undefined){
                rowChilObj["constraintDate"] =  scheduleData.buildertek__Start__c;
                rowChilObj["constraintType"] =  "startnoearlierthan";
            // } else{
            //     rowChilObj["constraintDate"] =  taskListForPhase[i].buildertek__ConstraintDate__c;
            //     rowChilObj["constraintType"] =  taskListForPhase[i].buildertek__ConstraintType__c;
            // }

            if(taskListForPhase[i].buildertek__Milestone__c){
                rowChilObj["duration"] = 0
                rowChilObj["cls"] = 'milestoneCompleteColor'
                rowChilObj['orgmilestone'] = taskListForPhase[i].buildertek__Milestone__c;
                rowChilObj["constraintDate"] =  taskListForPhase[i].buildertek__End_date__c;
                rowChilObj["constraintType"] =  'muststarton';
            }

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
    console.log('firstRowDup ',firstRowDup);
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
    const phasedatamap = new Map();
    const contractordatamap = new Map();

    console.log('data !-->', {data})
    if (data) {
        data.forEach(element => {
            if(element.hasOwnProperty('NewPhase')){
                phasedatamap.set(element.id, element.NewPhase);
            }
            if(element._data.hasOwnProperty('contractorId')){
                contractordatamap.set(element.id, element._data.contractorId);
            }
        });
        if (data.length > 0) {
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
            console.log('rowdata:- ', rowData);
            var updateDataList = [];
            var updateDataCloneList = [];
            for (var i = 0; i < rowData.length; i++) {
                var updateData = {}
                var updateDataClone = {}
                var endDate
                if (rowData[i]['name'] != 'Milestone Complete') {
                    endDate = new Date(rowData[i].endDate);
                    endDate.setDate(endDate.getDate())
                } else {
                    endDate = new Date(rowData[i].endDate);
                    //endDate.setDate(endDate.getDate() + 1)
                }

                rowData[i].endDate = endDate;
                // if (rowData[i]['id'].indexOf('_generate') == -1) {
                    updateData['Id'] = rowData[i]['id']
                // }
                updateData['buildertek__Schedule__c'] = taskData[0].id;
                updateData['Name'] = rowData[i]['name'];

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
                if (rowData[i]['constraintDate'] != null && rowData[i]['constraintType'] != null) {
                    updateData['buildertek__ConstraintDate__c'] = rowData[i]['constraintDate'].split('T')[0];
                    updateData['buildertek__ConstraintType__c'] = rowData[i]['constraintType']
                } else{
                    updateData['buildertek__ConstraintDate__c'] = null
                    updateData['buildertek__ConstraintType__c'] = 'None'
                }
                console.log('check Constraint date ',rowData[i]['constraintDate']);
                console.log('check Constraint type ',rowData[i]['constraintType']);
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
                console.log('phasedatamap -->', phasedatamap);
                console.log('hasownproperty updateData -->', updateData.Id );
                if(phasedatamap.has(updateData.Id)){
                    console.log('updating phase data');
                    updateData['buildertek__Phase__c'] = phasedatamap.get(updateData.Id);
                }
                const keys = phasedatamap.keys();

                if(contractordatamap.has(updateData.Id)){
                    console.log('updating Contractor data');
                    updateData['buildertek__Contractor__c'] = contractordatamap.get(updateData.Id);
                }

                console.log('DemoGenretedId updateData:- ',{updateData});

                updateDataClone = Object.assign({}, updateData);

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

function recordsTobeDeleted(oldListOfTaskRecords, newListOfTaskRecords) {
    const setOfNewRecordId = new Set();
    const listOfRecordIdToBeDeleted = [];
    newListOfTaskRecords.forEach(newTaskRecord => {
        // console.log('newTaskRecord in recordtobedeleted :- ',newTaskRecord);
        var taskId = newTaskRecord.Id
        if(!(taskId.includes('_generatedt_'))){
            setOfNewRecordId.add(newTaskRecord.Id);
        }
    });

    oldListOfTaskRecords.forEach(oldTaskRecord => {
        if (!setOfNewRecordId.has(oldTaskRecord.Id)) {
            listOfRecordIdToBeDeleted.push(oldTaskRecord.Id);
        }
    });
    console.log('listOfRecordIdToBeDeleted:- ',listOfRecordIdToBeDeleted);
    return listOfRecordIdToBeDeleted;
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

function makeComboBoxDataForContractor(listOfContractors) {
    let listOfContractorToReturn = [];

    listOfContractors.forEach(ctrObj => {
        let contractorObj = {};
        if (ctrObj.Id) {
            contractorObj['value'] = ctrObj.Id;
        }
        if(ctrObj.Name){
            contractorObj['text'] = ctrObj.Name;
        }
        listOfContractorToReturn.push(contractorObj);
    });
    return listOfContractorToReturn;
}

//* auther : Nishit Suthar
//* Date : 8th Sep 2023
//* this method is use for creating data for resources to store in backend
function setResourceDataForApexData(assignmentsData) {
    let listOfResourceToReturn = [];

    assignmentsData.forEach(assignmentObj => {
        let resourceObj = {};
        resourceObj['id'] = assignmentObj.resource;
        resourceObj['name'] = assignmentObj.resource;
        listOfResourceToReturn.push(resourceObj);
    });

    return listOfResourceToReturn;
}

//* auther : Nishit Suthar/krunal Lungaria
//* Date : 29th Aug 2023
//* this method is used to create data for resource combobox
function makeComboBoxDataForResourceData(listOfContractors, listOfUsers){
    let listOfResourceToReturn = [];

    listOfContractors.forEach(ctrObj => {
        if (ctrObj.Contacts) {
            ctrObj.Contacts.forEach(resObj => {
                let resourceObj = {};
                resourceObj['id'] = resObj.Id;
                resourceObj['name'] = resObj.Name;
                resourceObj['contractorId'] = resObj.AccountId;
                resourceObj['type'] = 'External Resources';
                listOfResourceToReturn.push(resourceObj);
            });
        }
    });

    listOfUsers.forEach(usrObj => {
        let resourceObj = {};
        resourceObj['id'] = usrObj.Id;
        resourceObj['name'] = usrObj.Name;
        resourceObj['type'] = 'Internal Resources';
        listOfResourceToReturn.push(resourceObj);
    });


    return listOfResourceToReturn;
}

//* auther : Nishit Suthar
//* Date : 24th Aug 2023
//* this method is used to calculate business days between two dates for project schedule
function calcBusinessDays(dDate1, dDate2) { // input given as Date objects
    var iWeeks, iDateDiff, iAdjust = 0;
    if (dDate2 < dDate1) return -1; // error code if dates transposed
    var iWeekday1 = dDate1.getDay(); // day of week
    var iWeekday2 = dDate2.getDay();
    iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
    iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
    if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
    iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
    iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

    // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
    iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

    if (iWeekday1 <= iWeekday2) { //Change '<' to '<=' to include the same date
      iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
    } else {
      iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
    }

    iDateDiff -= iAdjust // take into account both days on weekend

    return (iDateDiff + 1); // add 1 because dates are inclusive
}

export{ formatApexDatatoJSData, convertJSONtoApexData, recordsTobeDeleted, makeComboBoxDataForContractor, calcBusinessDays, makeComboBoxDataForResourceData };