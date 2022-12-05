({
    doInit: function (component, event, helper) {
        var record = component.get("v.record");
        var field = component.get("v.field");
       // alert("hai"+JSON.stringify(record));
        //alert("Field::"+JSON.stringify(field));
        console.log('Record::', JSON.stringify(record));
        console.log('Field::', JSON.stringify(field));
        component.set("v.cellValue", record[field.name]);
        component.set("v.fieldName", field.name);
        if (field.name == 'buildertek__Profit_Margin__c' && field.type == 'PERCENT') {
            component.set("v.isProfiteMargin", true);
        } else if ((field.name == 'buildertek__Gross_Profit__c' || field.name == 'buildertek__Net_Total_Price__c' || field.name == 'buildertek__Net_Unit__c') && field.type == 'CURRENCY') {
            component.set("v.isGrossProfte", true);
        } else if (field.type == 'STRING') {
            component.set("v.isTextField", true);
        } else if (field.type == 'TEXTAREA') {
            component.set("v.isTextField", true);
        } else if (field.type == 'PICKLIST') {
            component.set("v.isDropDownField", true);
            component.set("v.dropDownValue", record[field.name]);
            if (field.pickListValuesList != undefined) {
                component.set('v.dropDown', field.pickListValuesList);
            }
        } else if (field.type == 'DATE') {
            component.set("v.isDateField", true);
        } else if (field.type == 'DOUBLE') {
            component.set("v.isDoubleField", true);
        } else if (field.type == 'PERCENT') {
            component.set("v.isPercentField", true);
        } else if (field.type == 'DATETIME') {
            component.set("v.isDateTimeField", true);
        } else if (field.type == 'CURRENCY') {
            component.set("v.isCurrencyField", true);
        } else if (field.type == 'REFERENCE') {
            component.set("v.isReferenceField", true);
            var relationShipName = '';
            if (field.name.indexOf('__c') == -1) {
                relationShipName = field.name.substring(0, field.name.indexOf('Id'));
            } else {
                relationShipName = field.name.substring(0, field.name.indexOf('__c')) + '__r';
            }
            component.set('v.fieldName', field.name);
            if (record[relationShipName] != undefined && record[relationShipName].Name != undefined) {
                component.set("v.cellLabel", record[relationShipName].Name);
            }
        }
    },

    getLookUpValues: function (component, event, helper) {
        var fieldName = event.getParam("fieldName");
        var selectedRecordId = event.getParam("selectedRecordId");
        var record = component.get('v.record');
        record[fieldName] = selectedRecordId;
        component.set('v.record', record);
    },

    onInputChange: function (component, event, helper) {
        var fieldName = event.getSource().get("v.name").split('-');
        var index = fieldName[0];
        var fieldLabel = fieldName[1];

        var selectedValue = event.getSource().get("v.value");
        console.log('selectedValue--->'+selectedValue);

        var record = component.get('v.record');


        record[fieldLabel] = selectedValue != '' && selectedValue != 'None' ? selectedValue : '';

        var NetUnit;        // buildertek__Net_Unit__c          = buildertek__Unit_Cost__c + (buildertek__Unit_Cost__c * buildertek__Markup__c) - (buildertek__Unit_Cost__c * buildertek__Additional_Discount__c)
        var Total;          // buildertek__Net_Total_Price__c   = buildertek__Total_Cost__c + buildertek__Markup_Amount__c + buildertek__Tax_Amount__c - buildertek__Discount_Amount__c
        var GrossProfit;    // buildertek__Gross_Profit__c      = buildertek__Net_Total_Price__c - buildertek__Total_Cost__c
        var ProfitMargin;   // buildertek__Profit_Margin__c     = (buildertek__Net_Total_Price__c - buildertek__Total_Cost__c)/buildertek__Net_Total_Price__c
        var Quantity, UnitCost, TotalCost, Markup, Discount;

        console.log(' - - - - - - - - - - - - - - - - - - - ');
        for (var key in record){
            console.log("key -> " + key + ", value -> " + record[key]);
            if (key == 'buildertek__Quantity__c') {
                Quantity = parseInt(record['buildertek__Quantity__c']);
                console.log('Quantity --> '+Quantity);
            } 
            else if(key == 'buildertek__Unit_Cost__c'){
                UnitCost = parseInt(record['buildertek__Unit_Cost__c']);
                console.log('UnitCost --> '+UnitCost);

            } 
            else if(key == 'buildertek__Total_Cost__c'){
                TotalCost = parseInt(record['buildertek__Total_Cost__c']);
                console.log('TotalCost --> '+TotalCost);

            } 
            else if(key == 'buildertek__Markup__c'){
                Markup = parseInt(record['buildertek__Markup__c']);
                console.log('Markup --> '+Markup);

            } 
            else if(key == 'buildertek__Additional_Discount__c'){
                Discount = parseInt(record['buildertek__Additional_Discount__c']);
                console.log('Discount --> '+Discount);

            } 
        }

        if (UnitCost != null && Markup != null && Discount != null) {
            // buildertek__Unit_Cost__c + (buildertek__Unit_Cost__c * buildertek__Markup__c) - (buildertek__Unit_Cost__c * buildertek__Additional_Discount__c)

            NetUnit = (UnitCost + ((UnitCost * Markup)/100) - ((UnitCost * Discount)/100)).toFixed(2);
            record['buildertek__Net_Unit__c'] = NetUnit;

            console.log('NetUnit ----> '+NetUnit);
        }
        if (TotalCost != null && Markup != null && UnitCost != null && Discount != null) {
                UnitCost = parseInt(record['buildertek__Unit_Cost__c']);
            Total = ((Quantity * UnitCost) + (((Quantity * UnitCost)/100)*Markup) - (((Quantity * UnitCost)/100)*Discount)).toFixed(2);
            record['buildertek__Net_Total_Price__c'] = Total;

            console.log('TotalCost ----> '+TotalCost);

        }
        if (Total != null && TotalCost != null) {
            GrossProfit = (Total-(Quantity * UnitCost)).toFixed(2);
            record['buildertek__Gross_Profit__c'] = GrossProfit;
            console.log('GrossProfit ----> '+GrossProfit);

            ProfitMargin = ((GrossProfit/Total)*100).toFixed(2);
            record['buildertek__Profit_Margin__c'] = ProfitMargin;
            console.log('ProfitMargin ----> '+ProfitMargin);
        }

        component.set('v.record', record);

        console.log('Record --> ', JSON.stringify(record));

        var parentComponent = component.get("v.parent");  
        if(NetUnit != null || Total != null || GrossProfit != null || ProfitMargin != null){
            parentComponent.reloadMethod();
        }                      

    }
})