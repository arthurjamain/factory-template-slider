var fs   = require('fs');
var path = require('path');
var less = require('less');
var colors = require('colors');
var parser = new less.Parser({paths: [path.join(__dirname, '/../app/less')]});
var src  = path.join(__dirname, '/../app/style/less/');
var dest = path.join(__dirname, '/../app/style/css/');
var compress = false;

var files = [
  'style'
];

var srcPath = function(file) {
  return src + file + '.less';
};

var destPath = function(file) {
  return dest + file + '.css';
};

var compileSource = function(str, file, cb) {
  parser.parse(str, function (e, tree) {
    try {
      var css = tree.toCSS({compress: compress});
      var dest = destPath(file);
      fs.writeFileSync(dest, css, 'utf8');

      console.log((' - compiled ' + file).green);
    } catch(err) {
      console.error(err.message.red);
    }

    if(cb) cb();
  });
};

var compileFile = function(file, cb) {
  console.log(('+ compiling ' + file).cyan);

  var src = srcPath(file);
  var str = fs.readFileSync(src, 'utf8');

  compileSource(str, file, cb);
};

var compile = function(cb) {
  var i = 0;

  var doIt = function() {
    compileFile(files[i], function() {
      if(++i === files.length && cb) {
        cb();
      } else {
        doIt();
      }
    });
  };

  doIt();
};

exports.compile = compile;
