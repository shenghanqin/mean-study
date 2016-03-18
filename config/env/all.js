'use strict';

// 设置root路径
var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  root: rootPath,
  http: {
    // 默认端口
    port: process.env.PORT || 3000
  },
  https: {
    // 不使用 https
    port: false,

    // Paths to key and cert as string
    ssl: {
      key: '',
      cert: '',
      ca: ''
    }
  },

  // 设置 hostname？
  hostname: process.env.HOST || process.env.HOSTNAME,
  db: process.env.MONGOHQ_URL,

  // 模板引擎 swig
  templateEngine: 'swig',

  // 配置无法猜出的session secret
  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'MEAN',

  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',

  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null
  },
  public: {
    languages: [{
      locale: 'en',
      direction: 'ltr',
    }, {
      locale: 'he',
      direction: 'rtl',
    }],
    currentLanguage: 'en',
    loginPage: '/auth/login',
    cssFramework: 'bootstrap'
  },
  // The session cookie name
  sessionName: 'connect.sid',
  // Set bodyParser options
  bodyParser: {
    json: {limit: '100kb'},
    urlencoded: {limit: '100kb', extended: true}
  }
};
