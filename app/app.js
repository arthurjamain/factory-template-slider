require([
  'joshlib!vendor/backbone',
  'joshlib!vendor/underscore',
  'src/router',
  'src/controllers/home'
], function(
  Backbone,
  _,
  Router,
  HomeController
) {

  var App = function(options) {

    this.initialize();
  };

  _.extend(App.prototype, Backbone.Events, {

    initialize: function() {
      window.console.log('App initialized.');

      this.homeController = new HomeController(this);
      /* And we're off. */
      this.router = Router;
      window.console.log(this.router, Router);
      this.router.setRoutes(this);
      this.router.historyStart();
    }

  });

  window.app = new App();

});