define(['joshlib!ui/item'], function(Item) {
  return Item.extend({

    templateEl: '#tpl-details',

    initialize: function(options) {
      Item.prototype.initialize.call(this, options);
      this.render();
    },

    generate: function(cb) {
      var html = this.compileTemplate($(this.templateEl).text(), {});
      cb(null, html);
    },

    setContent: function(html) {
      this.el.innerHTML = html;
    },

    enhance: function() {

    }
  });
});