// requires --------------
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const log = require('bristol');
const palin = require('palin');
var pdf = require('html-pdf');
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
var datos_score = [0,0], datos = [], preguntasBloque = [],  preguntasAnio = [], preg = [], selected = [];
var accion = '', accion_anterior = '', bloque_anterior = '', anio_anterior = '', search_autor = '', bloque_search = '', autor = '';
// comaandos
bot.onText(/^\/start/, (msg) => { datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = '', selected = [], search_autor = ''; bot.sendMessage(msg.chat.id, oper.commandStart(msg), listas.getTestKeyboardBlank()); });
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
bot.onText(/^\/test/, function(msg) { 
    let cid = msg.chat.id;
    let textoAutor = '', textoYear = '', textoPromo = '', textoBloque = '';
    let i=0, i1=0, i2=0, ea=0, ea1=0, g=0;
    bot.sendMessage(cid,  oper.commandTest(msg)+"¿Qué autor quieres elegir para hacer el test?", listas.getTestKeyboardAutores());
    //bot.onText(/.+/g, function(msg, match) {
    bot.onText(/INAP|Emilio|Adams|Gokoan|OpoSapiens|OpositaTest|Daypo|PreparaTic|OposTestTic/, (msg) => {
        textoAutor = msg.text;
        if( funciones.findAutores(textoAutor) ){
            let autor = listas.listAutores();
            let response = 'Has elegido realizar el test de *';
            let autorElegido = funciones.textIncluyeArray(textoAutor, autor, "listAutores" );
            selected[0]=autorElegido;
            if( autorElegido === autor[0] ){ // INAP
                if( i < 1 ){
                    bot.sendMessage(msg.chat.id, "¿Qué año quieres?", listas.getTestKeyboardYears() );
                    i++;
                    bot.onText(/2014|2015|2015|2016|2017|2018/, (msg) => {
                        textoYear = msg.text;
                        if( funciones.findYears(textoYear) ){
                            let year = listas.listYears();
                            let yearElegido = funciones.textIncluyeArray(textoYear, year, "listYears" );                              
                            selected[1]=yearElegido;
                            if( i1 < 1 ){
                                bot.sendMessage(msg.chat.id, "¿Qué promoción quieres?", listas.getTestKeyboardPromocion() );
                                i1++;
                                bot.onText(/PI|LI/, (msg) => {
                                    textoPromo = msg.text;
                                    if( funciones.findPromociones(textoPromo) ){
                                        let promotion = listas.listPromociones();
                                        let promocionElegido = funciones.textIncluyeArray(textoPromo, promotion, "listPromociones" );
                                        selected[2]=promocionElegido;
                                        for(var i=0;i<selected.length;i++){ //console.log("selected: "+selected[i]);
                                            response += selected[i]+" ";
                                        }
                                    }
                                    if( i2 < 1 ){
                                        bot.sendMessage(msg.chat.id, response+"*", { parse_mode: "Markdown" } );
                                        bot.sendMessage(msg.chat.id, "\nPulsa "+command[15], listas.getTestKeyboardBlank() ).then(() => {
                                            textoAutor = '', textoYear = '', textoPromo = '';
                                        });
                                        i2++;
                                    }
                                });
                            }
                        }
                    });
                }
            } // INAP
            else if(  autorElegido === autor[1] | autorElegido === autor[2] | autorElegido === autor[5]
                    | autorElegido === autor[6] | autorElegido === autor[7] | autorElegido === autor[8] ){ // Emmilio o Adams u OpositaTest o Daypo o PreparaTic o TestOposTic
                if( ea < 1 ){
                    bot.sendMessage(msg.chat.id, "¿Qué bloque quieres?", listas.getTestKeyboardBloques());
                    ea++;
                    bot.onText(/B1|B2|B3|B4/, (msg) => {
                        textoBloque = msg.text;
                        if( funciones.findBloques(textoBloque) ){
                            let bloque = listas.listBloques();
                            let bloqueElegido = funciones.textIncluyeArray(textoBloque, bloque, "listBloques" );
                            selected[1]=bloqueElegido;
                            response += selected[0]+" "+selected[1];
                            if( ea1 < 1 ){
                                bot.sendMessage(msg.chat.id, response+"*", { parse_mode: "Markdown" } );
                                if( autorElegido === autor[1]) com = command[16];
                                else if( autorElegido === autor[2]) com = command[17];
                                else if( autorElegido === autor[5]) com = command[21];
                                else if( autorElegido === autor[6]) com = command[22];
                                else if( autorElegido === autor[7]) com = command[23];
                                else if( autorElegido === autor[8]) com = command[24];
                                bot.sendMessage(msg.chat.id, "\nPulsa "+com, listas.getTestKeyboardBlank() ).then(() => {
                                    textoAutor = '', textoBloque = '';
                                });
                                ea1++;
                            }
                        }
                    });
                }
            } // Emilio o Adams
            else if( autorElegido === autor[3] | autorElegido === autor[4] ){ // Gokoan u Oposapiens
                if( g < 1 ){
                    response += selected[0];
                    if( autorElegido === autor[3]) com = command[18];
                    else if( autorElegido === autor[4]) com = command[19];
                    bot.sendMessage(msg.chat.id, response+"*", { parse_mode: "Markdown" } );
                    bot.sendMessage(msg.chat.id, "\nPulsa "+com, listas.getTestKeyboardBlank() );
                    g++;
                }
            } // Gokoan u Oposapiens
            else{
                if ( !funciones.findAutores(textoAutor) & !funciones.findBloques(textoBloque) & !funciones.findYears(textoYear) & !funciones.findPromociones(textoPromo) ) // si no es ningun autor o bloque o promocion
                    bot.sendMessage(msg.chat.id, "No has seleccionado bien del teclado.");
            }
        } // cierre if
        //else { bot.sendMessage(cid, "No has seleccionado de forma adecuada del teclado el autor."); }
    });
});
// test inap
bot.onText(/^\/inap/, (msg) => {
    logs.logTestInap(msg);
    let db = clientMongo.getDb(), comando = msg.text.toString();
    let questPersonalized = [];
    accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        //for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); }
        if( search_autor === '' ){
            search_autor = "TAI-"+selected[2]+"-"+selected[1]+"-1";
            selected = [];
        }
        db.collection(coleccion_preguntas).find({ "autor" : search_autor }).toArray((err, results) => { // consulta autor
            if (err) { log.error(err, { scope: 'find autor '+search_autor+" "+coleccion_preguntas } ); }
            results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                let preg = new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta); //preg.showPregunta()
                questPersonalized.push(preg);
            });
            if( !validaciones.arrayVacio(questPersonalized, "questPersonalized "+search_autor) ){
                questPersonalized = funciones.shuffle(questPersonalized);
                let m_datos = funciones.getDatosPregunta(questPersonalized), response = funciones.getResponse(m_datos);
                datos = funciones.getDatos(datos, m_datos);
                preg = funciones.getDatosPreg(preg, m_datos);
                bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown", reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });   
            } else { log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// test emilio o adams u opositatest o daypo o preparatic
bot.onText(/^\/emilio|^\/adams|^\/opositatest|^\/daypo|^\/preparatic|^\/opostestic/, (msg) => {
    let db = clientMongo.getDb(), comando = msg.text.toString();
    let questPersonalized = [];
    if( comando == command[16] ){ logs.logTestEmilio(msg); }
    else if( comando == command[17] ){ logs.logTestAdams(msg); }
    else if( comando == command[21] ){ logs.logTestOpositaTest(msg); }
    else if( comando == command[22] ){ logs.logTestDaypo(msg); }
    else if( comando == command[24] ){ logs.logTestOposTic(msg); }
    accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion; for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); }
        if( search_autor === '' ){
            if( comando == command[16] ){ search_autor = "Emilio del bloque "+selected[1]; autor = "Emilio"; }
            else if( comando == command[17] ){ search_autor = "Adams del bloque "+selected[1]; autor = "Adams"; }
            else if( comando == command[21] ){ search_autor = "OpositaTest del bloque "+selected[1]; autor = "OpositaTest"; }
            else if( comando == command[22] ){ search_autor = "Daypo del bloque "+selected[1]; autor = "Daypo"; }
            else if( comando == command[23] ){ search_autor = "PreparaTic del bloque "+selected[1]; autor = "PreparaTic"; }
            else if( comando == command[24] ){ search_autor = "OposTestTic del bloque "+selected[1]; autor = "OposTestTic"; }
            bloque_search = selected[1];
            selected = [];
        }
        db.collection(coleccion_preguntas).find({$and:[ { "bloque": bloque_search },{ "autor" : autor } ]}).toArray((err, results) => { // consulta autor
            if (err) { log.error(err, { scope: 'find autor '+search_autor+" "+coleccion_preguntas } ); }
            results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                let preg = new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta); //preg.showPregunta()
                questPersonalized.push(preg);
            });
            if( !validaciones.arrayVacio(questPersonalized, "questPersonalized "+search_autor) ){
                questPersonalized = funciones.shuffle(questPersonalized);
                let m_datos = funciones.getDatosPregunta(questPersonalized), response = funciones.getResponse(m_datos);
                datos = funciones.getDatos(datos, m_datos);
                preg = funciones.getDatosPreg(preg, m_datos);
                bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown", reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });   
            } else { log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// test gokoan u oposapiens
bot.onText(/^\/gokoan|^\/oposapiens/, (msg) => {
    let db = clientMongo.getDb(), comando = msg.text.toString();
    let questPersonalized = [];
    if( comando == command[18] ){ logs.logTestGokoan(msg); }
    else if( comando == command[19] ){ logs.logTestOposapiens(msg); }
    accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if( search_autor === '' ){
            search_autor = selected[0];
            selected = [];
        }
        db.collection(coleccion_preguntas).find({ "autor" : search_autor }).toArray((err, results) => { // consulta autor
            if (err) { log.error(err, { scope: 'find autor '+search_autor+" "+coleccion_preguntas } ); }
            results.forEach(function(obj) { //console.log("obj: "+ JSON.stringify(obj));
                let preg = new model_pregunta(obj.bloque, obj.autor,  obj.enunciado, obj.opcion_a, obj.opcion_b, obj.opcion_c, obj.opcion_d, obj.resp_correcta); //preg.showPregunta()
                questPersonalized.push(preg);
                
            });
            if( !validaciones.arrayVacio(questPersonalized, "questPersonalized "+search_autor) ){
                questPersonalized = funciones.shuffle(questPersonalized);
                let m_datos = funciones.getDatosPregunta(questPersonalized), response = funciones.getResponse(m_datos);
                datos = funciones.getDatos(datos, m_datos);
                preg = funciones.getDatosPreg(preg, m_datos);
                bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown", reply_markup: keyboard }).then(() => { console.log("datos: \nenunciado: "+datos[0]+"\n resp_correcta: "+datos[1]); });   
            } else { log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// stop
bot.onText(/^\/stop/, (msg) => {
    if( oper.commandStop(msg, datos_score, accion, search_autor).substring(0,2).trim() == "De" ) { bot.sendMessage(msg.chat.id, oper.commandStop(msg, datos_score, accion, search_autor), { parse_mode: "Markdown" }).then(() => { datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = '', selected = [], search_autor = '', bloque_search=''; db_operations.insertRespUser(oper.createStopObject(msg)); }); }
    else { bot.sendMessage(msg.chat.id, oper.commandStop(msg, datos_score, accion, search_autor)); }
});
// wiki [whatever]
bot.onText(/^\/wiki (.+)/, function onWikiText(msg, match) {
    let response = ''; if( oper.commandWiki(msg, match[1]).length > 0 ) { response = oper.commandWiki(msg, match[1]); bot.sendMessage(msg.chat.id, oper.commandWiki(msg, match[1]), { parse_mode: "HTML" }).then(() => { db_operations.insertSearchUser( oper.createSearchObject(msg, response) ); }); }
});

bot.onText(/^\/searches/, (msg) => {
    //var fs = require('fs');
    logs.logSearches(msg);
    /*
    var contenido = `<h1>Esto es un test de html-pdf</h1><p>Estoy generando PDF a partir de este código HTML sencillo</p>`;
    pdf.create(contenido).toFile(externalUrl+'/prueba.pdf', function(err, res) {
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    });
    */
    const nombre_archivo = "searches.pdf";
    bot.sendDocument(msg.chat.id, nombre_archivo, { caption: "Searches"}).then(()=>{
    	console.log(msg);
    });
    
});

bot.onText(/\/photo/, function onPhotoText(msg) {
    // From file path
    //const photo = `${__dirname}/kitten.jpg`;
    const photo = "kitten.jpg";
    bot.sendPhoto(msg.chat.id, photo, {
      caption: "I'm a kitten!"
    });
    console.log(msg);
});
// default
bot.on('message', (msg) =>  { bot.sendMessage(msg.chat.id, oper.commandDefault(msg)); });