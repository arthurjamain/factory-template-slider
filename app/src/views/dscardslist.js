define(['joshlib!ui/list'], function(List) {
  return List.extend({

    initialize: function(options) {
      List.prototype.initialize.call(this, options);
    },
    generate: function(cb) {
      List.prototype.generate.call(this, cb);
    },
    setContent: function(html) {
      List.prototype.setContent.call(this, html);
    },
    enhance: function() {
      List.prototype.enhance.call(this);
    }
  });
});