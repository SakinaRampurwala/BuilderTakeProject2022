public with sharing class PDFController {
    @AuraEnabled(cacheable=true)
    public static String convertBlobToHTML() {
                // Retrieve the PDF file from a static resource
                StaticResource pdfResource = [SELECT Id, Body FROM StaticResource WHERE Name = 'Releasenote'];
        
                // Convert the PDF Blob to HTML body
                String pdfContent ='';
                String htmlBody = '';
                Blob pdfBlob;
                String pdfUrl = '';
                if (pdfResource != null && pdfResource.Body != null) {
                
                        pdfBlob = pdfResource.Body;
                        System.debug('pdfblob' + pdfBlob);
                        pdfContent = EncodingUtil.base64Encode(pdfBlob);
                         pdfUrl = 'data:application/pdf;base64,' + pdfContent;
                        //  htmlBody = '<html><body><img src="' + pdfUrl + '" width="100%" height="100%"></body></html>';

                        htmlBody = '<html><body><embed src="data:application/pdf;base64,' + pdfContent + '" type="application/pdf" width="100%" height="100%"></embed></body></html>';
                }
                return pdfUrl;
            }
}