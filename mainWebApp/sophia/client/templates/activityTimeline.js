Template.activityTimeline.onRendered(function(){
	setTimeout(function(){


	var currentHeartRateObject = HeartRates.findOne({userId: Meteor.userId()});
	var currentHeartRate = currentHeartRateObject && currentHeartRateObject.heartRate;
	var safe = f_heartRateIsSafe(currentHeartRate);
	Session.set('heartRateSafe', safe);

	var currentArea = Areas.findOne({userId: Meteor.userId()}) && Areas.findOne({userId: Meteor.userId()}).area;
	Session.set('area', currentArea);
	}, 1000);
});

Template.activityTimeline.helpers({
	activities: function(){
		return Activities.find({}).fetch();/// "5 pm", description: "Grandma went in exercise room"}
	//]
	}
});

Template.activity.helpers({
	time: function(){
		var date = new Date(this.timestamp);
	
		var time = (function getHours12() {
			var hours = date.getHours() %12;
			return hours;
		})() + ":" + (function getMinutes(){
				var minutes = date.getMinutes();
				if (minutes < 10){
					minutes = "0" + minutes;
				}
				return minutes+"";
			})();
		return time + " pm";
	}
});

Template.activityTimeline.events({
	'click #enableActivityMonitoring': function(e, t){
		startActivityMonitoring();
		//hideActivityEnableButton();
		$('#enableActivityMonitoring')[0].outerHTML = "";
	},
});


function hideActivityEnableButton(){
	
}

function startActivityMonitoring(){
	activityInterval = setInterval(updateActivityFeed, 2000);
}


function updateActivityFeed(){
	var activityDetectionStart = Date.now(); //accurate to 1 microsecond.

	getHeartRate(function(rate){
		var heartRateIsSafe = f_heartRateIsSafe(rate);
	
		if (!heartRateIsSafe && Session.get('heartRateSafe')){//if new rate is unsafe and flag was unsafe, update flag
			Session.set('heartRateSafe', 'false');

			//also create a new activity
			insertNewActivity(
				{
					heartRate: rate,
					timestamp: Date.now(),
					changed: "heartRateToNotNormal"
				}
			);
		} else if (heartRateIsSafe && !Session.get('heartRateSafe')){//if new rate is unsafe and flag was unsafe, update flag
			Session.set('heartRateSafe', 'true');

			//also create a new activity
			insertNewActivity(
				{
					heartRate: rate,
					timestamp: Date.now(),
					changed: "heartRateToNormal"
				}
			);
		}

	});

	getArea(function(area){
		if (area !== Session.get('area')){
			Session.set('area', area);

			insertNewActivity({
				area:  area,
				timestamp: Date.now(),
				changed: "area"
			});
		}
	});

}

function getHeartRate(callback){
	var heartRate = HeartRates.findOne({userId: Meteor.userId()}).heartRate;
	if (typeof callback === 'function'){
		callback(heartRate);
	}
}
function f_heartRateIsSafe(rate){
	return (rate >=50 && rate <=110);
}


function getArea(callback){
	return fakeGetArea(callback);
	//return realGetArea();
}
function fakeGetArea(callback){
	var area = Areas.findOne({userId: Meteor.userId()}).area;
	if (typeof callback === 'function'){
		callback(area);
	}
}


/*

	navigator.geolocation.getCurrentPosition(function(position){
			var area = getAreaFromLocation(position.coords.latitude, position.coords.longitude);

			if(area !== Session.get('currentArea')){
				insertNewActivity(
					{
						location: {lat: -80.04349, long: 40.3349},
						area:  "Dining Room",
						timestamp: JSON.stringify(activityDetectionStart),
						changed: "area"
					}
				);
				Session.set('currentArea', area);
			}
	});


*/

function insertNewActivity(activity){
	var id =Activities.insert(activity);
}//callback of activityChanged
