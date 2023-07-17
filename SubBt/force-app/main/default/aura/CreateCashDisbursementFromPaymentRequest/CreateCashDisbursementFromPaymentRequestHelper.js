({
    getFields: function (component, event, helper) {
        console.log('DoInitHelper');
		console.log(component.get("v.recordId"));
        component.set('v.Spinner', true);
		var action = component.get("c.getFieldSet");
		action.setParams({
			objectName: 'buildertek__Payment__c',
			fieldSetName: 'buildertek__New_Cash_Disbursement_Field_Set',
		});
		action.setCallback(this, function (response) {
			if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
				var listOfFields = JSON.parse(response.getReturnValue());
                component.set("v.listOfFields", listOfFields);
				console.log('List Name => ', listOfFields);
			} else {
				console.log('Error');
			}
		});
		$A.enqueueAction(action);
		
		var parentRecordId = component.get("v.recordId");
		var action2 = component.get("c.getParentRecord");
		action2.setParams({
			parentRecordId: parentRecordId
		});
		action2.setCallback(this, function (response) {
			if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
					var parentRecord = response.getReturnValue();
					component.set("v.parentRecord", parentRecord);
					console.log('response.getReturnValue() => '+ JSON.stringify(parentRecord));
			} else {
				console.log('Error');
			}
		});

		$A.enqueueAction(action2);
        component.set('v.Spinner', false);


		// console.log('FieldValue => ', component.find('inputFields1').get("v.value"));

	},
})