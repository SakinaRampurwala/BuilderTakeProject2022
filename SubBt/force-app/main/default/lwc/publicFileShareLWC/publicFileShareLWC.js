import { LightningElement, track, wire, api } from 'lwc';
import getFolderList from "@salesforce/apex/PublicFileShareController.getFolderList";
import createPublicFolder from "@salesforce/apex/PublicFileShareController.createPublicFolder";
import {NavigationMixin} from 'lightning/navigation'

export default class PublicFileShareLWC extends NavigationMixin(LightningElement) {

    @api recordId; // Passed record ID
    @track spinnerDataTable = true;
    @track folderData = [];
    @track selectedFolder = '';
    @track showManageFolder = false;

    @track showNewFolderPopup = false;
    @track newFolderName = '';
    @track newFolderDescription = '';

    connectedCallback() {
        try {
            this.getFolderDataFromApex()            
        } catch (error) {
            console.error(error);
        }
    }

    getFolderDataFromApex(){
        getFolderList()
            .then((response) =>{
                console.log("FolderData:- ",response);
                this.folderData = response;
                this.spinnerDataTable = false
            });
    }

    handleNewFolder(event){
        this.showNewFolderPopup = true;
    }

    handleNameChange(event) {
        this.newFolderName = event.target.value;
    }

    handleDescriptionChange(event) {
        this.newFolderDescription = event.target.value;
    }

    createFolder(){
        this.spinnerDataTable = true
        createPublicFolder({ Fname : this.newFolderName, Fdesc : this.newFolderDescription })
        .then((response) =>{
            console.log('Response for create folder :- ',response);
            this.getFolderDataFromApex()
            this.template.querySelector('c-toast-component').showToast('success', 'New Folder Created Successfully', 3000);
            this.spinnerDataTable = false
        })
        this.showNewFolderPopup = false
    }

    manageFolder(event){
        let folderId = event.currentTarget.dataset.id;
        this.selectedFolder = folderId;
        this.showManageFolder = true;
    }

    closeManageFolder(){
        this.showManageFolder = false;
    }
}