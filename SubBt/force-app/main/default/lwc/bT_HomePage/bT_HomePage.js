import { LightningElement, track, wire } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import PDF_Resource from '@salesforce/resourceUrl/Releasenote';
import Resource from '@salesforce/resourceUrl/Release';
import getStaticResourceDescription from '@salesforce/apex/PDFController.getStaticResourceDescription';
import designcss from '@salesforce/resourceUrl/designcss';
import sendemail from '@salesforce/apex/PDFController.sendemail';
import createCase from '@salesforce/apex/PDFController.createCase';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class Bt_HomePage extends NavigationMixin(LightningElement) {
  @track spinnerdatatable = false;
  error_toast = true;
  pdfUrl;
  img;
  descriptionValue;
  activeSections = ['A'];
  activeSectionsMessage = '';
  supportname;
  email;
  subject;
  message;
  name_msg = true;
  email_msg = true;
  Message_msg = true;
  subject_msg = true;


  connectedCallback() {
    this.img = Resource;
    this.pdfUrl = PDF_Resource;
    document.title = 'BT Home Page';
    loadStyle(this, designcss);
  }
  openPDF() {
    window.open(this.pdfUrl);
  }
  handleSectionToggle(event) {
    const openSections = event.detail.openSections;

    if (openSections.length === 0) {
      this.activeSectionsMessage = 'All sections are closed';
    } else {
      this.activeSectionsMessage =
        'Open sections: ' + openSections.join(', ');
    }
  }
  
  @wire(getStaticResourceDescription)
  wiredDescription({ error, data }) {
      if (data) {
          this.descriptionValue = data;
          console.log(this.descriptionValue);
      } else if (error) {
          console.error('Error fetching static resource description:', error);
      }
  }
  renderedCallback() {
    this.template.querySelectorAll("a").forEach(element => {
      element.addEventListener("click", evt => {
        let target = evt.currentTarget.dataset.tabId;

        this.template.querySelectorAll("a").forEach(tabel => {
          if (tabel === element) {
            tabel.classList.add("active-tab");
          } else {
            tabel.classList.remove("active-tab");
          }
        });
        this.template.querySelectorAll(".tab").forEach(tabdata => {
          tabdata.classList.remove("active-tab-content");
        });
        this.template.querySelector('[data-id="' + target + '"]').classList.add("active-tab-content");
      });
    });
  }


  tabing() {
    const target = "tab1";
    this.template.querySelectorAll("a").forEach(tabel => {
      tabel.classList.remove("active-tab");
    });
    this.template.querySelectorAll(".tab").forEach(tabdata => {
      tabdata.classList.remove("active-tab-content");
    });
    this.template.querySelector('[data-tab-id="' + target + '"]').classList.add("active-tab");
    this.template.querySelector('[data-id="' + target + '"]').classList.add("active-tab-content");
  }

  Support_name(event) {
    this.supportname = event.target.value;
    this.name_msg = true;
  }

  Support_email(event) {
    this.email = event.target.value;
    this.email_msg = true;
  }
  Support_message(event) {
    this.message = event.target.value;
    this.Message_msg = true;

  }
  Support_subject(event) {
    this.subject = event.target.value;
    this.subject_msg = true;

  }
  onSubmit() {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var validation1 = pattern.test(this.email);
    this.supportname = this.supportname.trim();
    this.subject = this.subject.trim();
    this.message = this.message.trim();
    if ((this.supportname == undefined) || (this.supportname == '')) {
      this.name_msg = false;
    } else if (validation1 == false) {
      this.email_msg = false;
    } else if (this.subject == undefined || (this.subject == '')) {
      this.subject_msg = false;
    } else if (this.message == undefined || (this.message == '')) {
      this.Message_msg = false;
    } else {
      this.email_msg = true;
      createCase({ subject: this.subject, body: this.message })
            .then(result => {
              // Get the newly created record's Id
              const recordId = result;
              console.log('recordId',recordId);
              // Navigate to the newly created record
              this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: recordId,
                    objectApiName: 'Case',
                    actionName: 'view'
                }
            });
            })
            .catch(error => {
              console.log('error',error);
            });
      sendemail({
        name: this.supportname,
        email: this.email,
        subject: this.subject,
        body: this.message
      })
        .then(result => {
          if (result == 'success') {
            this.supportname = '';
            this.email = '';
            this.message = '';
            this.subject = '';
            const event = new ShowToastEvent({
              title: 'Success',
              message: 'Email Sent Successfully.',
              variant: 'success',
            });
            this.dispatchEvent(event);
          } else {
            const event = new ShowToastEvent({
              title: 'Error',
              message: 'An error occurred while sending Email.',
              variant: 'error',
            });
            this.dispatchEvent(event);
          }
        })


    }

  }
  onClear() {
    this.supportname = '';
    this.email = '';
    this.message = '';
    this.subject = '';
    this.name_msg = true;
    this.email_msg = true;
    this.subject_msg = true;
    this.Message_msg = true;
  }


}