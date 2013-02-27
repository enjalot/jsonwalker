var walker = require('./mapreduce');

var mongo = require('mongoskin');
var mongo_host = process.env.MONGO_HOST || 'localhost'
var mongo_port = process.env.MONGO_PORT || 27017
var mongo_db   = process.env.MONGO_DB || 'test'
var db         = mongo.db(mongo_host + ':' + mongo_port + '/' + mongo_db + '?auto_reconnect');

var async = require('async');

async.parallel([
  //REPLACE these collections with your own collections
  walker.reduce(db, "collection1"),
  walker.reduce(db, "collection2")
],function(err, result) {
  console.log("all done!");
  db.close();
})
//`walker.reduce(db, "stories");
