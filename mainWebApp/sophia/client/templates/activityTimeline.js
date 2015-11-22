Template.activityTimeline.onRendered(function(){
	var currentHeartRate = HeartRates.findOne({userId: Meteor.userId()}).heartRate;
	var safe = f_heartRateIsSafe(currentHeartRate);
	Session.set('heartRateSafe', safe);

	var currentArea = Areas.findOne({userId: Meteor.userId()}).area;
	Session.set('area', currentArea);

});

Template.activityTimeline.helpers({
	activities: function(){
		return Activities.find({}).fetch();/// "5 pm", description: "Grandma went in exercise room"}
	//]
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
	setInterval(updateActivityFeed, 2000);
}


function updateActivityFeed(){
	console.log('updateActivityFeed called');
	var activityDetectionStart = Date.now(); //accurate to 1 microsecond.

	getHeartRate(function(rate){
		console.log('callback in getHeartRate called. Heart rate is ', rate);
		var heartRateIsSafe = f_heartRateIsSafe(rate);
		console.log('heartRateIsSafe', heartRateIsSafe, '. Session heart rate safe: ', Session.get('heartRateSafe'));
		if (!heartRateIsSafe && Session.get('heartRateSafe')){//if new rate is unsafe and flag was unsafe, update flag
			Session.set('heartRateSafe', 'false');

			//also create a new activity
			insertNewActivity(
				{
					heartRate: rate,
					timestamp: JSON.stringify(activityDetectionStart),
					changed: "heartRateToNotNormal"
				}
			);
		} else if (heartRateIsSafe && !Session.get('heartRateSafe')){//if new rate is unsafe and flag was unsafe, update flag
			Session.set('heartRateSafe', 'false');

			//also create a new activity
			insertNewActivity(
				{
					heartRate: rate,
					timestamp: JSON.stringify(activityDetectionStart),
					changed: "heartRateToNormal"
				}
			);
		}

	});

	getArea(function(area){
		console.log('callback in getArea called');
		console.log('area: ', area, "Sesion area: ", Session.get('area'));
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


function getArea(){
	return fakeGetArea();
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
	Activities.insert(activity);
}//callback of activityChanged
