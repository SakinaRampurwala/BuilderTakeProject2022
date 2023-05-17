({
    doInit : function(component, event, helper) {
        console.log('**INIT Method**');
        console.log(component.get('v.recordId'));
        var action=component.get('c.getBudgetLine');
        action.setParams({
            BudgetId:component.get('v.recordId')
        });
        action.setCallback(this, function(response){
            console.log(response.getReturnValue());
            var result= response.getReturnValue();
            console.log({result});
            var state= response.getState();
            console.log({state});
            if(state == 'SUCCESS'){

                component.set('v.budgetLineList' , result);
            }

        });
        $A.enqueueAction(action);

    },
    changeFileName: function(component, event, helper) {
        var getValue= event.getSource().get('v.value');
        component.set('v.fileName', getValue);
    },

    exportData : function(component, event, helper) {
        console.log('**EXPORT DATA**');
        var fileName=component.get('v.fileName');

        var csvContent = "data:text/csv;charset=utf-8,";
        var jsonArray= component.get('v.budgetLineList');
        console.log({jsonArray});
        if(jsonArray.length > 0){
            var headers = Object.keys(jsonArray[0]).join(",");
            csvContent += headers + "\n";

            // Iterating over each object and extracting values
            jsonArray.forEach(function(obj) {
            var row = Object.values(obj).join(",");
            csvContent += row + "\n";
            });
            console.log({csvContent});
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", fileName+".csv");
            document.body.appendChild(link);
            link.click();
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "",
                "message": "There are no BudgetLines to Export",
                "type": "error"
            });
            toastEvent.fire();
        }
        
        $A.get("e.force:closeQuickAction").fire();

    },
    closeModel:function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },
    
})


