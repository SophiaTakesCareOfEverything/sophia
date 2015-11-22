Meteor.users.allow({
	update: function(){return true;}
});

HeartRates = new Meteor.Collection("HeartRates");
Areas = new Meteor.Collection("Areas");
Activities = new Meteor.Collection("Activities"); //literally just the Activities for grandma