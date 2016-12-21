
Template.registerHelper("formatDate", function(date) {
	return moment(date).format("MMMM Do");
});

Template.registerHelper("formatTime", function(date) {
	return moment(date).format("h:mm a");
});

Template.registerHelper("equals", function (a, b) {
	return a === b;
});


Template.registerHelper("json", function (data) {
	data = JSON.stringify(data, null, "\t");
	return `<pre>${data}</pre>`;
});

import {getPrefs} from "../imports/api/prefs.js";
Template.registerHelper("prefs", function() {
	return getPrefs();
	// let prefs = Prefs.find({});
	// return prefs.fetch()[0];
});


Template.registerHelper("authorHeadshot", function() {

	let id = this.author_id;
	let author = Meteor.users.findOne(id);
	if (!author || !author.profile || !author.profile.headshot) {
		return false;
	}
	return author.profile.headshot;
});


Template.registerHelper("pluralize", function(num, string) {
	return pluralize(string, num, true);
});

Template.registerHelper("formatDescription", function(num, string) {
	string = stripHTML(string);
	let converter = new Showdown.converter();
	string = converter.makeHtml(string);

	string = $.truncate(string, {
		length: num,
		words: true
	});
	return string;
});

// Template.registerHelper("formatText", function(string) {
// 	console.log(string.split("\n\n"));
//
//
//
// 	return "!" + "<p>"+string.split("\n\n").join("</p></p>")+"</p>";
// });

function stripHTML(string){
	let s = string.replace(/(<([^>]+)>)/ig, "");
	return s;
}
Template.registerHelper("stripHTML", stripHTML);


Template.registerHelper("editing_post",()=>{return Session.get("editing_post");});
Template.registerHelper("editing_user",()=>{return Session.get("editing_user");});
Template.registerHelper("previewing_post",()=>{return Session.get("previewing_post");});

// Template.registerHelper("user_profile", function () {
// 	return Meteor.user().profile;
// });
