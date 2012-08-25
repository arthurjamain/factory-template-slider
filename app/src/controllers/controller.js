define(['joshlib!vendor/backbone'], function(Backbone) {
  'use strict';
  
  var Controller = function(app) {
    this.app = app;
  };

  Controller.extend = Backbone.Model.extend;

  return Controller;
});