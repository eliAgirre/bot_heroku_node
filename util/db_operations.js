// requires
const log = require('bristol');

// database
const clientMongo = require('../database/config.js');

// colecciones db
const coleccion_resp_users="respuestas_user";
const coleccion_user_searches="user_searches";

// constantes filenames
const file_log       = "./logs.txt";

// constantes funciones
const funciones = require('./funciones.js');

module.exports = {

    insertRespUser: function(doc){

        var db = clientMongo.getDb();
        db.collection(coleccion_resp_users).insertOne(doc, (err, result) => {
            if(err){
                console.log(err);
                log.error(err, { scope: 'insertOne '+coleccion_resp_users});
                funciones.writeFile(file_log, err+" in inserOne "+coleccion_resp_users);
            }
            else{
                const log_msg="Document inserted in "+coleccion_resp_users;
                console.log(log_msg);
                log.info(log_msg, { scope: 'insertOne '+coleccion_resp_users});
                //funciones.writeFile(file_log, log_msg);
            }
        })
    },

    insertSearchUser: function(doc){

        var db = clientMongo.getDb();
        db.collection(coleccion_user_searches).insertOne(doc, (err, result) => {
            if(err){
                console.log(err);
                log.error(err, { scope: 'insertOne '+coleccion_user_searches});
                funciones.writeFile(file_log, err+" in inserOne "+coleccion_user_searches);
            }
            else{
                const log_msg="Document inserted in "+coleccion_user_searches;
                console.log(log_msg);
                log.info(log_msg, { scope: 'insertOne '+coleccion_user_searches});
                //funciones.writeFile(file_log, log_msg);
            }
        })
    }

}