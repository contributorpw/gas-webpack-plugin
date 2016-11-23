var webpack = require("webpack");
var MemoryFS = require("memory-fs");
var test = require('tap').test;
var fs = require('fs');
var GasPlugin = require('../');

test('gas-plugin', function(t) {
  var compiler = webpack({
    context: __dirname + '/fixtures',
    entry: "./main.js",
    output: {
      path: __dirname + "/output",
      filename: "bundle.gs"
    },
    plugins: [
      new GasPlugin()
    ]
  });

  var mfs = new MemoryFS();
  compiler.outputFileSystem = mfs;
  compiler.run(function(err, stats) {
    t.error(err, 'build failed');
    var jsonStats = stats.toJson();
    t.ok(jsonStats.errors.length === 0);
    t.ok(jsonStats.warnings.length === 0);
    var bundle = mfs.readFileSync(__dirname + '/output/bundle.gs', 'utf8');
    var expected = fs.readFileSync(__dirname + '/fixtures/expected.gs', 'utf8');
    t.equal(bundle.toString(), expected.toString(), 'plugin and expected output match');
    t.end();
  });
});
