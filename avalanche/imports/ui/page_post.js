import {Template} from 'meteor/templating';
import {Posts} from '../api/posts.js';
import './page_post.html';

Template.page_post.helpers({
    post() {
        console.log("posthelper");
        var id = FlowRouter.getParam("postId");
        console.log(id);
        var cursor = Posts.findOne(id);
        return cursor;
    }
});