setInterval(function modulateBPM(){
	var currentHeartRateObject = HeartRates.findOne({userId: Meteor.userId()});
	var currentHeartRate = currentHeartRateObject && currentHeartRateObject.heartRate;

	var delta;
	var random = Math.floor((Math.random() * 10) + 1);
	if (random <=3){
		delta = -1;
	} else if (random >=4 && random <= 7){}
	else if(random >= 8){
		delta = 1;
	}

	Meteor.call('addToHeartRate', delta);
}, 7000);

Template.keyIndicatorsDashboard.helpers({
	heartRate: function(){
		var heartRateObject = HeartRates.findOne({userId: Meteor.userId()});
		var heartRate = heartRateObject && heartRateObject.heartRate;

		return heartRate;
	}
});