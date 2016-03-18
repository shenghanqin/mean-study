'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Articles = new Module('articles');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Articles.register(function(app, auth, database, circles, swagger) {

  //We enable routing. By default the Package Object is passed to the routes
  Articles.routes(app, auth, database);

  Articles.aggregateAsset('js', '../lib/Sortable/Sortable.js', { weight: 1 });
  Articles.aggregateAsset('js', '../lib/Sortable/ng-sortable.js', { weight: 2 });
  Articles.aggregateAsset('js', '../lib/wiz-markdown/wizMarkdown/wizMarkdown.js', { weight: 3 });
  
  Articles.aggregateAsset('js', '../lib/Hz2Py/jQuery.Hz2Py-min.js', { weight: 4 });
  Articles.aggregateAsset('js', '../lib/angular-clipboard/angular-clipboard.js', { weight: 5 });


  Articles.aggregateAsset('js', '../lib/ng-prettyjson/dist/ng-prettyjson.min.js', { weight: 6 });
  Articles.aggregateAsset('js', '../lib/ng-prettyjson/src/ace.js', { weight: 6 });
  Articles.aggregateAsset('js', '../lib/daft-auto-spacing-gh-pages/text-autospace.js', { weight: 7 });

  Articles.angularDependencies(['ng-sortable', 'wiz.markdown', 'ngPrettyJson', 'angular-clipboard']);

  Articles.aggregateAsset('css', '../lib/ng-prettyjson/dist/ng-prettyjson.min.css', { weight: 1 });
  Articles.aggregateAsset('css', 'articles.css');

  
  //We are adding a link to the main menu for all authenticated users
  Articles.menus.add({
    'roles': ['authenticated'],
    'title': '职位列表',
    'link': 'all articles'
  });
  Articles.menus.add({
    'roles': ['authenticated'],
    'title': '发布新职位',
    'link': 'create article'
  });

  Articles.events.defaultData({
    type: 'post',
    subtype: 'article'
  });


  /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Articles.settings({'someSetting':'some value'},function (err, settings) {
      //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Articles.settings({'anotherSettings':'some value'});

    // Get settings. Retrieves latest saved settings
    Articles.settings(function (err, settings) {
      //you now have the settings object
    });
    */

  // Only use swagger.add if /docs and the corresponding files exists
  swagger.add(__dirname);
	
  return Articles;
});
