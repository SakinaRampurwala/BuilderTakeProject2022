/* **************************************************************************
* Copyright © Copyright 2017-2018, BuilderTek
* All rights reserved
*
* Controller Class: BT_AdminConfigurationController
* Created by Sagar
*
* Controlelr for Administration page

* - Modifications:
* - Sagar – Initial Development
************************************************************************** */
public with sharing class BT_AdminConfigurationController{
    public Boolean isError{get; set;}
    
    // Varidables for history of opened tabs
    public String strOpenedTabIds{get; set;}
    public String strOpenedPageTabIds{get; set;}
    public String strSelectedTabId{get; set;}
    
    // Lists of parent node configuration objects
    Public List<Admin_Interface_Node_Configuration__c> listNodeConfigurations{get;set;}
    
    // Tab Panel object, use globally in whole page.
    transient Public Component.Apex.OutputText objDynamicTabHeaders {get; set;}
    transient Public Component.Apex.OutputPanel objDynamicTabContents {get; set;}
    
    public boolean isNewOrganization {get; set;}
    public String nameSpacePrefix{get; set;}
    
    private String staticResourceURL = BT_Utils.getResourceURL('SLDS');
    
    // -----------------------------------------------------------------------
    // Constructor Method
    // - Initialize variables used by this VF page
    // - Read data from the Parent Node Configuration object and populate
    // - Get the contents for Home tab
    // -----------------------------------------------------------------------
    Public BT_AdminConfigurationController(){
        isError = false;
        nameSpacePrefix = BT_Utils.getNamespacePrefix();
        listNodeConfigurations = New List<Admin_Interface_Node_Configuration__c>();
        isNewOrganization = BT_Utils.getIsNewOrg();
        strOpenedTabIds = 'Home,';
        strOpenedPageTabIds = '';
        fillMainPanelWithTabs();
    }
    
    /*
    *   Purpose:    Initialize the controller
    *   Parameters: 
    *   UnitTests:  
    */
    public void init(){
         try{
             User currentUser;
             if (Schema.sObjectType.Profile.fields.Name.isAccessible() && Schema.sObjectType.User.fields.Id.isAccessible()) {
                currentUser = [Select Id, Profile.Name From User Where Id = :UserInfo.getUserId() LIMIT 1];    
             }
            if(currentUser.Profile.Name != 'System Administrator'){
                throw new BT_ApplicationException(System.Label.Page_Access_Error);
            }
        } catch(Exception e){
            isError = true;
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.FATAL, e.getMessage()));
            return;
        }
    }
    
    /*
    *   Purpose:    Prepare list of dynamic tab components
    *   Parameters: 
    *   UnitTests:  
    */
    Public PageReference fillMainPanelWithTabs(){
        
        fillNodeConfigurationList();
        
        if (listNodeConfigurations.size() > 0) {
            
            // Attributes of headers
            objDynamicTabHeaders = new Component.Apex.OutputText(escape = false, value = '<ul id="AdminConfigTabHeaders" class="slds-tabs_default__nav">');
            objDynamicTabHeaders.value += '<li style="margin:0px;" class="slds-tabs_default__item slds-grid slds-grid--vertical-align-center slds-active" id="Home"><a class="slds-tabs_default__link" id="AdminConfigTabPanelHome__header" title = "'+System.Label.File_Control_Administration+'" onclick="switchTab(this);">'+System.Label.File_Control_Administration+'</a></li>';
            
            
            List<Component.Apex.OutputText> listChildTabHeaders = New List<Component.Apex.OutputText>();
            List<Component.Apex.OutputPanel> listChildTabContents = New List<Component.Apex.OutputPanel>();
            
            // Attributes of tab panel
            objDynamicTabContents = new Component.Apex.OutputPanel(layout = 'block', id='AdminConfigTabContents',  styleClass = 'slds-tabs_default');
            Component.Apex.OutputPanel objHomeTabContent = new Component.Apex.OutputPanel(layout = 'block', id = 'AdminConfigTabPanelHome', styleClass = 'apInfoTab slds-tabs__content slds-show');
            objDynamicTabContents.childComponents.add(objHomeTabContent);
            Component.Apex.OutputText objHomeTabHTML = new Component.Apex.OutputText(escape = false);
            objHomeTabContent.childComponents.add(objHomeTabHTML);
                    
            // HTML Table for child nodes
            if(listNodeConfigurations.size() == 1){
                objHomeTabHTML.value = '<table width="50%" cellspacing="15" cellpadding="10" border="0" id="homeHTMLTable" class="">';
            } else {
                objHomeTabHTML.value = '<table width="100%" cellspacing="15" cellpadding="10" border="0" id="homeHTMLTable" class="">';
            }
            
            Integer intCount = 0;
            for (Integer intI = 0;intI < listNodeConfigurations.size();intI++) {
                
                if (listNodeConfigurations[intI].Parent_Node__c == null) {
                
                    // System.debug('objTabInfoCardHTML ===> ' + getTabInfoCard(listNodeConfigurations[intI]));
                    if (math.mod(intCount,2) == 0) {
                        
                        objHomeTabHTML.value += '<tr class="">';
                        Component.Apex.OutputText objTabInfoCardHTML = getTabInfoCard(listNodeConfigurations[intI]);
                        objHomeTabHTML.value += ''+objTabInfoCardHTML.value;
                        intCount++;
                        
                    } else {
                        Component.Apex.OutputText objTabInfoCardHTML = getTabInfoCard(listNodeConfigurations[intI]);
                        objHomeTabHTML.value += ''+objTabInfoCardHTML.value;
                        intCount++;
                    }
                    
                    listChildTabHeaders = getChildTabHeaders(listNodeConfigurations[intI]);
                    if (listChildTabHeaders.size() > 0) {
                        for (Component.Apex.OutputText objTabHeader : listChildTabHeaders) {
                            // Tab for visualforce page on child node
                            objDynamicTabHeaders.value +=  '' + objTabHeader.value;
                        }
                    }
                    
                    listChildTabContents = getChildTabContents(listNodeConfigurations[intI]);
                    if (listChildTabContents.size() > 0) {
                        for (Component.Apex.OutputPanel objTabContent : listChildTabContents) {
                            // Tab for visualforce page on child node
                            objDynamicTabContents.childComponents.add(objTabContent);
                        }
                    }
                }
            }
            objHomeTabHTML.value += '</tr></table>';
            objDynamicTabHeaders.value += '</ul>';
        }
        
        return null;
    }
    
    /*
    *   Purpose: Returns list of child component header components
    *   Parameters: 
    *   UnitTests:  
    */
    public List<Component.Apex.OutputText> getChildTabHeaders(Admin_Interface_Node_Configuration__c objNodeConfiguration){
        List<Component.Apex.OutputText> listChildTabHeaders = New List<Component.Apex.OutputText>();
        if(objNodeConfiguration == null){
            return listChildTabHeaders;
        }
        
        List<Admin_Interface_Node_Configuration__c> listChildNodes = new List<Admin_Interface_Node_Configuration__c> ();
        for(Admin_Interface_Node_Configuration__c childNode : objNodeConfiguration.Admin_Interface_Node_Configurations__r){
            listChildNodes.add(childNode);
        }
        
        if(listChildNodes.size() > 0) {
            
            Component.Apex.OutputText objChildTabHeader = getTabHeader(objNodeConfiguration);
            listChildTabHeaders.add(objChildTabHeader);
            
            for (Integer intI = 0;intI < listChildNodes.size();intI++) {
                Admin_Interface_Node_Configuration__c objNodeForGetTabs;
                for (Admin_Interface_Node_Configuration__c objNextNodeConfiguration : listNodeConfigurations) {
                    if (objNextNodeConfiguration.Id == listChildNodes[intI].Id) {
                        objNodeForGetTabs = objNextNodeConfiguration;
                    }
                }
                
                if (objNodeForGetTabs != null) {
                    List<Component.Apex.OutputText> listNextChildTabHeaders = getChildTabHeaders(objNodeForGetTabs);
                    if (listNextChildTabHeaders.size() > 0)     {
                        for (Component.Apex.OutputText objTabHeader : listNextChildTabHeaders) {
                            listChildTabHeaders.add(objTabHeader);
                        }
                    }
                }
            }
        }
        return listChildTabHeaders;
    }
    
    /*
    *   Purpose: Returns list of child component content components
    *   Parameters: 
    *   UnitTests:  
    */
    public List<Component.Apex.OutputPanel> getChildTabContents(Admin_Interface_Node_Configuration__c objNodeConfiguration){
        List<Component.Apex.OutputPanel> listChildTabContents = New List<Component.Apex.OutputPanel>();
        if(objNodeConfiguration == null){
            return listChildTabContents;
        }
        
        List<Admin_Interface_Node_Configuration__c> listChildNodes = new List<Admin_Interface_Node_Configuration__c> ();
        for(Admin_Interface_Node_Configuration__c childNode : objNodeConfiguration.Admin_Interface_Node_Configurations__r){
            listChildNodes.add(childNode);
        }
        
        if(listChildNodes.size() > 0) {
            Component.Apex.OutputPanel objChildTabContent = New Component.Apex.OutputPanel(layout = 'block', id = 'AdminConfigTabPanel'+objNodeConfiguration.Id, styleClass = 'apInfoTab slds-tabs__content');
            objChildTabContent.expressions.rendered = '{!if(CONTAINS(strOpenedTabIds,\''+objNodeConfiguration.Id+'\'),true,false)}';
            listChildTabContents.Add(objChildTabContent);
            
            Component.Apex.OutputText objChildTabHTML = new Component.Apex.OutputText(escape = false);
            
            // HTML Table for child nodes
            if(listChildNodes.size() == 1) {
                objChildTabHTML.value = '<table width="50%" cellspacing="15" cellpadding="10" border="0" id="'+objNodeConfiguration.Id+'HTMLTabel" class="">';
            } else {
                objChildTabHTML.value = '<table width="100%" cellspacing="15" cellpadding="10" border="0" id="'+objNodeConfiguration.Id+'HTMLTabel" class="">';
            }
            
            Integer intCount = 0;
            for (Integer intI = 0;intI < listChildNodes.size();intI++) {
                if (math.mod(intCount, 2) == 0) {
                    objChildTabHTML.value += '<tr class="">';
                    Component.Apex.OutputText objChildTabInfoCardHTML = getTabInfoCard(listChildNodes[intI]);
                    objChildTabHTML.value += ''+objChildTabInfoCardHTML.value;
                    intCount++;
                    
                } else {
                    Component.Apex.OutputText objChildTabInfoCardHTML = getTabInfoCard(listChildNodes[intI]);
                    objChildTabHTML.value += ''+objChildTabInfoCardHTML.value;
                    intCount++;
                }
                
                Admin_Interface_Node_Configuration__c objNodeForGetTabs;
                for (Admin_Interface_Node_Configuration__c objNextNodeConfiguration : listNodeConfigurations) {
                    if (objNextNodeConfiguration.Id == listChildNodes[intI].Id) {
                        objNodeForGetTabs = objNextNodeConfiguration;
                    }
                }
                
                if (objNodeForGetTabs != null) {
                    List<Component.Apex.OutputPanel> listNextChildTabContents = getChildTabContents(objNodeForGetTabs);
                    if (listNextChildTabContents.size() > 0)     {
                        for (Component.Apex.OutputPanel objTabContent : listNextChildTabContents) {
                            listChildTabContents.add(objTabContent);
                        }
                    }
                }
            }
            objChildTabHTML.value += '</tr></table>';
            objChildTabContent.childComponents.add(objChildTabHTML);
        }
        return listChildTabContents;
    }
    
    /*
    *   Purpose: Returns HTML for tab header
    *   Parameters: 
    *   UnitTests:  
    */
    private Component.Apex.OutputText getTabHeader(Admin_Interface_Node_Configuration__c objNodeConfiguration){
        Component.Apex.OutputText objTabHeader = new Component.Apex.OutputText(escape = false, value = '');
        objTabHeader.value += '<li style="margin:0px;" class="slds-tabs_default__item slds-grid slds-grid--vertical-align-center" id="'+objNodeConfiguration.Id+'"><a class="slds-tabs_default__link" id="AdminConfigTabPanel'+objNodeConfiguration.Id+'__header" title = "'+objNodeConfiguration.Tab_Name__c+'" onclick="switchTab(this);">'+objNodeConfiguration.Tab_Name__c+'</a></li>';
        return objTabHeader;    
    }
    
    /*
    *   Purpose: Returns HTML for tab content
    *   Parameters: 
    *   UnitTests:  
    */
    private Component.Apex.OutputText getTabInfoCard(Admin_Interface_Node_Configuration__c objNodeConfiguration){
        Component.Apex.OutputText objTabInfoCard = new Component.Apex.OutputText(escape = false, value = '');
        if(objNodeConfiguration.Page_URL__c == null) {
            objTabInfoCard.value += '<td width="50%" class="parentNodeDiv" onclick="openChildNodeTab(\''+objNodeConfiguration.Id+'\');">';
        }
        else {
            if (objNodeConfiguration.Open_New_Tab__c == false) {
                objTabInfoCard.value += '<td width="50%" class="parentNodeDiv" onclick="openVFPageTab(\''+objNodeConfiguration.Page_URL__c.escapeEcmaScript().escapeHtml4()+'\',\''+objNodeConfiguration.Tab_Name__c.escapeEcmaScript().escapeHtml4()+'\',\''+objNodeConfiguration.Id+'\');">';
            } else {
                objTabInfoCard.value += '<td width="50%" class="parentNodeDiv" onclick="openNewTab(\''+objNodeConfiguration.Page_URL__c.escapeEcmaScript().escapeHtml4()+'\');">';
            }
        }
        objTabInfoCard.value += '<ul class="slds-has-dividers--around-space" style="cursor: pointer;"><li class="slds-item">';
        objTabInfoCard.value += '<div class="slds-tile slds-tile--board"><div class="slds-tile__detail slds-text-body--small">';
        objTabInfoCard.value += '<p class="slds-text-heading--small"><img class="apLightningTileBoardIcon slds-button__icon" src="'+objNodeConfiguration.Icon_URL__c.escapeHtml4()+'"/><a href="javascript:void(0);">'+objNodeConfiguration.Name.escapeEcmaScript().escapeHtml4()+'</a></p>';
        if(objNodeConfiguration.Description__c != null && objNodeConfiguration.Description__c != ''){
            objTabInfoCard.value += '<p class="slds-truncate">'+objNodeConfiguration.Description__c.escapeEcmaScript().escapeHtml4()+'</p>';    
        }
        objTabInfoCard.value += '</div></div>';
        objTabInfoCard.value += '</li></ul>';
        return objTabInfoCard;
    }
    
    /********************************************************************
    Purpose: Method is for add tab with the it's child nodes, whenever 
             click on parent node.
    Parameters: 
    Returns: 
    Throws:
    ********************************************************************/
    Public PageReference openChildNodeTab(){
        if (apexpages.currentpage().getparameters().get('prmParentNodeId') != null) {
            String strParentNodeId = apexpages.currentpage().getparameters().get('prmParentNodeId').escapeHtml4();
            if(!strOpenedTabIds.Contains(strParentNodeId + ',')) {
                strOpenedTabIds += strParentNodeId + ',';
                strSelectedTabId = strParentNodeId;
            } else {
                strSelectedTabId = strParentNodeId;
            }
        }
        return null;
    }
    
    /********************************************************************
    Purpose: Method is for close the tab, and open next or previous tab.
    Parameters: 
    Returns: 
    Throws:
    ********************************************************************/
    Public PageReference closeTab(){
        if (apexpages.currentpage().getparameters().get('prmCloseTabId') != null) {
            String strTabId = apexpages.currentpage().getparameters().get('prmCloseTabId').escapeHtml4();
            String strNextNodeId = apexpages.currentpage().getparameters().get('prmNextNodeId').escapeHtml4();
            if (strOpenedTabIds.Contains(strTabId + ',')) {
                strOpenedTabIds = strOpenedTabIds.replace(strTabId + ',','');
                strSelectedTabId = strNextNodeId;
            }
        }
        return null;
    }
    
    /********************************************************************
    Purpose: Method is stands for open visualforce page in next tab.
    Parameters: 
    Returns: 
    Throws:
    ********************************************************************/
    Public PageReference openVFPageTab(){
        if (apexpages.currentpage().getparameters().get('prmPageUrl') != null && apexpages.currentpage().getparameters().get('prmPageUrl') != ''
             && apexpages.currentpage().getparameters().get('prmPageTabId') != null) {
            
            String strPageName = apexpages.currentpage().getparameters().get('prmPageUrl').escapeHtml4();
            String strPageTabName = apexpages.currentpage().getparameters().get('prmPageTabeName').escapeHtml4();
            String strPageTabId = apexpages.currentpage().getparameters().get('prmPageTabId').escapeHtml4();
            
            system.debug('strPageName ---------> '+strPageName);
            
            if (!strOpenedPageTabIds.Contains(strPageTabId)) {
                
                List<String> fields = new List<String>{'Id', 'Name', 'Description__c', 'Open_New_Tab__c', 'Icon_URL__c', 'Page_URL__c', 'Tab_Name__c', 'Parent_Node__c'};
                // Check field level access
                SOQLManager.checkFieldAccess(Admin_Interface_Node_Configuration__c.sObjectType, fields);
                // List of node configuration
                Admin_Interface_Node_Configuration__c adminConfigurationNode;
                for(Admin_Interface_Node_Configuration__c node : Database.query(String.escapeSingleQuotes('Select '+BT_Utils.buildSelectListFragment(null, null, fields) +' FROM Admin_Interface_Node_Configuration__c LIMIT 999'))){
                    if(node.Id == strPageTabId){
                        adminConfigurationNode = node;
                        break;
                    }
                }
                // Tab for visualforce page on child node
                String strTabHeaders = String.valueOf(objDynamicTabHeaders.value);
                strTabHeaders =  strTabHeaders.substring(0,  strTabHeaders.length() - 5);
                Component.Apex.OutputText objPageTabHeader = getTabHeader(adminConfigurationNode);
                objDynamicTabHeaders.value = strTabHeaders + objPageTabHeader.value;
                objDynamicTabHeaders.value += '</ul>';
                
                // Attributes of tab panel
                Component.Apex.OutputPanel objPageTabContent = new Component.Apex.OutputPanel(layout = 'block', style = 'min-height: 500px;', id = 'AdminConfigTabPanel'+adminConfigurationNode.Id, styleClass = 'apPageTab slds-tabs__content');
                objPageTabContent.expressions.rendered = '{!if(CONTAINS(strOpenedTabIds,\''+strPageTabId+'\'),true,false)}';
                objDynamicTabContents.childComponents.add(objPageTabContent);
                
                // Iframe for visualforce page
                Component.Apex.Iframe objIframe = New Component.Apex.Iframe(id = 'iframe'+adminConfigurationNode.Id);
                //Component.Apex.Image objImg = New Component.Apex.Image(id = 'image'+adminConfigurationNode.Id);
                objPageTabContent.childComponents.add(objIframe);
                //objPageTabContent.childComponents.add(objImg);
                
                if (strPageName.Contains('apex') && strPageName.Contains('?')) { 
                    objIframe.src = strPageName+'&isdtp=vw';
                    if(BT_Utils.isLightning()){
                        objIframe.src += '&isLX=1';
                    }
                } else if (strPageName.Contains('apex')) {
                    objIframe.src = strPageName+'?isdtp=vw';
                    if(BT_Utils.isLightning()){
                        objIframe.src += '&isLX=1';
                    }
                } else {
                    objIframe.src = strPageName;
                    if(BT_Utils.isLightning()){
                        objIframe.src += ''; 
                    }
                    
                }
                
                system.debug('objIframe ------> '+objIframe.src);
                
                objIframe.scrolling = true;
                //objIframe.height = '100%';
              //  objIframe.height = '720px';
                
                strOpenedTabIds += strPageTabId + ',';
                strOpenedPageTabIds += strPageTabId + ',';
                strSelectedTabId = strPageTabId;
                
            } else {
                strOpenedTabIds += strPageTabId + ',';
                strSelectedTabId = strPageTabId;
            }
        }
        return null;
    }
    
    /********************************************************************
    Purpose: fillNodeConfigurationList is for retrieve 
             parent node configuration and fill the list.
    Parameters: 
    Returns: 
    Throws:
    ********************************************************************/
    public void fillNodeConfigurationList(){
        List<String> fields = new List<String>{'Id', 'Name', 'Description__c', 'Open_New_Tab__c', 'Icon_URL__c', 'Page_URL__c', 'Tab_Name__c', 'Parent_Node__c'};
        // Check field level access
        SOQLManager.checkFieldAccess(Admin_Interface_Node_Configuration__c.sObjectType, fields);
        // List of node configuration
        listNodeConfigurations = Database.query(String.escapeSingleQuotes('Select '+BT_Utils.buildSelectListFragment(null, null, fields) + ','+ 
                                ' (Select '+BT_Utils.buildSelectListFragment(null, null, fields) + 
                                ' FROM Admin_Interface_Node_Configurations__r WHERE Disable__c = False ORDER BY Index__c,Name Asc) FROM Admin_Interface_Node_Configuration__c WHERE Disable__c = False ORDER BY Index__c,Name Asc'));
        
        System.debug('listNodeConfigurations => '+listNodeConfigurations);
        for (Admin_Interface_Node_Configuration__c Conf : listNodeConfigurations) {
            System.debug('Conf ==> ' + Conf);
        }
                         
    }
    
    /********************************************************************
    Purpose: Initialize new org.
    Parameters: 
    Returns: 
    Throws:
    ********************************************************************/
    public pageReference initializeNewOrg(){
        // Initialize new org congfiguration
        BT_Utils.initializeNewOrg();
        Pagereference pg = new PageReference('/apex/BT_AdminConfiguration');
        pg.setRedirect(true);
        return pg;
    }
    
    /********************************************************************
    Purpose: reset the configuration buttons
    Parameters: 
    Returns: 
    Throws:
    ********************************************************************/
    public static pageReference reset(){ 
        SavePoint sp = Database.setSavePoint();
        try{
            List<String> fields = new List<String>{'Id'};
            // Check field level access
            SOQLManager.checkFieldAccess(Admin_Interface_Node_Configuration__c.sObjectType, fields);
            List<Admin_Interface_Node_Configuration__c> adminConfigurations = Database.query(String.escapeSingleQuotes('Select '+BT_Utils.buildSelectListFragment(null, null, fields) + ' from Admin_Interface_Node_Configuration__c limit 999'));
            DMLManager.deleteAsUser(adminConfigurations);
            initialize();
            Pagereference pg = new PageReference('/apex/BT_AdminConfiguration');
            pg.setRedirect(true);
            return pg;
        } catch(Exception ex){
            Database.rollback(sp);
            ApexPages.Message errorMsg = new ApexPages.Message(ApexPages.Severity.FATAL, ex.getMessage());
            ApexPages.addMessage(errorMsg);
            return null;
        }
    } 
   
    /********************************************************************
    Purpose: initialize the configuration buttons
    Parameters: 
    Returns: 
    Throws:
    ********************************************************************/
    public static void initialize(){ 
        string nameSpacePrefix = BT_Utils.getNamespacePrefix();
        //*******************************************************************
        // Create all first level nodes
        //*******************************************************************
        List<Admin_Interface_Node_Configuration__c> firstLevelNodes = new List<Admin_Interface_Node_Configuration__c>();
        
        Admin_Interface_Node_Configuration__c systemConfigurationNode = new Admin_Interface_Node_Configuration__c();
        systemConfigurationNode.Name = System.Label.System_Configuration;
        systemConfigurationNode.Disable__c = false;
        systemConfigurationNode.Index__c = 1;
        systemConfigurationNode.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/settings_60.png';
        systemConfigurationNode.Tab_Name__c = System.Label.System_Configuration;
        systemConfigurationNode.Page_URL__c = '/apex/BT_ApplicationConfiguration';
        systemConfigurationNode.Description__c = System.Label.System_Configuration_Description;
        firstLevelNodes.add(systemConfigurationNode);
        
        Admin_Interface_Node_Configuration__c fileExplorerPageConfigurationNode = new Admin_Interface_Node_Configuration__c();
        fileExplorerPageConfigurationNode.Name = System.Label.File_Explorer_Page_Configuration;
        fileExplorerPageConfigurationNode.Disable__c = false;
        fileExplorerPageConfigurationNode.Index__c = 2;
        fileExplorerPageConfigurationNode.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/settings_60.png';
        fileExplorerPageConfigurationNode.Tab_Name__c = System.Label.File_Explorer_Page_Configuration;
        fileExplorerPageConfigurationNode.Page_URL__c = '/apex/BT_FileExplorerPageConfiguration';
        fileExplorerPageConfigurationNode.Description__c = System.Label.File_Explorer_Page_Configuration_Description;
        firstLevelNodes.add(fileExplorerPageConfigurationNode);
        
        /*
        Admin_Interface_Node_Configuration__c fileManagementConfig = new Admin_Interface_Node_Configuration__c();
        fileManagementConfig.Name = System.Label.File_Management_Configuration;
        fileManagementConfig.Disable__c = false;
        fileManagementConfig.Index__c = 3;
        fileManagementConfig.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/settings_60.png';
        fileManagementConfig.Page_URL__c = '/apex/BT_FileManagementConfiguration';
        fileManagementConfig.Tab_Name__c = System.Label.File_Management_Configuration;
        fileManagementConfig.Description__c = System.Label.File_Management_Configuration_Description;
        firstLevelNodes.add(fileManagementConfig);
        */
        
        Admin_Interface_Node_Configuration__c fileUploadConfig = new Admin_Interface_Node_Configuration__c();
        fileUploadConfig.Name = System.Label.File_Upload_Page_Configuration;
        fileUploadConfig.Disable__c = false;
        fileUploadConfig.Index__c = 3;
        fileUploadConfig.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/settings_60.png';
        fileUploadConfig.Page_URL__c = '/apex/BT_FileUploadPageConfiguration';
        fileUploadConfig.Tab_Name__c = System.Label.File_Upload_Page_Configuration;
        fileUploadConfig.Description__c = System.Label.File_Upload_Configuration_Page_Description;
        firstLevelNodes.add(fileUploadConfig);
        
        Admin_Interface_Node_Configuration__c cleanupFilesAndFoldersNode = new Admin_Interface_Node_Configuration__c();
        cleanupFilesAndFoldersNode.Name = System.Label.Cleanup_Files;
        cleanupFilesAndFoldersNode.Disable__c = false;
        cleanupFilesAndFoldersNode.Index__c = 4;
        cleanupFilesAndFoldersNode.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/delete_60.png';
        cleanupFilesAndFoldersNode.Tab_Name__c = System.Label.Cleanup_Files;
        cleanupFilesAndFoldersNode.Page_URL__c = '/apex/BT_CleanupFiles';
        cleanupFilesAndFoldersNode.Description__c = System.Label.Cleanup_Files_Description;
        firstLevelNodes.add(cleanupFilesAndFoldersNode);
        
        Admin_Interface_Node_Configuration__c importFilesAndFoldersNode = new Admin_Interface_Node_Configuration__c();
        importFilesAndFoldersNode.Name = System.Label.Import_Files;
        importFilesAndFoldersNode.Disable__c = false;
        importFilesAndFoldersNode.Index__c = 5;
        importFilesAndFoldersNode.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/download_60.png';
        importFilesAndFoldersNode.Tab_Name__c = System.Label.Import_Files;
        importFilesAndFoldersNode.Page_URL__c = '/apex/BT_ImportFiles';
        importFilesAndFoldersNode.Description__c = System.Label.Import_Files_Description;
        firstLevelNodes.add(importFilesAndFoldersNode);
        
        Admin_Interface_Node_Configuration__c groupManagementNode = new Admin_Interface_Node_Configuration__c();
        groupManagementNode.Name = System.Label.Group_Management;
        groupManagementNode.Disable__c = false;
        groupManagementNode.Index__c = 5;
        groupManagementNode.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/groups_60.png';
        groupManagementNode.Tab_Name__c = System.Label.Group_Management;
        groupManagementNode.Page_URL__c = '/apex/BT_GroupManagement';
        groupManagementNode.Description__c = System.Label.Group_Management_Description;
        firstLevelNodes.add(groupManagementNode);
        
        Admin_Interface_Node_Configuration__c emailFilesNode = new Admin_Interface_Node_Configuration__c();
        emailFilesNode.Name = System.Label.Email_Files_to_Users;
        emailFilesNode.Disable__c = false;
        emailFilesNode.Index__c = 6;
        emailFilesNode.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/email_60.png';
        emailFilesNode.Open_New_Tab__c = true;
        emailFilesNode.Tab_Name__c = System.Label.Email_Files_to_Users;
        emailFilesNode.Page_URL__c = '/apex/'+nameSpacePrefix+'BT_EmailFilesToUsers';
        emailFilesNode.Description__c = System.Label.Email_Files_to_Users_Description;
        firstLevelNodes.add(emailFilesNode);
        
        Admin_Interface_Node_Configuration__c treeConfigurationNode = new Admin_Interface_Node_Configuration__c();
        treeConfigurationNode.Name = System.Label.Tree_Configuration;
        treeConfigurationNode.Disable__c = false;
        treeConfigurationNode.Index__c = 7;
        treeConfigurationNode.Icon_URL__c = '/resource/'+nameSpacePrefix+'SLDS/assets/icons/utility/settings_60.png';
        treeConfigurationNode.Tab_Name__c = System.Label.Tree_Configuration;
        treeConfigurationNode.Open_New_Tab__c = true;
        Schema.DescribeSObjectResult describeTreeConfigurationResult = Tree_Configuration__c.sObjectType.getDescribe();
        treeConfigurationNode.Page_URL__c = '/'+describeTreeConfigurationResult.getKeyPrefix();
        treeConfigurationNode.Description__c = System.Label.Tree_Configuration_Description;
        firstLevelNodes.add(treeConfigurationNode);
        
        try {
            DMLManager.insertAsUser(firstLevelNodes);
        } catch(Exception ex){
            ApexPages.Message errorMsg = new ApexPages.Message(ApexPages.Severity.FATAL, ex.getMessage());
            ApexPages.addMessage(errorMsg);
            return;
        }
    }
}