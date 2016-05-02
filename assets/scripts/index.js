'use strict';

const events = require('./api/events.js');
const app = require('./api/apiurl.js');
// var $ = require('jquery');
require('jquery.lazyload.cjs')($);

// On document ready
$(() => {
  events.addHandlers();
});

const getFlag = function(id){
  $.ajax({
    url: "http://localhost:3000/flags/" + id,
    // method: 'GET',
    // dataType: 'json'
  }).done(function(data){
    displayFlag(data.flag);
  });
};

const getComments = function(flagID){
  $.ajax({
    url: "http://localhost:3000/comments/",
    // method: 'GET',
    // dataType: 'json'
  }).done(function(data){
    displayComments(data.comments, flagID);
  });
};

const displayFlags = function(flags){
  const flagsTemplate = require('./templates/flag-listing.handlebars');
  // const flagTemplate = require('./templates/flag.handlebars');
  $('.content').append(flagsTemplate({flags}));
  $("img.flags").lazyload({
    effect : "fadeIn"
  });
  $('.flags').on("click", function(){
    $('#flagModal').modal();
    getFlag($(this).data("id"));
  });
};

const getFlags = function(){
  $.ajax({
    url: "http://localhost:3000/flags",
    // method: 'GET',
    // dataType: 'json'
  }).done(function(data){
    displayFlags(data.flags);
  });
};

const displayFlag = function(flag){
  const display = require('./templates/flag.handlebars');
  $('.flagDisplay, .flag-comments').empty();
  $('#comment').val('');
  $('.flagName').text(function() {return flag.name;});
  $('.flagDisplay').append(display({flag}));
  getComments(flag.id);
};

const displayComments = function(comments, flagID) {
  const display = require('./templates/comments.handlebars');
  const displaySelf = require('./templates/self-comments.handlebars');
  console.log(comments);
  console.log(app.user.email);

  for (var i = 0; i < comments.length; i++) {
    if (comments[i].flag.id === flagID && comments[i].user.email === app.user.email) {
      let comment = comments[i];
      $('.flag-comments').append(displaySelf({comment}));
    }
    else if (comments[i].flag.id === flagID) {
      let comment = comments[i];
      $('.flag-comments').append(display({comment}));
    }
  }
};

$(document).ready(function(){
  getFlags();
});

module.exports = {
  getComments
};
