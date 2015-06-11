var util = require('util');
var info = require('./../package');

module.exports = usage_yargs;
//module.exports = usage_commander;
function usage_yargs(argv) {
  var argv = argv.slice(2);
  var usage = require('yargs')(argv)
    .usage('Usage: nezumi [Options] URL[ URL [...]] ')
    .version(function() {
      var core = require('../../nezumi-core'); /*TODO: use nezumi-core as a module*/
      return util.format('%s@%s (%s@%s)', info.name, info.version, core.name, core.version);
    })
    .help('help', 'Show help and exit')
    .options({
      V: {
        alias: 'version',
        requiresArg: false,
        description: 'Show version and exit'
      },
      h: {
        alias: 'help',
        requiresArg: false
      },
      f: {
        alias: 'force',
        type: 'boolean',
        requiresArg: false,
        description: 'Force overwriting existed files'
      },
      i: {
        alias: 'info',
        type: 'boolean',
        requiresArg: false,
        description: 'Display the information without downloading'
      },
      u: {
        alias: 'url',
        type: 'boolean',
        requiresArg: false,
        description: 'Display the real URLs without downloading'
      },
      n: {
        alias: 'no-merge',
        type: 'boolean',
        requiresArg: false,
        /*default: true,*/
        description: 'dont merge video parts'
      },
      q: {
        alias: 'quality',
        requiresArg: true,
        default: 5,
        description: '<1-5>| Quality choice,1 the wrost,5 the best'
      },
      o: {
        alias: 'output',
        type: 'string',
        requiresArg: true,
        default: './',
        description: '<outputdir>| set the output videos directory',
      },
      x: {
        alias: 'http-proxy',
        type: 'string',
        requiresArg: true,
        description: '<http://HOST:PORT>| http proxy for parsing page'
      },
      c: {
        alias: 'config',
        type: 'string',
        requiresArg: true,
        description: '<conf.json>| load config from json file'
      },
    })
    .config('config');
  var urls = usage.argv._;
  var options = usage.argv;
  delete options._;
  if (urls.length === 0 || options.help) {
    usage.showHelp();
  }
  return {
    urls: urls,
    options: options
  };

}


function usage_commander(argv) {
  var program = require('commander');
  program
    .usage('[Options] URL[ URL [...]] ')
    .version(util.format('%s %s', info.name, info.version))
    .option('-i, --info', 'Display the information without downloading')
    .option('-u, --url', 'Display the real URLs without downloading')
    .option('-n, --no-merge', 'dont merge video parts')
    .option('-t, --format <format-id>', 'Video format code')
    .option('-o, --output <outputdir>', 'set the output videos directory')
    .option('-x, --http-proxy <HOST:PORT>', 'http proxy for downloading')
    .option('-y, --extractor-proxy <HOST:PORT>', 'http proxy for extracting stream data')
    .parse(argv);
  var urls = program.args;
  var options = program;
  delete options.args;

  if (urls.length === 0) {
    program.help();
  }
  return {
    urls: urls,
    options: options
  };

}