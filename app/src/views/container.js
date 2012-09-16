define(['joshlib!ui/layout'], function(Layout) {
  return Layout.extend({
    initialize: function(options) {
      this.slider = options.slider;
      this.viewport = options.viewport;

      Layout.prototype.initialize.call(this, {
        children: {
          slider: this.slider,
          viewport: this.viewport
        }
      });
    }
  });
});