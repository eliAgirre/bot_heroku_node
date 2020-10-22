const MongoClient = require('mongodb').MongoClient;
const user = process.env.USER;
const pass = process.env.PASS;
//const url = "mongodb+srv://"+user+":"+pass+"@cluster0-faeim.mongodb.net/test?retryWrites=true&w=majority";
const url = "mongodb+srv://"+user+":"+pass+"@cluster0.faeim.mongodb.net/test";
//const client = new MongoClient(url, { useNewUrlParser: true });
    
var _db;

const options = {
  keepAlive: 1,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url, options, function( err, client ) {
      _db = client.db('quiz');
      //console.log(_db);
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }

};