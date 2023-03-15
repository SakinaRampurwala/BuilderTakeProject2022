({

    getProjects : function(component) {
        var action = component.get("c.getProjects");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log(response.getReturnValue());
                //add none option
                var noneOption = {
                    Name: "--None--",
                    Id: ""
                };
                component.set("v.selectedProjectId", '');
                var projects = response.getReturnValue();
                projects.unshift(noneOption);
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
        component.set("v.selectedExpenses", component.get("v.selectedExpenses").map(function(expense){
            if(!expense.buildertek__Budget_Line_Item__c){
                expense.buildertek__Budget_Line_Item__c = null;
            }
            return expense;
        }));
        if(component.get("v.selectedBudgetId")){
            component.set("v.Spinner", true);
            var expenses = component.get("v.selectedExpenses");
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
                component.set("v.Page1", true);
                component.set("v.Page2", false);
                component.set("v.SelectBLines", false);
                component.set("v.expenses", []);
                component.set("v.tableDataList", []);
                component.set("v.selectedTransactionType", "");
            }
            );
            $A.enqueueAction(saveExp);
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

    getTimeCards : function(component) {
        var action = component.get("c.getTimeCards");
        action.setParams({
            "projectId": component.get("v.selectedProjectId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var timeCards = response.getReturnValue();
                timeCards.forEach(function(timeCard){
                    timeCard.selected = false;
                    timeCard.buildertek__Budget_Line__c = "";
                    timeCard.buildertek__Budget__c = "";
                });
                console.log('timeCards => ',timeCards);
                component.set("v.timeCards", timeCards);
                component.set("v.tableDataList", timeCards);
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },

    ExpensesPage2 : function(component, event, helper) {
        helper.handleSelectedExpenses(component);
        if(component.get("v.selectedExpenses").length > 0){    
            component.set("v.Page1", false);
            component.set("v.SelectExp", false);
            component.set("v.SelectBLines", true);
            component.set("v.Page2", true);
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

    handleSelectedTimeCards : function(component) {
        var timeCards = component.get("v.timeCards");
        console.log('timeCards => ',timeCards);
        var selectedTimeCards = [];
        timeCards.forEach(function(timeCard){
            if(timeCard.selected){
                selectedTimeCards.push(timeCard);
            }
        }
        );
        component.set("v.selectedTimeCards", selectedTimeCards);
        console.log('selectedTimeCards => ',selectedTimeCards);
    },

    TimeCardsPage2 : function(component, event, helper) {
        helper.handleSelectedTimeCards(component);
        if(component.get("v.selectedTimeCards").length > 0){    
            component.set("v.Page1", false);
            component.set("v.SelectTC", false);
            component.set("v.Page2", true);
            component.set("v.TimeCardP2", true);
            helper.getBudegts(component);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select at least one Time Card.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    ExpensesPage1 : function(component, event, helper) {
        component.set("v.Page1", true);
        component.set("v.SelectExp", true);
        component.set("v.SelectBLines", false);
        component.set("v.Page2", false);
    },

    changeBudgetExpenses : function(component, event, helper) {
        component.set("v.Spinner", true);
        var selectedBudget = component.find("selectedBudget").get("v.value");
        component.set("v.selectedBudgetId", selectedBudget);
        console.log('selectedBudget => '+selectedBudget);
        if(selectedBudget){    
            component.set("v.selectedExpenses", component.get("v.selectedExpenses").map(function(expense){
                expense.buildertek__Budget__c = selectedBudget;
                return expense;
            }));
            console.log('selectedExpenses => '+JSON.stringify(component.get("v.selectedExpenses")));
            this.getBudgetLines(component);
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

    changeBudgetTimeCards : function(component, event, helper) {
        component.set("v.Spinner", true);
        var selectedBudget = component.find("selectedBudget").get("v.value");
        component.set("v.selectedBudgetId", selectedBudget);
        console.log('selectedBudget => '+selectedBudget);
        if(selectedBudget){    
            component.set("v.selectedBudgetName", component.get("v.budgetsOptions").find(function(budget){
                return budget.Id == selectedBudget;
            }).Name);
            console.log('selectedBudgetName => '+component.get("v.selectedBudgetName"));
            component.set("v.selectedTimeCards", component.get("v.selectedTimeCards").map(function(timeCard){
                timeCard.buildertek__Budget__c = selectedBudget;
                return timeCard;
            }));
            console.log('selectedTimeCards => '+JSON.stringify(component.get("v.selectedTimeCards")));
            this.getBudgetLines(component);
        }else{
            component.set("v.selectedBudgetName", '');
            component.set("v.selectedTimeCards", component.get("v.selectedTimeCards").map(function(timeCard){
                timeCard.buildertek__Budget__c = '';
                return timeCard;
            }
            ));
            console.log('selectedTimeCards => '+JSON.stringify(component.get("v.selectedTimeCards")));
            component.set("v.budgetLinesOptions", []);
            component.set("v.Spinner", false);
        }
        
    },

    TimeCardsPage1 : function(component, event, helper) {
        component.set("v.Page1", true);
        component.set("v.SelectTC", true);
        component.set("v.TimeCardP2", false);
        component.set("v.Page2", false);
    },

    saveTimeCards : function(component, event, helper) {
        component.set("v.selectedTimeCards", component.get("v.selectedTimeCards").map(function(timecard){
            if(!timecard.buildertek__Budget_Line__c){
                timecard.buildertek__Budget_Line__c = null;
            }
            return timecard;
        }));
        if(component.get("v.selectedBudgetId")){
            component.set("v.Spinner", true);
            var TimeCard = component.get("v.selectedTimeCards");
            var action = component.get("c.saveTC");
            action.setParams({
                "TimeCard": TimeCard
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Success',
                        message: 'Time Cards have been saved.',
                        duration: ' 2000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
                console.log('TimeCard => '+JSON.stringify(TimeCard));
                component.set("v.Spinner", false);
                component.set("v.selectedTimeCards", []);
                component.set("v.selectedProjectId", "");
                component.set("v.selectedBudgetId", "");
                component.set("v.Page1", true);
                component.set("v.Page2", false);
                component.set("v.TimeCardP2", false);
                component.set("v.timeCards", []);
                component.set("v.tableDataList", []);
                component.set("v.selectedTransactionType", "");
            });
            $A.enqueueAction(action);
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
    }

})