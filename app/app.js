require([
  'joshlib!vendor/backbone',
  'joshlib!vendor/underscore',
  'src/router',
  'src/controllers/home',
  'src/views/container',
  'src/views/slider',
  'src/views/viewport'
], function(
  Backbone,
  _,
  Router,
  HomeController,
  ContainerView,
  SliderView,
  Viewport
) {

  'use strict';

  var App = function(options) {

    this.initialize();
  };

  _.extend(App.prototype, Backbone.Events, {

    initialize: function() {
      window.console.log('App initialized.');
      /**
      * Create the controllers
      **/
      this.homeController = new HomeController(this);
      
      /**
      * Create the views
      **/
      this.createSlider();
      this.createViewport();
      this.createContainer();

      /* And we're off. */
      this.router = Router;
      this.router.setRoutes(this);
      this.router.historyStart();
    },

    createSlider: function() {
      this.sliderView = new SliderView({
        className: 'slider'
      });
    },
    createViewport: function() {
      this.viewport = new Viewport({
        className: 'viewport'
      });
    },

    createContainer: function() {
      this.containerView = new ContainerView({
        el: '#container',
        slider: this.sliderView,
        viewport: this.viewport
      });
      this.containerView.render();
    }

  });



  /**
  * Check compatibility and launch the app.
  * Else, noooooope.
  **/
  window.app = new App();

});