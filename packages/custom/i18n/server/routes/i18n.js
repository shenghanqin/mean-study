'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(I18n, app, auth, database) {

var x = {
    log: function(req, res, next){
        console.log(">>>> ",JSON.stringify(req.user));
        next();
        // return res.send('Anyone can access this' + JSON.stringify(req.user));
    }
}
  app.get('/api/i18n/example/anyone', x.log, function(req, res, next) {
    res.send('Anyone can access this' + JSON.stringify(req.user));
  });

  app.get('/api/i18n/example/auth', x.log, auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/i18n/example/admin', x.log, auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/i18n/example/render', function(req, res, next) {
    I18n.render('index', {
      package: 'i18n'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
