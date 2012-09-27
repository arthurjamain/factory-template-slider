define([
  'joshlib!ui/item'
], function(Item) {
  return Item.extend({

    tagName: 'li',
    templateEl: '#tpl-ds-cards-item',


    initialize: function(options) {
      Item.prototype.initialize.call(this, options);
      //console.log(this);
      //this.render();
    },

    hideLoader: function() {
      $('.loader', this.el).animate({
        opacity: 0
      }, 800, 'ease-in-out', function() {
        $(this).remove();
      });
    },

    setElement: function(el) {
      this.el = el;
      this.$ = function(sel, cont) {
        return $($(sel, cont), el);
      };
    },

    enhance: function() {
      $('h2', this.el).html(this.model.get('name'));
      Item.prototype.enhance.call(this);
    }
  });
});