({
    /*
    Description:- This method used for get and display all the fields of the meeting object record in modal box
    Created Date:- 30th November
    
    */
    doInit: function(component, event, helper) {
        try {
            component.set("v.Spinner", true);
            var action = component.get("c.getMeetingData");
            action.setParams({
                recordId: component.get("v.recordId")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log(response);
                if (state === "SUCCESS") {
                    console.log(response.getReturnValue());
                    component.set('v.oldMeeting', response.getReturnValue().meet);
                    component.set('v.Atendee', response.getReturnValue().Attendee);
                    component.set('v.actionItemRec', response.getReturnValue().actionItem);




                }
            });
            $A.enqueueAction(action);

            helper.getPicklist(component, event, helper);
            component.set("v.Spinner", false);
        } catch (e) {
            console.log({ e });
        }
    },

    /*
    Description:- This method used for close the pop up box when user click on cancel!
    Created Date:- 30th November
    
    */
    Cancel: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();

    },

    /*
    Description:- This method used for Clone meeting object record and its related list (Atendee and ActionItem)
    Created Date:- 30th November
    
    */
    Save: function(component, event, helper) {
        try {
            component.set("v.Spinner", true);
            var cloneMeetRecord = component.get('v.oldMeeting');
            delete cloneMeetRecord['Id'];

            var action = component.get("c.save");
            action.setParams({
                meet: cloneMeetRecord,
                attendee: component.get('v.Atendee'),
                action: component.get('v.actionItemRec')
            });
            action.setCallback(this, function(response) {
                console.log(response);
                var state = response.getState();
                var result = response.getReturnValue();
                if (state === "SUCCESS") {
                    component.set("v.Spinner", false);
                    $A.get("e.force:closeQuickAction").fire();
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": "Meeting added successfully",
                        "type": "success",
                        "duration": 5000
                    });
                    toastEvent.fire();


                    console.log(response.getReturnValue());
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": result,
                        "slideDevName": "related"
                    });
                    navEvt.fire();


                } else {
                    component.set("v.Spinner", false);
                    $A.get("e.force:closeQuickAction").fire();
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Failed to save record",
                        "type": "error",
                        "duration": 5000
                    });
                    toastEvent.fire();


                }
            });



            $A.enqueueAction(action);


        } catch (e) {
            console.log({ e });
        }

    },


})