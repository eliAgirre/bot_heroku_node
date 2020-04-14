// requires
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const log = require('bristol');
const palin = require('palin');
// log
log.addTarget('console').withFormatter(palin);
log.info("We're up and running!", {port: 3000});
// webhook
const token = process.env.TOKEN;
port = process.env.PORT || 443, host = '0.0.0.0',  // probably this change is not required
externalUrl = process.env.CUSTOM_ENV_VARIABLE, token,
bot = new TelegramBot(process.env.TOKEN, { webHook: { port : port, host : host } });
bot.setWebHook(externalUrl + ':443/bot' + token);
// database
const clientMongo = require('./database/config.js');
clientMongo.connectToServer( function( err ) {
    if (err) { console.log(err); }
    else { console.log("database working."); }
});
// colecciones db
const coleccion_preguntas="preguntas";
// modelos
const model_pregunta = require('./model/Pregunta.js');
// constantes funciones
const funciones = require('./util/funciones.js');
// constantes validaciones
const validaciones = require('./util/validaciones.js');
// operaciones db
const logs = require('./util/logs.js');
// operaciones db
const db_operations = require('./util/db_operations.js');
// constantes operaciones
const oper = require('./util/comandos.js');
// constantes listas/arrays
const listas = require('./util/listas.js');
const commands = listas.listCommand();
const keyboard = listas.getKeyboard();
const command = listas.arrayCommands();
// constantes errores
const error_cargar_array = "Error al cargar el array de preguntas por";
const error_no_bien_elegido = "No se ha elegido bien.\nPara ello debe escribir el comando.\nEjemplo: ";
const error_cambio_comando = "Para cambiar debes escribir el comando "+command[12]+" y después el comando correspondiente al";
// otros constantes
const markdown = "Markdown";
// variables globales
//var array = funciones.readFile(file_preguntas);
//var preguntas = funciones.getPreguntas(array);
var datos_score = [0,0];
var datos = [] // enunciado y resp_correcta
var preguntasAnio = [];
var preguntasBloque = [];
var preg = [];
var accion = '';
var accion_anterior = '';
var bloque_anterior = '';
var anio_anterior = '';

// comandos
bot.onText(/^\/start/, (msg) => {
    let response = oper.commandStart(msg);
    bot.sendMessage(msg.chat.id, response);  
});

// help
bot.onText(/^\/help/, (msg) => {
    let response = oper.commandHelp(msg);
    for (key in commands)  // generate help text out of the commands dictionary defined at the top 
        response += "/"+key +' : '+commands[key]+"\n"
    bot.sendMessage(msg.chat.id, response);  
});

// quiz
bot.onText(/^\/quiz/, (msg) => {
    logs.logQuiz(msg);
    const cid = msg.chat.id
    var db = clientMongo.getDb();
    var db_questions = [];
    let response = '';
    accion = command[2];

    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;

        db.collection(coleccion_preguntas).find().toArray((err, results) => {
            if (err)
                log.error(err, { scope: 'find '+coleccion_preguntas } );

            results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                let preg = new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta);
                db_questions.push(preg);
            });
    
            db_questions = funciones.shuffle(db_questions);
            let m_datos = funciones.getDatosPregunta(db_questions);
            response = funciones.getResponse(m_datos);
            datos = funciones.getDatos(datos, m_datos);
            preg = funciones.getDatosPreg(preg, m_datos);
            bot.sendMessage(cid, response, { parse_mode: markdown, reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });
        });
    }
    else
        bot.sendMessage(cid, error_cambio_comando+" año o al bloque o sino al quiz.");
});

// test por bloque
bot.onText(/^\/b1|^\/b2|^\/b3|^\/b4/, (msg) => {
    logs.logBloque(msg);
    const cid = msg.chat.id
    var db = clientMongo.getDb();
    let bloque = ''
    let response = '';
    let comando = msg.text.toString();
    const bloque_elegido = comando.substring(1, comando.length);
    accion = comando;  

    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;

        if (bloque_anterior == '' | bloque_elegido == bloque_anterior){

            if (bloque_elegido.toLowerCase() == command[3].substring(1,command[3].length )|| bloque_elegido.toLowerCase() == command[4].substring(1,command[4].length ) //b2
                || bloque_elegido.toLowerCase() == command[5].substring(1,command[5].length ) || bloque_elegido.toLowerCase() == command[6].substring(1,command[6].length ) ){ //b4

                bloque_anterior = bloque_elegido;
                bloque = bloque_elegido.toUpperCase();

                db.collection(coleccion_preguntas).find({ "bloque" : bloque }).toArray((err, results) => {
                    if (err)
                        log.error(err, { scope: 'find bloque'+coleccion_preguntas } );
                    
                    results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                        let preg = new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta);
                        preguntasBloque.push(preg);

                    });
                    //preguntasBloque = funciones.getPreguntasPorBloque(array, bloque);
                    if( !validaciones.arrayVacio(preguntasBloque, "preguntasBloque") ){
            
                        preguntasBloque = funciones.shuffle(preguntasBloque);
                        let m_datos = funciones.getDatosPregunta(preguntasBloque);
                        response = funciones.getResponse(m_datos);
                        datos = funciones.getDatos(datos, m_datos);
                        preg = funciones.getDatosPreg(preg, m_datos);
                        bot.sendMessage(cid, response, { parse_mode: markdown, reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });
                    }
                    else
                        log.error(error_cargar_array+" bloque.", { scope: comando } )
                });
            }
            else
                bot.sendMessage(cid, error_no_bien_elegido+command[3]);
        }
        else 
            bot.sendMessage(cid, error_cambio_comando+" bloque.");
    }    
    else 
        bot.sendMessage(cid, error_cambio_comando+" año o al bloque o sino al quiz.");
});

// test por año
bot.onText(/^\/2014|^\/2015|^\/2016|^\/2017|^\/2018/, (msg) => {
    logs.logYear(msg);
    const cid = msg.chat.id
    var db = clientMongo.getDb();
    let comando = msg.text.toString();
    let anio_elegido = comando.substring(1, comando.length);
    accion = comando;
    
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;

        if ( anio_anterior == '' | anio_elegido == anio_anterior){

            if ( anio_elegido == command[7].substring(1,command[7].length ) || anio_elegido == command[8].substring(1,command[8].length ) //2015
                || anio_elegido == command[9].substring(1,command[9].length ) || anio_elegido == command[10].substring(1,command[10].length ) //2017
                || anio_elegido == command[11].substring(1,command[11].length ) ){ //2018

                anio_anterior = anio_elegido;
                let autorLI1 = "TAI-LI-"+anio_elegido+"-1";
                let autorPI1 = "TAI-PI-"+anio_elegido+"-1";

                db.collection(coleccion_preguntas).find({$or:[{ "autor" : autorLI1 },{ "autor" : autorPI1 } ]}).toArray((err, results) => {
                    if (err)
                        log.error(err, { scope: 'find autor '+autorLI1+" "+autorPI1+" "+coleccion_preguntas } );
                    
                    results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                        let preg = new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta);
                        preguntasAnio.push(preg);
                    });
                });

                if( !validaciones.arrayVacio(preguntasAnio, "preguntasAnio") ){
            
                    preguntasAnio = funciones.shuffle(preguntasAnio);
                    let m_datos = funciones.getDatosPregunta(preguntasAnio);
                    response = funciones.getResponse(m_datos);
                    datos = funciones.getDatos(datos, m_datos);
                    preg = funciones.getDatosPreg(preg, m_datos);
                    bot.sendMessage(cid, response, { parse_mode: markdown, reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });   
                }
                else
                    log.error(error_cargar_array+" año.", { scope: comando })
            }
            else
                bot.sendMessage(cid, error_no_bien_elegido+command[8]);
        }
        else
            bot.sendMessage(cid, error_cambio_comando+" año.");
    }
    else 
        bot.sendMessage(cid, error_cambio_comando+" año o al bloque o sino al quiz.");
});

// Listener (handler) for callback data from /quiz or /b1 or /2015 command
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    let response = "No has respondido a la pregunta";
    if( callbackQuery.data == '') 
        bot.sendMessage(msg.chat.id, response); 
    else if( callbackQuery.data != ''){
        response = oper.callbackQuery(msg, callbackQuery.data, datos_score, datos, accion);
        tipo_respuesta = funciones.tipoRespuesta(datos[1], callbackQuery.data);
        let doc = oper.createCallbackObject(msg, callbackQuery.data, accion, preg, datos, tipo_respuesta);
        bot.sendMessage(msg.chat.id, response, { parse_mode: markdown }).then(() => { db_operations.insertRespUser(doc); });
    }
});

// stop
bot.onText(/^\/stop/, (msg) => {
    let response = oper.commandStop(msg, datos_score, accion);
    if( response.substring(0,2).trim() == "De" ){
        let doc = oper.createStopObject(msg);
        bot.sendMessage(msg.chat.id, response, { parse_mode: markdown }).then(() => { contador = 0, datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = ''; db_operations.insertRespUser(doc); });
    }
    else
        bot.sendMessage(msg.chat.id, response);
});

// Matches /wiki [whatever]
bot.onText(/^\/wiki (.+)/, function onWikiText(msg, match) {
    let response = oper.commandWiki(msg, match[1]);
    if( response.length > 0 ){
        let doc = oper.createSearchObject(msg, response);
        bot.sendMessage(msg.chat.id, response, { parse_mode: "HTML" }).then(() => { db_operations.insertSearchUser(doc); });
    }
});

// command default
bot.on('message', (msg) =>  {
    response = oper.commandDefault(msg);
    bot.sendMessage(msg.chat.id, response);
});