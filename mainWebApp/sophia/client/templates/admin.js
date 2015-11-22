Template.admin.helpers({
	'heartRate': function(){
		var heartRate = HeartRates.findOne({userId: Meteor.userId()}).heartRate;
		console.log('current heart rate is', heartRate);
		return heartRate;
	},
	'area': function(){
		return Areas.findOne({userId: Meteor.userId()}).area;
	}
});

Template.admin.events({
	'click #increaseHeartRate': function(){
		Meteor.call('addToHeartRate', 1);
	},
	'click #decreaseHeartRate': function(){
		Meteor.call('addToHeartRate', -1);
	},
	'click #setHeartRate': function(){

	},
	'submit #setArea': function(e, t){
		e.preventDefault();
		var area = t.find('#area').value;
		Meteor.call('setArea', area);
	}
});

