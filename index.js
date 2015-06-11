#!/usr/bin/env node

'use strict'
var info = require('./package');
process.title = info.name;
var fs = require('fs');
var util = require('util');
var path = require('path');
var events = require('events');

var async = require('async');
var request = require('request');

var multimeter = require('multimeter');
var multi = multimeter(process);

process.on('SIGINT', function() {
  console.log(util.format('\rOoops! %s terminated.', info.name));
  process.exit(1);
});


var usage = require('./lib/usage.js')(process.argv);
var urls = usage.urls;
var options = usage.options;
/*var urls = usage.argv._;*/
/* options do not need _(urls)*/
/*var options = usage.argv;*/
/*delete options._;*/


// var multi = require('multimeter')(process);

var nezumi = require('../nezumi-core'); // this will be a node module

urls.forEach(function(url, index) {
  var extractOptions = {
    proxy: options.x,
    quality: options.q
  };
  nezumi.extract(url, extractOptions, function(err, urlLists, downloadOptions) {
    if (err) {
      console.trace(err);
      return;
    }
    urlLists.forEach(function(item) {
      console.log(item.size);

      // var bar = multi.rel(0, 0);
      multi.drop(function(bar) {
        async.forEachOf(item.urls, function(value, index, cb) {
            var file = fs.createWriteStream(path.resolve(options.o, item.title + '.' + index));
            var i = 0;
            var j = 0;
            file.on('drain', function() {
              i++;
            });
            // file.on('finish', function() {
            //   console.log(path.resolve(options.o, item.title + '.' + index), 'finish at', i);
            // });
            request.get({
              url: value,
              headers: downloadOptions.headers,
              proxy: options.x,
              encoding: null
            }).on('response', function(response) {
              // console.log(response.headers['content-type']);
              // console.log(response.headers['content-length']);
            }).on('data', function(data) {
              var len = data.length;
              // console.log(len / item.size);
              // bar.percent(bar.percent() + len / item.size);
              bar.ratio(len, item.size);
              // bar.percent(bar.percent() + len / item.size);
            }).on('end', function() {
              // console.log('end at', j);
            }).pipe(file);
          },
          function(err) {
            if (err) {
              console.trace(err);
              return;
            }
          });
      });

    });
  });
});

// var matchExtractor = require('./lib/matcher.js').match;
// var extractorFolder = path.join(__dirname, 'lib', 'extractors');

// urls.forEach(function(url, index) {
//   var url = url.toString().toLowerCase();
//   /* not a strict regexp*/
//   if (!url.match(/^https?:\/\/.+$/)) {
//     url = 'http://' + url;
//   }
//   var p = require(path.join(extractorFolder, resModule))(srcUrl, options, function realDownload(err, infos) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     // infos  should be array even array.length==1-> 
//     //{ ,items:[{url:[string,string,...],title,size,},{url:[string],title,size},{url:function_to_gen_url,title,size},{url:[function_to_gen,function],title,size}]}
//     // info.items.forEach(function(item, index) {
//     //   if (Array.isArray(item)) {
//     //     if (url) {

//     //     }

//     //   }
//     //   if (typeof item === 'function') {
//     //     for (var len = item.length(), i = 0; i < len; i++) {
//     //       var url = item.next();
//     //       download_url(url);
//     //     }
//     //   } else if (Array.isArray(item)) {
//     //     item.forEach(function(url, idx) {
//     //       if (typeof url === 'function') {
//     //         url = url();
//     //       }

//     //     });
//     //   }
//     // });
//   });
//   p.on('display', function(msg) {
//     // do sth with msg
//   })
// });