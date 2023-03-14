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
                    expense.buildertek__Budget__c = "";
                });
                component.set("v.expenses", expenses);
                component.set("v.tableDataList", expenses);
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },

    handleSelectedExpenses : function(component) {
        var expenses = component.get("v.expenses");
        console.log('expenses => ',expenses);
        var selectedExpenses = [];
        expenses.forEach(function(expense){
            if(expense.selected){
                selectedExpenses.push(expense);
            }
        }
        );
        component.set("v.selectedExpenses", selectedExpenses);
        console.log('selectedExpenses => ',selectedExpenses);
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
                console.log('budgetsOptions => ',budgets);
                component.set("v.budgetsOptions", budgets);
            }
        });
        $A.enqueueAction(action);
    },

    getBudgetLines : function(component) {
        var action = component.get("c.getBudgetLines");
        action.setParams({
            "budgetId": component.get("v.selectedBudgetId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var budgetLines = response.getReturnValue();
                console.log('budgetLinesOptions => ',budgetLines);
                component.set("v.budgetLinesOptions", budgetLines);
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },

    saveExpenses : function(component) {
        var expenses = component.get("v.selectedExpenses");
        console.log('expenses => ',expenses);
        var saveExp = component.get("c.saveExp");
        saveExp.setParams({
            "expenses": expenses
        });
        saveExp.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log('response => ',response.getReturnValue());
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: 'Success',
                    message: 'Expenses are updated successfully',
                    duration: ' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
                toastEvent.fire();
            }
            component.set("v.Spinner", false);
            component.set("v.selectedExpenses", []);
            component.set("v.selectedProjectId", "");
            component.set("v.selectedBudgetId", "");
            component.set("v.SelectExp", true);
            component.set("v.SelectBLines", false);
            component.set("v.expenses", []);
            component.set("v.tableDataList", []);
        }
        );
        $A.enqueueAction(saveExp);
    }

})