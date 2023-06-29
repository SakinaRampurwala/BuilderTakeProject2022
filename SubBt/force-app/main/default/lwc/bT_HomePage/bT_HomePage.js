import { LightningElement, track, wire } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import PDF_Resource from '@salesforce/resourceUrl/Releasenote';
import convertBlobToHTML from '@salesforce/apex/PDFController.convertBlobToHTML';

export default class Qf_guide2 extends LightningElement {
  @track spinnerdatatable = false;
  error_toast = true;
  pdfUrl;
  pdfUrls;
  pdfBlob;
  htmlBody;

  connectedCallback() {
    document.title = 'BT Admin Configuration';
  }

  // loadPdf() {
  //   fetch(PDF_Resource)
  //     .then(response => response.blob())
  //     .then(blob => {
  //       this.pdfBlob = blob;
  //       console.log("log" , this.pdfBlob);
  //       // this.convertBlobToHTML();
  //     })
  //     .catch(error => {
  //       console.error('Error loading PDF:', error);
  //     });
  // }
  @wire(convertBlobToHTML)
  wiredConvertBlobToHTML({ error, data }) {
    if (data) {
      this.pdfUrl = data;
      console.log("HTML Body:", this.pdfUrl);
      // this.createPdfUrl();
      // Perform any additional operations with the HTML body
    } else if (error) {
      console.error('Error converting Blob to HTML:', error);
    }
  }

  createPdfUrl() {
    if (this.pdfUrls) {
      const base64data = btoa(String.fromCharCode(...new Uint8Array(this.pdfUrls)));
      this.pdfUrl = `data:application/pdf;base64,${this.pdfUrls}`;
      console.log("PDF URL:", this.pdfUrl);
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
}