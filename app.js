// requires --------------
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const log = require('bristol');
const palin = require('palin');
log.addTarget('console').withFormatter(palin);
log.info("We're up and running!", {port: 3000});
// webhook ---------------
const token = process.env.TOKEN;
port = process.env.PORT || 443, host = '0.0.0.0',  // probably this change is not required
externalUrl = process.env.CUSTOM_ENV_VARIABLE, token,
bot = new TelegramBot(process.env.TOKEN, { webHook: { port : port, host : host } });
bot.setWebHook(externalUrl + ':443/bot' + token);
// database --------------
const clientMongo = require('./database/config.js');
clientMongo.connectToServer( function( err ) {
    if (err) { console.log(err); }
    else { console.log("database working."); }
});
// otros constantes ------
const coleccion_preguntas="preguntas"; // colecciones db
const model_pregunta = require('./model/Pregunta.js'); // modelos
const funciones = require('./util/funciones.js'); // constantes funciones
const validaciones = require('./util/validaciones.js'); // constantes validaciones
const logs = require('./util/logs.js'); // operaciones db
const db_operations = require('./util/db_operations.js'); // operaciones db
const oper = require('./util/comandos.js'); // constantes operaciones
const listas = require('./util/listas.js'); // constantes listas/arrays
const keyboard = listas.getKeyboard();
const command = listas.arrayCommands();
// constantes errores ------
const error_cargar_array = "Error al cargar el array de preguntas por";
const error_no_bien_elegido = "No se ha elegido bien.\nPara ello debe escribir el comando.\nEjemplo: ";
const error_cambio_comando = "Para cambiar debes escribir el comando "+command[12]+" y después el comando correspondiente al";
// variables globales- ------ var array = funciones.readFile(file_preguntas); var preguntas = funciones.getPreguntas(array);
var datos_score = [0,0], datos = [], preguntasBloque = [],  preguntasAnio = [], preg = [];
var accion = '', accion_anterior = '', bloque_anterior = '', anio_anterior = '';
// comaandos
bot.onText(/^\/start/, (msg) => { datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = ''; bot.sendMessage(msg.chat.id, oper.commandStart(msg)); });
// help
bot.onText(/^\/help/, (msg) => { bot.sendMessage(msg.chat.id, oper.commandHelp(msg)); });
// quiz
bot.onText(/^\/quiz/, (msg) => {
    logs.logQuiz(msg); let db = clientMongo.getDb(), db_questions = []; accion = command[2];
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        db.collection(coleccion_preguntas).find().toArray((err, results) => { // consulta preguntas
            if (err) { log.error(err, { scope: 'find '+coleccion_preguntas } ); }
            results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                db_questions.push(new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta));
            });
            db_questions = funciones.shuffle(db_questions); // random preguntas
            let m_datos = funciones.getDatosPregunta(db_questions), response = funciones.getResponse(m_datos);
            datos = funciones.getDatos(datos, m_datos);
            preg = funciones.getDatosPreg(preg, m_datos);
            bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown", reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz."); }
});
// test por bloque
bot.onText(/^\/b1|^\/b2|^\/b3|^\/b4/, (msg) => {
    logs.logBloque(msg);
    let db = clientMongo.getDb(), comando = msg.text.toString(), bloque_elegido = comando.substring(1, comando.length);
    accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if (bloque_anterior == '' | bloque_elegido == bloque_anterior){
            if (bloque_elegido.toLowerCase() == command[3].substring(1,command[3].length )|| bloque_elegido.toLowerCase() == command[4].substring(1,command[4].length ) //b2
                || bloque_elegido.toLowerCase() == command[5].substring(1,command[5].length ) || bloque_elegido.toLowerCase() == command[6].substring(1,command[6].length ) ){ //b4
                bloque_anterior = bloque_elegido;
                db.collection(coleccion_preguntas).find({ "bloque" : bloque_elegido.toUpperCase() }).toArray((err, results) => { // consulta bloque
                    if (err) { log.error(err, { scope: 'find bloque'+coleccion_preguntas } ); }
                    results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                        preguntasBloque.push(new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta));
                    });
                    if( !validaciones.arrayVacio(preguntasBloque, "preguntasBloque") ){
                        preguntasBloque = funciones.shuffle(preguntasBloque);
                        let m_datos = funciones.getDatosPregunta(preguntasBloque), response = funciones.getResponse(m_datos);
                        datos = funciones.getDatos(datos, m_datos);
                        preg = funciones.getDatosPreg(preg, m_datos);
                        bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown", reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });
                    } else { log.error(error_cargar_array+" bloque.", { scope: comando } ) }
                });
            } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[3]); }
        } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" bloque."); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz."); }
});
// test por año
bot.onText(/^\/2014|^\/2015|^\/2016|^\/2017|^\/2018/, (msg) => {
    logs.logYear(msg);
    let db = clientMongo.getDb(), comando = msg.text.toString(), anio_elegido = comando.substring(1, comando.length);
    accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if ( anio_anterior == '' | anio_elegido == anio_anterior){
            if ( anio_elegido == command[7].substring(1,command[7].length ) || anio_elegido == command[8].substring(1,command[8].length ) //2015
                || anio_elegido == command[9].substring(1,command[9].length ) || anio_elegido == command[10].substring(1,command[10].length ) //2017
                || anio_elegido == command[11].substring(1,command[11].length ) ){ //2018
                anio_anterior = anio_elegido;
                let autorLI1 = "TAI-LI-"+anio_elegido+"-1", autorPI1 = "TAI-PI-"+anio_elegido+"-1";
                db.collection(coleccion_preguntas).find({$or:[{ "autor" : autorLI1 },{ "autor" : autorPI1 } ]}).toArray((err, results) => { // consulta autor
                    if (err) { log.error(err, { scope: 'find autor '+autorLI1+" "+autorPI1+" "+coleccion_preguntas } ); }
                    results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                        preguntasAnio.push(new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta));
                    });
                });
                if( !validaciones.arrayVacio(preguntasAnio, "preguntasAnio") ){
                    preguntasAnio = funciones.shuffle(preguntasAnio);
                    let m_datos = funciones.getDatosPregunta(preguntasAnio), response = funciones.getResponse(m_datos);
                    datos = funciones.getDatos(datos, m_datos);
                    preg = funciones.getDatosPreg(preg, m_datos);
                    bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown", reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });   
                } else { log.error(error_cargar_array+" año.", { scope: comando }) }
            } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[8]); }
        } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año."); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz."); }
});
// Listener (handler) for callback data from /quiz or /b1 or /2015 command
bot.on('callback_query', (callbackQuery) => {
    if( callbackQuery.data == '') { bot.sendMessage(callbackQuery.message.chat.id, "No has respondido a la pregunta"); }
    else if( callbackQuery.data != '') { bot.sendMessage(callbackQuery.message.chat.id, oper.callbackQuery(callbackQuery.message, callbackQuery.data, datos_score, datos, accion), { parse_mode: "Markdown" }).then(() => { db_operations.insertRespUser(oper.createCallbackObject(callbackQuery.message, callbackQuery.data, accion, preg, datos, funciones.tipoRespuesta(datos[1], callbackQuery.data)) ); }); }
});
// test
bot.onText(/\/test/, (msg) => { bot.sendMessage(msg.chat.id,  oper.commandTest(msg)+"¿Qué autor quieres elegir para hacer el test?", listas.getTestKeyboard1()); });
// stop
bot.onText(/^\/stop/, (msg) => {
    if( oper.commandStop(msg, datos_score, accion).substring(0,2).trim() == "De" ) { bot.sendMessage(msg.chat.id, oper.commandStop(msg, datos_score, accion), { parse_mode: "Markdown" }).then(() => { datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = ''; db_operations.insertRespUser(oper.createStopObject(msg)); }); }
    else { bot.sendMessage(msg.chat.id, oper.commandStop(msg, datos_score, accion)); }
});
// wiki [whatever]
bot.onText(/^\/wiki (.+)/, function onWikiText(msg, match) {
    if( oper.commandWiki(msg, match[1]).length > 0 ) { bot.sendMessage(msg.chat.id, oper.commandWiki(msg, match[1]), { parse_mode: "HTML" }).then(() => { db_operations.insertSearchUser( oper.createSearchObject(msg, response) ); }); }
});
// default
bot.on('message', (msg) =>  { bot.sendMessage(msg.chat.id, oper.commandDefault(msg)); });