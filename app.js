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
bot = new TelegramBot(process.env.TOKEN, { webHook: { port : port, host : host }, filepath: false  });
bot.setWebHook(externalUrl + ':443/bot' + token);
// database --------------
const clientMongo = require('./database/db.js');
clientMongo.connectToServer( function( err ) {
    if (err) { console.log(err); }
    else { console.log("database working."); }
});
/// otros constantes ------
const funciones = require('./util/funciones.js'); // constantes funciones
const validaciones = require('./util/validaciones.js'); // constantes validaciones
const logs = require('./util/logs.js'); // logs
const db_operations = require('./util/db_operations.js'); // operaciones db
const oper = require('./util/comandos.js'); // constantes operaciones
const listas = require('./util/listas.js'); // constantes listas/arrays
const cronometro = require('./util/timer.js'); // constantes cronometro
const keyboard = listas.getKeyboard();
const command = listas.arrayCommands();
const db_array = listas.getListArray();
const listAutor = listas.listAutores();
const modo = "HTML"; const mostrar_datos = "datos: \nenunciado: "; const mostrar_rok = "\n resp_correcta: "; const c_marcha = "marcha: "; const c_empiece = "empiece: ";
// constantes errores ------
const WARNING = '⚠️', ARROW = '➡️';
const error_cargar_array = WARNING+" Error al cargar el array de preguntas por";
const error_no_bien_elegido = "No se ha elegido bien.\nPara ello debe escribir el comando.\nEjemplo: ";
const error_cambio_comando = "Para cambiar de test "+ARROW+" "+command[12]+" y después el comando correspondiente al";
// variables globales- ------ var array = funciones.readFile(file_preguntas); var preguntas = funciones.getPreguntas(array);
var datos_score = [0,0], datos = [], preg = [], selected = [];
var accion = '', accion_anterior = '', bloque_anterior = '', anio_anterior = '', search_autor = '', bloque_search = '', autor = '', tema_elegido = '', temaAbuscar = '', search_bloque = '', com = '';
var marcha = 0, empiece, actual = 0, time = 0, cont = 0;
// ---------------------------------------- comandos ------------------------------------------ //
// comando - start (bienvenida o reiniciar)
bot.onText(/^\/start/, (msg) => { datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = '', selected = [], search_autor = ''; idiomaElegido = msg.from.language_code; marcha, time = cronometro.reiniciar(1, time); console.log(c_marcha+marcha); console.log("time: "+time); bot.sendMessage(msg.chat.id, oper.commandStart(msg, command[0]), listas.getTestKeyboardBlank()); });
// comando - help
bot.onText(/^\/help/, (msg) => { bot.sendMessage(msg.chat.id, oper.commandHelp(msg, command[1])); });
// comando - quiz
bot.onText(/^\/quiz/, (msg) => {
    logs.logs(msg, command[2]); accion = command[2]; let m_datos = '', response = '';
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        clientMongo.findAllDocs( function ( db_questions ) {
            if(!validaciones.arrayVacio(db_questions, db_array[0] )){
                //m_datos, response = funciones.getMdatosYresponse(db_questions, m_datos, datos, preg, response);
                response = funciones.getMResponse(db_questions, m_datos, datos, preg, response);
                m_datos = funciones.getDatosPregunta(db_questions);
                if(m_datos.img !== undefined)
                    bot.sendPhoto(msg.chat.id, m_datos.img);
                if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
            } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array, { scope: comando } ) }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz." ); }
});
// comando - test bloque y tema
bot.onText(/^\/blocXtema/, function(msg) {
    logs.logs(msg, command[25] ); let m_datos = '', response = '', comando = msg.text.toString(), bloque_elegido = '', tema_elegido = '';
    if( selected[0] != undefined || selected[1] != undefined ){
        bloque_elegido = selected[0], tema_elegido = selected[1];
        accion = comando;
        if (accion_anterior == '' | accion == accion_anterior){
            accion_anterior = accion;
            if (bloque_anterior == '' | bloque_elegido == bloque_anterior){
                if (bloque_elegido.toLowerCase() == command[3].substring(1,command[3].length )|| bloque_elegido.toLowerCase() == command[4].substring(1,command[4].length ) //b2
                    || bloque_elegido.toLowerCase() == command[5].substring(1,command[5].length ) || bloque_elegido.toLowerCase() == command[6].substring(1,command[6].length ) ){ //b4
                    bloque_anterior = bloque_elegido; search_bloque = selected[0].substring(1,2);
                    if( funciones.findTemas(tema_elegido) ){
                        temaAbuscar = tema_elegido.substring(1, 3); console.log(" blocXtema -> tema a buscar: "+temaAbuscar);
                        clientMongo.findBloqueYtema( selected[0], temaAbuscar, function ( preguntasBlocXTema ) { // consulta bloque y tema
                            if( !validaciones.arrayVacio(preguntasBlocXTema, db_array[1] ) ){                                
                                //m_datos, response = funciones.getMdatosYresponse(preguntasBlocXTema, m_datos, datos, preg, response);
                                response = funciones.getMResponse(preguntasBlocXTema, m_datos, datos, preg, response);
                                m_datos = funciones.getDatosPregunta(preguntasBlocXTema);
                                if(m_datos.img !== undefined)
                                    bot.sendPhoto(msg.chat.id, m_datos.img);
                                if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
                            } else { bot.sendMessage(msg.chat.id, 'No hay preguntas para el <b>bloque '+search_bloque+" y tema "+temaAbuscar+'</b>.\nPara elegir otro pulsa '+command[25]+".\nMuchas gracias.", { parse_mode: modo } ); bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array+" tema.", { scope: comando } ) }
                        });                        
                    } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[3]); }
                } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[3]); }
            } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" bloque."); }
        } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año, bloque o tema o sino al quiz."); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año, bloque o tema o sino al quiz."); }
});
// comando - test x bloque
bot.onText(/^\/b1|^\/b2|^\/b3|^\/b4/, (msg) => {
    logs.logs(msg, msg.text); let m_datos = '', response = '', comando = msg.text.toString(), bloque_elegido = comando.substring(1, comando.length); accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if (bloque_anterior == '' | bloque_elegido == bloque_anterior){
            if (bloque_elegido.toLowerCase() == command[3].substring(1,command[3].length )|| bloque_elegido.toLowerCase() == command[4].substring(1,command[4].length ) //b2
                || bloque_elegido.toLowerCase() == command[5].substring(1,command[5].length ) || bloque_elegido.toLowerCase() == command[6].substring(1,command[6].length ) ){ //b4
                bloque_anterior = bloque_elegido;
                clientMongo.findBloque( bloque_elegido, function ( preguntasBloque ) {
                    if( !validaciones.arrayVacio(preguntasBloque, db_array[2] ) ){ // consulta bloque
                        //m_datos, response = funciones.getMdatosYresponse(preguntasBloque, m_datos, datos, preg, response);
                        response = funciones.getMResponse(preguntasBloque, m_datos, datos, preg, response);
                        m_datos = funciones.getDatosPregunta(preguntasBloque);
                        if(m_datos.img !== undefined)
                            bot.sendPhoto(msg.chat.id, m_datos.img);
                        if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                        bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
                    } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array+" bloque.", { scope: comando } ) }
                });
            } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[3]); }
        } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" bloque."); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz."); }
});
// comando - test x año
bot.onText(/^\/2014|^\/2015|^\/2016|^\/2017|^\/2018/, (msg) => {
    logs.logs(msg, msg.text.toString() ); let m_datos = '', response = '', comando = msg.text.toString(), anio_elegido = comando.substring(1, comando.length); accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if ( anio_anterior == '' | anio_elegido == anio_anterior){
            if ( anio_elegido == command[7].substring(1,command[7].length ) || anio_elegido == command[8].substring(1,command[8].length ) //2015
                || anio_elegido == command[9].substring(1,command[9].length ) || anio_elegido == command[10].substring(1,command[10].length ) //2017
                || anio_elegido == command[11].substring(1,command[11].length ) ){ //2018
                anio_anterior = anio_elegido;
                let autorLI1 = "TAI-LI-"+anio_elegido+"-1", autorPI1 = "TAI-PI-"+anio_elegido+"-1";
                clientMongo.findInapAnio( autorLI1, autorPI1, function ( preguntasAnio ) { // consulta INAP x anio
                    if( !validaciones.arrayVacio(preguntasAnio, db_array[3] ) ){
                        //m_datos, response = funciones.getMdatosYresponse(preguntasAnio, m_datos, datos, preg, response);
                        response = funciones.getMResponse(preguntasAnio, m_datos, datos, preg, response);
                        m_datos = funciones.getDatosPregunta(preguntasAnio);
                        if(m_datos.img !== undefined)
                            bot.sendPhoto(msg.chat.id, m_datos.img);
                        if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                        bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
                    } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array+" año.", { scope: comando }) }
                });
            } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[8]); }
        } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año."); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz."); }
});
// comando - test x tema (cuestionario)
bot.onText(/^\/tema/, function(msg) { selected[0] = '', selected[1] = '', comando = msg.text;
    accion = comando;'Has elegido realizar el test de <b>'; bot.sendMessage(msg.chat.id, "¿Qué bloque quieres?", listas.getTestKeyboardBloques()); //bot.sendMessage(msg.chat.id,  oper.commandBloque(msg)+"¿Qué bloque quieres?", listas.getTestKeyboardBloques());
});
// comando - test personalizado (cuestionario)
bot.onText(/^\/test/, function(msg) { 
    selected[0]='', selected[1]='', selected[2]='', accion = msg.text;
    bot.sendMessage(msg.chat.id,  oper.commandTest(msg, command[14])+"¿Qué autor quieres elegir para hacer el test?", listas.getTestKeyboardAutores()); //bot.onText(/.+/g, function(msg, match) {
});
// comando - inap
bot.onText(/^\/inap/, (msg) => {
    logs.logs(msg, command[15]); let m_datos = '', response = '', comando = msg.text; accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); } 
        if( search_autor === '' ){
            search_autor = "TAI-"+selected[2]+"-"+selected[1]+"-1";
            selected = []; } console.log("search autor: "+search_autor);
        clientMongo.findAutor( search_autor, function ( questPersonalized ) { // consulta autor
            if( !validaciones.arrayVacio(questPersonalized, db_array[4] ) ){
                //m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                response = funciones.getMResponse(questPersonalized, m_datos, datos, preg, response);
                m_datos = funciones.getDatosPregunta(questPersonalized);
                if(m_datos.img !== undefined)
                    bot.sendPhoto(msg.chat.id, m_datos.img);
                if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
            } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// comando - Emilio o adams u opositatest o daypo o preparatic u opolex 
bot.onText(/^\/Emilio|^\/adams|^\/opositatest|^\/daypo|^\/preparatic|^\/opostestic|^\/opolex/, (msg) => { 
    let m_datos = '', response = '', comando = msg.text; accion = comando, t = ''; const literalBloque = " del bloque ";
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion; for(var i=0;i<selected.length;i++){ console.log("selected "+i+": "+selected[i]); } /*console.log("selected0: "+selected[0]); console.log("selected1: "+selected[1]); console.log("selected2: "+selected[2]);*/
        if( search_autor === '' ){ bloque_search = selected[1];
            if(selected[1] !== undefined){
                switch(comando){
                    case command[16]: search_autor = listAutor[1]+literalBloque+selected[1].substring(1,2); autor = listAutor[1]; break; // Emilio
                    case command[17]: search_autor = listAutor[2]+literalBloque+selected[1].substring(1,2); autor = listAutor[2]; break; // Adams
                    case command[21]: search_autor = listAutor[5]+literalBloque+selected[1].substring(1,2); autor = listAutor[5]; break; // OpositaTest
                    case command[22]: search_autor = listAutor[6]+literalBloque+selected[1].substring(1,2); autor = listAutor[6]; break; // Daypo
                    case command[23]: search_autor = listAutor[7]+literalBloque+selected[1].substring(1,2); autor = listAutor[7]; break; // PreparaTic
                    case command[24]: search_autor = listAutor[9]+literalBloque+selected[1].substring(1,2); autor = listAutor[9]; break; // OposTestTic
                    case command[27]: search_autor = listAutor[8]+literalBloque+selected[1].substring(1,2); autor = listAutor[8]; break; /* Opolex */ }
            }
            if(selected[2] === undefined){ temaAbuscar = undefined; }
            else if(selected[2] !== undefined){ temaAbuscar = selected[2].substring(1, selected[2].length ); /*console.log("temaAbuscar: "+temaAbuscar);*/ }
            selected = []; }
        if( temaAbuscar === undefined){ /* sin tema */ /*console.log("bloque_search: "+bloque_search); console.log("temaAbuscar: "+temaAbuscar); console.log("autor: "+autor);*/
            clientMongo.findBloqueYautor( bloque_search, autor, function ( questPersonalized ) { // consulta bloque y tema
                if( !validaciones.arrayVacio(questPersonalized, db_array[4] ) ){
                    //m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                    response = funciones.getMResponse(questPersonalized, m_datos, datos, preg, response);
                    m_datos = funciones.getDatosPregunta(questPersonalized);
                    if(m_datos.img !== undefined)
                        bot.sendPhoto(msg.chat.id, m_datos.img);
                    if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                    bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
                } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        }); }
        else if( temaAbuscar !== undefined){ /* con tema */ /*console.log("bloque_search: "+bloque_search); console.log("temaAbuscar: "+temaAbuscar); console.log("autor: "+autor);*/
            clientMongo.findBloqueTemaYautor( bloque_search, temaAbuscar, autor, function ( questPersonalized ) { // consulta bloque, tema y autor
                if( !validaciones.arrayVacio(questPersonalized, "questPersonalized") ){
                    //m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                    response = funciones.getMResponse(questPersonalized, m_datos, datos, preg, response);
                    m_datos = funciones.getDatosPregunta(questPersonalized);
                    if(m_datos.img !== undefined)
                        bot.sendPhoto(msg.chat.id, m_datos.img);
                    if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                    bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
                } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        }); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// comando - gokoan u oposapiens o funcionaTest (bloque 1)
bot.onText(/^\/gokoan|^\/oposapiens|^\/funcionaTest/, (msg) => {
    let m_datos = '', response = '', comando = msg.text; accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if( search_autor === '' ){ search_autor = selected[0]; selected = []; } console.log("search_autor: ", search_autor);
        clientMongo.findAutor( search_autor, function ( questPersonalized ) { // consulta autor
            if( !validaciones.arrayVacio(questPersonalized, db_array[4] ) ){
                //m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                response = funciones.getMResponse(questPersonalized, m_datos, datos, preg, response);
                m_datos = funciones.getDatosPregunta(questPersonalized);
                if(m_datos.img !== undefined)
                    bot.sendPhoto(msg.chat.id, m_datos.img);
                if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
            } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// comando - failed
bot.onText(/^\/failed/, (msg) => {
    logs.logs(msg, command[28]); accion = command[28]; let m_datos = '', response = '', user = msg.chat.username, comando = msg.text;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion; let i=0;
        clientMongo.findFailedDocs( user, function ( array_enunciado ) {
            if(!validaciones.arrayVacio(array_enunciado, "array_enunciado" )){
                array_enunciado = funciones.shuffle(array_enunciado);
                clientMongo.findEnunciadoDocs( array_enunciado[i], function ( failed_questions ) {
                    //m_datos, response = funciones.getMdatosYresponse(failed_questions, m_datos, datos, preg, response);
                    response = funciones.getMResponse(failed_questions, m_datos, datos, preg, response);
                    m_datos = funciones.getDatosPregunta(failed_questions);
                    if(m_datos.img !== undefined)
                        bot.sendPhoto(msg.chat.id, m_datos.img);
                    if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                    bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
                });
                i++;
            } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array, { scope: comando } ) }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer." ); }
});
// comando - examen [whatever]
bot.onText(/^\/examen (.+)/, (msg, match) => { 
    logs.logs(msg, msg.text); accion = command[30];
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion; examUser = match[1]; bot.sendMessage(msg.chat.id, command[30]);
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer." ); }
});
// comando - exam
bot.onText(/^\/exam/, (msg) => { 
    logs.logs(msg, command[30]); accion = command[30]; let m_datos = '', response = '';
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        clientMongo.findRegExpEnunciado( examUser, function ( questPersonalized ) { // consulta whatever
            if( !validaciones.arrayVacio(questPersonalized, db_array[4] ) ){
                //m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                response = funciones.getMResponse(questPersonalized, m_datos, datos, preg, response);
                m_datos = funciones.getDatosPregunta(questPersonalized);
                if(m_datos.img !== undefined)
                    bot.sendPhoto(msg.chat.id, m_datos.img);
                if(cont === 0){ if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } cont++; /* cronometro*/ }
                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
            } else { bot.sendMessage(msg.chat.id, command[12]); log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+match }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer." ); }
});
// comando - stop
bot.onText(/^\/stop/, function onStop(msg) { //console.log("stop -> tema a buscar: "+temaAbuscar);
    if( oper.commandStop(msg, datos_score, accion, search_autor, search_bloque, temaAbuscar, command[12] ).substring(0,2).trim() == "De" ) { bot.sendMessage(msg.chat.id, oper.commandStop(msg, datos_score, accion, search_autor, search_bloque, temaAbuscar, command[12] ), { parse_mode: modo }).then(() => { if(marcha === 1){  let tiempo = cronometro.tiempo(marcha, actual, empiece, time); cronometro.reiniciar(1, time); bot.sendMessage(msg.chat.id, "En tiempo:  <b>"+tiempo+"</b>", { parse_mode: modo }); } datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = '', com = '',  bloque_anterior = '', anio_anterior = '', selected = [], selected[0]='', selected[1]='', selected[2]='', preguntasBloque = [], search_autor = '', bloque_search='', search_bloque = '', temaAbuscar = '', cont = 0, preg=[]; db_operations.insertRespUser(oper.createStopObject(msg)); }); }
    else { bot.sendMessage(msg.chat.id, oper.commandStop(msg, datos_score, accion, search_autor, search_bloque, temaAbuscar, command[12])); }
});
// comando - specific lang wiki
bot.onText(/^\/langWiki/, function onLangWiki(msg) {
    bot.sendMessage(msg.chat.id, oper.commandLangWiki(msg, command[13])+"¿Qué idioma quieres elegir para buscar en la Wiki?", { reply_markup: listas.getKeyboardIdioma() });
});
// comando - wiki [whatever]
bot.onText(/^\/wiki (.+)/, function onWikiText(msg, match) {
    let response = ''; if( oper.commandWiki(msg, match[1], command[13]).length > 0 ) { response = oper.commandWiki(msg, match[1], command[13]); bot.sendMessage(msg.chat.id, oper.commandWiki(msg, match[1], command[13]), { parse_mode: modo }).then(() => { db_operations.insertSearchUser( oper.createSearchObject(msg, response) ); }); }
});
// ---------------------------------------- listeners ------------------------------------------ //
// listener - polling_error
bot.on("polling_error", console.log);
// listener- callback_query (handler) for callback data from /quiz or any command
bot.on('callback_query', (callbackQuery) => {
    if( callbackQuery.data == '') { bot.sendMessage(callbackQuery.message.chat.id, "No has respondido a la pregunta"); }
    else if( callbackQuery.data != '') { let langElegido = ''; let arrayIdiomas = listas.listIdiomas(); let idioma = { "es" : "Español", "en" : "Inglés", "fr": "Francés", "pt" : "Portugués" }; if( callbackQuery.data == arrayIdiomas[0] || callbackQuery.data == arrayIdiomas[1] || callbackQuery.data == arrayIdiomas[2] || callbackQuery.data == arrayIdiomas[3] ){ idiomaElegido = callbackQuery.data;  if( arrayIdiomas[0] == callbackQuery.data ){ langElegido = idioma[arrayIdiomas[0]]; } if( arrayIdiomas[1] == callbackQuery.data ){ langElegido = idioma[arrayIdiomas[1]]; } if( arrayIdiomas[2] == callbackQuery.data ){ langElegido = idioma[arrayIdiomas[2]]; } if( arrayIdiomas[3] == callbackQuery.data ){ langElegido = idioma[arrayIdiomas[3]]; } bot.sendMessage(callbackQuery.message.chat.id, "Has elegido el idioma "+langElegido ); }
        bot.sendMessage(callbackQuery.message.chat.id, oper.callbackQuery(callbackQuery.message, callbackQuery.data, datos_score, datos, accion, "callback_query"), { parse_mode: modo }).then(() => { db_operations.insertRespUser(oper.createCallbackObject(callbackQuery.message, callbackQuery.data, accion, preg, datos, funciones.tipoRespuesta(datos[1], callbackQuery.data)) ); }); }
});
// comando - default
//bot.on('message', (msg) =>  { bot.sendMessage(msg.chat.id, oper.commandDefault(msg, selected, "default")); });
// ---------------------------------------- textos ------------------------------------------ //
// texto - bloque
bot.onText(/B1|B2|B3|B4/, (msg) => { textoBloque = msg.text; console.log("accion: ",accion);
    if(accion === command[25]){ // tema
        if( funciones.findBloques(textoBloque) ){
            let bloques = listas.listBloques();
            bloque_elegido = funciones.textIncluyeArray(textoBloque, bloques, "listBloques" ); bloque_anterior = bloque_elegido; selected[0]=bloque_elegido;
            bot.sendMessage(msg.chat.id, oper.commandTema(msg, command[25] )+"¿Qué tema quieres elegir?", listas.getTestKeyboardTemas());
        } else { bot.sendMessage(msg.chat.id, "No has seleccionado bien el bloque desde el teclado."); }
    }
    else if(accion === command[14]){ // test
        if( funciones.findBloques(textoBloque) ){ // existe bloque
            let bloque = listas.listBloques();
            selected[1] = funciones.textIncluyeArray(textoBloque, bloque, "listBloques" );
            bot.sendMessage(msg.chat.id, "¿Quieres elegir un tema?", listas.getTestKeyboardSiNo() );
        } else { bot.sendMessage(msg.chat.id, "No has seleccionado bien el bloque desde el teclado."); }
    }
});
// texto - tema
bot.onText(/T01|T02|T03|T04|T04|T05|T06|T07|T08|T09|T10|T11/, (msg) => {textoTema = msg.text;
    if(accion === command[25]){ // tema
        if( funciones.findTemas(textoTema) ){
            let tema = listas.listTemas(); response = 'Has elegido realizar el test de <b>';
            tema_elegido = funciones.textIncluyeArray(textoTema, tema, "listTemas" );
            tema_anterior = tema_elegido; selected[1]=tema_elegido; 
            response += selected[0]+" "; response += selected[1]+" "; // for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); response += selected[i]+" "; }
            bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
            bot.sendMessage(msg.chat.id, "\nPulsa "+command[26], listas.getTestKeyboardBlank() ).then(() => { textoBloque = '', textoTema = ''; });
        } else { bot.sendMessage(msg.chat.id, "No has seleccionado bien el tema desde el teclado."); }
    } // test
    else if(accion === command[14]){ selected[2]=textoTema;
        if( funciones.findTemas(textoTema) ){
            let tema = listas.listTemas();
            tema_elegido = funciones.textIncluyeArray(textoTema, tema, "listTemas" );
            tema_anterior = tema_elegido; selected[2]=tema_elegido;
            response = 'Has elegido realizar el test de <b>';
            response += selected[0]+" "+selected[1]+" "+selected[2]; console.log("selected 1: "+selected[1]); console.log("listAutor 1: "+listAutor[1]); console.log("command 16: "+command[16]); /* for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); response += selected[i]+" "; }*/
            com = funciones.getComandoAutor(selected[0], com);
            bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
            bot.sendMessage(msg.chat.id, "\nPulsa "+com, listas.getTestKeyboardBlank() ).then(() => { textoTema = ''; });
        } else { bot.sendMessage(msg.chat.id, "No has seleccionado bien el tema desde el teclado."); }
    }
});
// texto - autores
bot.onText(/INAP|Emilio|Adams|Gokoan|OpoSapiens|OpositaTest|Daypo|PreparaTic|OposTestTic|Opolex|OposTestTic|FuncionaTest/, (msg) => { textoAutor = msg.text;
    if( funciones.findAutores(textoAutor) ){ // existe autor
        let response = 'Has elegido realizar el test de <b>', com = '';
        selected[0]=textoAutor; console.log("listAutor 0: "+listAutor[0]); console.log("textoAutor: "+textoAutor);
        if( textoAutor === listAutor[0] ) // INAP            
            bot.sendMessage(msg.chat.id, "¿Qué año quieres?", listas.getTestKeyboardYears() );
        else if(  textoAutor === listAutor[1] |textoAutor === listAutor[2] | textoAutor === listAutor[5] | textoAutor === listAutor[6] | textoAutor === listAutor[7] 
                | textoAutor === listAutor[8] | textoAutor === listAutor[9] ){ // Emilio o Adams u OpositaTest o Daypo o PreparaTic u Opolex o TestOposTic
                bot.sendMessage(msg.chat.id, "¿Qué bloque quieres?", listas.getTestKeyboardBloques());
            } // Emmilio o Adams u OpositaTest o Daypo o PreparaTic u Opolex o TestOposTic
        else if( textoAutor === listAutor[10] | textoAutor === listAutor[3] | textoAutor === listAutor[4] ){ // Gokoan u Oposapiens o FuncionaTest
            response += selected[0];
            if( textoAutor === listAutor[3]) com = command[18]; // Gokoan
            else if( textoAutor === listAutor[4]) com = command[19]; // OpoSapiens
            else if( textoAutor === listAutor[10]) com = command[29]; // FuncionaTest
            bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
            bot.sendMessage(msg.chat.id, "\nPulsa "+com, listas.getTestKeyboardBlank() ); }
    } // si no es ningun autor o bloque o promocion if ( !funciones.findAutores(textoAutor) & !funciones.findBloques(textoBloque) & !funciones.findYears(textoYear) & !funciones.findPromociones(textoPromo) ) // si no es ningun autor o bloque o promocion
    else{ bot.sendMessage(msg.chat.id, "No has seleccionado bien el autor desde el teclado."); }  // cierre if //else { bot.sendMessage(cid, "No has seleccionado de forma adecuada del teclado el autor."); }
});
// texto - años inap
bot.onText(/2014|2015|2015|2016|2017|2018/, (msg) => { textoYear = msg.text;
    if( funciones.findYears(textoYear) ){ // existe year
        let year = listas.listYears(); let yearElegido = funciones.textIncluyeArray(textoYear, year, "listYears" );                              
        selected[1]=yearElegido;
        bot.sendMessage(msg.chat.id, "¿Qué promoción quieres?", listas.getTestKeyboardPromocion() );
    } else{ bot.sendMessage(msg.chat.id, "No has seleccionado bien el el año desde el teclado."); } 
});
// texto - promocion interna o libre
bot.onText(/PI|LI/, (msg) => { textoPromo = msg.text;
    if( funciones.findPromociones(textoPromo) ){ // existe promo
        let promotion = listas.listPromociones(), response = '';
        let promocionElegido = funciones.textIncluyeArray(textoPromo, promotion, "listPromociones" );
        selected[2]=promocionElegido;
        response += selected[0]+" "; response += selected[1]+" "; // for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); response += selected[i]+" "; }
        bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
        bot.sendMessage(msg.chat.id, "\nPulsa "+command[15], listas.getTestKeyboardBlank() ).then(() => { textoAutor = '', textoYear = '', textoPromo = ''; });
    }
    else{ bot.sendMessage(msg.chat.id, "No has seleccionado bien la promoción desde el teclado."); } 
});
// texto - si o no (tema)
bot.onText(/SI|NO/, (msg) => { textoSINO = msg.text;
    if( textoSINO === 'SI') // con tema
        bot.sendMessage(msg.chat.id, oper.commandTema(msg, command[25])+"¿Qué tema quieres elegir?", listas.getTestKeyboardTemas());
    else if( textoSINO === 'NO'){ /*sin tema*/ let response = '';
        response += selected[0]+" "+selected[1]; selected[2]=undefined;
        bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
        com = funciones.getComandoAutor(selected[0], com);
        bot.sendMessage(msg.chat.id, "\nPulsa "+com, listas.getTestKeyboardBlank() ).then(() => { textoAutor = '', textoBloque = ''; });
    }
});