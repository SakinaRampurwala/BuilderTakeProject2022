import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import GOOGLE_API from '@salesforce/resourceUrl/GooglePicker';

export default class GooglePicker extends LightningElement {
    connectedCallback() {
        this.loadGoogleApi();
    }

    loadGoogleApi() {
        loadScript(this, GOOGLE_API)
            .then(() => {
                gapi.load('auth');
                gapi.load('picker');
            })
            .catch((error) => {
                console.error('Error loading Google API', error);
            });
    }

    openGooglePicker() {
        const picker = new google.picker.PickerBuilder()
            .addView(google.picker.ViewId.DOCS)
            .setOAuthToken(gapi.auth.getToken().access_token)
            .setDeveloperKey('<YOUR_DEVELOPER_KEY>')
            .setCallback((data) => {
                if (data.action === google.picker.Action.PICKED) {
                    const fileId = data.docs[0].id;
                    console.log('Selected file ID:', fileId);
                }
            })
            .build();

        picker.setVisible(true);
    }


}