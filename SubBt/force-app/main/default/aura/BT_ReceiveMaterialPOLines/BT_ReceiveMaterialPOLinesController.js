({
    doInit : function(component, event, helper) {
        var myPageRef = component.get("v.pageReference");
       // var pageSize = component.get("v.pageSize");
          var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var action =component.get("c.getProducts");
        action.setParams({
            "recordId" : JSON.parse(JSON.stringify(component.get("v.recordId")))
        });
        action.setCallback(this, function(a){ 
            var obj = JSON.parse(JSON.stringify(a.getReturnValue()))
            obj['quantity_recieved'] = ''
           // alert(JSON.stringify(obj.length));
            component.set("v.rfqRecordList", obj);
            
             component.set("v.totalRecords", component.get("v.rfqRecordList").length);
             var pageNumber = component.get("v.totalRecords");
        //alert(pageNumber);
                component.set("v.startPage", 0);
                component.set("v.endPage", pageSize - 1);
                for (var i = 0; i < pageSize; i++) {
                    if (component.get("v.rfqRecordList").length > i)
                        paginationList.push(obj[i]);
                }
                component.set('v.paginationList', paginationList);
            
            
            
        });
        $A.enqueueAction(action);
          var workspaceAPI = component.find("workspace");
        workspaceAPI.getEnclosingTabId().then((response) => {
            let opendTab = response.tabId;
            workspaceAPI.setTabLabel({
            tabId: opendTab,
            label: "Receive Material"
        });
        workspaceAPI.setTabIcon({
            tabId: opendTab,
            icon: 'custom:custom18',
            iconAlt: 'Receive Material'
        });
    });
    
    },
    
    
    addToPOLines: function (component, event, helper, ProductsList) {
        var  purchaseId = component.get("v.recordId");
      
        var rfqlist= component.get("v.rfqRecordList");
        var action =component.get("c.addProducts");
        let productIdList=[];
        console.log(rfqlist);
        
        for(var i=0;i<rfqlist.length;i++){
            if(rfqlist[i].quantity_recieved != null){
                console.log(rfqlist[i].quantity_recieved);
                if(rfqlist[i].quantity_recieved < 0 ){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Error',
                        message: 'Quantity received should not be in negative.',
                        duration: ' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    return;
                }
                if(rfqlist[i].quantity_recieved % 1 != 0){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Error',
                        message: 'Quantity received should not be in decimal.',
                        duration: ' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    return;
                }
                if(isNaN(rfqlist[i].quantity_recieved)){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Error',
                        message: 'Quantity received should be a number.',
                        duration: ' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    return;
                }
            }
        }
        
        var productList = [];
        for(var i=0;i<rfqlist.length;i++){
            if(rfqlist[i].buildertek__Product__c != null){
                productIdList.push(rfqlist[i].buildertek__Product__c);
                var obj = {};
                console.log(rfqlist[i].quantity_recieved);
                if(rfqlist[i].quantity_recieved != null && rfqlist[i].quantity_recieved != 0){
                    obj['prodId'] = rfqlist[i].buildertek__Product__c
                    obj['quantity_recieved'] = rfqlist[i].quantity_recieved
                    obj['polineId'] = rfqlist[i].Id
                    
                    productList.push(obj);
                }
            }
            else{
                var obj = {};
                console.log(rfqlist[i].quantity_recieved);
                if(rfqlist[i].quantity_recieved != null && rfqlist[i].quantity_recieved != 0){
                    obj['quantity_recieved'] = rfqlist[i].quantity_recieved
                    obj['polineId'] = rfqlist[i].Id
                    
                    productList.push(obj);
                }
            }
            
        }
        
        var fileData2 = component.get("v.fileData2");
        
        for(var i=0;i<productList.length;i++){
            for(var j=0;j<fileData2.length;j++){
                if(productList[i].polineId == fileData2[j].Index){
                    productList[i].fileName = fileData2[j].fileName;
                    productList[i].fileContent = fileData2[j].fileContent;
                    
                }
            }   
        }
        
        console.log(rfqlist);
        console.log(productList);
        debugger;

        component.set("v.Spinner", true);
        component.set("v.showMessage", true);
        action.setParams({
            "productId":productIdList,
            "ProductsList" : JSON.stringify(productList),
        })
        
        action.setCallback(this,function(response){
            console.log(response.getState() , 'State=====');
            console.log(response.getError());
            if(response.getState() == "SUCCESS"){
               // console.log(response);
                //alert(response.getState());
                var result = response.getReturnValue();
                console.log(result);
                debugger;

                if(result){
                    var recId = response.getReturnValue();
                    // alert(recId);
                    var recordId = component.get("v.recordId");
                    
                    $A.get("e.force:closeQuickAction").fire();
                    setTimeout(function(){ location.reload(); }, 1800);
                    component.set("v.Spinner", false);
                    component.set("v.showMessage", false);
                // alert(recordId);
                /*   $A.get("e.force:navigateToSObject").setParams({
                        "recordId": recordId,
                        "slideDevName": "detail"
                    }).fire();*/
                    
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": '/lightning/r/buildertek__Purchase_Order__c/'+recordId+'/view'
                    });
                    urlEvent.fire();
                }else{
                    component.set("v.Spinner", false);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Error',
                        message: 'Quantity received and quantity delivered must be less than or equal to quantity ordered. ',
                        duration: ' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
                    
                 
                
                
            }
        });
        
        $A.enqueueAction(action);
        
    },
    
    closeModal: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var Spinner = component.get("v.spinner",true);
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        
        .catch(function(error) {
            console.log(error);
        });
        //component.get("v.onCancel")(); 
    },
    
    handleBlur : function(component, event, helper) {

        var inputField = event.getSource();

        var paginationList = component.get("v.paginationList");
        console.log('paginationList ==> ',paginationList);

        var Index = event.getSource().get("v.name");
        console.log('Index ==> '+Index);

        if((paginationList[Index].quantity_recieved > paginationList[Index].buildertek__Quantity__c) || (paginationList[Index].quantity_recieved > paginationList[Index].buildertek__Quantity_Remaining__c)) {
            
            inputField.setCustomValidity("Items Delivered must be less than Quantity remaining");
       
            component.find("submit").set("v.disabled", true);
        }else{
            inputField.setCustomValidity("");
            component.find("submit").set("v.disabled", false);
        }

    },
    
    
    next: function (component, event, helper) {
        var sObjectList = component.get("v.rfqRecordList");
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0;
        for (var i = end + 1; i < end + pageSize + 1; i++) {
            if (sObjectList.length > i) {
                paginationList.push(sObjectList[i]);
            }
            counter++;
        }
        start = start + counter;
        end = end + counter;
        component.set("v.startPage", start);
        component.set("v.endPage", end);
        component.set('v.paginationList', paginationList);
    },
    previous: function (component, event, helper) {
        var sObjectList = component.get("v.rfqRecordList");
         var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0;
        for (var i = start - pageSize; i < start; i++) {
            if (i > -1) {
                paginationList.push(sObjectList[i]);
                counter++;
            } else {
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.startPage", start);
        component.set("v.endPage", end);
        component.set('v.paginationList', paginationList);
    },

    handleFilesChange: function(component, event, helper) {
        // var paginationList = component.get("v.paginationList");
        // var index = event.getSource().get("v.name");
        // console.log('file name is ' + event.getSource().get("v.files")[0]['name']);
        // console.log('Index is ' + index);
        var fileName = "No File Selected..";
		var fileCount = event.target.files;
		var files = '';
		if (fileCount.length > 0) {
			component.set("v.uploadFile", true);
			for (var i = 0; i < fileCount.length; i++) {
				fileName = fileCount[i]["name"];
				if (files == '') {
					files = fileName;
				} else {
					files = files + ',' + fileName;
				}
				helper.readFiles2(component, event, helper, fileCount[i], event.currentTarget.dataset.index);

			}
		}
		component.set("v.fileName2", files);
        
    },

    clear: function (component, event, helper) {
		// debugger;
		event.stopPropagation();
		event.preventDefault();
		var selectedPillId = event.getSource().get("v.name");
		var selectedPillIndex = selectedPillId.split("_")[0];
		var selectedPillPo = selectedPillId.split("_")[1];
		var allFileList = component.get("v.fileData2");
        console.log('allFileList ==> ',allFileList);
		var AllPillsList = component.get("v.selectedfilesFill");

		if (allFileList.length != undefined) {
			for (var i = 0; i < allFileList.length; i++) {
				if (allFileList[i].Index == selectedPillPo && i == Number(selectedPillIndex)) {
					allFileList.splice(i, 1);
					//component.set("v.selectedfilesFill", AllPillsList);
				}
			}
		}
		component.set("v.fileData2", allFileList);
        console.log('fileData2 ==> ',component.get("v.fileData2"));
		var names = []
		if (component.get("v.fileData2") != undefined) {
			for (var i = 0; i < component.get("v.fileData2").length; i++) {
                var name = {};
                name['FileName'] = [];
                name['Index'] = (JSON.parse(JSON.stringify(component.get("v.fileData2")[i])).Index)
                name['FileName'] = JSON.parse(JSON.stringify(component.get("v.fileData2")[i]))["fileName"];
                names.push(name);
            }
		}
		component.set("v.FileNameList", names);
        console.log('FileNameList ==> ',component.get("v.FileNameList"));
	},
    
    
})