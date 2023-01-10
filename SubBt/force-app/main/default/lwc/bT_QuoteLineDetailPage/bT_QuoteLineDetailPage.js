import { LightningElement, api, track } from 'lwc';
import getProductName from '@salesforce/apex/bT_QuoteLineDetailPage.getProductName';
import getUnitPrice from '@salesforce/apex/bT_QuoteLineDetailPage.getUnitPrice';

export default class BT_QuoteLineDetailPage extends LightningElement {

    @api recordId;
    @api objectApiName;
    @api flexipageRegionWidth;
    @track isDetail = true;
    @track isEdit = false;
    @track ProductName = 'test'; 
    @track UnitPrice = '0';

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
        console.log('refresh');
        eval("$A.get('e.force:refreshView').fire();");
    }

    handleSuccess(event) {
        // console.log('handleSuccess');
    }

    hnadleChange(event){
        var id = event.target.value;
        console.log(id);
        getProductName({id:id})
        .then(result => {
            console.log(result);
            this.ProductName = result;
        }
        )
        .catch(error => {
            this.error = error;
        }
        );

        getUnitPrice({id:id})
        .then(result => {
            console.log(result);
            this.UnitPrice = result;
        }
        )
        .catch(error => {
            this.error = error;
        }
        );


    }




}