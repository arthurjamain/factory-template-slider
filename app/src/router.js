define([
  'joshlib!router'
], function(
  Router
) {

  var t = Router({

    setRoutes: function(app) {
      this.app = app;

      this.route('', 'home', app.homeController.index);
      this.route('home', 'home', app.homeController.index);
      


    }

  });

 return t;

});