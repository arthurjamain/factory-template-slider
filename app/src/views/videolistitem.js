define([
  'joshlib!ui/item',
  'joshlib!vendor/underscore'
], function(Item) {

  return Item.extend({

    tagName: 'li',
    templateEl: '#tpl-cards-list-item-video',
    events: {
      'click': 'expand'
    },


    initialize: function(options) {
      Item.prototype.initialize.call(this, options);
    },

    enhance: function() {
      Item.prototype.enhance.call(this);
    },

    expand: function() {
      $('.video-item-expanded').removeClass('video-item-expanded');
      $(this.el).addClass('video-item-expanded');
    }

  });
});