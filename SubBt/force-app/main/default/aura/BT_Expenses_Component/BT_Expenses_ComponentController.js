({
    
    doInit : function(component, event, helper) {
        helper.tabName(component);
        helper.getProjects(component);
    },

    changeProject : function(component, event, helper) {
        component.set("v.Spinner", true);
        var selectedProject = component.find("selectedProject").get("v.value");
        component.set("v.selectedProjectId", selectedProject);
        console.log('selectedProject => '+selectedProject);
        helper.getExpenses(component);
    },

    checkAllExpenses : function(component, event, helper) {
        var value = event.getSource().get("v.checked");
        var tableDataList = component.get("v.tableDataList");
        tableDataList.forEach(element => {
            element.selected = value;
        }
        );
        component.set("v.tableDataList", tableDataList);
        console.log('tableDataList => '+JSON.stringify(tableDataList));
    },

    checkboxChange : function(component, event, helper) {
        //iterate through all the rows in the table and check if all are selected then check the select all checkbox
        var tableDataList = component.get("v.tableDataList");
        var checkAll = true;
        tableDataList.forEach(element => {
            if (!element.selected) {
                checkAll = false;
            }
        }
        );
        component.find("selectAll").set("v.checked", checkAll);
    },

    addExpensesToBudgetLineItem : function(component, event, helper) {
        helper.handleSelectedExpenses(component);
        if(component.get("v.selectedExpenses").length > 0){    
            component.set("v.SelectExp", false);
            component.set("v.SelectBLines", true);
            helper.getBudegts(component);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select at least one Expense.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    backToExpenses : function(component, event, helper) {
        component.set("v.SelectExp", true);
        component.set("v.SelectBLines", false);
        console.log('selectedProjectId => '+component.get("v.selectedProjectId"));
    },

    changeBudget : function(component, event, helper) {
        component.set("v.Spinner", true);
        var selectedBudget = component.find("selectedBudget").get("v.value");
        component.set("v.selectedBudgetId", selectedBudget);
        console.log('selectedBudget => '+selectedBudget);
        if(selectedBudget){    
            component.set("v.selectedBudgetName", component.get("v.budgetsOptions").find(function(budget){
                return budget.Id == selectedBudget;
            }).Name);
            console.log('selectedBudgetName => '+component.get("v.selectedBudgetName"));
            component.set("v.selectedExpenses", component.get("v.selectedExpenses").map(function(expense){
                expense.buildertek__Budget__c = selectedBudget;
                return expense;
            }));
            console.log('selectedExpenses => '+JSON.stringify(component.get("v.selectedExpenses")));
            helper.getBudgetLines(component);
        }else{
            component.set("v.selectedBudgetName", '');
            component.set("v.selectedExpenses", component.get("v.selectedExpenses").map(function(expense){
                expense.buildertek__Budget__c = '';
                return expense;
            }
            ));
            console.log('selectedExpenses => '+JSON.stringify(component.get("v.selectedExpenses")));
            component.set("v.budgetLinesOptions", []);
            component.set("v.Spinner", false);
        }
    },

    saveExpenses : function(component, event, helper) {
        component.set("v.selectedExpenses", component.get("v.selectedExpenses").map(function(expense){
            if(!expense.buildertek__Budget_Line_Item__c){
                expense.buildertek__Budget_Line_Item__c = null;
            }
            return expense;
        }));
        if(component.get("v.selectedBudgetId")){    
            component.set("v.Spinner", true);
            helper.saveExpenses(component);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select a Budget.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    changeBudgetLine : function(component, event, helper) {
        var selectedExpense = component.get("v.selectedExpenses")
        console.log('selectedExpense => '+JSON.stringify(selectedExpense));
        var selectedLine = event.getSource().get("v.value");
    }



})