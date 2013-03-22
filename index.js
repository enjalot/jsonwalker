var walker = require('./mapreduce');

var mongo = require('mongoskin');
var mongo_host = process.env.MONGO_HOST || 'localhost'
var mongo_port = process.env.MONGO_PORT || 27017
var mongo_db   = process.env.MONGO_DB || 'test'
var db         = mongo.db(mongo_host + ':' + mongo_port + '/' + mongo_db + '?auto_reconnect');

var async = require('async');

async.parallel([
  //REPLACE these collections with your own collections
  //walker.reduce(db, "profiles")
  //,walker.reduce(db, "stories")
  walker.reduce(db, "testimports")
],function(err, result) {
  console.log("all done!", err, result);
  db.close();
})
//`walker.reduce(db, "stories");
