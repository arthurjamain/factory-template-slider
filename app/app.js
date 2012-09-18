require([
  'joshlib!vendor/backbone',
  'joshlib!vendor/underscore',
  'joshlib!factorycollection',
  'src/router',
  'src/controllers/home',
  'src/views/container',
  'src/views/slider',
  'src/views/viewport'
], function(
  Backbone,
  _,
  FactoryCollection,
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
      /**
      * Create the controllers
      **/
      this.homeController = new HomeController(this);
      
      /**
      * Create the DS
      **/
      this.createDatasourceCollection();

      /**
      * Create the views
      **/
      this.createViewport();
      this.createSlider();
      this.sliderView.render();

      /* And we're off. */
      this.router = Router;
      this.router.setRoutes(this);
      this.router.historyStart();

      window.console.log('App initialized.');
    },

    createSlider: function() {
      this.sliderView = new SliderView({
        className: 'slider',
        viewport: this.viewport,
        collection: this.datasources
      });
    },
    createViewport: function() {
      this.viewport = new Viewport({
        className: 'viewport'
      });
    },

    createDatasourceCollection: function() {
      
      this.datasources = new Backbone.Collection(window.Joshfire.factory.getDataSource('main').children);
      
    }

  });

  window.translateType = function(rawtype) {
    switch(rawtype) {
      case 'CreativeWork':
        return 'creativework';
      case 'Article/Status':
        return 'status';
      case 'VideoObject':
        return 'video';
      case 'AudioObject':
        return 'audio';
      case 'BlogPosting':
        return 'post';
    }
  };

  /**
  * Check compatibility and launch the app.
  * Else, noooooope.
  **/
  window.app = new App();

});