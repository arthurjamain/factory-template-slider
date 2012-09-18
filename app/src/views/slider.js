define([
  'joshlib!ui/layout',
  'joshlib!vendor/underscore',
  'src/views/selector',
  'src/views/dslist',
  'src/views/dscardslistitem',
  'src/views/dscards'
], function(
  Layout,
  _,
  Selector,
  DsList,
  DsCardsListItem,
  DsCards
) {

  return Layout.extend({

    el: '#slider',
    templateEl: '#tpl-slider',

    selector: null,
    dsList: null,
    dsCards: null,

    cancelDrag: false,

    prevX: null,
    prevCardX: null,

    initialize: function(options) {

      this.viewport = options.viewport;
      this.selector = new Selector({});
      this.dsroot = options.collection;

      this.dsList = new DsList({
        collection: this.dsroot,
        templateEl: '#tpl-ds-list',
        itemTemplateEl: '#tpl-ds-list-item'
      });
      this.dsCards = new DsCards({
        collection: this.dsroot,
        templateEl: '#tpl-ds-cards',
        itemFactory: function(model, offset) {
          return new DsCardsListItem({
            model: model,
            templateEl: '#tpl-ds-cards-item'
          });
        }
      });
      _.extend(options, {
        children: {
          selector: this.selector,
          dslist: this.dsList,
          dscards: this.dsCards,
          viewport: this.viewport
        }
      });

      Layout.prototype.initialize.call(this, options);
    },


    enhance: function() {
      this.$knob = this.dsList.$('ul');
      this.$cards = this.dsCards.$('ul');
      this.$selector = $(this.selector.el);
      
      this.initKnobWidth();
      this.initKnobMiddlePosition();

      this.initCardsWidth();
      this.initCardsMiddlePosition();

      try {
        $(document).bind('touchstart mousedown', _.bind(this.evtDragstart, this));
        $(document).bind('touchmove mousemove', _.bind(this.evtDragging, this));
        $(document).bind('touchend mouseup', _.bind(this.evtDragstop, this));
      }
      catch(e) {
        console.log('Drag binding error : ' + e.toString());
      }
     //$(document).trigger('mouseup');
    },

    initKnobWidth: function() {
      var elements = this.dsList.$('li').length;
        
      this.aKnobLi = this.dsList.$('li').first();

      this.aKnobLiWidth = this.aKnobLi.width() + parseInt(this.aKnobLi.css('margin-left'), 10) * 2;
      this.knobWidth = this.aKnobLiWidth;
      this.knobWidth *= elements;

      this.$knob.css({
        width: this.knobWidth+'px'
      });
    },

    initCardsWidth: function() {
      var elements = this.dsCards.$('li').length;
      this.dsCards.$('li').css({
        width: document.width
      });
      this.aCardsLi = this.dsCards.$('li').first();
      this.aCardsLiWidth = parseInt(document.width, 10) + parseInt(this.aCardsLi.css('margin-right'), 10)*2;
      this.cardsWidth = this.aCardsLiWidth;
      this.cardsWidth *= elements;

      this.$cards.css({
        width: this.cardsWidth+'px'
      });
    },

    initKnobMiddlePosition: function() {
      var dw = document.width;

      this.knobMiddlePosition = (dw - this.knobWidth)/2;

      this.$knob.css({
        '-webkit-transform': 'translate3d('+this.knobMiddlePosition+'px, 0, 0)'
      });
      this.knobGoToElement(this.getClosestElement());
    },

    initCardsMiddlePosition: function() {
      var dw = document.width;

      if(dw < this.cardsWidth) {
        this.cardsMiddlePosition = (dw - this.cardsWidth)/2;
      }
      else {
        this.cardsMiddlePosition = (this.cardsWidth - dw)/2;
      }

      this.$cards.css({
        '-webkit-transform': 'translate3d('+this.cardsMiddlePosition+'px, 0, 0)',
        '-webkit-transition': 'none'
      });
      this.cardsGoToElement(this.getClosestElement(), 0);
    },

    getClosestElement: function() {
      var sl = parseInt(this.$selector.offset().left, 10),
          sr = parseInt(this.$selector.offset().left + 180, 10),
          closestLi = null,
          closestLeft = {index: 0, offset: 999};

      $('li', this.$knob).each(_.bind(function(i, el) {
        
        var $el = $(el),
            loffset = parseInt($el.offset().left, 10);
        
        // If it's too far away, don't care.
        /*if(loffset < sl - 150 || roffset < sr - 150)
          return;
        if(loffset > sl + 300 || roffset > sr + 300)
          return;
        */
        var ldiff = sl - loffset;
        var symbol = (ldiff < 0)? -1 : 1;
        ldiff = Math.abs(ldiff);

        if(ldiff < Math.abs(closestLeft.offset)) {
          closestLeft.offset = ldiff*symbol;
          closestLeft.position = loffset;
          closestLeft.index = i;
          closestLeft.$el = $el;
          closestLeft.view = this.dsList.items[i];
        }
      }, this));

      return closestLeft;
    },

    knobGoToElement: function(obj) {

      var oldtrans = this.knobX,
          newtrans = parseInt(oldtrans, 10) + parseInt(obj.offset, 10);
      newtrans -= (parseInt(this.aKnobLi.width(), 10) - parseInt($(this.selector.el).width(), 10)+4)/2;

      this.$knob.css({
        '-webkit-transform': 'translate3d('+newtrans+'px, 0, 0)',
        '-webkit-transition': '-webkit-transform 400ms ease-in-out'
      });
      
    },

    cardsGoToElement: function(obj, duration) {

      var newtrans = obj.index * (parseInt(this.aCardsLiWidth, 10)) * -1;

      if(typeof duration === 'number' && !duration) {
        this.$cards.css({
          '-webkit-transform': 'translate3d('+newtrans+'px, 0, 0)'
        });
      }
      else {
        this.$cards.css({
          '-webkit-transform': 'scale(1) translate3d('+newtrans+'px, 0, 0)',
          '-webkit-transition': '-webkit-transform 500ms ease-in-out'
        });
      }
    },

    evtDragstart: function(e) {
      if(this.cancelDrag) return;
      this.dragging = true;
      this.$knob.css({
        '-webkit-transition': 'none'
      });
      this.$cards.css({
        '-webkit-transition': 'none'
      });
      var scaledpos;
      if(this.$cards.css('-webkit-transform') == 'none') {
        scaledpos = 0;
        console.log(scaledpos);
      }
      else {
        scaledpos = this.$cards.css('-webkit-transform').split('translate3d(')[1].split('px')[0];
      }
      
      this.scaledPosDifference = scaledpos;
      scaledpos -= (this.aCardsLiWidth+60) * 0.85 / 2;
      this.scaledPosDifference -= scaledpos;
      
      this.$cards.css({
        '-webkit-transform': 'scale(0.85) translate3d(' + (scaledpos) + 'px, 0, 0)',
        '-webkit-transition': '-webkit-transform 100ms ease-in-out'
      });

    },

    evtDragging: function(e) {
      if(this.dragging) {

        var evtX=0;
        if(e.originalEvent && e.originalEvent.touches.length) evtX = e.originalEvent.touches[0].pageX;
        if(e.originalEvent && e.originalEvent.changedTouches.length)evtX = e.originalEvent.changedTouches[0].pageX;
        if(e.x) evtX = e.x;
        if(e.pageX) evtX = e.pageX;

        this.$cards.css({
          '-webkit-transition': 'none'
        });
        var oldKnobX = this.$knob.css('-webkit-transform'),
            oldCardsX = this.$cards.css('-webkit-transform');
        if(oldKnobX && oldCardsX) {
          if(oldKnobX === 'none' || oldCardsX === 'none') {
            oldKnobX = 0;
            oldCardsX = 0;
          }
          else {
            oldKnobX = parseInt(oldKnobX.split('translate3d(')[1].split('px')[0], 10);
            oldCardsX = parseInt(oldCardsX.split('translate3d(')[1].split('px')[0], 10);
          }
          /* Find the offset of the movement */
          if(!this.prevX) this.prevX = evtX;
          var offset = evtX - this.prevX;


          this.knobX = oldKnobX + offset;
          this.$knob.css({
            '-webkit-transform': 'translate3d('+this.knobX+'px, 0, 0)'
          });

          this.cardsX = oldCardsX + offset * (this.cardsWidth/this.knobWidth);
          this.$cards.css({
            '-webkit-transform': 'scale(0.85) translate3d('+this.cardsX+'px, 0, 0)'
          });


          this.prevX = evtX;
        }
      }
    },

    evtDragstop: function(e) {
      if(this.dragging) {
        this.dragging = false;
        this.prevX = null;
        var closestElement = this.getClosestElement();
        this.knobGoToElement(closestElement);
        this.cardsGoToElement(closestElement);
      }

      var scaledpos = parseInt(this.$cards.css('-webkit-transform').split('translate3d(')[1].split('px')[0], 10);
      scaledpos += this.aCardsLiWidth*2*0.85;
      scaledpos =  Math.ceil(scaledpos);
    }

  });
});