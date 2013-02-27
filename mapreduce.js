
exports.reduce = function(db, collection) {
  return function(callback) {
    reduce(db, collection, callback);
  };
}

function reduce(db, collection, callback) {
  var $col = db.collection(collection);
  var out = collection +  "_schema"
  console.log("reducing", collection, "in to", out);
  db.collection(out).remove({});
  
  var query = {};
  
  function map() {
    emit("schema", this)
  }

  function reduce(k, docs) {
    // Profiles are already unique so this doesn't actually do anything
    var output = {};
    
    function checkType(value) {
      if(value == undefined) return "undefined";
      //if(value == null) return "undefined";
      if(typeof(value) === "object") { 
        if(value._$count) {
          return "count";
        }
      }
      if(value.hasOwnProperty("length") && typeof(value) !== "string") {
        return "array";
      }
      return typeof(value);
    }
    function makeCount() {
      return {
        _$count: true,
        _$array: {},
        _$object: 0,
        _$string: 0,
        _$number: 0,
        _$undefined: 0,
        _$boolean: 0
      }
    }
    
    function merge (to, from) {
      for (var key in from) { 
        if(!to[key]) to[key] = 0;
        to[key] += from[key]
      }
      return to;
    }
    function add(a,b) {
      var newCount = {
        _$count: true,
        _$array: merge(a._$array, b._$array),
        //_$array: {},
        _$object: a._$object + b._$object,
        _$string: a._$string + b._$string,
        _$number: a._$number + b._$number,
        _$undefined: a._$undefined + b._$undefined,
        _$boolean: a._$boolean + b._$boolean
      }
      return newCount;
    }
          
    function walk(doc, result) {
      for (var field in doc) {
        
        if(!(field in result)) {
          result[field] = makeCount();
        }
          
        var type = checkType(doc[field])
        if(type === "count") {
          //this doc is a count, so just add it to existing
          result[field] = add(result[field], doc[field]);
          continue;
        }

        if(type === "array") {
          var len = doc[field].length;
          var res = result[field]["_$array"]
          if (!(len in res)) res[len] = 0;
          res[len]++;

        } else if(type ==="object") {
          result[field]["_$object"] += 1;
          walk(doc[field], result[field]);
        } else {
          result[field]["_$" + type] += 1;
        }
      }
      return result;
    }
    docs.forEach(function(doc) {
      walk(doc, output)
    });
    return output;

  }

  // This creates a simplified profile
  $col.mapReduce(map, reduce, {
    out: {reduce: out},
    query: query
  }, function(err, coll) {
    console.log("reduced", collection, "!");
    //if(err) console.log(err);
    callback(err, coll);
  })

}

