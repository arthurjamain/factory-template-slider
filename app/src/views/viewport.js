define(['joshlib!uielement'], function(uiElement) {
  return uiElement.extend({

    id: 'viewport',
    templateEl: '#tpl-viewport',

    initialize: function(options) {
      uiElement.prototype.initialize.call(this, options);

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