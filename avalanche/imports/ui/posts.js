import {getPrefs} from "../api/prefs.js";
import {Posts, postEditableBy} from "../api/posts.js";
import "./posts.html";

Template.post_list.rendered = function() {

	let posts = this.find(".posts");

	window.isotope = new Isotope(posts, {
		itemSelector: ".post",
		sortBy: "original-order",
		transitionDuration: 0,
		masonry: {
			isFitWidth: true
		},
	});

	function relayoutIsotope() {
		window.isotope.reloadItems();
		window.isotope.arrange({sortBy: "original-order"});
	}

	let observer = new MutationObserver(function(/*mutations*/) {
		relayoutIsotope();

		$(posts).find("video").on("loadeddata", function() {
			relayoutIsotope();
		});

		$(posts).find("img").on("load", function() {
			relayoutIsotope();
		});
	});

	observer.observe(posts, {
		childList: true,
		// subtree: true,,
	});
};

Template.post.helpers({
	mediaCount() {
		// console.log(this.cloudinary_media);
		let items = _.pluck(this.cloudinary_media, "resource_type");
		items = _.filter(items, function(item) {
			return item;
		});
		return items.length;
	},

	userCanEdit() {
		return postEditableBy(this, Meteor.userId());
		// return true;
	}
});
Template.post.events({
	"click .poster-link": function() {
		Session.set("previewing_post", this._id);
		event.preventDefault();
	},

	"click .remove-post": function() {
		Meteor.call("posts.remove", this._id);
	},

	"click .edit-post": function() {
		Session.set("editing_post", this._id);
	}
});

Template.post_overlay.helpers({
	post() {
		let _id = this.post_id;
		return Posts.findOne(_id);
	}
});

Template.post_overlay.events({
	"click #post-overlay": function() {
		Session.set("previewing_post", false);
	}
});

AutoForm.hooks({
	"updatePostForm": {
		"onSuccess": function(formType, result) {
			Meteor.call("posts.mark_posted", this.docId);
			Session.set("editing_post", false);
		},
		"onError": function(formType, result) {},
	},

	"updatePrefsForm": {
		"before": {
			update: function(doc) {
				// console.log("before", doc);
				// console.log(doc.$set.weeks);
				doc.$set.weeks = _.sortBy(doc.$set.weeks, "start");

				this.result(doc);
			}
		},
		"onError": function(insertDoc, updateDoc, currentDoc) {
			// console.log(JSON.stringify(this.updateDoc));
			this.event.preventDefault();
			return false;
		},
	},
});

function uploadFile(post, slot, files) {
	Cloudinary.upload(files, {
		folder: "avalanche",
		resource_type: "auto"
	}, (err, res) => {
		// console.log("Upload Error:", err);
		// console.log("Upload Result:", res);
		if (!err) {
			Meteor.call("posts.updateMedia", post, slot, res);
		}
	});
}

Template.edit_post_form.events({
	"click .cancel": function() {
		if (!this.posted) {
			Meteor.call("posts.remove", this._id);
		}
		Session.set("editing_post", false);
	},

	"click .submit": function() {
		// handled through autoform hooks
	},

	"click .remove-file-0": function() {
		Meteor.call("posts.updateMedia", this.post_id, 0, {});
	},

	"click .remove-file-1": function() {
		Meteor.call("posts.updateMedia", this.post_id, 1, {});
	},

	"click .remove-file-2": function() {
		Meteor.call("posts.updateMedia", this.post_id, 2, {});
	},

	"change .upload-file-0": function(event, template) {
		let post = this.post_id;
		let slot = 0;
		let files = template.find(".upload-file-0").files;
		uploadFile(post, slot, files);
	},

	"change .upload-file-1": function(event, template) {
		let post = this.post_id;
		let slot = 1;
		let files = template.find(".upload-file-1").files;
		uploadFile(post, slot, files);
	},

	"change .upload-file-2": function(event, template) {
		let post = this.post_id;
		let slot = 2;
		let files = template.find(".upload-file-2").files;
		uploadFile(post, slot, files);
	},

	// "change .create-post-file": function(event, template) {
	//
	// 	event.preventDefault();
	//
	// 	Meteor.call("posts.insert", {}, function(error, id){
	// 		if (error) {
	// 			console.error(error);
	// 			return;
	// 		}
	// 		// upload image + add to post
	// 		let files = template.find(".create-post-file").files;
	// 		Cloudinary.upload(files, {
	// 			folder: "avalanche",
	// 			resource_type: "auto"
	// 		}, (err, res) => {
	// 			console.log("Upload Error:", err);
	// 			console.log("Upload Result:", res);
	// 			if (!err) {
	// 				Meteor.call("posts.updateMedia", id, res);
	// 			}
	// 		});
	// 	});
	//
	//
	// },,,
});

Template.edit_post_form.helpers({
	post() {
		// console.log("hi", this.post_id);
		return Posts.findOne(this.post_id);
	},
	lessons() {

		let p = getPrefs();
		if (!p) {
			return {};
		}

		let lessons = _.pluck(p.weeks, "topic");
		lessons = _.object(lessons, lessons);
		return lessons;
	},
});
