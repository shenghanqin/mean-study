'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
  Module = mean.Module;

// 定义 auth 作用是啥?
function MeanUserKlass () {
  Module.call(this, 'users');
  this.auth = null;
}


// MeanUserKlass 配置原型? 作用?
MeanUserKlass.prototype = Object.create(Module.prototype,{constructor:{
  value:MeanUserKlass,
  configurable: false,
  enumerable: false,
  writable: false
}});

//示例?  实例
var MeanUser = new MeanUserKlass();

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
MeanUser.register(function(app, database, passport) {
    // This is for backwards compatibility
    MeanUser.aggregateAsset('js', '../lib/angular-jwt/dist/angular-jwt.min.js', {
        // 绝对 的作用是啥?
        absolute: false,
        global: true
    });

    // 权限?
    MeanUser.auth = require('./authorization');

    // passport 的作用是啥?
    require('./passport')(passport);

    // 作用是啥?
    mean.register('auth', MeanUser.auth);

    //We enable routing. By default the Package Object is passed to the routes
    MeanUser.routes(app, MeanUser.auth, database, passport);

    MeanUser.angularDependencies(['angular-jwt', 'mean.system']);

    // 作用是啥?
    MeanUser.events.defaultData({
        type: 'user'
    });

    return MeanUser;
});
