import { LightningElement, api, track } from 'lwc';

export default class BT_QuoteLineDetailPage extends LightningElement {

    @api recordId;
    @api objectApiName;
    @api flexipageRegionWidth;
    @track isDetail = true;
    @track isEdit = false;

    handleEdit() {
        console.log('handleEdit');
        this.isDetail = false;
        this.isEdit = true;
    }

    handleCancel() {
        console.log('handleCancel');
        this.isDetail = true;
        this.isEdit = false;
    }

    handleSave(){
        console.log('handleSave');
        this.isDetail = true;
        this.isEdit = false;
    }




}