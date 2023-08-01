({
	doInit : function(component, event, helper) {
        component.set("v.Spinner", true);
        var dbAction = component.get("c.getTemplates");
        dbAction.setCallback(this, function(response) {
            var state = response.getState();
            var error = response.getError();

            console.log({state});
            console.log({error});

            if (state === "SUCCESS") {
                console.log( response.getReturnValue());
                var result= response.getReturnValue();
                result.forEach(function(value){
                    console.log(value);
                    if(value.Name === 'Quote'){
                        component.set("v.selectedTemplate" ,value.Id);
                        helper.getTemplateBody(component, event, helper);
                    }
                })
                // component.set("v.templates", response.getReturnValue());
                component.set("v.Spinner", false);
            }
        });

        $A.enqueueAction(dbAction);

       
    },
    scrolldown: function(component, event, helper) {

        document.getElementById('footer').scrollIntoView();

    },
    scrollup: function(component, event, helper) {

        document.getElementById('header').scrollIntoView(true);

    },
    // preiewEmailTemplate: function(component, event, helper) {
    //     console.log('Preview email template');

    //     var selectedTemplate = component.get("v.selectedTemplate");
    //     console.log(selectedTemplate);
    //     if (selectedTemplate != undefined) {
    //         component.set("v.isTemplateSelected", true);
    //         // helper.getTemplateBody(component, event, helper);
    //         var recordId = component.get("v.recordId");
    //         var action = component.get("c.getQuoteLines");
    //         action.setParams({
    //             recordId: recordId,
    //             templateId: component.get("v.selectedTemplate")
    //         });
    //         action.setCallback(this, function(response) {
    //             var state = response.getState();
    //             if (state === "SUCCESS") {
    //                 var result = response.getReturnValue();
    //                 console.log('get template body');
    //                 console.log({ result });
    //                 component.set("v.quoteLines", result);
    //             }
    //         });
    //         $A.enqueueAction(action);
    //     }
    // },

    closeModel: function(component, event, helper) {
        // location.reload(); 
        $A.get("e.force:closeQuickAction").fire();

    },
    downloadFile:function(component, event, helper) {
        var data= component.get("v.quoteLines");
        // console.log(data);

        var action = component.get('c.setAttachmentBody2');
        action.setParams({
            recordId: component.get("v.recordId"),
            templateId:component.get("v.selectedTemplate"),
            fileid:'',

        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            var error = response.getError();

            console.log({state});
            console.log({error});
            console.log(response.getReturnValue());

            if (state === "SUCCESS") {
               console.log(response.getReturnValue());
               let fileBlob = response.getReturnValue();

               let downloadLink = document.createElement("a");
                downloadLink.href = "data:text/html;base64,"+fileBlob;
                downloadLink.download = "quote.pdf";
                downloadLink.click();
               
            }
        });
        $A.enqueueAction(action);
        
        // // Create a new jsPDF instance
        // var doc = new jsPDF();

        // // Add content to the PDF
        // doc.text("Hello, this is a sample PDF generated using jsPDF in Aura component!", 10, 10);

        // // Save the PDF
        // doc.save("sample.pdf");
        // const blob = new Blob([data], { type: "application/pdf" });

        // // Create a new anchor element.
        // const link = document.createElement("a");
        
        // // Set the href attribute of the anchor element to the blob data.
        // link.href = window.URL.createObjectURL(blob);
        
        // // Set the download attribute of the anchor element to the filename.
        // link.download = 'TestFile.pdf';
        
        // // Click the anchor element to download the PDF file.
        // link.click();



          

    },

    scriptsLoaded:function(component, event, helper) {
        console.log('SCRIPT LOADED SUCCESFULLY::');


    }
})