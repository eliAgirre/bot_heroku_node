const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const user = process.env.USER;
const pass = process.env.PASS;
const base = process.env.DATABASE;
const coleccion = process.env.COLLECTION;
//const url = "mongodb+srv://"+user+":"+pass+"@cluster0-faeim.mongodb.net/test?retryWrites=true&w=majority";
const url = "mongodb+srv://"+user+":"+pass+"@cluster0.faeim.mongodb.net/test";
//const client = new MongoClient(url, { useNewUrlParser: true });
const model_pregunta = require('../model/Pregunta.js'); // modelos
    
var _db;
var _collection;

const options = {
  keepAlive: 1,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url, options, function( err, client ) {
      _db = client.db(base);
      _collection = _db.collection(coleccion);
      console.log("db: "+_db.databaseName);
      console.log("coleccion: "+_collection.namespace);
      return callback( err );
    });
  },

  getDb: function() {
    console.log(_db);
    return _db;
  },
  
  findAllDocs: function( callback ){
    this.connectToServer( function( err ) {
      if (err) { console.log(err); }
        _db.collection(coleccion).find().toArray((err, results) => {
          var db_questions = [];
          if(err) return console.log(err)
          if (results.length > 0) { //console.log(results);
            results.forEach(function(obj) { //results.forEach(function(obj, i) { //console.log("obj: "+ JSON.stringify(obj));
              db_questions.push(new model_pregunta(obj.bloque, obj.tema, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta, obj.img)); //preg.showPregunta()
          });}
          //console.log("array length: "+db_questions.length);
          return callback( db_questions );
        })
    });
  },

  findBloque: function( bloque_elegido, callback ){
    this.connectToServer( function( err ) {
      if (err) { console.log(err); }
        _db.collection(coleccion).find( { bloque : bloque_elegido.toUpperCase } ).toArray((err, results) => {
          var preguntasBloque = [];
          if(err) return console.log(err)
          if (results.length > 0) { //console.log(results);
            results.forEach(function(obj) { //results.forEach(function(obj, i) { //console.log("obj: "+ JSON.stringify(obj));
              preguntasBloque.push(new model_pregunta(obj.bloque, obj.tema, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta, obj.img)); //preg.showPregunta()
          });}
          //console.log("array length: "+preguntasBloque.length);
          return callback( preguntasBloque );
        })
    });
  },

  findBloqueYtema: function( bloque, tema, callback ){
    this.connectToServer( function( err ) {
      if (err) { console.log(err); }
        _db.collection(coleccion).find( {$and:[{ bloque : bloque },{ tema : tema } ]} ).toArray((err, results) => {
          var preguntasBloqueXtema = [];
          if(err) return console.log(err)
          if (results.length > 0) { //console.log(results);
            results.forEach(function(obj) { //results.forEach(function(obj, i) { //console.log("obj: "+ JSON.stringify(obj));
              preguntasBloqueXtema.push(new model_pregunta(obj.bloque, obj.tema, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta, obj.img)); //preg.showPregunta()
          });}
          //console.log("array length: "+preguntasBloqueXtema.length);
          return callback( preguntasBloqueXtema );
        })
    });
  },

  findInapAnio: function( autorLI1, autorPI1, callback ){
    this.connectToServer( function( err ) {
      if (err) { console.log(err); }
        _db.collection(coleccion).find( {$or:[{ autor: autorLI1 },{ autor : autorPI1 } ]} ).toArray((err, results) => {
          var preguntasAnio = [];
          if(err) return console.log(err)
          if (results.length > 0) { //console.log(results);
            results.forEach(function(obj) { //results.forEach(function(obj, i) { //console.log("obj: "+ JSON.stringify(obj));
              preguntasAnio.push(new model_pregunta(obj.bloque, obj.tema, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta, obj.img)); //preg.showPregunta()
          });}
          //console.log("array length: "+preguntasAnio.length);
          return callback( preguntasAnio );
        })
    });
  },

  findAutor: function( autor, callback ){
    this.connectToServer( function( err ) {
      if (err) { console.log(err); }
        _db.collection(coleccion).find( { autor : autor } ).toArray((err, results) => {
          var questPersonalized = [];
          if(err) return console.log(err)
          if (results.length > 0) { //console.log(results);
            results.forEach(function(obj) { //results.forEach(function(obj, i) { //console.log("obj: "+ JSON.stringify(obj));
              questPersonalized.push(new model_pregunta(obj.bloque, obj.tema, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta, obj.img)); //preg.showPregunta()
          });}
          //console.log("array length: "+questPersonalized.length);
          return callback( questPersonalized );
        })
    });
  },

  findBloqueYautor: function( bloque, autor, callback ){
    this.connectToServer( function( err ) {
      if (err) { console.log(err); }
        _db.collection(coleccion).find( {$and:[{ bloque : bloque },{ autor : autor } ]} ).toArray((err, results) => {
          var preguntasBloqueAutor = [];
          if(err) return console.log(err)
          if (results.length > 0) { //console.log(results);
            results.forEach(function(obj) { //results.forEach(function(obj, i) { //console.log("obj: "+ JSON.stringify(obj));
              preguntasBloqueAutor.push(new model_pregunta(obj.bloque, obj.tema, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta, obj.img)); //preg.showPregunta()
          });}
          //console.log("array length: "+preguntasBloqueAutor.length);
          return callback( preguntasBloqueAutor );
        })
    });
  },

  findBloqueTemaYautor: function( bloque, tema, autor, callback ){
    this.connectToServer( function( err ) {
      if (err) { console.log(err); }
        _db.collection(coleccion).find( {$and:[{ bloque : bloque },{ tema : tema },{ autor : autor } ]} ).toArray((err, results) => {
          var preguntasBloqueTemaAutor = [];
          if(err) return console.log(err)
          if (results.length > 0) { //console.log(results);
            results.forEach(function(obj) { //results.forEach(function(obj, i) { //console.log("obj: "+ JSON.stringify(obj));
              preguntasBloqueTemaAutor.push(new model_pregunta(obj.bloque, obj.tema, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta, obj.img)); //preg.showPregunta()
          });}
          //console.log("array length: "+preguntasBloqueTemaAutor.length);
          return callback( preguntasBloqueTemaAutor );
        })
    });
  },

};