define([
  'joshlib!router'
], function(
  Router
) {

  return Router({


    setRoutes: function(app) {
      'use strict';
      
      this.app = app;

      this.route('', 'home', app.homeController.index);
      this.route('home', 'home', app.homeController.index);
      


    }

  });

});