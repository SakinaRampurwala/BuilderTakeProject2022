import { LightningElement, api, track , wire } from 'lwc';
import  getAllFileFolderJunctionObj from "@salesforce/apex/PublicFileShareController.getAllFileFolderJunctionObj";
import  UpdateFileName from "@salesforce/apex/PublicFileShareController.UpdateFileName";
import  getContentDocuments from "@salesforce/apex/PublicFileShareController.getContentDocuments";
import createPublicFileFolderJnc from "@salesforce/apex/PublicFileShareController.createPublicFileFolderJnc";
import {NavigationMixin} from 'lightning/navigation'

export default class PublickFileManageLWC extends NavigationMixin(LightningElement) {

    @api folderid = 'a2l1K000002Dr65QAC';
    @track RelatedJunObj;
    @api recordId;

    @track SelectedFiles = [];
    @track EditedRecords = [];

    @track showfiles = false;
    @track showtable = true;
    @track selectedDocuments = [];
    @track contentDocuments = [];


    connectedCallback(){
        try {
            getAllFileFolderJunctionObj({FolderIds : this.folderid})
            .then(result => {
                console.log('result >> ', JSON.parse(JSON.stringify(result)));
                this.RelatedJunObj = JSON.parse(JSON.stringify(result));
            })
            .catch(error => {
                console.log('error in getAllFileFolderJunctionObj apex call >> ', error);
            })
        } catch (error) {
            console.log(' all related Jun Obj >> ', {error});
            
        }
    }

    Handle_EditFileName(event){
        try {
            if(event.type == 'click' || event.type == 'dblclick'){
            // When user clicked on edit button or double click on field name
                const FileNameInput = this.template.querySelector(`[data-inputfiled=${event.currentTarget.dataset.key}]`);                   // enable Input Filed
                FileNameInput.disabled = false
                FileNameInput.focus();

                this.template.querySelector(`[data-nameedit=${event.currentTarget.dataset.key}]`).style.display = 'none';              // Hide Edit Buttom
                this.template.querySelector(`[data-namedone=${event.currentTarget.dataset.key}]`).style.display = 'block';             // Unhide Edit Done Button
            }
            else if(event.type == 'blur'){
                this.template.querySelector(`[data-inputfiled=${event.currentTarget.dataset.key}]`).disabled = true;
                this.template.querySelector(`[data-nameedit=${event.currentTarget.dataset.key}]`).style.display = 'block';
                this.template.querySelector(`[data-namedone=${event.currentTarget.dataset.key}]`).style.display = 'none';
            }
        } catch (error) {
            console.log('error in Handle_EditFileName >> ', error.stack);
        }
    }

    handle_Changes(event){
        try  {
            var existingRecord = this.EditedRecords.find(obj => obj.JunobjId == event.currentTarget.dataset.key);
            // If User change Aready chnages file name again... then change perticualr JunObj File Name only
            if(existingRecord){
                existingRecord.buildertek__File_Name__c = event.target.value;
            }
            // If user change file name First time ...Add file name and JunObj id to array of Object
            else{ 
                this.EditedRecords.push({
                    Id : event.currentTarget.dataset.key,
                    buildertek__File_Name__c : event.target.value
                })
            }
            
            
        } catch (error) {
            console.log(('error in  handle_Changes>>', error.stack));
            
        }
    }
    
    handle_SaveChanges(event){
        try {
            console.log('this.EditedRecords', JSON.parse(JSON.stringify(this.EditedRecords)));
            UpdateFileName({UpdatedRecords : this.EditedRecords})
            .then(result => {
                console.log('result >. ', result);
                this.EditedRecords.splice(0, this.EditedRecords.length);
                console.log('afetr update this.EditedRecords', JSON.parse(JSON.stringify(this.EditedRecords)));
            })
            .catch(error => {
                console.log('error >> ', error);
            })

        } catch (error) {
            console.log(('error in  handle_SaveChanges>>', error.stack));
            
        }
    }

    Handle_CheckBoxes(event){
        try {
            console.log('checked checkbox >> ', event.currentTarget.dataset.name);
            if(event.currentTarget.dataset.name == 'select_all_checkbox'){
                const select_all_checkboxes = this.template.querySelectorAll(`[data-name="select_file_checkbox"]`);
                if(event.target.checked){
                    // When User "checked" on Select All Checkbox
                    select_all_checkboxes.forEach(ele => {
                        ele.checked = true;                                                                             // Make all checkboxes TRUE(checked)
                        this.SelectedFiles.push(ele.dataset.key);                                                       // Add all record ID into Array/List
                    })
                }
                else{
                    // When User "Unchecked" on Select All Checkbox
                    select_all_checkboxes.forEach(ele => {
                        ele.checked = false;                                                                                // Make all checkboxes FALSE(Unchecked)
                        this.SelectedFiles = this.SelectedFiles.filter(item => (item != ele.dataset.key))                   // Remove all record ID into Array/List
                    });
                }
            }
            else{
                if(event.target.checked){ // When User "checked" Checkbox
                    this.SelectedFiles.push(event.currentTarget.dataset.key);

                    if(this.SelectedFiles.length == this.RelatedJunObj.length){ // when use check all checkbox then Checked Select all checkbox
                        this.template.querySelector(`[data-name="select_all_checkbox"]`).checked = true;
                    }                                              
                }
                else{ // When User "Unchecked" Checkbox
                    this.SelectedFiles = this.SelectedFiles.filter(item => (item != event.currentTarget.dataset.key));
                    
                    if(this.SelectedFiles.length > 0){                      // When User check any checkbox then Unchecked select add checkbox
                        this.template.querySelector(`[data-name="select_all_checkbox"]`).checked = false;
                    }  
                }
            }

        } catch (error) {
            console.log('error in Handle_CheckBoxes >> ', error.stack);
        }
    }

    Handle_deleteFile(event){
        try {
            var RecordToDelete = [];
            if(event.currentTarget.dataset.key == 'delete_selected'){
                if(this.SelectedFiles){
                    RecordToDelete = this.SelectedFiles;
                }
            }
            else {
                RecordToDelete.push(event.currentTarget.dataset.key)
            }

            if(RecordToDelete.length > 0){
                console.log('delete file  >> ', JSON.parse(JSON.stringify(RecordToDelete)));
            }
            else{
                // show toast
            }
            
        } catch (error) {
            console.log('error in Handle_deleteFile >> ', error.stack);
            
        }
    }

    handle_BackButton(event){
        const backbutton = new CustomEvent("backbuttonclick", {
            // detail: pera_m
        });
        this.dispatchEvent(backbutton);
    }

    handleAddFiles(event){
        this.spinnerDataTable = true
        this.showfiles = true;
        this.showtable = false;
        this.getFilesforselectedRecord()
    }

    handleBack(event){
        this.selectedDocuments = [];
        this.showtable = true;
        this.showfiles = false;
    }

    handleCheckboxChange(event) {
        const selectedDocId = event.target.value;
        const isChecked = event.target.checked;
        console.log('selectedDocId :- ',selectedDocId)

        if (isChecked) {
            console.log('isChecked in IF :- ', isChecked);
            this.contentDocuments.forEach(element => {
                console.log(JSON.stringify(element))
                if(element.ContentDocument.Id === selectedDocId){
                    this.selectedDocuments.push(element)
                }
            });

            console.log('selectedDocuments :- ',this.selectedDocuments);
        } else {
            console.log('isChecked in ELSE :- ', isChecked);
            this.selectedDocuments = this.selectedDocuments.filter(doc => doc.ContentDocument.Id !== selectedDocId);
            console.log('selectedDocuments :- ',this.selectedDocuments);
        }
    }

    previewHandler(event){
        console.log('dataset id:- ',event.target.dataset.id)
        this[NavigationMixin.Navigate]({ 
            type:'standard__namedPage',
            attributes:{ 
                pageName:'filePreview'
            },
            state:{
                selectedRecordId: event.target.dataset.id
            }
        })
    }

    getFilesforselectedRecord(){
        getContentDocuments({recordId:this.recordId})
            .then ((response) =>{
                console.log(response)
                console.log(typeof(response))
                const arrayOfObj = Object.values(response);
                console.log("arrayOfObj :- ",arrayOfObj)

                this.contentDocuments = arrayOfObj;
                console.log("ContentDocuments :- ",this.contentDocuments)
                this.spinnerDataTable = false
            });
    }

    handleConfirm(event){
        this.spinnerDataTable = true;
        createPublicFileFolderJnc({ folderId : this.folderid , cdllist : this.selectedDocuments })
        .then((response) =>{
            console.log("Response on confirm click:- ",response);
            if(response == 'Success'){
                this.template.querySelector('c-toast-component').showToast('success', 'Files are added to the selected folders and ready to be viewed publicly', 3000);
                this.spinnerDataTable = false
            }
        })
    }
}