Session.set('sideMenuState', 'sideLogin');
Template.sideLogin.events({
	'submit .loginForm': function(event, template){
		event.preventDefault();
		var email = event.target.email.value;
		var password = event.target.password.value;

		Meteor.loginWithPassword(email, password, function(){
			console.log('loggin in');
		});
	}
});

Template.sideSignupLogin.helpers({
	'sideMenuState': function() {
		return Session.get('sideMenuState');
	}
});

Template.sideSignupLogin.events({
	'click a': function(event, template){
		console.log(event, template);
		var menu = event.target.getAttribute('data-menu');
		console.log(menu);
		Session.set('sideMenuState', menu);
		//Session.set('sideMenuState', event.target.data-menu);
	}
});


//signup
Session.set('passwordMatch', true);
Template.sideSignup.helpers({
	'passwordMatch': function() {return Session.get('passwordMatch');}
});

Template.sideSignup.events({
	'change #password, keyup #password, change #confirmPassword, keyup #confirmPassword': function(e, t){

		var password = t.find('#password').value, confirmPassword = t.find('#confirmPassword').value;
		console.log(password, confirmPassword);
		Session.set('passwordMatch', password === confirmPassword);
	},
	'submit .signupForm': function(e,t){
		debugger;
		event.preventDefault();
		var e =t.find('#email').value, p = t.find('#password').value, pC = t.find('#confirmPassword').value;
		if (p === pC){
			Accounts.createUser({email: e, password: p});
			HeartRates.insert({userId: Meteor.userId(), heartRate: 70});
			Areas.insert({userId: Meteor.userId(), area: "bedroom"});

		} else {
			console.log('passwords did not match');
		}
	}
});
