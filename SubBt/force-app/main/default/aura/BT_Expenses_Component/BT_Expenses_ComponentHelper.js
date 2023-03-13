({

    getProjects : function(component) {
        var action = component.get("c.getProjects");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log(response.getReturnValue());
                //add none option
                var noneOption = {
                    Name: "None",
                    Id: ""
                };
                var projects = response.getReturnValue();
                projects.push(noneOption);
                component.set("v.projectsOptions", projects);
            }
        });
        $A.enqueueAction(action);
    },

    tabName : function(component) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: "BT Expense Component"
            });
            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon: "standard:link",
                iconAlt: "BT Expense Component"
            });
        }
        ).catch(function(error) {
            console.log(error);
        }); 

    },

    getExpenses : function(component) {
        var action = component.get("c.getExpenses");
        action.setParams({
            "projectId": component.get("v.selectedProjectId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log(response.getReturnValue());
                var expenses = response.getReturnValue();
                expenses.forEach(function(expense){
                    expense.selected = false;
                    expense.buildertek__Budget_Line__c = "";
                });
                component.set("v.expenses", expenses);
                component.set("v.tableDataList", expenses);
            }
        });
        $A.enqueueAction(action);
    },

    getBudegts : function(component) {
        var action = component.get("c.getBudgets");
        action.setParams({
            "projectId": component.get("v.selectedProjectId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var budgets = response.getReturnValue();
                component.set("v.budgetsOptions", budgets);
                console.log('budgetsOptions => ',budgets);
            }
        });
        $A.enqueueAction(action);
    }



})