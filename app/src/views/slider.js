define([
  'joshlib!ui/layout',
  'joshlib!vendor/underscore',
  'src/views/selector',
  'src/views/dslist'
], function(
  Layout,
  _,
  Selector,
  DsList
) {
  return Layout.extend({

    id: 'slider',
    templateEl: '#tpl-slider',

    selector: null,
    dsList: null,

    cancelDrag: false,

    prevX: null,

    initialize: function(options) {

      this.selector = new Selector({});

      this.dsList = new DsList({
        collection: new Backbone.Collection([
          {
            'name': 'Tab 1' 
          },
          {
            'name': 'Tab 2' 
          },
          {
            'name': 'Tab 3' 
          },
          {
            'name': 'Tab 4' 
          },
          {
            'name': 'Tab 2' 
          },
          {
            'name': 'Tab 3' 
          },
          {
            'name': 'Tab 4' 
          }
        ]),
        templateEl: '#tpl-ds-list',
        itemTemplateEl: '#tpl-ds-list-item'
      });

      _.extend(options, {
        children: {
          selector: this.selector,
          dslist: this.dsList
        }
      });

      Layout.prototype.initialize.call(this, options);
    },

    setContent: function(html) {
      this.el.innerHTML = html;
    },

    enhance: function() {

      this.$knob = this.dsList.$('ul');
      this.$selector = $(this.selector.el);
      
      this.initKnobWidth();
      this.initKnobMiddlePosition();

      try {
        $(document).bind('mousedown', _.bind(this.evtDragstart, this));
        $(document).bind('mousemove', _.bind(this.evtDragging, this));
        $(document).bind('mouseup', _.bind(this.evtDragstop, this));
      }
      catch(e) {
        console.log('Drag binding error : ' + e.toString());
      }
      $(document).trigger('mouseup');
    },

    initKnobWidth: function() {
      var elements = this.$('li').length,
          anLi = this.$('li').first();
      
      this.listWidth = anLi.width(true) + parseInt(anLi.css('margin-left'), 10) + parseInt(anLi.css('margin-right'), 10);
      this.listWidth *= elements;

      this.$knob.css({
        width: this.listWidth+'px'
      });
    },

    initKnobMiddlePosition: function() {
      var dw = document.width;

      if(dw < this.listWidth) {
        this.listMiddlePosition = (dw - this.listWidth)/2;
      }
      else {
        this.listMiddlePosition = (this.listWidth - dw)/2;
      }

      this.$knob.css({
        '-webkit-transform': 'translate3d('+this.listMiddlePosition+'px, 1px, 1px)'
      });

    },

    goToClosestElement: function() {
      var sl = parseInt(this.$selector.offset().left, 10),
          sr = parseInt(this.$selector.offset().left + 180, 10),
          closestLi = null,
          closestLeft = {index: 0, val: 999},
          closestRight = {index: 0, val: 999};

      $('li', this.$knob).each(function(i, el) {
        
        var $el = $(el),
            loffset = parseInt($el.offset().left, 10),
            roffset = parseInt($el.offset().left + 150, 10);
        
        // If it's too far away, don't care.
        if(loffset < sl - 150 || roffset < sr - 150)
          return;
        if(loffset > sl + 300 || roffset > sr + 300)
          return;

        var ldiff = Math.abs(
          sl - loffset
        ),
            rdiff = Math.abs(
          sr - roffset
        );

        if(rdiff < closestRight.val) {
          closestRight.val = roffset;
          closestRight.index = i;
        }
        if(ldiff < closestLeft.val) {
          closestLeft.val = loffset;
          closestLeft.index = i;
        }
      });
      console.log(closestLeft, closestRight);
      if(closestLeft.val == closestRight.val)
        return;

      var chosen = (closestLeft.val > closestRight.val)?closestRight:closestLeft;
      

      var oldX = this.$knob.css('-webkit-transform');
      if(oldX == 'none') {
        oldX = 0;
      }
      else {
        oldX = parseInt(oldX.split('translate3d(')[1].split('px')[0], 10);
      }

      var gotox = oldX + chosen.val;
      
      //this.cancelDrag = true;
      this.$knob.css({
        '-webkit-transition': 'none'
      });
      this.$knob.anim({
        '-webkit-transform': 'translate3d('+gotox+'px, 0, 0)'
      }, 0.2, 'linear',
      _.bind(function() {
        this.$knob.css({
          '-webkit-transition': 'none'
        });
        this.cancelDrag = false;
      }, this));

    },

    evtDragstart: function(e) {
      if(this.cancelDrag) return;
      this.dragging = true;
    },

    evtDragging: function(e) {
      if(this.dragging) {
        /* Get the knob's previous X */
        var oldX = this.$knob.css('-webkit-transform');
        if(oldX) {
          if(oldX == 'none') {
            oldX = 0;
          }
          else {
            oldX = parseInt(oldX.split('translate3d(')[1].split('px')[0], 10);
          }
          /* Find the offset of the movement */
          if(!this.prevX) this.prevX = e.x;
          var offset = e.x - this.prevX;
          this.prevX = e.x;
          /* Get the knob's new X */
          this.X = oldX + offset;
          /* Bam ! */
          this.$knob.css({
            '-webkit-transform': 'translate3d('+this.X+'px, 0, 0)'
          });
        }
      }
    },

    evtDragstop: function(e) {
      this.dragging = false;
      this.prevX = null;
      this.goToClosestElement();
    }

  });
});