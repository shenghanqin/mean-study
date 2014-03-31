var templates = require('./templates.js');
var fs = require('fs');
var mkdirp = require('mkdirp');

exports.packages = function(name, options) {
  name = name.toLowerCase();

  var data = {
    name: name,
    class: capitaliseFirstLetter(name),
    author: (typeof options.author == 'string' ? options.author : 'mean scaffold')
  };

  console.log('Go to #!/'+name+'/example to see your default page');
  buildDirectoryStructure(name, data);

}



function buildDirectoryStructure(name, data) {
  var path = './node_modules/' + name;
  var code = new giraffe(templates.app);

  console.log("Files saved in node_modules/" + name);

  mkdir(path, function() {
    code = new giraffe(templates.app);
    write(path + '/app.js', code.render(data));
    code = new giraffe(templates.packagejson);
    write(path + '/package.json', code.render(data));
    write(path + '/README.md', 'README: ' + name);
  });

  mkdir(path + '/server');

  mkdir(path + '/public');
  mkdir(path + '/public/assets');  
  mkdir(path + '/public/assets/css', function() {
    write(path + '/public/assets/css/'+name+'.css', '.'+name+'_example h1:{background-color:purple}');
  });    
  mkdir(path + '/public/assets/img', function() {
    fs.createReadStream(__dirname+'/meanlogo.png').pipe(fs.createWriteStream(path + '/public/assets/img/logo.png'));
  });  

  mkdir(path + '/public/config', function () {
    code = new giraffe(templates.clientRoutes);
    write(path + '/public/config/routes.js', code.render(data));    
  });
  mkdir(path + '/public/controllers', function () {
    code = new giraffe(templates.clientController);
    write(path + '/public/controllers/'+name+'.js', code.render(data));    
  });    
  mkdir(path + '/public/services', function () {
    // code = new giraffe(templates.clientService);
    // write(path + '/public/services/'+name+'.js', code.render(data));    
  });
  mkdir(path + '/public/views', function () {
    code = new giraffe(templates.clientView);
    write(path + '/public/views/index.html', code.render(data));    
  });      

  mkdir(path + '/server');
  mkdir(path + '/server/models');
  mkdir(path + '/server/controllers');
  mkdir(path + '/server/config');
  mkdir(path + '/server/views', function () {
    code = new giraffe(templates.serverView);    
    write(path + '/server/views/index.html',code.render(data));    
  });
  mkdir(path + '/server/routes', function () {
    code = new giraffe(templates.serverRoutes);
    write(path + '/server/routes/index.js', code.render(data));    
  });  

}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str) {
  fs.writeFile(path, str);
  console.log('   \x1b[36mcreate\x1b[0m : ' + path.replace('./node_modules/', ''));
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
  mkdirp(path, 0755, function(err) {
    if (err) throw err;
    console.log('   \033[36mcreate\033[0m : ' + path.replace('./node_modules/', ''));
    fn && fn();
  });
}

function giraffe(template) {
  this.template = template;
};

giraffe.prototype.render = function(data) {
  var template = this.template;
  for (var index in data) {
    template = template.split("{{" + index + "}}").join(data[index]);
  }
  return template;
}

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}