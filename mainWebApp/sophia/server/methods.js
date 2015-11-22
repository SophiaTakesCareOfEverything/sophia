Meteor.methods({
	'addToHeartRate': function(delta){
		var currentHeartRate = HeartRates.findOne({userId: Meteor.userId()}).heartRate;
		var newHeartRate = currentHeartRate + delta;
		HeartRates.update({userId: Meteor.userId()}, {$set: {heartRate: newHeartRate}});
	},
	'setArea': function(area){
		Areas.update({userId: Meteor.userId()}, {$set: {area: area}});
	}
});