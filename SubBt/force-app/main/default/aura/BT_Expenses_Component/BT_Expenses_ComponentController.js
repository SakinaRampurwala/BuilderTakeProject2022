({
    
    doInit : function(component, event, helper) {
        helper.tabName(component);
        helper.getProjects(component);
    },

    changeProject : function(component, event, helper) {
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
        console.log('tableDataList => '+JSON.stringify(component.get("v.tableDataList")));
        console.log('expenses => '+JSON.stringify(component.get("v.expenses")));
    },

    addExpensesToBudgetLineItem : function(component, event, helper) {
        component.set("v.SelectExp", false);
        component.set("v.SelectBLines", true);
        console.log('tableDataList => '+JSON.stringify(component.get("v.tableDataList")));
        helper.getBudegts(component);
        var tableDataList = component.get("v.tableDataList");
        var selectedExpenses = [];
        tableDataList.forEach(element => {
            if (element.selected) {
                selectedExpenses.push(element);
            }
        }
        );
        component.set("v.selectedExpenses", selectedExpenses);
    },

    backToExpenses : function(component, event, helper) {
        component.set("v.SelectExp", true);
        component.set("v.SelectBLines", false);
    }



})