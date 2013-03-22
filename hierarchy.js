//Convert our count hierarchy to a node hierarchy for d3

function schemaToHierarchy(schema) {
  var keys = Object.keys(doc);
  keys.forEach(function(key) {
    if(key.indexOf("_$") != 0) {
      //this is an actual field, let's make it a child
      if(!doc['_$children']) doc['_$children'] = [];
      var obj = doc[key];
      doc['_$children'].push(obj)
      schemaToHierarchy(obj);
      delete doc[key];
    }
  });
  return schema;
}
