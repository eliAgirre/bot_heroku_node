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
const modo = "HTML"; const mostrar_datos = "datos: \nenunciado: "; const mostrar_rok = "\n resp_correcta: "; const c_marcha = "marcha: "; const c_empiece = "empiece: ";
// constantes errores ------
const WARNING = '⚠️', ARROW = '➡️';
const error_cargar_array = WARNING+" Error al cargar el array de preguntas por";
const error_no_bien_elegido = "No se ha elegido bien.\nPara ello debe escribir el comando.\nEjemplo: ";
const error_cambio_comando = "Para cambiar de test "+ARROW+" "+command[12]+" y después el comando correspondiente al";
// variables globales- ------ var array = funciones.readFile(file_preguntas); var preguntas = funciones.getPreguntas(array);
var datos_score = [0,0], datos = [], preg = [], selected = [];
var accion = '', accion_anterior = '', bloque_anterior = '', anio_anterior = '', search_autor = '', bloque_search = '', autor = '', tema_elegido = '', temaAbuscar = '', search_bloque = '';
var marcha = 0, empiece, actual = 0, time = 0;
// comandos
bot.onText(/^\/start/, (msg) => { datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = '', selected = [], search_autor = ''; idiomaElegido = msg.from.language_code; marcha, time = cronometro.reiniciar(1, time); console.log(c_marcha+marcha); console.log("time: "+time); bot.sendMessage(msg.chat.id, oper.commandStart(msg, command[0]), listas.getTestKeyboardBlank()); });
// help
bot.onText(/^\/help/, (msg) => { bot.sendMessage(msg.chat.id, oper.commandHelp(msg, command[1])); });
// quiz
bot.onText(/^\/quiz/, (msg) => {
    logs.logs(msg, command[2]); accion = command[2]; let m_datos = '', response = '';
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } // cronometro
        clientMongo.findAllDocs( function ( db_questions ) {
            if(!validaciones.arrayVacio(db_questions, db_array[0] )){
                m_datos, response = funciones.getMdatosYresponse(db_questions, m_datos, datos, preg, response);
                if(m_datos.img !== undefined)
                    bot.sendPhoto(msg.chat.id, m_datos.img);
                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); }); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz." ); }
});
// test x tema
bot.onText(/^\/tema/, function(msg) {
    let textoBloque='', textoTema = '', response = ''; selected[0] = '', selected[1] = '', comando = msg.text;
    let cont= 0, konta = 0, zenbat = 0;
    accion = comando;'Has elegido realizar el test de <b>'; //bot.sendMessage(msg.chat.id,  oper.commandBloque(msg)+"¿Qué bloque quieres?", listas.getTestKeyboardBloques());
    if( konta < 1 ){ konta++;
        bot.sendMessage(msg.chat.id, "¿Qué bloque quieres?", listas.getTestKeyboardBloques());
        bot.onText(/B1|B2|B3|B4/, (msg) => { textoBloque = msg.text;
            if( funciones.findBloques(textoBloque) ){
                let bloques = listas.listBloques();
                bloque_elegido = funciones.textIncluyeArray(textoBloque, bloques, "listBloques" ); bloque_anterior = bloque_elegido; selected[0]=bloque_elegido;
                if( zenbat < 1 ){ zenbat++;
                    bot.sendMessage(msg.chat.id, oper.commandTema(msg, command[25] )+"¿Qué tema quieres elegir?", listas.getTestKeyboardTemas());
                    bot.onText(/T01|T02|T03|T04|T04|T05|T06|T07|T08|T09|T10|T11/, (msg) => { textoTema = msg.text;
                        if( funciones.findTemas(textoTema) ){
                            let tema = listas.listTemas(); response = 'Has elegido realizar el test de <b>';
                            tema_elegido = funciones.textIncluyeArray(textoTema, tema, "listTemas" );
                            tema_anterior = tema_elegido; selected[1]=tema_elegido; 
                            response += selected[0]+" "; response += selected[1]+" "; // for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); response += selected[i]+" "; }
                        }
                        if( cont < 1 ){
                            bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
                            bot.sendMessage(msg.chat.id, "\nPulsa "+command[26], listas.getTestKeyboardBlank() ).then(() => { textoBloque = '', textoTema = ''; });
                            cont++;
                        }
                    });
                }
            }
        });
    }
});
// test x bloque y tema
bot.onText(/^\/blocXtema/, function(msg) {
    logs.logs(msg, command[25] ); let m_datos = '', response = '', comando = msg.text.toString(), bloque_elegido = '', tema_elegido = '';
    if( selected[0] != undefined || selected[1] != undefined ){
        bloque_elegido = selected[0], tema_elegido = selected[1];
        accion = comando;
        if (accion_anterior == '' | accion == accion_anterior){
            accion_anterior = accion;
            if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece);} // cronometro
            if (bloque_anterior == '' | bloque_elegido == bloque_anterior){
                if (bloque_elegido.toLowerCase() == command[3].substring(1,command[3].length )|| bloque_elegido.toLowerCase() == command[4].substring(1,command[4].length ) //b2
                    || bloque_elegido.toLowerCase() == command[5].substring(1,command[5].length ) || bloque_elegido.toLowerCase() == command[6].substring(1,command[6].length ) ){ //b4
                    bloque_anterior = bloque_elegido; search_bloque = selected[0].substring(1,2);
                    if( funciones.findTemas(tema_elegido) ){
                        temaAbuscar = tema_elegido.substring(1, 3); console.log(" blocXtema -> tema a buscar: "+temaAbuscar);
                        clientMongo.findBloqueYtema( selected[0], temaAbuscar, function ( preguntasBlocXTema ) { // consulta bloque y tema
                            if( !validaciones.arrayVacio(preguntasBlocXTema, db_array[1] ) ){                                
                                m_datos, response = funciones.getMdatosYresponse(preguntasBlocXTema, m_datos, datos, preg, response);
                                if(m_datos.img !== undefined)
                                    bot.sendPhoto(msg.chat.id, m_datos.img);
                                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
                            } else { bot.sendMessage(msg.chat.id, 'No hay preguntas para el <b>bloque '+search_bloque+" y tema "+temaAbuscar+'</b>.\nPara elegir otro pulsa '+command[25]+".\nMuchas gracias.", { parse_mode: modo } ); log.error(error_cargar_array+" tema.", { scope: comando } ) }
                        });                        
                    } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[3]); }
                } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[3]); }
            } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" bloque."); }
        } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año, bloque o tema o sino al quiz."); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año, bloque o tema o sino al quiz."); }
});
// test x bloque
bot.onText(/^\/b1|^\/b2|^\/b3|^\/b4/, (msg) => {
    logs.logs(msg, msg.text); let m_datos = '', response = '', comando = msg.text.toString(), bloque_elegido = comando.substring(1, comando.length); accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece); } //cronometro 
        if (bloque_anterior == '' | bloque_elegido == bloque_anterior){
            if (bloque_elegido.toLowerCase() == command[3].substring(1,command[3].length )|| bloque_elegido.toLowerCase() == command[4].substring(1,command[4].length ) //b2
                || bloque_elegido.toLowerCase() == command[5].substring(1,command[5].length ) || bloque_elegido.toLowerCase() == command[6].substring(1,command[6].length ) ){ //b4
                bloque_anterior = bloque_elegido;
                clientMongo.findBloque( bloque_elegido, function ( preguntasBloque ) {
                    if( !validaciones.arrayVacio(preguntasBloque, db_array[2] ) ){ // consulta bloque
                        m_datos, response = funciones.getMdatosYresponse(preguntasBloque, m_datos, datos, preg, response);
                        if(m_datos.img !== undefined)
                            bot.sendPhoto(msg.chat.id, m_datos.img);
                        bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });
                    } else { log.error(error_cargar_array+" bloque.", { scope: comando } ) }
                });
            } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[3]); }
        } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" bloque."); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz."); }
});
// test x anio
bot.onText(/^\/2014|^\/2015|^\/2016|^\/2017|^\/2018/, (msg) => {
    logs.logs(msg, msg.text.toString() ); let m_datos = '', response = '', comando = msg.text.toString(), anio_elegido = comando.substring(1, comando.length); accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece);} // cronometro
        if ( anio_anterior == '' | anio_elegido == anio_anterior){
            if ( anio_elegido == command[7].substring(1,command[7].length ) || anio_elegido == command[8].substring(1,command[8].length ) //2015
                || anio_elegido == command[9].substring(1,command[9].length ) || anio_elegido == command[10].substring(1,command[10].length ) //2017
                || anio_elegido == command[11].substring(1,command[11].length ) ){ //2018
                anio_anterior = anio_elegido;
                let autorLI1 = "TAI-LI-"+anio_elegido+"-1", autorPI1 = "TAI-PI-"+anio_elegido+"-1";
                clientMongo.findInapAnio( autorLI1, autorPI1, function ( preguntasAnio ) { // consulta INAP x anio
                    if( !validaciones.arrayVacio(preguntasAnio, db_array[3] ) ){
                        m_datos, response = funciones.getMdatosYresponse(preguntasAnio, m_datos, datos, preg, response);
                        if(m_datos.img !== undefined)
                            bot.sendPhoto(msg.chat.id, m_datos.img);
                        bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });   
                    } else { log.error(error_cargar_array+" año.", { scope: comando }) }
                });
            } else { bot.sendMessage(msg.chat.id, error_no_bien_elegido+command[8]); }
        } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año."); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" año o al bloque o sino al quiz."); }
});
// Listener (handler) for callback data from /quiz or any command
bot.on('callback_query', (callbackQuery) => {
    if( callbackQuery.data == '') { bot.sendMessage(callbackQuery.message.chat.id, "No has respondido a la pregunta"); }
    else if( callbackQuery.data != '') { let langElegido = ''; let arrayIdiomas = listas.listIdiomas(); let idioma = { "es" : "Español", "en" : "Inglés", "fr": "Francés", "pt" : "Portugués" }; if( callbackQuery.data == arrayIdiomas[0] || callbackQuery.data == arrayIdiomas[1] || callbackQuery.data == arrayIdiomas[2] || callbackQuery.data == arrayIdiomas[3] ){ idiomaElegido = callbackQuery.data;  if( arrayIdiomas[0] == callbackQuery.data ){ langElegido = idioma[arrayIdiomas[0]]; } if( arrayIdiomas[1] == callbackQuery.data ){ langElegido = idioma[arrayIdiomas[1]]; } if( arrayIdiomas[2] == callbackQuery.data ){ langElegido = idioma[arrayIdiomas[2]]; } if( arrayIdiomas[3] == callbackQuery.data ){ langElegido = idioma[arrayIdiomas[3]]; } bot.sendMessage(callbackQuery.message.chat.id, "Has elegido el idioma "+langElegido ); }
        bot.sendMessage(callbackQuery.message.chat.id, oper.callbackQuery(callbackQuery.message, callbackQuery.data, datos_score, datos, accion, "callback_query"), { parse_mode: modo }).then(() => { db_operations.insertRespUser(oper.createCallbackObject(callbackQuery.message, callbackQuery.data, accion, preg, datos, funciones.tipoRespuesta(datos[1], callbackQuery.data)) ); }); }
});
// test personalized
bot.onText(/^\/test/, function(msg) { 
    let cid = msg.chat.id; let textoAutor = '', textoYear = '', textoPromo = '', textoBloque = ''; selected[0]='', selected[1]='', selected[2]='';
    bot.sendMessage(cid,  oper.commandTest(msg, command[14])+"¿Qué autor quieres elegir para hacer el test?", listas.getTestKeyboardAutores()); //bot.onText(/.+/g, function(msg, match) {
    bot.onText(/INAP|Emilio|Adams|Gokoan|OpoSapiens|OpositaTest|Daypo|PreparaTic|OposTestTic|Opolex/, (msg) => { textoAutor = msg.text;
        if( funciones.findAutores(textoAutor) ){ // existe autor
            let autor = listas.listAutores();
            let response = 'Has elegido realizar el test de <b>';
            let autorElegido = funciones.textIncluyeArray(textoAutor, autor, "listAutores" ); selected[0]=autorElegido;
            if( autorElegido === autor[0] ){ // INAP              
                bot.sendMessage(msg.chat.id, "¿Qué año quieres?", listas.getTestKeyboardYears() );
                bot.onText(/2014|2015|2015|2016|2017|2018/, (msg) => { textoYear = msg.text;
                    if( funciones.findYears(textoYear) ){ // existe year
                        let year = listas.listYears(); let yearElegido = funciones.textIncluyeArray(textoYear, year, "listYears" );                              
                        selected[1]=yearElegido;
                        bot.sendMessage(msg.chat.id, "¿Qué promoción quieres?", listas.getTestKeyboardPromocion() );
                        bot.onText(/PI|LI/, (msg) => { textoPromo = msg.text;
                            if( funciones.findPromociones(textoPromo) ){ // existe promo
                                let promotion = listas.listPromociones();
                                let promocionElegido = funciones.textIncluyeArray(textoPromo, promotion, "listPromociones" );
                                selected[1]=yearElegido; selected[2]=promocionElegido;
                                response += selected[0]+" "; response += selected[1]+" "; // for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); response += selected[i]+" "; }
                            }
                            bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
                            bot.sendMessage(msg.chat.id, "\nPulsa "+command[15], listas.getTestKeyboardBlank() ).then(() => { textoAutor = '', textoYear = '', textoPromo = ''; });
                    }); }
            }); } // INAP
            else if(  autorElegido === autor[1] | autorElegido === autor[2] | autorElegido === autor[5] | autorElegido === autor[6] | autorElegido === autor[7] 
                | autorElegido === autor[8] | autorElegido === autor[9] ){ // Emmilio o Adams u OpositaTest o Daypo o PreparaTic u Opolex o TestOposTic
                bot.sendMessage(msg.chat.id, "¿Qué bloque quieres?", listas.getTestKeyboardBloques());
                bot.onText(/B1|B2|B3|B4/, (msg) => { textoBloque = msg.text;
                    if( funciones.findBloques(textoBloque) ){ // existe bloque
                        let bloque = listas.listBloques();
                        let bloqueElegido = funciones.textIncluyeArray(textoBloque, bloque, "listBloques" );
                        bot.sendMessage(msg.chat.id, "¿Quieres elegir un tema?", listas.getTestKeyboardSiNo() );
                        bot.onText(/SI|NO/, (msg) => { textoSINO = msg.text;
                            if( textoSINO === 'SI'){ // con tema
                                bot.sendMessage(msg.chat.id, oper.commandTema(msg, command[25])+"¿Qué tema quieres elegir?", listas.getTestKeyboardTemas());
                                bot.onText(/T01|T02|T03|T04|T04|T05|T06|T07|T08|T09|T10|T11/, (msg) => { textoTema = msg.text;
                                    selected[0]=autorElegido; selected[1]=bloqueElegido;  selected[2]=textoTema; console.log("textoTema: "+textoTema);
                                    if( funciones.findTemas(textoTema) ){
                                        let tema = listas.listTemas();
                                        tema_elegido = funciones.textIncluyeArray(textoTema, tema, "listTemas" );
                                        tema_anterior = tema_elegido; selected[2]=tema_elegido;
                                        response = 'Has elegido realizar el test de <b>';
                                        response += selected[0]+" "+selected[1]+" "+selected[2]; /* for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); response += selected[i]+" "; }*/
                                    }
                                    bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
                                    if( autorElegido === autor[1]) com = command[16]; else if( autorElegido === autor[2]) com = command[17];
                                    else if( autorElegido === autor[5]) com = command[21]; else if( autorElegido === autor[6]) com = command[22];
                                    else if( autorElegido === autor[7]) com = command[23]; else if( autorElegido === autor[8]) com = command[27]; else if( autorElegido === autor[9]) com = command[24];
                                    bot.sendMessage(msg.chat.id, "\nPulsa "+com, listas.getTestKeyboardBlank() ).then(() => { textoAutor = '', textoBloque = '', textoTema = ''; });
                            }); }
                            else if( textoSINO === 'NO'){ //sin tema
                                selected[0]=autorElegido; selected[1]=bloqueElegido;
                                response += selected[0]+" "+selected[1]; selected[2]=undefined;
                                bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
                                if( autorElegido === autor[1]) com = command[16]; else if( autorElegido === autor[2]) com = command[17];
                                else if( autorElegido === autor[5]) com = command[21]; else if( autorElegido === autor[6]) com = command[22];
                                else if( autorElegido === autor[7]) com = command[23]; else if( autorElegido === autor[8]) com = command[27]; else if( autorElegido === autor[9]) com = command[24];
                                bot.sendMessage(msg.chat.id, "\nPulsa "+com, listas.getTestKeyboardBlank() ).then(() => { textoAutor = '', textoBloque = ''; });
                            }
                        });
                    }
            }); } // Emmilio o Adams u OpositaTest o Daypo o PreparaTic u Opolex o TestOposTic
            else if( autorElegido === autor[3] | autorElegido === autor[4] ){ // Gokoan u Oposapiens
                response += selected[0];
                if( autorElegido === autor[3]) com = command[18];
                else if( autorElegido === autor[4]) com = command[19];
                bot.sendMessage(msg.chat.id, response+"</b>", { parse_mode: modo } );
                bot.sendMessage(msg.chat.id, "\nPulsa "+com, listas.getTestKeyboardBlank() ); }
            else {
                if ( !funciones.findAutores(textoAutor) & !funciones.findBloques(textoBloque) & !funciones.findYears(textoYear) & !funciones.findPromociones(textoPromo) ) // si no es ningun autor o bloque o promocion
                    bot.sendMessage(msg.chat.id, "No has seleccionado bien del teclado."); }
        } // cierre if //else { bot.sendMessage(cid, "No has seleccionado de forma adecuada del teclado el autor."); }
    });
});
// test inap
bot.onText(/^\/inap/, (msg) => {
    logs.logs(msg, command[15]); let m_datos = '', response = '', comando = msg.text; accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece);} // cronometro
        for(var i=0;i<selected.length;i++){ console.log("selected: "+selected[i]); } console.log("search autor: "+search_autor);
        if( search_autor === '' ){
            search_autor = "TAI-"+selected[2]+"-"+selected[1]+"-1";
            selected = []; }
        clientMongo.findAutor( search_autor, function ( questPersonalized ) { // consulta autor
            if( !validaciones.arrayVacio(questPersonalized, db_array[4] ) ){
                m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                if(m_datos.img !== undefined)
                    bot.sendPhoto(msg.chat.id, m_datos.img);
                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });   
            } else { log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// test emilio o adams u opositatest o daypo o preparatic u opolex
bot.onText(/^\/emilio|^\/adams|^\/opositatest|^\/daypo|^\/preparatic|^\/opostestic|^\/opolex/, (msg) => { 
    let m_datos = '', response = '', comando = msg.text; accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion; for(var i=0;i<selected.length;i++){ console.log("selected "+i+": "+selected[i]); } /*console.log("selected0: "+selected[0]); console.log("selected1: "+selected[1]); console.log("selected2: "+selected[2]);*/
        if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece);} // cronometro
        if( search_autor === '' ){
            if(selected[1] !== undefined){
                let listAutor = listas.listAutores();
                switch(comando){
                    case command[16]:
                        search_autor = listAutor[1]+" del bloque "+selected[1].substring(1,2); autor = listAutor[1]; // Emilio
                        break;
                    case command[17]:
                        search_autor = listAutor[2]+" del bloque "+selected[1].substring(1,2); autor = listAutor[2]; // Adams
                        break;
                    case command[21]:
                        search_autor = listAutor[5]+" del bloque "+selected[1].substring(1,2); autor = listAutor[5]; // OpositaTest
                        break;
                    case command[22]:
                        search_autor = listAutor[6]+" del bloque "+selected[1].substring(1,2); autor = listAutor[6]; // Daypo
                        break;
                    case command[23]:
                        search_autor = listAutor[17]+" del bloque "+selected[1].substring(1,2); autor = listAutor[7]; // PreparaTic
                        break;
                    case command[24]:
                        search_autor = listAutor[9]+" del bloque "+selected[1].substring(1,2); autor = listAutor[9]; // OposTestTic
                        break;
                    case command[27]:
                        search_autor = listAutor[8]+" del bloque "+selected[1].substring(1,2); autor = listAutor[8]; // Opolex
                        break;
                }
            }
            if(selected[2] === undefined){ temaAbuscar = undefined; }
            else if(selected[2] !== undefined){ temaAbuscar = selected[2].substring(1, selected[2].length ); /*console.log("temaAbuscar: "+temaAbuscar);*/ }
            selected = []; }
        if( temaAbuscar === undefined){ // sin tema
            clientMongo.findBloqueYautor( bloque_search, autor, function ( questPersonalized ) { // consulta bloque y tema
                if( !validaciones.arrayVacio(questPersonalized, db_array[4] ) ){
                    m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                    if(m_datos.img !== undefined)
                        bot.sendPhoto(msg.chat.id, m_datos.img);
                    bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });   
                } else { log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        }); }
        else if( temaAbuscar !== undefined){ // con tema
            clientMongo.findBloqueTemaYautor( bloque_search, temaAbuscar, autor, function ( questPersonalized ) { // consulta bloque, tema y autor
                if( !validaciones.arrayVacio(questPersonalized, "questPersonalized") ){
                    m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                    if(m_datos.img !== undefined)
                        bot.sendPhoto(msg.chat.id, m_datos.img);
                    bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });   
                } else { log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        }); }
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// test gokoan u oposapiens (bloque 1)
bot.onText(/^\/gokoan|^\/oposapiens/, (msg) => {
    let m_datos = '', response = '', comando = msg.text; accion = comando;
    if (accion_anterior == '' | accion == accion_anterior){
        accion_anterior = accion;
        if(marcha === 0){ empiece = new Date(); marcha = cronometro.empezar(marcha);  console.log(c_marcha, marcha); console.log(c_empiece, empiece);} // cronometro
        if( search_autor === '' ){ search_autor = selected[0]; selected = []; }
        clientMongo.findAutor( search_autor, function ( questPersonalized ) { // consulta autor
            if( !validaciones.arrayVacio(questPersonalized, db_array[4] ) ){
                m_datos, response = funciones.getMdatosYresponse(questPersonalized, m_datos, datos, preg, response);
                if(m_datos.img !== undefined)
                    bot.sendPhoto(msg.chat.id, m_datos.img);
                bot.sendMessage(msg.chat.id, response, { parse_mode: modo, reply_markup: keyboard }).then(() => { console.log(mostrar_datos+datos[0]+mostrar_rok+datos[1]); });   
            } else { log.error(error_cargar_array+" questPersonalized.", { scope: 'test_'+search_autor }); bot.sendMessage(msg.chat.id, "Elije el test que quieres hacer, para ello puedes escribir el comando help o hacer clic en /help."); }
        });
    } else { bot.sendMessage(msg.chat.id, error_cambio_comando+" elegir el test que quieres hacer."); }
});
// stop
bot.onText(/^\/stop/, (msg) => { //console.log("stop -> tema a buscar: "+temaAbuscar);
    if( oper.commandStop(msg, datos_score, accion, search_autor, search_bloque, temaAbuscar, command[12] ).substring(0,2).trim() == "De" ) { bot.sendMessage(msg.chat.id, oper.commandStop(msg, datos_score, accion, search_autor, search_bloque, temaAbuscar, command[12] ), { parse_mode: modo }).then(() => { if(marcha === 1){  let tiempo = cronometro.tiempo(marcha, actual, empiece, time); cronometro.reiniciar(1, time); bot.sendMessage(msg.chat.id, "En tiempo:  <b>"+tiempo+"</b>", { parse_mode: modo }); } datos_score = [0,0], datos = ['',''], accion_anterior = '', accion = '', bloque_anterior = '', anio_anterior = '', selected = [], selected[0]='', selected[1]='', selected[2]='', preguntasBloque = [], search_autor = '', bloque_search='', search_bloque = '', temaAbuscar = '', preg=[]; db_operations.insertRespUser(oper.createStopObject(msg)); }); }
    else { bot.sendMessage(msg.chat.id, oper.commandStop(msg, datos_score, accion, search_autor, search_bloque, temaAbuscar, command[12])); }
});
// specific lang wiki
bot.onText(/^\/langWiki/, function onLangWiki(msg) {
    bot.sendMessage(msg.chat.id, oper.commandLangWiki(msg, command[13])+"¿Qué idioma quieres elegir para buscar en la Wiki?", { reply_markup: listas.getKeyboardIdioma() });
});
// wiki [whatever]
bot.onText(/^\/wiki (.+)/, function onWikiText(msg, match) {
    let response = ''; if( oper.commandWiki(msg, match[1], command[13]).length > 0 ) { response = oper.commandWiki(msg, match[1], command[13]); bot.sendMessage(msg.chat.id, oper.commandWiki(msg, match[1], command[13]), { parse_mode: modo }).then(() => { db_operations.insertSearchUser( oper.createSearchObject(msg, response) ); }); }
});
bot.on("polling_error", console.log);
// default
//bot.on('message', (msg) =>  { bot.sendMessage(msg.chat.id, oper.commandDefault(msg, selected, "default")); });