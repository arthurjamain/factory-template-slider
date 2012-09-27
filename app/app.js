require([
  'joshlib!vendor/backbone',
  'joshlib!vendor/underscore',
  'joshlib!factorycollection',
  'joshlib!ui/list',
  'joshlib!ui/item',
  'src/router',
  'src/controllers/home',
  'src/views/container',
  'src/views/slider',
  'src/views/viewport',
  'src/views/dscardslist'
], function(
  Backbone,
  _,
  FactoryCollection,
  List,
  Item,
  Router,
  HomeController,
  ContainerView,
  SliderView,
  Viewport,
  DsCardsList
) {

  'use strict';
  
  var App = function(options) {
    this.initialize();
  };

  _.extend(App.prototype, Backbone.Events, {

    datasources: null,
    datasourcesEntriesCollections: [],
    datasourcesListViews: [],


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
      this.createDatasourceLists();
      this.fetchAllDatasources();

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
        collection: this.datasources,
        app: this
      });
    },
    createViewport: function() {
      this.viewport = new Viewport({
        className: 'viewport'
      });
    },

    createDatasourceLists: function() {
      for(var i in this.datasourcesEntriesCollections) {
        this.datasourcesListViews.push(new DsCardsList({
          collection: this.datasourcesEntriesCollections[i],
          el: window.$('.joshfire-ds-'+i+' .entrieslist', this.sliderView.children.dscards.el)[0],
          itemFactory: function(model, offset) {
            var simpletype = window.translateType(model.get('@type'));
            var template = '#tpl-cards-list-item-'+simpletype;
            return new Item({
              model: model,
              offset: offset,
              templateEl: template
            });
          },
          templateEl: '#tpl-cards-list',
          scroller: true,
          app: this,
          offset: i
        }));
      }
    },

    createDatasourceCollection: function() {
      
      this.datasources = new Backbone.Collection(window.Joshfire.factory.getDataSource('main').children);
      this.datasources.each(_.bind(function(model, i) {
        this.datasourcesEntriesCollections.push(new Backbone.Collection());
      }, this));
    },

    fetchAllDatasources: function() {
      this.datasources.each(_.bind(function(model, i) {
        model.get('find').call(this, {}, _.bind(function(err, data) {
          if(data && data.entries && data.entries.length) {
            this.datasourcesListViews[i].collection.add(data.entries, {
              silent: true
            });
            this.datasourcesListViews[i].update(true);
            this.sliderView.children.dscards.items[i].view.hideLoader();
          }
        }, this));
      }, this));
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
      case 'ImageObject':
        return 'image';
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