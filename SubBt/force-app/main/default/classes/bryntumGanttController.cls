public with sharing class bryntumGanttController {

    /* Wrapper Class */


    public class DataTableDetails{
        @AuraEnabled
        public List<buildertek__Project_Task__c> lstOfSObjs = new List<buildertek__Project_Task__c>();
        @AuraEnabled
        public buildertek__Schedule__c scheduleObj = new buildertek__Schedule__c();
        @AuraEnabled
        public Map<String, NotesAttachmet> filesandattacmentList = new Map<String, NotesAttachmet>();
        @AuraEnabled
        public string ganttJSON;
        @AuraEnabled
        public boolean hideScheduleFromUser;
        @AuraEnabled
        public string profileName;
    }

    public class NotesAttachmet{
        @AuraEnabled
        public Integer fileLength;
        @AuraEnabled
        public Integer notesLength;
    }

    public class RfqDataTableWrapper{
        @AuraEnabled
        public Integer pageSize{ get; set; }

        @AuraEnabled
        public Integer pageNumber{ get; set; }

        @AuraEnabled
        public Integer totalRecords{ get; set; }

        @AuraEnabled
        public Integer recordStart{ get; set; }

        @AuraEnabled
        public Integer recordEnd{ get; set; }

        @AuraEnabled
        public List<Contact> recordList{ get; set; }

        @AuraEnabled
        public List<contactWrap> wrapperList ;

        @AuraEnabled
        public String label;
        @AuraEnabled
        public String value;
        @AuraEnabled
        public Boolean check;
        @AuraEnabled
        public String accId;
        @AuraEnabled
        public String accName;

        @AuraEnabled
        public List<RfqDataTableSubWrapper> accRecList {get;set;}
        // @AuraEnabled
        // public List<RfqDataTableSubWrapper> subwraplist {get;set;}

        // @AuraEnabled
        // public List<Account> accRecList{get;set;}
    }

    public class RfqDataTableSubWrapper{
        @AuraEnabled
        public String Id {get;set;}

        @AuraEnabled
        public String Name {get;set;}

        @AuraEnabled
        public Boolean check {get;set;}
    }

    public class contactWrap{

        @AuraEnabled
        public String label;
        @AuraEnabled
        public String value;
        @AuraEnabled
        public Boolean check;
        @AuraEnabled
        public String accId;
        @AuraEnabled
        public String accName;
    }


    @AuraEnabled
    public static DataTableDetails getScheduleWrapperAtLoading(string scheduleid){


        System.debug('getScheduleWrapperAtLoading called===');
        List<Id> filesIdList = new List<Id>();
        Set<Id> notesIdList = new Set<Id>();


        DataTableDetails dataTableDtls = new DataTableDetails();

        String strQuery = 'SELECT ';

        strQuery += 'Id,Name,buildertek__Type__c,buildertek__Indent_Task__c,buildertek__Reference_for_Import__c,buildertek__Lag__c,buildertek__Schedule__c,buildertek__Budget__c,buildertek__Add_To_All_Active_Schedules__c,buildertek__Notes__c,buildertek__Schedule__r.Name,buildertek__Start__c,buildertek__Finish__c,buildertek__Duration__c,buildertek__Contractor__c,buildertek__Contractor__r.Name,buildertek__Phase__c,buildertek__Completion__c, buildertek__Dependency__c,buildertek__Dependency__r.Name,buildertek__Contractor_Resource__c,buildertek__Contractor_Resource__r.Name,buildertek__Resource__c, buildertek__Resource__r.Name,buildertek__Milestone__c,buildertek__Order__c,buildertek__Budget_Line__c,CreatedDate FROM buildertek__Project_Task__c where buildertek__Schedule__c = :  scheduleid Order By buildertek__Order__c NULLS LAST,CreatedDate';
        //CreatedDate//Order by buildertek__Milestone__c , Order__c ASC NULLS LAST, Auto_Number__c ASC
        system.debug('strQuery---' + strQuery);

        dataTableDtls.lstOfSObjs = Database.query(strQuery);

        System.debug('dataTableDtls**=='+JSON.serialize(dataTableDtls.lstOfSObjs));
        List<buildertek__Project_Task__c> projectTasksSorted = dataTableDtls.lstOfSObjs;

        String milestonequery = 'Select buildertek__Project__r.Name,buildertek__Schedule__r.Name, buildertek__Dependency__r.buildertek__Finish__c,buildertek__Contractor_Resource__r.Name,buildertek__Contractor__r.Name,buildertek__Resource__r.Name, ' + new_BT_Utils.getQueryStringForObjectWithAllFields('buildertek__Project_Task__c');
        milestonequery = milestonequery + ' From buildertek__Project_Task__c where buildertek__Schedule__c =:scheduleid AND buildertek__Milestone__c= true';
        List<buildertek__Project_Task__c> milestoneTaskList = DataBase.query(milestonequery);

        Map<String, List<buildertek__Project_Task__c>> TaskWithPhaseMap = new Map<String, List<buildertek__Project_Task__c>>();

        for (buildertek__Project_Task__c task : projectTasksSorted){
            if (!filesIdList.contains(task.Id)){
                filesIdList.add(task.Id);
            }
            if (task.buildertek__Reference_for_Import__c != null){
                if (!filesIdList.contains(task.buildertek__Reference_for_Import__c)){
                    filesIdList.add(task.buildertek__Reference_for_Import__c);
                }
            }
            if (!notesIdList.contains(task.Id)){
                notesIdList.add(task.Id);
            }
            if (!task.buildertek__Milestone__c){
                if (task.buildertek__Phase__c != null){
                    if (TaskWithPhaseMap.get(task.buildertek__Phase__c) != null){
                        list<buildertek__Project_Task__c> newProjectTaskList = TaskWithPhaseMap.get(task.buildertek__Phase__c);
                        newProjectTaskList.add(task) ;
                        TaskWithPhaseMap.put(task.buildertek__Phase__c, newProjectTaskList);
                    } else{
                        List<buildertek__Project_Task__c> newTaskList = new List<buildertek__Project_Task__c>();
                        newTaskList.add(task) ;
                        TaskWithPhaseMap.put(task.buildertek__Phase__c, newTaskList);
                    }
                }
            }
        }

        Map<String, buildertek__Project_Task__c> milestoneMap = new Map<String, buildertek__Project_Task__c>();
        if (milestoneTaskList.Size() > 0){
            for (buildertek__Project_Task__c milestone : milestoneTaskList){
                if (milestone.buildertek__Phase__c != null){
                    System.debug(milestone.buildertek__Phase__c);
                    list<buildertek__Project_Task__c> newProjectTaskList = TaskWithPhaseMap.get(milestone.buildertek__Phase__c);
                    System.debug(newProjectTaskList);
                    if (newProjectTaskList != null){
                        if (newProjectTaskList.Size() > 0){
                            newProjectTaskList.add(milestone);
                            TaskWithPhaseMap.put(milestone.buildertek__Phase__c, newProjectTaskList);
                        }
                    }

                } else{
                    milestoneMap.put(milestone.Id, milestone);
                }
            }
        }

        Integer i = 0;
        Map<String, Integer> newTaskWithPhaseMap = new Map<String, Integer>();
        List<buildertek__Project_Task__c> updatetaskList = new List<buildertek__Project_Task__c>();
        List<buildertek__Project_Task__c> newProjectTaskList = new List<buildertek__Project_Task__c>();
        Integer ListSize = 0;
        for (Integer j = 0; j < projectTasksSorted.Size(); j++){
            buildertek__Project_Task__c task = projectTasksSorted[j];
            if (!string.isBlank(task.buildertek__Phase__c)){
                if (TaskWithPhaseMap.Size() > 0){
                    if (newTaskWithPhaseMap.get(task.buildertek__Phase__c) == null){
                        if (TaskWithPhaseMap.get(task.buildertek__Phase__c) != null){
                            newProjectTaskList = TaskWithPhaseMap.get(task.buildertek__Phase__c);
                            if (newProjectTaskList != null){
                                ListSize = ListSize + newProjectTaskList.Size();
                            }
                            newTaskWithPhaseMap.put(task.buildertek__Phase__c, newProjectTaskList.Size());
                            updatetaskList.addAll(newProjectTaskList);
                            i = i + ListSize;
                        }
                    }
                }
            } else{
                updatetaskList.add(task) ;
                i++;
            }
        }

        system.debug('Schedule Items ::' + dataTableDtls.lstOfSObjs);
        system.debug('Schedule Item ::' + dataTableDtls);
        buildertek__Schedule__c schedulerec = [Select Id, Name, buildertek__Gantt_Draw_Dependencies__c, buildertek__Gantt_Highlight_Non_Working_Time__c, buildertek__Gantt_Project_Lines__c, buildertek__Gantt_Task_Labels__c, buildertek__Hide_Gantt_Schedule__c, buildertek__Project__c, buildertek__Project__r.Name
                                            from buildertek__Schedule__c
                                            Where Id = :scheduleid];
        dataTableDtls.scheduleObj = schedulerec;
        NotesAttachmet notesAttachFiles = new NotesAttachmet();
        Map<String, NotesAttachmet> getnotesFilesLengthMap = new Map<String, NotesAttachmet>();

        if (updatetaskList.size() > 0){
            Map<Id, list<ContentVersion>> filesList = new Map<Id, list<ContentVersion>>();
            if (filesIdList.size() > 0){
                filesList = new_filePreviewController.getRelatedFiles(filesIdList);
                System.debug(filesList.size());
                System.debug(filesList);
            }

            // for notes
            List<ContentNote> notesList = new List<ContentNote>();
            map<Id, list<ContentNote>> parentandNoteMap = new map<Id, list<ContentNote>>();
            Map<Id, Id> docAndParentMap = new Map<Id, Id>();
            if (notesIdList.size() > 0){
                Set<Id> contentDocumentIds = new Set<Id>();
                for (ContentDocumentLink conDoc : [SELECT ContentDocumentId, LinkedEntityId
                                                FROM ContentDocumentLink
                                                WHERE LinkedEntityId IN:notesIdList]){
                    contentDocumentIds.add(conDoc.ContentDocumentId);
                    docAndParentMap.put(conDoc.ContentDocumentId, conDoc.LinkedEntityId);
                }
                System.debug(docAndParentMap);
                //get all the content notes using contentDocumentIds
                List<ContentNote> contentNotes = [SELECT Id, Content, Title, TextPreview, CreatedDate
                                                from ContentNote
                                                where Id In:contentDocumentIds
                                                order by CreatedDate ASC];
                System.debug(contentNotes);
                for (ContentNote noteRec : contentNotes){
                    system.debug(noteRec.Id);
                    if (!parentandNoteMap.containsKey(docAndParentMap.get(noteRec.Id))){
                        parentandNoteMap.put(docAndParentMap.get(noteRec.Id), new list<ContentNote>());
                    }
                    parentandNoteMap.get(docAndParentMap.get(noteRec.Id)).add(noteRec);
                }
                System.debug(parentandNoteMap);
            }

            NotesAttachmet getnotesFilesLength = new NotesAttachmet();

            if (updatetaskList.size() > 0){
                for (buildertek__Project_Task__c taskItem : updatetaskList){
                    NotesAttachmet getnotesFilesObj = new NotesAttachmet();

                    if (filesList.get(taskItem.Id) != null || filesList.get(taskItem.buildertek__Reference_for_Import__c) != null){
                        getnotesFilesObj.fileLength = 0;
                        if (filesList.get(taskItem.Id) != null){
                            getnotesFilesObj.fileLength = filesList.get(taskItem.Id).size();
                        }
                        if (filesList.get(taskItem.buildertek__Reference_for_Import__c) != null){
                            getnotesFilesObj.fileLength += filesList.get(taskItem.buildertek__Reference_for_Import__c).size();
                        }
                    } else{
                        getnotesFilesObj.fileLength = 0;
                    }

                    if (parentandNoteMap.get(taskItem.Id) != null){
                        getnotesFilesObj.notesLength = parentandNoteMap.get(taskItem.Id).size();
                    } else{
                        getnotesFilesObj.notesLength = 0;
                    }

                    if (!getnotesFilesLengthMap.containsKey(taskItem.Id)){
                        getnotesFilesLengthMap.put(taskItem.Id, getnotesFilesObj);
                    }
                }
            }
            system.debug(getnotesFilesLengthMap);

        }

        User curruser = [select id, Name, buildertek__Hide_Schedule__c
                        from User
                        where id = :userInfo.getUserId()];

        List<object> fileLenListCustom = new list<Object>();

        dataTableDtls.lstOfSObjs = updatetaskList;
        System.debug('updatetaskList===='+JSON.serialize(updatetaskList));

        dataTableDtls.filesandattacmentList = getnotesFilesLengthMap;
        dataTableDtls.hideScheduleFromUser = curruser.buildertek__Hide_Schedule__c;
        Id profileId = userinfo.getProfileId();
        String profileName = [Select Id, Name from Profile where Id = :profileId].Name;
        system.debug('ProfileName' + profileName);
        system.debug(userinfo.getusername());
        dataTableDtls.profileName = profileName;
        System.debug('dataTable :: ' + dataTableDtls);
        return dataTableDtls;
    }

    @AuraEnabled
    public static RfqDataTableWrapper getAccounts(Integer pageNumber, Integer pageSize,String selected,String searchaccount){
        try {
            List<Account> accList = new List<Account>();

            Integer offset = (pageNumber - 1) * pageSize;
            //Total Records
            Integer totalRecords = 0;

            String accountsearch = '%'+''+'%';
            if(searchaccount != '' && searchaccount != null){
                accountsearch = '%'+searchaccount+'%';
            }

            if(searchaccount != ''){
                String query = 'Select COUNT() FROM Account WHERE id!=NULL';

                if(searchaccount != '' && searchaccount != null){
                    query = query+ ' AND Name LIKE \'%'+String.escapeSingleQuotes(searchaccount)+'%\'';
                }
                totalRecords = Database.countQuery(query);
            }else{
                totalRecords = [SELECT COUNT() FROM Account ];
            }

            Integer recordEnd = pageSize * pageNumber;

            //Instance of Account DataTable Wrapper Class
            RfqDataTableWrapper objDT = new RfqDataTableWrapper();
            objDT.pageSize = pageSize;
            objDT.pageNumber = pageNumber;
            objDT.recordStart = offset + 1;
            objDT.recordEnd = totalRecords >= recordEnd ? recordEnd : totalRecords;
            objDT.totalRecords = totalRecords;

            String queryList2 = '';
            String queryList = 'Select Id,Name FROM Account WHERE id!=NULL ';
            if(searchaccount != '' && searchaccount != null){
                queryList = queryList+ ' AND (Name LIKE \'%'+searchaccount+'%\')'; //String.escapeSingleQuotes(description)
            }
            queryList2 = queryList+ ' ORDER BY Name';
            queryList = queryList+ ' ORDER BY Name LIMIT :pageSize OFFSET :offset';

            List<Account> allContacts =  Database.query(queryList2);

            List<Account> accRecL = Database.query(queryList);

            List<RfqDataTableSubWrapper> subwrapperlist = new List<RfqDataTableSubWrapper>();
            for(Account a: accRecL){
                RfqDataTableSubWrapper rs = new RfqDataTableSubWrapper();
                rs.Id = a.Id;
                rs.Name = a.Name;
                rs.check = String.valueOf(a.Id) == selected ? true : false;
                subwrapperlist.add(rs);
            }
            objDT.accRecList = subwrapperlist;

            return objDT;

        } catch (Exception e) {
            return null;
        }
    }

    @AuraEnabled
    public static List<contactWrap> getContacts(String selected,String searchname,String searchaccount){
        String contactsearch = '%'+''+'%';
        if(searchname != '' && searchname != null){
            contactsearch = '%'+searchname+'%';
        }
        String accountsearch = '%'+''+'%';
        if(searchaccount != '' && searchaccount != null){
            accountsearch = '%'+searchaccount+'%';
        }
        String queryStr = 'Select Id,Name,AccountId,Account.Name From Contact Where Name LIKE:contactsearch ';
        if(searchaccount != '' && searchaccount != null){
            queryStr += ' AND Account.Name LIKE:accountsearch Order by Name';
        }else{
            queryStr += ' Order by Name';
        }
        List<Contact> conList = Database.query(queryStr);
        //List<Contact> conList = [Select Id,Name,AccountId,Account.Name From Contact Order by Name];
        List<contactWrap> conWrapList = new List<contactWrap>();
        String conName = '';
        if(conList.size() > 0){
            for(Contact con : conList){
                    contactWrap conwrapLabelVal = new contactWrap();
                    conwrapLabelVal.label = con.Name;
                    conwrapLabelVal.value = con.Id;
                    conwrapLabelVal.check = false;
                    conwrapLabelVal.accId = con.AccountId;
                    conwrapLabelVal.accName = '';
                    if(con.AccountId != null){
                        conwrapLabelVal.accName = con.Account.Name;
                    }

                    if(selected == String.valueOf(con.Id) && selected != ''){
                    conwrapLabelVal.check = true;
                    }
                    conWrapList.add(conwrapLabelVal);
            }
        }
        return conWrapList;
    }

    @AuraEnabled(Cacheable=true)
    public static List<buildertek__Project__c> searchProject(String searchProjectName){
        List<buildertek__Project__c> searchProjectList = [SELECT Name, Id FROM buildertek__Project__c WHERE Name LIKE :('%' + searchProjectName + '%')];
        System.debug('searchProjectList: ' + searchProjectList);
        return searchProjectList;
    }

    @AuraEnabled(Cacheable=true)
    public static List<User> searchUsers(String searchProjectManagerName){
        List<User> searchProjectManagerList = [SELECT Name, Id FROM User WHERE Name LIKE :('%' + searchProjectManagerName + '%')];
        System.debug('searchProjectManagerList: ' + searchProjectManagerList);
        return searchProjectManagerList;
    }

    @AuraEnabled
    public static String getFieldSet(){
        String result = '';
        String objectName = 'buildertek__Schedule__c';
        String fieldSetName = 'buildertek__ScheduleFields';
        List<String> pickListValuesList = new List<String>();
        try{
            SObjectType objToken = Schema.getGlobalDescribe().get(objectName);
            Schema.DescribeSObjectResult d = objToken.getDescribe();
            Map<String, Schema.FieldSet> FsMap = d.fieldSets.getMap();
            if (FsMap.containsKey(fieldSetName)){
                for (Schema.FieldSetMember f : FsMap.get(fieldSetName).getFields()){
                    if (result != ''){
                        result += ',';
                    }
                    String jsonPart = '{';
                    jsonPart += '"label":"' + f.getLabel() + '",';
                    jsonPart += '"required":"' + (f.getDBRequired() || f.getRequired()) + '",';
                    jsonPart += '"type":"' + (f.getType()) + '",';
                    jsonPart += '"name":"' + f.getFieldPath() + '"';
                    if (String.valueOf(f.getType()) == 'PICKLIST'){
                        pickListValuesList = getDropDown(String.valueOf(f.getFieldPath()));
                        jsonPart += ',"pickListValuesList":' + JSON.serialize(pickListValuesList);
                    }
                    jsonPart += '}';
                    result += jsonPart;
                }
            }

        } catch (Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
            System.debug('Error::' + e.getMessage());
            System.debug('Error At Line::' + e.getLineNumber());
        }
        return '[' + result + ']';
    }

    @AuraEnabled
    public static List<String> getDropDown(String fieldName){
        String objName = 'buildertek__Schedule__c';
        List<String> pickListValuesList = new List<String>();
        try{
            Schema.SObjectType s = Schema.getGlobalDescribe().get(objName);
            Schema.DescribeSObjectResult r = s.getDescribe();
            Map<String, Schema.SObjectField> fields = r.fields.getMap();
            Schema.DescribeFieldResult fieldResult = fields.get(fieldName).getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry pickListVal : ple){
                pickListValuesList.add(pickListVal.getLabel());
            }
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        return pickListValuesList;
    }

    @AuraEnabled
    public static list<buildertek__Schedule__c> fetchScheduleList(){

        return [select id, Name, buildertek__Type__c, buildertek__Total_Duration__c, buildertek__Description__c
        from buildertek__Schedule__c
        where buildertek__Type__c LIKE '%Master%'];
    }

    @AuraEnabled
    public static list<buildertek__Project_Task__c> getScheduleItemList(String masterId){
        string mId = masterId;
        System.debug('mId: ' + mId);
        return [select id, Name, buildertek__Start__c, buildertek__Phase__c, buildertek__Schedule__c, buildertek__Budget__c, buildertek__Budget_Line__c, buildertek__Completed__c, buildertek__Completion__c, buildertek__Contractor__c, buildertek__Contractor_Resource__c, buildertek__Cost_Code__c, buildertek__Duration__c, buildertek__Finish__c, buildertek__Resource__c, buildertek__Lag__c, buildertek__Last_Saved_End_Date__c, buildertek__Last_Saved_Start_Date__c, buildertek__Material_Ordered__c, buildertek__Material_Received__c, buildertek__Milestone__c, buildertek__Notes__c, buildertek__Order__c, buildertek__Original_End_Date__c, buildertek__Original_Start_Date__c, buildertek__Payable_Task__c, buildertek__Project__c
                from buildertek__Project_Task__c
                where buildertek__Schedule__c = :mId
                order by createdDate];
    }

    /* @Author        Karan Patel
     * Date           10-7-23
     * Description :  This method is used to create New Schedule.
     */

    @AuraEnabled
    public static String createNewSchedule(String description, String project ,Date initialStartDate, String type, String user, String masterId) {
        System.debug('description: ' + description);
        System.debug('project: ' + project);
        System.debug('initialStartDate: ' + initialStartDate);
        System.debug('type: ' + type);
        System.debug('user: ' + user);
        System.debug('masterId: ' + masterId);

        if(initialStartDate == null){
            initialStartDate = Date.Today();
        }

        buildertek__Schedule__c schedule = new buildertek__Schedule__c(
            buildertek__Description__c = description,
            buildertek__Initial_Start_Date__c = date.parse(initialStartDate.format()),
            buildertek__Type__c = type,
            buildertek__Project_Managers__c = user,
            buildertek__Project__c = project
        );
        insert schedule;
        String pageUrl = schedule.Id;

        if(masterId != null || masterId != ''){
            createScheduleLineFromMasterSchedule(schedule.Id, masterId, initialStartDate);
        }

        return pageUrl;
    }

    /* @Author        Karan Patel
     * Date           10-7-23
     * Description :  This method is used to create New ScheduleLine from Master Schedule.
     */

    @AuraEnabled
    public static void createScheduleLineFromMasterSchedule (String recordId, String masterId, Date initialStartDate){
        System.debug('initialStartDate: ' + initialStartDate);
        Map<Id, buildertek__Project_Task__c> projectInsertTaskMap = new Map<Id, buildertek__Project_Task__c>();
       
        List<buildertek__Project_Task__c> masterScheduleList = new List<buildertek__Project_Task__c>([select Id, Name, buildertek__Start__c,buildertek__Contractor__c,buildertek__Phase__c, buildertek__Schedule__c,buildertek__Dependency__r.Name, buildertek__Dependency__r.buildertek__Schedule__c, buildertek__Completed__c, buildertek__Completion__c, buildertek__Contractor_Resource__c, buildertek__Type__c,buildertek__Cost_Code__c, buildertek__Duration__c, buildertek__Finish__c, buildertek__Resource__c, buildertek__Lag__c, buildertek__Last_Saved_End_Date__c, buildertek__Last_Saved_Start_Date__c, buildertek__Material_Ordered__c, buildertek__Material_Received__c, buildertek__Milestone__c, buildertek__Notes__c, buildertek__Order__c, buildertek__Original_End_Date__c, buildertek__Original_Start_Date__c, buildertek__Payable_Task__c, buildertek__Project__c, buildertek__Purchase_Order__c, buildertek__Reason_for_Date_Change__c, buildertek__Reason_for_Date_Change_PL__c, buildertek__Required_Completion_Date__c  from buildertek__Project_Task__c where buildertek__Schedule__c = :masterId  ORDER BY buildertek__Order__c ASC NULLS LAST]);
        String businessHourId = [SELECT Id, IsDefault, IsActive FROM BusinessHours WHERE IsDefault = false].Id;
        System.debug('masterScheduleList: ' + masterScheduleList);

        Map<String, String> predecessorMap = new Map<String, String>();

        for (buildertek__Project_Task__c Masterscheduleitem : masterScheduleList){
            if (!Masterscheduleitem.buildertek__Milestone__c){

                if (Masterscheduleitem.buildertek__Dependency__c != null) {
                    predecessorMap.put(Masterscheduleitem.Id, Masterscheduleitem.buildertek__Dependency__c);
                }

                buildertek__Project_Task__c newSchItem = new buildertek__Project_Task__c();
                newSchItem.buildertek__Completion__c = Masterscheduleitem.buildertek__Completion__c;
                newSchItem.buildertek__Contractor__c = Masterscheduleitem.buildertek__Contractor__c;
                newSchItem.buildertek__Contractor_Resource__c = Masterscheduleitem.buildertek__Contractor_Resource__c;

                if (Masterscheduleitem.buildertek__Duration__c != 0 && Masterscheduleitem.buildertek__Duration__c != null){
                    newSchItem.buildertek__Duration__c = Masterscheduleitem.buildertek__Duration__c;
                } else{
                    newSchItem.buildertek__Duration__c = 1;
                }
                // System.debug('StartDate: ' + initialStartDate.daysBetween(Masterscheduleitem.buildertek__Start__c));
                // // newSchItem.buildertek__Start__c = Masterscheduleitem.buildertek__Start__c;
                // newSchItem.buildertek__Start__c = initialStartDate.addDays(initialStartDate.daysBetween(Masterscheduleitem.buildertek__Start__c));
                // // newSchItem.buildertek__Finish__c = addDaysSkippingWeekends(businessHourId, initialStartDate, Integer.valueOf(newSchItem.buildertek__Duration__c));
                // newSchItem.buildertek__Finish__c = addDaysSkippingWeekends(businessHourId, Masterscheduleitem.buildertek__Start__c, Integer.valueOf(newSchItem.buildertek__Duration__c));

                // if (Masterscheduleitem.buildertek__Dependency__c == null) {
                //     System.debug('Dependency Condition: ');
                //     newSchItem.buildertek__Start__c = initialStartDate;
                //     newSchItem.buildertek__Finish__c = addDaysSkippingWeekends(businessHourId, initialStartDate, Integer.valueOf(Masterscheduleitem.buildertek__Duration__c));
                // } else {
                //     System.debug('Dependency Condition else: ');
                //     if (projectInsertTaskMap.get(Masterscheduleitem.Id) != null) {
                //         System.debug('Dependency Condition !=null: ');
                //         newSchItem.buildertek__Start__c = projectInsertTaskMap.get(Masterscheduleitem.Id).buildertek__Finish__c.adddays(1);
                //         newSchItem.buildertek__Finish__c = addDaysSkippingWeekends(businessHourId, newSchItem.buildertek__Start__c, Integer.valueOf(Masterscheduleitem.buildertek__Duration__c));
                //     } else {
                //         System.debug('Dependency Condition ==null: ');
                //         newSchItem.buildertek__Start__c = initialStartDate;
                //         newSchItem.buildertek__Finish__c = addDaysSkippingWeekends(businessHourId, initialStartDate, Integer.valueOf(Masterscheduleitem.buildertek__Duration__c));
                //     }
                // }

                if (Masterscheduleitem.buildertek__Dependency__c == null) {
                    System.debug('Dependency Condition: ');
                    newSchItem.buildertek__Start__c = initialStartDate;
                    newSchItem.buildertek__Finish__c = addDaysSkippingWeekends(businessHourId, newSchItem.buildertek__Start__c, Integer.valueOf(Masterscheduleitem.buildertek__Duration__c));
                } else {
                    System.debug('Dependency Condition else: ');
                    if (projectInsertTaskMap.containsKey(Masterscheduleitem.buildertek__Dependency__c)) {
                        System.debug('Dependency Condition !=null: ');
                        Date dependencyFinishDate = projectInsertTaskMap.get(Masterscheduleitem.buildertek__Dependency__c).buildertek__Finish__c;
                        Date startDate = dependencyFinishDate.addDays(1);
                        newSchItem.buildertek__Start__c = startDate;
                        newSchItem.buildertek__Finish__c = addDaysSkippingWeekends(businessHourId, newSchItem.buildertek__Start__c, Integer.valueOf(Masterscheduleitem.buildertek__Duration__c));
                    } else {
                        System.debug('Dependency Condition ==null: ');
                        newSchItem.buildertek__Start__c = initialStartDate;
                        newSchItem.buildertek__Finish__c = addDaysSkippingWeekends(businessHourId, newSchItem.buildertek__Start__c, Integer.valueOf(Masterscheduleitem.buildertek__Duration__c));
                    }
                }
                
                
                System.debug('finish date in import master before insertion ==> ' + newSchItem.buildertek__Finish__c + ' and master item id ' + newSchItem.id);
                newSchItem.buildertek__Resource__c = Masterscheduleitem.buildertek__Resource__c;
                newSchItem.buildertek__Lag__c = Masterscheduleitem.buildertek__Lag__c;
                newSchItem.buildertek__Milestone__c = Masterscheduleitem.buildertek__Milestone__c;
                newSchItem.buildertek__Notes__c = Masterscheduleitem.buildertek__Notes__c;
                newSchItem.buildertek__Order__c = Masterscheduleitem.buildertek__Order__c;
                newSchItem.buildertek__Original_Start_Date__c = Date.today();
                newSchItem.buildertek__Original_End_Date__c = Date.today().adddays(Integer.valueOf(Masterscheduleitem.buildertek__Duration__c));
                newSchItem.buildertek__Phase__c = Masterscheduleitem.buildertek__Phase__c;
                newSchItem.buildertek__Type__c = Masterscheduleitem.buildertek__Type__c;
                newSchItem.buildertek__Purchase_Order__c = Masterscheduleitem.buildertek__Purchase_Order__c;
                newSchItem.buildertek__Reason_for_Date_Change__c = Masterscheduleitem.buildertek__Reason_for_Date_Change__c;
                newSchItem.buildertek__Reason_for_Date_Change_PL__c = Masterscheduleitem.buildertek__Reason_for_Date_Change_PL__c;
                newSchItem.buildertek__Required_Completion_Date__c = Masterscheduleitem.buildertek__Required_Completion_Date__c;
                newSchItem.buildertek__Schedule__c = recordId;
                newSchItem.buildertek__Reference_for_Import__c = Masterscheduleitem.Id;

                newSchItem.Name = Masterscheduleitem.Name;
                buildertek__Project_Task__c newSchItemClone = newSchItem.Clone(false, true);
                projectInsertTaskMap.put(Masterscheduleitem.Id, newSchItemClone);

                // Milestone

                System.debug('projectInsertTaskMap values ==> ' + projectInsertTaskMap.values());
            }
        } 

        ProjectTaskTriggerHandler.blnSkipTaskTrigger = true;
        insert projectInsertTaskMap.values();
        ProjectTaskTriggerHandler.blnSkipTaskTrigger = false;

        for (String key : predecessorMap.keySet()) { 
            projectInsertTaskMap.get(key).buildertek__Dependency__c = projectInsertTaskMap.get(predecessorMap.get(key)).Id;
            System.debug('projectInsertTaskMap: ' + projectInsertTaskMap.get(key).buildertek__Dependency__c);
        }
        // List<Id> recordIds = new List<Id>(projectInsertTaskMap.keySet());
        // List<buildertek__Project_Task__c> dependencyStartDate = [Select Id, buildertek__Start__c, buildertek__Finish__c, buildertek__Dependency__r.Name,buildertek__Order__c, Name FROM buildertek__Project_Task__c WHERE buildertek__Schedule__c 
        // In :recordIds];

        ProjectTaskTriggerHandler.blnSkipTaskTrigger = true;
        update projectInsertTaskMap.values();
        ProjectTaskTriggerHandler.blnSkipTaskTrigger = false;


        // Adding Milestone to schedule
        Map<String, buildertek__Project_Task__c> milestoneList = new Map<String, buildertek__Project_Task__c>();
        Map<String, buildertek__Project_Task__c> projectTaskList = new Map<String, buildertek__Project_Task__c>();
        List<buildertek__Project_Task__c> projectMilestoneInsert = new List<buildertek__Project_Task__c>();

        List<Project_Task__c> task = [Select Id, Name, buildertek__Phase__c, buildertek__Start__c, buildertek__Finish__c,buildertek__Schedule__c, buildertek__Duration__c, buildertek__Milestone__c
                                    FROM Project_Task__c
                                    WHERE buildertek__Schedule__c = :recordId];

        Map<String, Date> milestoneFinishDateMap = new Map<String, Date>();
        List<AggregateResult> milestonePhaseFinishDateList = [SELECT buildertek__Phase__c, MAX(buildertek__Finish__c) FROM buildertek__Project_Task__c WHERE buildertek__Schedule__c = :recordId GROUP BY buildertek__Phase__c];

        for (AggregateResult result : milestonePhaseFinishDateList) {
            String phase = (String)result.get('buildertek__Phase__c');
            Date finishDate = (Date)result.get('expr0');
            milestoneFinishDateMap.put(phase, finishDate);
        }

        for (Project_Task__c tasks : task){
            System.debug('tasks: ' + tasks);
            if (!tasks.buildertek__Milestone__c){
                projectTaskList.put(tasks.buildertek__Phase__c, tasks);
                System.debug('Milestone IF Condition: ');
            } else{
                milestoneList.put(tasks.buildertek__Phase__c, tasks);
                System.debug('Milestone ELSE Condition: ');
            }
        }  

        for (Project_Task__c tasks : projectTaskList.values()){
            System.debug('projectTaskList Task: '+tasks);
            if (!milestoneList.containsKey(tasks.buildertek__Phase__c) && !tasks.buildertek__Milestone__c){
                System.debug('Check Project Manager 5');
                System.debug('Check tasks.buildertek__Milestone__c'+tasks.buildertek__Milestone__c);
                System.debug('Check tasks.buildertek__Phase__c'+tasks.buildertek__Phase__c);
                if (tasks.buildertek__Phase__c != null){
                    buildertek__Project_Task__c project = new buildertek__Project_Task__c();
                    project.Name = 'Milestone Complete';
                    project.buildertek__Phase__c = tasks.buildertek__Phase__c;
                    project.buildertek__Start__c = milestoneFinishDateMap.get(tasks.buildertek__Phase__c);
                    project.buildertek__Schedule__c = recordId;
                    project.buildertek__Use_Project_Manager_from_Schedule__c = true;
                    project.buildertek__Milestone__c = true;
                    project.buildertek__Duration__c = 0;
                    projectMilestoneInsert.add(project);
                }
            }
        }

        System.debug('Project Task::' + projectMilestoneInsert);
        ProjectTaskTriggerHandler.blnSkipTaskTrigger = true;
        insert projectMilestoneInsert;
        ProjectTaskTriggerHandler.blnSkipTaskTrigger = false;
    }

    /* @Author        Karan Patel
     * Date           10-7-23
     * Description :  This method is used skip weekend during calculation of duration of Task.
     */

    // Skip weekend and calculate date
	public static Date addDaysSkippingWeekends(String businessHourId, Date startDate, Integer duration){
		// Date resultantStartDate = startDate;
		// Integer addedDays = 0;
		// while (addedDays < duration){
		// 	System.debug('resultantStartDate ==> '+resultantStartDate);
		// 	resultantStartDate = resultantStartDate.addDays(1);
		// 	System.debug('resultantStartDate after adding day ==> '+resultantStartDate);
		// 	DateTime currentDate = DateTime.newInstance(resultantStartDate.year(), resultantStartDate.month(), resultantStartDate.day());
		// 	String todayDay = currentDate.format('EEEE');
		// 	if (todayDay != 'Saturday' && todayDay != 'Sunday'){
		// 		++addedDays;
		// 	}
		// }
		// System.debug('end resultantStartDate in addDayskepping method ==> '+resultantStartDate);
		// return resultantStartDate;
        // Long range = (7) * 24 * 60 * 60 * 1000;
        // Date finishDate = System.BusinessHours.add(businessHourId, startDate.addDays(duration), range).date();
        // System.debug('finishDate:'+ finishDate);
        // return finishDate;
        Date startDates = Date.newInstance(startDate.year(), startDate.month(), startDate.day());
        Integer addedDays = 0;

        while (addedDays < duration) {
            startDates = startDates.addDays(1);
            DateTime currentDate = DateTime.newInstance(startDates.year(), startDates.month(), startDates.day());
            String todayDay = currentDate.format('EEEE');
            if (todayDay != 'Saturday' && todayDay != 'Sunday') {
                ++addedDays;
            }
        }

        Date endDate = startDates.addDays(-1); 
        System.debug('Final endDate: ' + endDate);
        return endDate;
	}
    
}